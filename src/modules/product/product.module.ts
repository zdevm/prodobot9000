import { Module } from '@nestjs/common';
import { ProductService } from './services/product/product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseProduct, ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './repositories/product.repository';
import { RateProviderModule } from '@modules/rate-provider/rate-provider.module';
import { ProductRateModule } from '@modules/product-rate/product-rate.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongooseProduct.name, schema: ProductSchema }
    ]),
    RateProviderModule,
    ProductRateModule
  ],
  providers: [
    ProductService,
    ProductRepository,
  ],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}
