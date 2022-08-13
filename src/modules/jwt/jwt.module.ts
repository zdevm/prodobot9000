import { Module } from '@nestjs/common';
import { JwtRepositoryInjectionToken } from './constants/jwt-repostiroty';
import { RedisJwtRepository } from './repositories/redis-jwt.repository';

const jwtRepositoryProvide = {
  provide: JwtRepositoryInjectionToken,
  useClass: RedisJwtRepository
}

@Module({
  providers: [jwtRepositoryProvide ],
  exports: [jwtRepositoryProvide]
})
export class JwtModule {

}
