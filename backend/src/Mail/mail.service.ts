import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      return await this.mailerService.sendMail({
        to,
        subject,
        text,
        html,
      });
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to send mail',
        error.status || 500
      );
    }
  }
}
