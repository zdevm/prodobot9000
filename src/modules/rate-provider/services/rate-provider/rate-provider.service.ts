import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Extension } from 'src/modules/extensions-manager/classes/extension';
import { ExtensionsManagerService } from 'src/modules/extensions-manager/services/extensions-manager.service';

@Injectable()
export class RateProviderService {

  private extensionsMap: Map<string, Extension> = new Map();

  public constructor(private readonly extensionsManagerService: ExtensionsManagerService,
                     private readonly httpService: HttpService) {
    this.extensionsManagerService.loadExtensions().then(extensions => {
      extensions.forEach(ext => this.extensionsMap.set(ext.slug, ext));
    });
  }

  async getProduct(provider: string, dto: any) { 
    const ext = this.getExtension(provider);
    this.httpService.post(`${ext.endpoint}/price`, dto).subscribe(res => console.log(res.data))
  }

  private getExtension(slug: string) {
    const ext = this.extensionsMap.get(slug);
    if (!ext) {
      throw new Error(`'${slug}' extension was not found.`);
    }
    return ext;
  }


}
