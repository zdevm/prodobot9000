import { CaslModule } from '@modules/casl/casl.module';
import { ProductModule } from '@modules/product/product.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScanRepository } from './repositories/scan.repository';
import { ScanController } from './scan.controller';
import { MongooseScan, ScanSchema } from './schemas/scan.schema';
import { ScanService } from './services/scan/scan.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongooseScan.name, schema: ScanSchema, collection: 'pricescans' }
    ]),
    forwardRef(() => ProductModule),
    CaslModule
  ],
  controllers: [ScanController],
  providers: [ScanService, ScanRepository],
  exports: [ScanService]
})
export class ScanModule {}
