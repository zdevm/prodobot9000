import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductRateRepository } from './repositories/product-rate.repository';
import { MongooseProductRate, ProductRateSchema } from './schemas/product-rate.schema';
import { ProductRateService } from './services/product-rate/product-rate.service';
import { ProductRateController } from './product-rate.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongooseProductRate.name, schema: ProductRateSchema }
    ])
  ],
  providers: [ProductRateService, ProductRateRepository],
  exports: [ProductRateService],
  controllers: [ProductRateController]
})
export class ProductRateModule {}
