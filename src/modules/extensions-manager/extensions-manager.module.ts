import { Module, Provider } from '@nestjs/common';
import { ExtensionsManagerService } from './services/extensions-manager.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ExtensionsManagerConfig } from './extensions-manager.interface';
import { ExtensionsManagerConfigInjectionToken } from './constants/extensions-config.token';

const extensionsManagerConfigProvider: Provider = {
  provide: ExtensionsManagerConfigInjectionToken,
  useFactory: (configService: ConfigService): ExtensionsManagerConfig => ({
    extensionsPath: join(configService.getOrThrow('paths.root'), 'extensions')
  }),
  inject: [ConfigService]
}

@Module({
  imports: [],
  providers: [
    ExtensionsManagerService,
    extensionsManagerConfigProvider
  ]
})
export class ExtensionsManagerModule {
  
}
