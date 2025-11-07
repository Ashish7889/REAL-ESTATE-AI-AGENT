import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// In production, store and refresh tokens properly
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

export async function createCalendarEvent(booking) {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: `Site Visit - ${booking.listing?.title || 'Property'}`,
      description: `Site visit scheduled for ${booking.user.name}`,
      start: {
        dateTime: new Date(`${booking.visitDate}T${booking.visitTime}`).toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: new Date(new Date(`${booking.visitDate}T${booking.visitTime}`).getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      attendees: [
        { email: booking.user.email }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return {
      eventId: response.data.id,
      calendarLink: response.data.htmlLink,
      startTime: response.data.start.dateTime
    };
  } catch (error) {
    console.error('Create calendar event error:', error);
    return null;
  }
}

