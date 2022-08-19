import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Extension } from 'src/modules/extensions-manager/classes/extension';
import { ExtensionsManagerService } from 'src/modules/extensions-manager/services/extensions-manager.service';
import { RateProvider } from '@modules/rate-provider/interfaces/rate-provider.interface';
import { lastValueFrom, map, Observable } from 'rxjs';
import { RateProviderFormOptions } from '@modules/rate-provider/interfaces/form-options.interface';
import { Currency } from '@enums/currency.enum';

@Injectable()
export class RateProviderService implements RateProvider {

  private extensionsMap: Map<string, Extension> = new Map();

  public constructor(private readonly extensionsManagerService: ExtensionsManagerService,
                     private readonly httpService: HttpService) {
    this.extensionsManagerService.loadExtensions().then(extensions => {
      extensions.forEach(ext => this.extensionsMap.set(ext.slug, ext));
    });
  }

  getProviders() {
    return Array.from(this.extensionsMap.values()).map(ext => ({
      name: ext.name,
      description: ext.description,
      slug: ext.slug
    }));
  }

  async getProduct(provider: string, dto: any) { 
    const ext = this.getExtension(provider);
    const obs$ = this.httpService.post<{price: number; currency: Currency}>(`${ext.endpoint}/price`, dto, { timeout: 60000 })
                                 .pipe(
                                    map(res => {
                                      const rateRaw = res.data;
                                      if (rateRaw?.price === undefined) {
                                        throw new Error('Failed to obtain price.')
                                      }
                                      return rateRaw;
                                    })
                                  ) as Observable<{price: number; currency: Currency}>;
    return lastValueFrom(obs$);
  }

  async getName(provider: string) {
    return Promise.resolve(this.getExtension(provider).name);
  }

  async getWebsite(provider: string)  {
    return Promise.resolve(this.getExtension(provider).description);
  }

  async getFormOptions(provider: string) {
    const ext = this.getExtension(provider);
    const obs$ = this.httpService.get<RateProviderFormOptions>(`${ext.endpoint}/form-options`)
                                 .pipe(map(res => res.data))
    return lastValueFrom(obs$);
  }

  private getExtension(slug: string) {
    const ext = this.extensionsMap.get(slug);
    if (!ext) {
      throw new Error(`'${slug}' extension was not found.`);
    }
    return ext;
  }

}
