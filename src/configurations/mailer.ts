import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
  fromSender: process.env.MAILER_FROM_SENDER,
  fromName: process.env.MAILER_FROM_NAME,
  smtpUrl: process.env.MAILER_SMTP_URL
}))
