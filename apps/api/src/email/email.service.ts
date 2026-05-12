import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,

      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });
  }

  async sendEmailConfirmation(email: string, confirmToken: string) {
    const confirmationLink = `${process.env.FRONTEND_URL}/confirm-email?token=${confirmToken}`;

    const mailOptions = {
      from: this.configService.get('GMAIL_USER'),
      to: email,
      subject: 'Email Confirmation - Critic Lib',
      html: `
        <h2>Welcome to Critic Lib!</h2>
        <p>Please confirm your email address by clicking the link below:</p>
        <a href="${confirmationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Confirm Email
        </a>
        <p>Or copy this link: ${confirmationLink}</p>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendPasswordReset(email: string, resetToken: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: this.configService.get('GMAIL_USER'),
      to: email,
      subject: 'Password Reset - Critic Lib',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>Or copy this link: ${resetLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendLoginConfirmation(email: string, username: string) {
    const mailOptions = {
      from: this.configService.get('GMAIL_USER'),
      to: email,
      subject: 'Login Confirmation - Critic Lib',
      html: `
        <h2>Login Confirmation</h2>
        <p>Hi ${username},</p>
        <p>You have successfully logged in to your Critic Lib account.</p>
        <p>If this wasn't you, please reset your password immediately.</p>
        <p>Best regards,<br>Critic Lib Team</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
