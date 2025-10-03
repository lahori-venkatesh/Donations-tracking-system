const nodemailer = require('nodemailer');
const logger = require('./logger');

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email - DonateTrack',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to DonateTrack!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for registering with DonateTrack. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${data.verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          If you didn't create an account with DonateTrack, please ignore this email.
        </p>
      </div>
    `
  }),
  
  passwordReset: (data) => ({
    subject: 'Reset Your Password - DonateTrack',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>You requested to reset your password for your DonateTrack account. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${data.resetUrl}</p>
        <p><strong>This link will expire in 10 minutes.</strong></p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          If you didn't request a password reset, please ignore this email and your password will remain unchanged.
        </p>
      </div>
    `
  }),
  
  donationConfirmation: (data) => ({
    subject: `Thank you for your donation of ₹${data.amount} - DonateTrack`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Thank You for Your Donation!</h2>
        <p>Dear ${data.donorName},</p>
        <p>Thank you for your generous donation of <strong>₹${data.amount}</strong> to <strong>${data.projectTitle}</strong>.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Donation Details</h3>
          <p><strong>Amount:</strong> ₹${data.amount}</p>
          <p><strong>Project:</strong> ${data.projectTitle}</p>
          <p><strong>NGO:</strong> ${data.ngoName}</p>
          <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
          <p><strong>Date:</strong> ${data.date}</p>
        </div>
        
        ${data.taxEligible ? `
          <p>Your donation is eligible for tax deduction under Section 80G. Your tax certificate will be generated and sent to you within 24 hours.</p>
        ` : ''}
        
        <p>You can track the impact of your donation and view project updates in your donor dashboard.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/donor/dashboard" 
             style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Dashboard
          </a>
        </div>
        
        <p>Thank you for making a difference!</p>
        <p>The DonateTrack Team</p>
      </div>
    `
  })
};

const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let emailContent;
    
    // Check if using template
    if (options.template && emailTemplates[options.template]) {
      emailContent = emailTemplates[options.template](options.data);
    } else {
      emailContent = {
        subject: options.subject,
        html: options.html || options.message
      };
    }

    const message = {
      from: `DonateTrack <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(message);
    
    logger.info(`Email sent to ${options.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email sending error:', error);
    throw error;
  }
};

module.exports = sendEmail;