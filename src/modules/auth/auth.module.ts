import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './services/auth/auth.service';
import { JwtModule as LocalJwtModule } from '@modules/jwt/jwt.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('jwt.secret'),
        signOptions: { expiresIn: '60s' }
      }),
      inject: [ConfigService]
    }),
    LocalJwtModule
  ],
  providers: [
    JwtStrategy,
    {
      provide: 'JWT_CONFIG',
      useFactory: (configService: ConfigService) => (configService.getOrThrow('jwt')), 
      inject: [ConfigService]
    },
    AuthService
  ],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {
}
