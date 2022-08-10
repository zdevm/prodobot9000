import { BadRequestException, Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './services/user/user.service';

@Controller('users')
export class UserController {

  public constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body(ValidationPipe) dto: RegisterUserDto) {
    try {
      return await this.userService.register(dto);
    } catch (ex) {
      throw new BadRequestException();
    }
  }

}
