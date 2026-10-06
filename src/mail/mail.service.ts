import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { welcomeEmailTemplate } from './templates/welcome.template';
import { resetPasswordTemplate } from './templates/reset-password.template';

export interface SendEmailOptions {
  email: string;
  subject: string;
  message?: string;
  html?: string;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465, // true for 465 (SSL), false for 25/587 (TLS)
      
      // PRO FIX: Only pass the 'auth' object if BOTH EMAIL_USER and EMAIL_PASS exist
      // This is absolutely critical for VPS environments using localhost Postfix/Sendmail on port 25 without auth
      ...(process.env.EMAIL_USER && process.env.EMAIL_PASS ? {
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      } : {}),
      
      tls: {
        // Prevents blocking due to self-signed certificates
        rejectUnauthorized: false 
      }
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    const fromName = process.env.EMAIL_FROM_NAME || 'Clezo Express Laundry';
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@clezo.com';

    const mailOptions = {
      from: `${fromName} <${fromEmail}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html 
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`📧 Email sent successfully! Response: ${info.response}`);
    } catch (error) {
      this.logger.error(`❌ NODEMAILER ERROR: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Helper method for sending New User Welcome Email
  async sendWelcomeEmail(email: string, name: string, username: string, role: string): Promise<void> {
    await this.sendEmail({
      email,
      subject: 'Welcome to Clezo Express Laundry - Account Created',
      html: welcomeEmailTemplate(name, username, role),
    });
  }

  // Helper method for sending Password Reset
  async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<void> {
    const resetLink = `${process.env.ADMIN_PANEL_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    await this.sendEmail({
      email,
      subject: 'Password Reset Request - Clezo Express Laundry',
      html: resetPasswordTemplate(name, resetLink),
    });
  }
}
