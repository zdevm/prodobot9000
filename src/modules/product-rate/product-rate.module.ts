import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductRateRepository } from './repositories/product-rate.repository';
import { MongooseProductRate, ProductRateSchema } from './schemas/product-rate.schema';
import { ProductRateService } from './services/product-rate/product-rate.service';
import { ProductRateController } from './product-rate.controller';
import { CaslModule } from '@modules/casl/casl.module';
import { ProductModule } from '@modules/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongooseProductRate.name, schema: ProductRateSchema }
    ]),
    forwardRef(() => ProductModule),
    CaslModule
  ],
  providers: [ProductRateService, ProductRateRepository],
  exports: [ProductRateService],
  controllers: [ProductRateController]
})
export class ProductRateModule {}
