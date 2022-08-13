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
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MagicCodeAuthModule } from './modules/magic-code-auth/magic-code-auth.module';
import jwt from '@configurations/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import mailer from '@configurations/mailer';
import redis from '@configurations/redis';
import { RedisModule } from '@nestjs-modules/ioredis';

const configSettings: ConfigModuleOptions = {
  isGlobal: true,
  load: [paths, jwt, mailer, redis]
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
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: configService.getOrThrow('mailer.smtpUrl'),
        defaults: {
          from: `${configService.getOrThrow('mailer.fromName')}" <${configService.getOrThrow('mailer.fromSender')}>`,
        },
      }),
      inject: [ConfigService]
    }),
    ProductRateModule,
    UploadModule,
    UserModule,
    AuthModule,
    MagicCodeAuthModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        config: { url: configService.getOrThrow('redis.url') }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
