import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule,  ConfigService } from '@nestjs/config';
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
import { BullModule } from '@nestjs/bull';
import queue from '@configurations/queue';

const moduleImports = new Map<string, DynamicModule>();

moduleImports.set('config', ConfigModule.forRoot({
  isGlobal: true,
  load: [paths, jwt, mailer, redis, queue]
}))

moduleImports.set('mongoose', MongooseModule.forRootAsync({
  useFactory: async (configService: ConfigService) => ({
    uri: configService.getOrThrow('MONGODB_URI'),
    useNewUrlParser: true
  }),
  inject: [ConfigService]
}))

moduleImports.set('mailer', MailerModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    transport: configService.getOrThrow('mailer.smtpUrl'),
    defaults: {
      from: `${configService.getOrThrow('mailer.fromName')}" <${configService.getOrThrow('mailer.fromSender')}>`,
    },
  }),
  inject: [ConfigService]
}))

moduleImports.set('redis', RedisModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    config: { url: configService.getOrThrow('redis.url') }
  }),
  inject: [ConfigService]
}))

moduleImports.set('bull', BullModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    url: configService.getOrThrow('redis.url'),
    prefix: configService.getOrThrow('queue.prefix')
  }),
  inject: [ConfigService]
}))

@Module({
  imports: [
    ExtensionsManagerModule,
    RateProviderModule,
    ProductModule,
    ProductRateModule,
    UploadModule,
    UserModule,
    AuthModule,
    MagicCodeAuthModule,
    moduleImports.get('config'),
    moduleImports.get('mongoose'),
    moduleImports.get('mailer'),
    moduleImports.get('redis'),
    moduleImports.get('bull')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
