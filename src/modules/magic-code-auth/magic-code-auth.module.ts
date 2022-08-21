import { Module } from '@nestjs/common';
import { MagicCodeAuthService } from './services/magic-code-auth/magic-code-auth.service';
import { MagicCodeAuthController } from './magic-code-auth.controller';
import { UserModule } from '@modules/user/user.module';
import { MagicCodeAuthRepository } from './repositories/magic-code-auth.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MagicCodeAuthSchema, MongooseMagicCodeAuth } from './schemas/magic-code.schema';
import { AuthModule } from '@modules/auth/auth.module';
import { NotificationModule } from '@modules/notification/notification.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: MongooseMagicCodeAuth.name, schema: MagicCodeAuthSchema }
    ]),
    NotificationModule
  ],
  providers: [
    MagicCodeAuthService,
    MagicCodeAuthRepository
  ],
  controllers: [MagicCodeAuthController]
})
export class MagicCodeAuthModule {}
