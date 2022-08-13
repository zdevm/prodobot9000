import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { HelperService } from "@services/helper.service";

export const AuthUserId = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (typeof user === 'object') {
      return HelperService.id(user);
    } 
    return user;
  },
);