import { ProductService } from "@modules/product/services/product/product.service";
import { OnGlobalQueueError, Process, Processor } from "@nestjs/bull";
import { forwardRef, Inject } from "@nestjs/common";
import { Job } from "bull";
import { ScanPriceJobName, ScanPricesPayload } from "./jobs/scan-prices.job";
import { HelperService } from "@services/helper.service";
import { ScanStatus } from "@modules/scan/enums/scan-status.enum";
import { Scan } from "@modules/scan/classes/scan";
import { ScanService } from "@modules/scan/services/scan/scan.service";

export const ProductQueueName = 'Product';

@Processor(ProductQueueName)
export class ProductConsumer {

  constructor(@Inject(forwardRef(() => ProductService)) private readonly productService: ProductService,
              private readonly scanService: ScanService) { }

  @Process(ScanPriceJobName)
  async scanForPrices(job: Job<ScanPricesPayload>) {
    const payload = job.data;
    // fetch product
    const product = await this.productService.findById(payload.productId);
    if (!product) {
      throw new Error('Product not found!')
    }
    const productId = HelperService.id(product);
    // filter providers
    const providersToScan = payload.providersToScan;
    if (!providersToScan.length) {
      throw new Error('Cannot scan without providers!');
    }
    // find scan
    const scanId = payload.scanId;
    let scan = await this.scanService.findById(scanId);
    if (!scan) {
      throw new Error('Product not found!');
    }
    // start scanning
    scan = await this.scanService.updateById(scanId, { status: ScanStatus.Scanning })
    if (!scan) {
      throw new Error('Failed to update scan!');
    }
    let scanUpdatePartial: Partial<Scan> = {};
    try {
      const rates = await this.productService.scanPrices(productId, { providersToScan });
      if (!rates.length) {
        throw new Error('None of the providers returned scanned prices.');
      }
      scanUpdatePartial.status = ScanStatus.Succeeded
      scanUpdatePartial.rates = rates.map(r => HelperService.id(r)) as any[];
    } catch (ex) {
      scanUpdatePartial = { status: ScanStatus.Failed }
      throw ex;
    } finally {
      scanUpdatePartial.completedAt = new Date();
      this.scanService.updateById(scanId, scanUpdatePartial).catch(ex => {
        this.scanService.updateById(scanId, { status: ScanStatus.Failed }) // fallback update
        throw ex;
      })
    }
  }

  @OnGlobalQueueError()
  onError(err: Error) {
    console.error(err);
  }

}