import { Inject, Injectable } from '@nestjs/common';
import { ExtensionsManagerConfigInjectionToken } from '../constants/extensions-config.token';
import { ExtensionsManagerConfig } from '../extensions-manager.interface';
import { readdirSync, readFile } from 'fs';
import { extname, join } from 'path';
import { Extension } from '../classes/extension';

@Injectable()
export class ExtensionsManagerService {
  private extensionsPath: string;

  public constructor(@Inject(ExtensionsManagerConfigInjectionToken) config: ExtensionsManagerConfig) {
    this.extensionsPath = config.extensionsPath;
  }

  scanForExtensions() {
    const fileNames = readdirSync(this.extensionsPath).filter(file => extname(file) === '.json')
    return fileNames;
  }

  async loadExtensions(exclude?: string[]): Promise<Extension[]> {
    const fileNames = this.scanForExtensions();
    if (!fileNames.length) {
      return [];
    }
    const readPromises: Promise<any>[] = fileNames.map(fn => this.jsonFromFile(join(this.extensionsPath, fn)))
    return Promise.all<Extension>(readPromises)
                  .then(jsonStructs => jsonStructs.map(json => new Extension(json)));
      
  }

  private jsonFromFile(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        }
        let json;
        try {
          json = JSON.parse(data)
          json.filePath = filePath;
        } catch (ex) {
          reject(ex);
        } finally {
          resolve(json);
        }
      })
    });
  }

}
