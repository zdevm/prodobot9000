import { BadRequestException, Body, Controller, ForbiddenException, NotFoundException, Param, Post, Put, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { IsMongoIdPipe } from 'src/pipes/is-mongo-id.pipe';
import { FinishValidationDto } from './dto/finish-validation.dto';
import { StartValidationDto } from './dto/start-validation.dto';
import { NotFoundException as MagicCodeNotFoundException } from './exceptions/not-found.exception';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { MagicCodeAuthService } from './services/magic-code-auth/magic-code-auth.service';
import { pick } from 'lodash';
import { NotEligibleForValidationException } from './exceptions/not-eligible-for-validation.exception';

@Controller(['magic-code-auth', 'auth'])
export class MagicCodeAuthController {

  public constructor(private readonly magicCodeAuthService: MagicCodeAuthService) { }

  @Post()
  async startValidation(@Body(ValidationPipe) dto: StartValidationDto) {
    try {
      const magicAuth = await this.magicCodeAuthService.startValidation(dto);
      return pick(magicAuth, 'id', 'expiresAt');
    } catch (ex) {
      if (ex instanceof UserNotFoundException) {
        throw new NotFoundException();
      }
      throw new BadRequestException();
    }
  }

  @Put(':id')
  async finishValidation(@Param('id', IsMongoIdPipe) id: string,
                         @Body(ValidationPipe) dto: FinishValidationDto) {
    try {
      return await this.magicCodeAuthService.finishValidation(id, dto);
    } catch (ex) {
      if (ex instanceof MagicCodeNotFoundException) {
        throw new NotFoundException();
      } else if (ex instanceof NotEligibleForValidationException) {
        throw new ForbiddenException()
      }
      throw new BadRequestException();
    }
  }

}
