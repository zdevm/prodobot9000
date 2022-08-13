import { AuthService } from '@modules/auth/services/auth/auth.service';
import { MagicCodeAuth } from '@modules/magic-code-auth/classes/magic-code-auth';
import { FinishValidationDto } from '@modules/magic-code-auth/dto/finish-validation.dto';
import { StartValidationDto } from '@modules/magic-code-auth/dto/start-validation.dto';
import { InvalidCodeException } from '@modules/magic-code-auth/exceptions/invalid-code.exception';
import { NotEligibleForValidationException } from '@modules/magic-code-auth/exceptions/not-eligible-for-validation.exception';
import { NotFoundException } from '@modules/magic-code-auth/exceptions/not-found.exception';
import { UserNotFoundException } from '@modules/magic-code-auth/exceptions/user-not-found.exception';
import { MagicCodeAuthRepository } from '@modules/magic-code-auth/repositories/magic-code-auth.repository';
import { User } from '@modules/user/classes/user';
import { UserService } from '@modules/user/services/user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { HelperService } from '@services/helper.service';
import { addMinutes, isBefore  } from 'date-fns'

@Injectable()
export class MagicCodeAuthService {
  public constructor(private readonly magicCodeAuthRepository: MagicCodeAuthRepository,
                     private readonly mailerService: MailerService,
                     private readonly userService: UserService,
                     private readonly authService: AuthService) {}

  async startValidation(dto: StartValidationDto) {
    const user = await this.getUserByEmail(dto.email);
    const code = this.generateCode();
    const magicAuth = await this.createMagicAuth(HelperService.id(user), code);
    const messageInfo = await this.sendCode(user.email, code);
    return magicAuth;
  }

  async finishValidation(id: string, dto: FinishValidationDto) {
    let auth = await this.findAuthById(id);
    auth = await this.incrementAttempts(auth);
    this.eligibleForValidationOrThrow(auth);
    this.codeIsValidOrThrow(dto.code, auth.code);
    return this.authService.auth(<User>auth.user);
  }

  private incrementAttempts(auth: MagicCodeAuth) {
    return this.magicCodeAuthRepository.updateById(HelperService.id(auth), { attempts: auth.attempts + 1 })
  }

  private codeIsValidOrThrow(input: string, original: string) {
    if (input !== original) {
      throw new InvalidCodeException();
    }
  }

  private eligibleForValidationOrThrow(auth: MagicCodeAuth) {
    if (auth.attempts > auth.maxAttempts
        || (auth.expiresAt && isBefore( auth.expiresAt, new Date()))
        || !!auth.verifiedAt === true) {
      throw new NotEligibleForValidationException()
    }
  }

  private findAuthById(id: string) {
    return this.magicCodeAuthRepository.findById(id, { populateUser: true }).then(m => {
      if (!m) {
        throw new NotFoundException();
      }
      return m;
    })
  }

  private getUserByEmail(email: string) {
    return this.userService.findOneByEmail(email).then(user => {
      if (!user) {
        throw new UserNotFoundException();
      }
      return user;
    })
  }

  private createMagicAuth(user: string, code: string): Promise<MagicCodeAuth> {
    const defaultDuration = 5; // 'minutes'
    return this.magicCodeAuthRepository.create({
      code,
      user,
      expiresAt: addMinutes(new Date(), defaultDuration)
    })
  }

  private sendCode(email: string, code: string) {
    return this.mailerService
      .sendMail({
        to: email,
        subject: 'A magic code is waiting for you!',
        text: `Here is your magic code: ${code}`, // plaintext body
        html: `Here is your magic code: <b>${code}</b>`, // HTML body content
      })
  }

  private generateCode(): string {
    return Math.floor(Math.random() * 900000 + 100).toString();
  }

}
