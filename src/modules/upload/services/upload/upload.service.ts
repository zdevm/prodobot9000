import { UploadService } from '@modules/upload/interfaces/upload.interface';
import { LocalFileRepository } from '@modules/upload/repositories/local-file.repository';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { writeFile } from 'fs';
import { join, extname, parse } from 'path';
import { File } from '../../classes/file';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LocalUploadService implements UploadService {
  private uploadsPath: string;

  public constructor(private configService: ConfigService,
                     private localFileRepository: LocalFileRepository) {
    this.uploadsPath = this.configService.get('paths.uploads');
  }

  saveFile(file: Express.Multer.File): Promise<File>
  saveFile(filename: string, data: Buffer, mimeType: string): Promise<File>
  async saveFile(...args: any[]): Promise<File> {
    const firstArg = args[0];
    let file: File;
    // save file to /uploads
    if (typeof firstArg === 'string') { // filename
      file = await this.fileSave.apply(this, args);
    } else if (firstArg?.fieldname) { // multer file
      file = await this.multerExpressFileSave.apply(this, args);
    } else {
      throw new Error('Invalid input arguments');
    }
    // save file to database
    return this.localFileRepository.create(file);
  }

  getUploadedFileById(id: string): Promise<File> {
    return this.localFileRepository.findById(id);
  }

  private fileSave(filename: string, data: Buffer, details?: { mimeType: string; }): Promise<File> {
    return new Promise(async (resolve, reject) => {
      // check if there is already a file with same name in database
      const fileInDb = await this.localFileRepository.findByFilename(filename);
      // a file with same name already exists
      // try appending a number in filename, until it filename is unique
      if (fileInDb) {
        const num = new Date().getTime() + Math.ceil(Math.random() * 100000);
        resolve(this.fileSave(this.appendBeforeExt(filename, `_${num.toString()}`), data, details));
        return;
      }
      // write file to /uploads
      const fileExt = extname(filename);
      const savePath = this.prepareSaveFilePath(`${uuidv4()}${fileExt}`);
      writeFile(savePath, data, (err) => {
        if (err) {
          reject(err);
        } else {
          const f = new File();
          f.filename = filename;
          f.fullPath = savePath;
          f.mimeType = details?.mimeType;
          f.ext = fileExt.substring(1) || ''; // substring to remove dot
          f.storage = 'local';
          resolve(f)
        }
      });
    }) 
  }

  private multerExpressFileSave(file: Express.Multer.File): Promise<File> {
    return this.fileSave(file.originalname, file.buffer, { mimeType: file.mimetype });
  }

  /**
   * Returns server's upload path + filename
   * @param filename 
   */
  private prepareSaveFilePath(filename: string) {
    return join(this.uploadsPath, filename || '');
  }

  /**
   *  Appended before ext
   */
  private appendBeforeExt(filename: string, textToAppend: string) {
    const fileParsed = parse(filename);
    return `${fileParsed.name}${textToAppend}${fileParsed.ext}`;
  }

}
