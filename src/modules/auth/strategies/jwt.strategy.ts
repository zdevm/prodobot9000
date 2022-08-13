import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { InjectJwtRepository } from '@modules/jwt/decorators/inject-jwt-repository.decorator';
import { JwtRepository } from '@modules/jwt/repositories/jwt.interface';

export const JwtStrategyName = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JwtStrategyName) {
  
  constructor(@Inject('JWT_CONFIG') private jwtConfig: { secret: string },
              @InjectJwtRepository() private jwtRepository: JwtRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: { sub: string; jti: string; }) {
    // check payload validity
    if (!payload.sub || !payload.jti) { // Access token is malformed
      return null;
    }
    // check if token is revoked (exists in repository)
    const tokenExists = await this.jwtRepository.retrieve(payload.jti).then(t => !!t, () => false);
    if (!tokenExists) { // Access token is revoked!
      return null;
    }
    // success - return userId
    return payload.sub;
  }

}