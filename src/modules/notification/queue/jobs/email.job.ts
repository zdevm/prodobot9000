import { ISendMailOptions } from "@nestjs-modules/mailer";

export const EmailJobName = 'EmailJob'

export interface EmailJobPayload extends ISendMailOptions { }