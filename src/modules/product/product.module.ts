import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './services/product/product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseProduct, ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './repositories/product.repository';
import { RateProviderModule } from '@modules/rate-provider/rate-provider.module';
import { ProductRateModule } from '@modules/product-rate/product-rate.module';
import { CaslModule } from '@modules/casl/casl.module';
import { BullModule } from '@nestjs/bull';
import { ProductConsumer, ProductQueueName } from './queue/consumers/product.consumer';
import { ScanRepository } from '../scan/repositories/scan.repository';
import { ScanModule } from '@modules/scan/scan.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongooseProduct.name, schema: ProductSchema }
    ]),
    BullModule.registerQueue({ name: ProductQueueName }),
    RateProviderModule,
    CaslModule,
    forwardRef(() => ProductRateModule),
    forwardRef(() => ScanModule),
  ],
  providers: [
    ProductService,
    ProductRepository,
    ProductConsumer
  ],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}
