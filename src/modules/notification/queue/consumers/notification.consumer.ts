import { MailerService } from "@nestjs-modules/mailer";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { EmailJobName, EmailJobPayload } from "../jobs/email.job";

export const NotificationQueueName = 'Notification'

@Processor(NotificationQueueName)
export class NotificationConsumer {

  constructor(private readonly mailerService: MailerService) {}

  @Process(EmailJobName)
  async sendEMail(job: Job<EmailJobPayload>) {
    await this.mailerService.sendMail(job.data);
  }

}
