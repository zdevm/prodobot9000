import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExtensionsManagerModule } from '../extensions-manager/extensions-manager.module';
import { RateProviderService } from './services/rate-provider/rate-provider.service';

@Module({
  imports: [
    ExtensionsManagerModule,
    HttpModule.register({})
  ],
  providers: [RateProviderService]
})
export class RateProviderModule {}
