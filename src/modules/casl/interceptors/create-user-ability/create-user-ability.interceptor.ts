import { CaslAbilityFactory } from '@modules/casl/classes/casl-ability.factory';
import { UserAbilityProp } from '@modules/casl/constants/user-ability.constant';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class CreateUserAbilityInterceptor implements NestInterceptor {
  constructor(private caslAbilityFactory: CaslAbilityFactory) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const userId = request?.user as any;
    if (userId) {
      const ability = this.caslAbilityFactory.createForUser(userId);
      context.switchToHttp().getRequest()[UserAbilityProp] = ability;
    }
    return next.handle();
  }
}
