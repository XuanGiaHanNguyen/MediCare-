const { google } = require('googleapis');

class GoogleCalendarService {
  constructor(auth) {
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async listCalendars() {
    try {
      const response = await this.calendar.calendarList.list();
      return response.data.items;
    } catch (error) {
      console.error('Error listing calendars:', error);
      throw error;
    }
  }

  async listEvents(calendarId = 'primary', timeMin = new Date().toISOString()) {
    try {
      const response = await this.calendar.events.list({
        calendarId,
        timeMin,
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });
      return response.data.items;
    } catch (error) {
      console.error('Error listing events:', error);
      throw error;
    }
  }

  async createEvent(eventData) {
    try {
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
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async updateEvent(eventId, eventData) {
    try {
      const response = await this.calendar.events.patch({
        calendarId: 'primary',
        eventId,
        resource: eventData,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId) {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId,
      });
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
}

module.exports = GoogleCalendarService;