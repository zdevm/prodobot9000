import { AuthUserId } from '@modules/auth/decorators/auth-user.decorator';
import { JwtGuard } from '@modules/auth/decorators/jwt-guard.decorator';
import { AppAbility } from '@modules/casl/classes/casl-ability.factory';
import { UserAbility } from '@modules/casl/decorators/user-ability';
import { CreateUserAbilityInterceptor } from '@modules/casl/interceptors/create-user-ability/create-user-ability.interceptor';
import { DemoConfigInjectionToken } from '@modules/demo/demo.module';
import { DemoConfig } from '@modules/demo/interfaces/demo-config.interface';
import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Inject, NotFoundException, Param, Post, Put, Request, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { PermissionsHelperService } from '@services/permissions-helper.service';
import { Request as ExpressRequest } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './services/user/user.service';

@Controller('users')
export class UserController {

  public constructor(private readonly userService: UserService,
                     @Inject(DemoConfigInjectionToken) private readonly demoConfig: DemoConfig) {}

  @Get('me')
  @JwtGuard()
  getMe(@Request() request: ExpressRequest) {
    return this.userService.findById((<any>request).user);
  }

  @Post('register')
  async register(@Body(ValidationPipe) dto: RegisterUserDto) {
    try {
      return await this.userService.register(dto);
    } catch (ex) {
      throw new BadRequestException();
    }
  }

  /**
   * Updates specified user (id param) or user performing the request.
   * @param dto 
   * @param loggedInUserId Authorized user's id
   * @param id Input user id
   * @param ability user ability (permissions)
   * @returns 
   */

  @Put(':id?')
  @JwtGuard()
  @UseInterceptors(CreateUserAbilityInterceptor)
  async update(@Body(ValidationPipe) dto: UpdateUserDto,
               @AuthUserId() loggedInUserId: string,
               @Param('id') id?: string,
               @UserAbility() ability?: AppAbility) {
    const userId = id ?? loggedInUserId;
    if (!userId) {
      throw new BadRequestException();
    }
    const user = await this.userService.findById(userId);
    PermissionsHelperService.canUpdateOrThrow(user, ability)
    if (!user) {
      throw new NotFoundException();
    }
    return await this.userService.updateById(userId, dto);
  }

  @Delete(':id?')
  @JwtGuard()
  @UseInterceptors(CreateUserAbilityInterceptor)
  async delete(@AuthUserId() loggedInUserId: string,
               @Param('id') id?: string,
               @UserAbility() ability?: AppAbility) {
    const userId = id ?? loggedInUserId;
    if (!userId) {
      throw new BadRequestException();
    }
    const user = await this.userService.findById(userId);
    if (this.checkIfDemoEmail(user.email)) {
      throw new ForbiddenException('Cannot delete DEMO account');
    }
    PermissionsHelperService.canDeleteOrThrow(user, ability)
    if (!user) {
      throw new NotFoundException();
    }
    return await this.userService.deleteById(userId);
  }

  @Get(':email/exists')
  @HttpCode(HttpStatus.NO_CONTENT)
  async emailExists(@Param('email') email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
  }

  private checkIfDemoEmail(email: string) {
    return email === this.demoConfig.email;
  }

}
