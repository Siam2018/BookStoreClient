import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  async testMail(@Body() body: { to: string; subject: string; text: string }) {
    await this.mailService.sendMail(body.to, body.subject, body.text);
    return { message: 'Test email sent (if config is correct)' };
  }
}
