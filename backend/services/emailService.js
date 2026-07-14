import { Resend } from 'resend';

let resendClient = null;

function getResendClient() {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }
    resendClient = new Resend(key);
  }
  return resendClient;
}

export const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset Your Password - Agrivision AI',
      html: `
        <h1>Password Reset Request</h1>
        <p>Hello,</p>
        <p>We received a request to reset your password for your Agrivision AI account.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 30 minutes.</p>
        <p>Best regards,<br>The Agrivision AI Team</p>
      `
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send reset email');
  }
};
