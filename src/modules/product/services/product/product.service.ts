import { PaginateOptions } from '@classes/paginate-options';
import { Pagination } from '@classes/pagination';
import { ProductRate } from '@modules/product-rate/classes/product-rate';
import { ProductRateService } from '@modules/product-rate/services/product-rate/product-rate.service';
import { Product } from '@modules/product/classes/product';
import { CreateProductDto } from '@modules/product/dto/create-product.dto';
import { UpdateProductDto } from '@modules/product/dto/update-product.dto';
import { ScanPriceJobName, ScanPricesPayload } from '@modules/product/queue/consumers/jobs/scan-prices.job';
import { ProductQueueName } from '@modules/product/queue/consumers/product.consumer';
import { ProductRepository } from '@modules/product/repositories/product.repository';
import { RateProviderService } from '@modules/rate-provider/services/rate-provider/rate-provider.service';
import { ScanService } from '@modules/scan/services/scan/scan.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HelperService } from '@services/helper.service';
import { Queue } from 'bull';
import { readFileSync } from 'fs';
import { set, remove, compact, pick } from 'lodash';

@Injectable()
export class ProductService {

  public constructor(private readonly productRepository: ProductRepository,
                     private readonly productRateService: ProductRateService,
                     private readonly rateProviderService: RateProviderService,
                     private readonly scanService: ScanService,
                     private readonly configService: ConfigService,
                     @InjectQueue(ProductQueueName) private readonly productQueue: Queue) {}

  getProductsPaginated(paginateOptions: PaginateOptions = new PaginateOptions()): Promise<Pagination<Product>> {
    return this.productRepository.getProductsPaginated(paginateOptions);
  }

  getUserProductsPaginated(userId: string, paginateOptions: PaginateOptions = new PaginateOptions()): Promise<Pagination<Product>> {
    return this.productRepository.getUserProductsPaginated(userId, paginateOptions);
  }
  
  findById(id: string): Promise<Product> {
    return this.productRepository.findById(id);
  }

  updateById(id: string, dto: UpdateProductDto): Promise<Product> {
    return this.productRepository.updateById(id, dto);
  }

  create(dto: CreateProductDto) {
    return this.productRepository.create(dto);
  }

  deleteById(id: string): Promise<Product> {
    return this.productRepository.deleteById(id);
  }

  /**
   * Set the data that will be sent to specified provider when @command command is being used.
   * For example, for getProduct { url: '{{product's url at provider's website}}' } would be used 
   * @param productId 
   * @param providerSlug 
   * @param command example: 'getProduct'
   * @param form Raw data that will be sent to provider.
   */
  async setProviderForm(productId: string, providerSlug: string, command: string, form: any) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Specified product was not found!');
    }
    const productPartial: Partial<Product> = {
      providers: product.providers || [],
      providersForms: product.providersForms || {}
    };
    // push provider into providers array (if does not already exist)
    productPartial.providers = Array.from(new Set<string>(productPartial.providers).add(providerSlug));
    // if provider does no exists in providersForm, it will be set
    // insert form
    set(productPartial, `providersForms.${providerSlug}.${command}`, form);
    // update database
    const updatedProduct = await this.productRepository.updateById(productId, productPartial);
    return updatedProduct;
  }

  /**
   * Removes specified command's form from provider's form options.
   * If there are no forms of specified supplier in 'providersForms', will also remove provider from 'providers' array.
   * @param productId 
   * @param providerSlug 
   * @param command example: 'getProduct'
   */
   async removeProviderForm(productId: string, providerSlug: string, command: string) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Specified product was not found!');
    }
    const productPartial: Partial<Product> = {
      providers: product.providers || [],
      providersForms: product.providersForms || {}
    };
    if (productPartial.providersForms[providerSlug]?.[command]) {
      delete productPartial.providersForms[providerSlug][command];
    }
    if (!productPartial.providersForms[providerSlug]
        || !compact(Object.values(productPartial.providersForms[providerSlug])).length ) {
      delete productPartial.providersForms[providerSlug];
      remove(productPartial.providers, slug => slug === providerSlug);
    }
    // update database
    const updatedProduct = await this.productRepository.updateById(productId, productPartial);
    return updatedProduct;
  }

  async scanPricesInQueue(id: string, options: Pick<ScanPricesPayload, 'mock' | 'trigger'>) {
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Specified product does not exist!');
    }
    const payload: Partial<ScanPricesPayload> = {
      productId: id,
      providersToScan: product.providers,
      ...options
    }
    // create scan
    const scan = await this.scanService.create(id, pick(payload, 'providersToScan', 'trigger'));
    payload.scanId = HelperService.id(scan);
    // enqueue job
    await this.productQueue.add(ScanPriceJobName, payload, { removeOnComplete: true, removeOnFail: true })
    return scan;
  }

  async scanPrices(id: string, options?: { providersToScan?: string[], mock?: boolean }): Promise<ProductRate[]> {
    // get mock
    if (!!options?.mock) {
      const mockPath = this.configService.getOrThrow('paths.mock');
      return JSON.parse(readFileSync(`${mockPath}/mock_getProduct.json`).toString('utf8'));
    }
    //
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Specified product was not found!');
    }
    const scanPromises = [];
    const providersToScan = options?.providersToScan || product.providers
    for (const providerSlug of providersToScan) {
      const providerGetProductForm = product.providersForms?.[providerSlug]?.getProduct;
      if (!providerGetProductForm) {
        continue;
      }
      const scanPromise = this.rateProviderService.getProduct(providerSlug, providerGetProductForm)
                                                  .then(rate => this.transformToRateProduct(providerSlug, product, rate), err =>  undefined) // TODO handle failed response
      scanPromises.push(scanPromise)
    }
    // wait for all providers and filter out providers that failed.
    let productRates = await Promise.all(scanPromises).then(rates => rates.filter(r => !!r)) as ProductRate[];
    if (productRates.length) {
      productRates = await this.productRateService.insertMany(productRates);
    }
    return productRates
  }

  private transformToRateProduct(providerSlug: string,
                                 product: Product,
                                 rate: Pick<ProductRate, 'price' | 'currency'>) {
    const productRate: ProductRate = new ProductRate();
    productRate.currency = rate.currency;
    productRate.price = rate.price;
    productRate.product = HelperService.id(product);
    productRate.providerSlug = providerSlug;
    return productRate;
  }

}
