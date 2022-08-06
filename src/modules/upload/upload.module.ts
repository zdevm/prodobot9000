import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { LocalUploadService } from './services/upload/upload.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema, MongooseFile } from './schemas/file.schema';
import { LocalFileRepository } from './repositories/local-file.repository';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadServiceInjectionToken } from './interfaces/upload.interface';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongooseFile.name, schema: FileSchema }
    ]),
    MulterModule.register({
      storage: memoryStorage()
    }),
  ],
  controllers: [UploadController],
  providers: [
    LocalFileRepository,
    {
      provide: UploadServiceInjectionToken,
      useClass: LocalUploadService
    }
  ],
  exports: [UploadServiceInjectionToken]
})
export class UploadModule {}
