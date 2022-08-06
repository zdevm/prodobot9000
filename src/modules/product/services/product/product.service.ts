import { PaginateOptions } from '@classes/paginate-options';
import { Pagination } from '@classes/pagination';
import { ProductRate } from '@modules/product-rate/classes/product-rate';
import { ProductRateService } from '@modules/product-rate/services/product-rate/product-rate.service';
import { Product } from '@modules/product/classes/product';
import { CreateProductDto } from '@modules/product/dto/create-product.dto';
import { UpdateProductDto } from '@modules/product/dto/update-product.dto';
import { ProductRepository } from '@modules/product/repositories/product.repository';
import { RateProviderService } from '@modules/rate-provider/services/rate-provider/rate-provider.service';
import { Injectable } from '@nestjs/common';
import { HelperService } from '@services/helper.service';
import { set } from 'lodash';

@Injectable()
export class ProductService {

  public constructor(private readonly productRepository: ProductRepository,
                     private readonly productRateService: ProductRateService,
                     private readonly rateProviderService: RateProviderService) {}

  getProductsPaginated(paginateOptions: PaginateOptions = new PaginateOptions()): Promise<Pagination<Product>> {
    return this.productRepository.getProductsPaginated(paginateOptions);
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

  async scanPrices(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Specified product was not found!');
    }
    const scanPromises = [];
    for (const providerSlug of product.providers) {
      const providerGetProductForm = product.providersForms?.[providerSlug]?.getProduct;
      if (!providerGetProductForm) {
        continue;
      }
      const scanPromise = this.rateProviderService.getProduct(providerSlug, providerGetProductForm)
                                                  .then(rate => this.transformToRateProduct(providerSlug, product, rate), () => undefined) // TODO handle failed response
      scanPromises.push(scanPromise)
    }
    // wait for all providers and filter out providers that failed.
    let productRates = await Promise.all(scanPromises).then(rates => rates.filter(r => !!r));
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
