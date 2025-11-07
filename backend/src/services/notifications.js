import twilio from 'twilio';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendNotification({ type, to, subject, body, phone }) {
  try {
    if (type === 'email' && to) {
      await sgMail.send({
        to: to,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@riverwood.com',
        subject: subject,
        text: body,
        html: `<p>${body}</p>`
      });
      return { success: true, method: 'email' };
    }

    if (type === 'sms' && phone) {
      await twilioClient.messages.create({
        body: body,
        to: phone,
        from: process.env.TWILIO_PHONE_NUMBER
      });
      return { success: true, method: 'sms' };
    }

    return { success: false, error: 'Invalid notification type or missing recipient' };
  } catch (error) {
    console.error('Send notification error:', error);
    return { success: false, error: error.message };
  }
}

