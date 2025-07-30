import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from 'src/mailer/dtos/send.mail.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,            
    port: Number(process.env.EMAIL_PORT), 
    secure: false,                            
    auth: {
      user: process.env.EMAIL_USER,    
      pass: process.env.EMAIL_PASS,          
    },
  });

  async sendMail(sendMailDto: SendMailDto) {
    const { to, subject, text, html } = sendMailDto;
    try {
      await this.transporter.sendMail({
        from: `School Admin <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
      this.logger.log(`Email successfully sent to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
