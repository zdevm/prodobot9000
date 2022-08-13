
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAbilityProp } from '../constants/user-ability.constant';

export const UserAbility = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[UserAbilityProp];
  },
);