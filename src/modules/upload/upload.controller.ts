import { Controller, Inject, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService, UploadServiceInjectionToken } from './interfaces/upload.interface';

@Controller('upload')
export class UploadController {

  public constructor(@Inject(UploadServiceInjectionToken) private uploadService: UploadService) {

  }

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async singleFile(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadService.saveFile(file.originalname, file.buffer, file.mimetype)
                                   .then(file => ({ id: file.id }));
  }



}
