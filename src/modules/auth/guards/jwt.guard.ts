import { JwtStrategyName } from '@modules/auth/strategies/jwt.strategy';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JwtStrategyName) {}
