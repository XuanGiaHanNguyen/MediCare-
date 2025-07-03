const { google } = require('googleapis');

class GoogleMeetService {
  constructor(auth) {
    this.meet = google.meet({ version: 'v2', auth });
  }

  async createMeeting(meetingData) {
    try {
      const space = await this.meet.spaces.create({
        requestBody: {
          config: {
            accessType: 'OPEN', // or 'RESTRICTED'
            entryPointAccess: 'ALL' // or 'CREATOR_APP_ONLY'
          }
        }
      });

      return {
        meetingUrl: space.data.meetingUri,
        meetingId: space.data.name,
        meetingCode: space.data.meetingCode
      };
    } catch (error) {
      console.error('Error creating Google Meet:', error);
      throw error;
    }
  }

  async createEventWithMeet(eventData) {
    try {
      // Create the calendar event with Google Meet
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: eventData.timeZone || 'UTC',
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: eventData.timeZone || 'UTC',
        },
        attendees: eventData.attendees || [],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`, // Unique ID for the request
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        }
      };

      const calendar = google.calendar({ version: 'v3', auth: this.meet.auth });
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1
      });

      return response.data;
    } catch (error) {
      console.error('Error creating event with Meet:', error);
      throw error;
    }
  }
}

module.exports = GoogleMeetService;