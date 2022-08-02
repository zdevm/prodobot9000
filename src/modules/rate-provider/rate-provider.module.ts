import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExtensionsManagerModule } from '../extensions-manager/extensions-manager.module';
import { RateProviderService } from './services/rate-provider/rate-provider.service';
import { RateProviderController } from './rate-provider.controller';

@Module({
  imports: [
    ExtensionsManagerModule,
    HttpModule.register({})
  ],
  providers: [RateProviderService],
  exports: [RateProviderService],
  controllers: [RateProviderController]
})
export class RateProviderModule {}
