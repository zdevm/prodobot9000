import { Controller, Get, Param } from '@nestjs/common';
import { IsMongoIdPipe } from 'src/pipes/is-mongo-id.pipe';
import { ProductRateService } from './services/product-rate/product-rate.service';

@Controller('rates')
export class ProductRateController {

  public constructor(private readonly productRateService: ProductRateService) {}

  @Get(':productId/latest')
  getLatestOfEachProvider(@Param('productId', IsMongoIdPipe) productId: string) {
    return this.productRateService.getLatestOfEachProvider(productId);
  }

}
