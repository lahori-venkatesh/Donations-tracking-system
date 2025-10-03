const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'development') {
    // For development, we'll just log emails instead of sending them
    return {
      sendMail: async (options) => {
        console.log('📧 Email would be sent:', {
          to: options.to,
          subject: options.subject,
          text: options.text || 'HTML email content'
        });
        return { messageId: 'dev-' + Date.now() };
      }
    };
  }

  // Production email configuration
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@donatetrack.com',
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    // Handle template-based emails
    if (options.template && options.data) {
      switch (options.template) {
        case 'emailVerification':
          mailOptions.html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Welcome to DonateTrack!</h2>
              <p>Hi ${options.data.name},</p>
              <p>Thank you for registering with DonateTrack. Please verify your email address by clicking the link below:</p>
              <a href="${options.data.verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
              <p>If you didn't create an account, please ignore this email.</p>
              <p>Best regards,<br>The DonateTrack Team</p>
            </div>
          `;
          break;
        case 'passwordReset':
          mailOptions.html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Password Reset Request</h2>
              <p>Hi ${options.data.name},</p>
              <p>You requested a password reset for your DonateTrack account. Click the link below to reset your password:</p>
              <a href="${options.data.resetUrl}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
              <p>This link will expire in 10 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <p>Best regards,<br>The DonateTrack Team</p>
            </div>
          `;
          break;
        default:
          mailOptions.html = options.data.html || options.text;
      }
    }

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
};