import { Controller, Get, Inject, NotFoundException, Param, Post, Query, Response, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response as ExpressResponse } from 'express';
import { IsMongoIdPipe } from 'src/pipes/is-mongo-id.pipe';
import { UploadService, UploadServiceInjectionToken } from './interfaces/upload.interface';

@Controller(['upload', 'files'])
export class UploadController {

  public constructor(@Inject(UploadServiceInjectionToken) private uploadService: UploadService) {

  }

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async singleFile(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadService.saveFile(file.originalname, file.buffer, file.mimetype)
                                   .then(file => ({ id: file.id }));
  }

  @Get(':id')
  async getUploadedFile(@Param('id', IsMongoIdPipe) id, @Response() res: ExpressResponse,
                        @Query('disposition') disposition: 'inline' | 'attachment' = 'inline') {
    const file = await this.uploadService.getUploadedFileById(id).catch(() => undefined);
    if (!file) {
      throw new NotFoundException();
    }
    if (disposition !== 'inline') {
      res.attachment(file.filename);
    }
    res.sendFile(file.fullPath);
  }

}
