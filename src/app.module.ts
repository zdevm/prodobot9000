import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import paths from '@configurations/paths';
import { ExtensionsManagerModule } from '@modules/extensions-manager/extensions-manager.module';
import { RateProviderModule } from '@modules/rate-provider/rate-provider.module';
import { ProductModule } from '@modules/product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductRateModule } from './modules/product-rate/product-rate.module';

const configSettings: ConfigModuleOptions = {
  isGlobal: true,
  load: [paths]
}

@Module({
  imports: [
    ExtensionsManagerModule,
    ConfigModule.forRoot(configSettings),
    RateProviderModule,
    ProductModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGODB_URI'),
        useNewUrlParser: true
      }),
      inject: [ConfigService]
    }),
    ProductRateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
