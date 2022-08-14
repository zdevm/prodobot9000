import { JwtGuard } from '@modules/auth/decorators/jwt-guard.decorator';
import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Request, ValidationPipe } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './services/user/user.service';

@Controller('users')
export class UserController {

  public constructor(private readonly userService: UserService) {}

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

  @Get(':email/exists')
  @HttpCode(HttpStatus.NO_CONTENT)
  async emailExists(@Param('email') email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
  }

}
