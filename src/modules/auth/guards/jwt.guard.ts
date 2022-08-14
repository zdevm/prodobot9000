import { JwtStrategyName } from '@modules/auth/strategies/jwt.strategy';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JwtStrategyName) {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('INVALID_ACCESS_TOKEN');
    }
    return user;
  }
}
