import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create transporter with Gmail or custom SMTP
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('Email service is ready to send messages');
    } catch (error) {
      logger.error('Email service connection failed:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${config.email.fromName}" <${config.email.from}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully', { messageId: info.messageId, to: options.to });
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
    const verificationUrl = `${config.frontend.url}/verify-email?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - HerbTrace</title>
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background-color: #f7fafc;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #2d5540 0%, #1a3728 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header .logo {
            font-size: 40px;
            margin-bottom: 10px;
          }
          .content {
            padding: 40px 30px;
          }
          .content h2 {
            color: #1a202c;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .content p {
            color: #4a5568;
            font-size: 16px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            background: #C87A3C;
            color: white;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: background 0.3s ease;
          }
          .button:hover {
            background: #b66a2c;
          }
          .token-box {
            background: #f7fafc;
            border: 2px dashed #cbd5e0;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            text-align: center;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #2d3748;
            word-break: break-all;
          }
          .footer {
            background: #f7fafc;
            padding: 30px;
            text-align: center;
            color: #718096;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
          }
          .footer a {
            color: #2d5540;
            text-decoration: none;
          }
          .features {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
            padding: 20px 0;
            border-top: 1px solid #e2e8f0;
            border-bottom: 1px solid #e2e8f0;
          }
          .feature {
            text-align: center;
          }
          .feature-icon {
            font-size: 32px;
            margin-bottom: 8px;
          }
          .feature-text {
            font-size: 12px;
            color: #718096;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌿</div>
            <h1>HerbTrace</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Blockchain-Verified Traceability</p>
          </div>
          
          <div class="content">
            <h2>Welcome, ${name}! 👋</h2>
            <p>Thank you for joining <strong>HerbTrace</strong> - the future of Ayurvedic supply chain transparency.</p>
            
            <p>To complete your registration and start using our platform, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">✅ Verify Email Address</a>
            </div>
            
            <p style="font-size: 14px; color: #718096;">
              Or copy and paste this link in your browser:
            </p>
            <div class="token-box">${verificationUrl}</div>
            
            <div class="features">
              <div class="feature">
                <div class="feature-icon">🔗</div>
                <div class="feature-text">Blockchain<br/>Security</div>
              </div>
              <div class="feature">
                <div class="feature-icon">📍</div>
                <div class="feature-text">Geo-Tagged<br/>Origins</div>
              </div>
              <div class="feature">
                <div class="feature-icon">📱</div>
                <div class="feature-text">QR Code<br/>Verification</div>
              </div>
            </div>
            
            <p style="font-size: 14px; color: #718096;">
              <strong>Note:</strong> This verification link will expire in 24 hours. If you didn't create an account with HerbTrace, please ignore this email.
            </p>
          </div>
          
          <div class="footer">
            <p>
              <strong>HerbTrace</strong><br/>
              From Soil to Soul, Traced & Trusted
            </p>
            <p style="margin-top: 15px;">
              <a href="${config.frontend.url}">Visit Website</a> • 
              <a href="${config.frontend.url}/scan">Scan Products</a> • 
              <a href="${config.frontend.url}/login">Login</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px;">
              © ${new Date().getFullYear()} HerbTrace. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to HerbTrace, ${name}!
      
      Please verify your email address by visiting:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account, please ignore this email.
      
      Best regards,
      The HerbTrace Team
    `;

    return await this.sendEmail({
      to: email,
      subject: '✅ Verify Your Email - HerbTrace',
      html,
      text,
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Welcome to HerbTrace</title>
        <style>
          body { font-family: 'Inter', sans-serif; background-color: #f7fafc; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #2d5540 0%, #1a3728 100%); padding: 40px 30px; text-align: center; color: white; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; background: #C87A3C; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 40px; margin-bottom: 10px;">🌿</div>
            <h1 style="margin: 0;">Welcome to HerbTrace!</h1>
          </div>
          <div class="content">
            <h2>Your Email is Verified! 🎉</h2>
            <p>Hi ${name},</p>
            <p>Congratulations! Your email has been successfully verified and your account is now active.</p>
            <p>You can now access all features of HerbTrace:</p>
            <ul>
              <li>📱 Scan and verify products</li>
              <li>📦 Track supply chain events</li>
              <li>🔗 View blockchain-verified transactions</li>
              <li>📊 Access your dashboard</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${config.frontend.url}/dashboard" class="button">🚀 Go to Dashboard</a>
            </div>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br/>The HerbTrace Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: email,
      subject: '🎉 Welcome to HerbTrace - Email Verified!',
      html,
    });
  }
}

export const emailService = new EmailService();
