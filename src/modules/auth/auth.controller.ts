import { BadRequestException, Body, Controller, Delete, HttpCode, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { TokenDto } from './dto/token.dto';
import { AuthService } from './services/auth/auth.service';

@Controller('auth')
export class AuthController {

  public constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  async refresh(@Body(ValidationPipe) dto: TokenDto) {
    try {
      return { accessToken: await this.authService.refresh(dto.token) }
    } catch (ex) {
      throw new BadRequestException();
    }
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async revoke(@Body(ValidationPipe) dto: TokenDto) {
    try {
      await this.authService.revoke(dto.token);
    } catch (ex) {
      throw new BadRequestException();
    }
  }

}
