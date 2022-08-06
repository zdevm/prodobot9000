import { File } from '../classes/file';

export const UploadServiceInjectionToken = 'UploadService';

export interface UploadService {

  saveFile(file: Express.Multer.File): Promise<File>;
  saveFile(filename: string, data: Buffer, mimeType: string): Promise<File>;

  getUploadedFileById(id: string): Promise<File>;

}