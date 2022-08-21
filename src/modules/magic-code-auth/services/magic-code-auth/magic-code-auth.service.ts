import { DemoConfig } from '@modules/demo/interfaces/demo-config.interface';
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
import { Inject, Injectable } from '@nestjs/common';
import { HelperService } from '@services/helper.service';
import { addMinutes, isBefore  } from 'date-fns'
import { DemoConfigInjectionToken } from '@modules/demo/demo.module';
import { Queue } from 'bull';
import { NotificationQueueName } from '@modules/notification/queue/consumers/notification.consumer';
import { EmailJobName, EmailJobPayload } from '@modules/notification/queue/jobs/email.job';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class MagicCodeAuthService {
  public constructor(private readonly magicCodeAuthRepository: MagicCodeAuthRepository,
                     private readonly userService: UserService,
                     private readonly authService: AuthService,
                     @InjectQueue(NotificationQueueName) private readonly notificationQueue: Queue,
                     @Inject(DemoConfigInjectionToken) private readonly demoConfig: DemoConfig) {}

  async startValidation(dto: StartValidationDto) {
    const isDemo = dto.email === this.demoConfig.email;
    const user = await this.getUserByEmail(dto.email);
    const code = isDemo ? (this.demoConfig.code || '123456') : this.generateCode();
    const magicAuth = await this.createMagicAuth(HelperService.id(user), code);
    await this.sendCode(user.email, code);
    return magicAuth;
  }

  async finishValidation(id: string, dto: FinishValidationDto) {
    let auth = await this.findAuthById(id);
    const updatePartial: Partial<MagicCodeAuth> = { attempts: auth.attempts + 1 }; // increase attempts
    try {
      this.eligibleForValidationOrThrow(auth);
      this.codeIsValidOrThrow(dto.code, auth.code);
      updatePartial.verifiedAt = new Date(); // reaching this point means that auth is verified.
      return this.authService.auth(<User>auth.user);
    } catch (ex) {
      throw ex;
    } finally {
      // update auth object
      this.magicCodeAuthRepository.updateById(HelperService.id(auth), updatePartial)
    }
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

  private async sendCode(email: string, code: string) {
    const jobPayload: EmailJobPayload = {
      to: email,
      subject: 'A magic code is waiting for you!',
      text: `Here is your magic code: ${code}`, // plaintext body
      html: `Here is your magic code: <b>${code}</b>`, // HTML body content
    }
    await this.notificationQueue.add(EmailJobName, jobPayload, {
      backoff: 3,
      timeout: 30 * 1000
    })
  }

  private generateCode(): string {
    return Math.floor(Math.random() * 900000 + 100).toString();
  }

}
