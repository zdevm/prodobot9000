import { BadRequestException, Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { LocalUploadService } from './services/upload/upload.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema, MongooseFile } from './schemas/file.schema';
import { LocalFileRepository } from './repositories/local-file.repository';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadServiceInjectionToken } from './interfaces/upload.interface';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongooseFile.name, schema: FileSchema }
    ]),
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        storage: memoryStorage(),
        limits: { fileSize: configService.get('upload.maxFileSize') },
        // TODO accept any type. Move validation logic
        fileFilter(req, file, cb) {
          if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
          } else {
            cb(null, false);
            return cb(new BadRequestException('Invalid image format!'), false);
          }
        }
      }),
      inject: [ConfigService]
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
