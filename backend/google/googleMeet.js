const { google } = require('googleapis');

class GoogleMeetService {
  constructor(auth) {
    this.auth = auth;
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async createEventWithMeet(eventData) {
    try {
      const { 
        title, 
        description, 
        startTime, 
        endTime, 
        attendees = [], 
        timeZone = 'UTC',
        sendUpdates = 'all'
      } = eventData;

      // Create event with Google Meet
      const event = {
        summary: title,
        description: description,
        start: {
          dateTime: startTime,
          timeZone: timeZone,
        },
        end: {
          dateTime: endTime,
          timeZone: timeZone,
        },
        attendees: attendees.map(email => ({ email })),
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours before
            { method: 'popup', minutes: 10 }, // 10 minutes before
          ],
        },
        guestsCanInviteOthers: false,
        guestsCanModify: false,
        guestsCanSeeOtherGuests: true,
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: sendUpdates,
      });

      console.log('Event created successfully:', {
        id: response.data.id,
        htmlLink: response.data.htmlLink,
        hangoutLink: response.data.hangoutLink
      });

      return {
        success: true,
        eventId: response.data.id,
        meetLink: response.data.hangoutLink,
        htmlLink: response.data.htmlLink,
        eventData: response.data
      };

    } catch (error) {
      console.error('Error creating event with Meet:', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data || error
      };
    }
  }

  async updateEvent(eventId, updateData) {
    try {
      const response = await this.calendar.events.patch({
        calendarId: 'primary',
        eventId: eventId,
        resource: updateData,
        conferenceDataVersion: 1,
        sendUpdates: 'all'
      });

      return {
        success: true,
        eventData: response.data
      };
    } catch (error) {
      console.error('Error updating event:', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data || error
      };
    }
  }

  async deleteEvent(eventId) {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all'
      });

      return { 
        success: true, 
        message: 'Event deleted successfully' 
      };
    } catch (error) {
      console.error('Error deleting event:', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data || error
      };
    }
  }

  async getEvent(eventId) {
    try {
      const response = await this.calendar.events.get({
        calendarId: 'primary',
        eventId: eventId
      });

      return {
        success: true,
        eventData: response.data
      };
    } catch (error) {
      console.error('Error getting event:', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data || error
      };
    }
  }

  async listEvents(options = {}) {
    try {
      const {
        timeMin = new Date().toISOString(),
        timeMax,
        maxResults = 10,
        orderBy = 'startTime',
        singleEvents = true,
        q // search query
      } = options;

      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin,
        timeMax,
        maxResults,
        orderBy,
        singleEvents,
        q
      });

      return {
        success: true,
        events: response.data.items || [],
        nextPageToken: response.data.nextPageToken
      };
    } catch (error) {
      console.error('Error listing events:', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data || error
      };
    }
  }

  async addAttendeeToEvent(eventId, attendeeEmail) {
    try {
      const eventResult = await this.getEvent(eventId);
      if (!eventResult.success) {
        return eventResult;
      }

      const event = eventResult.eventData;
      const attendees = event.attendees || [];
      
      // Check if attendee already exists
      const existingAttendee = attendees.find(a => a.email === attendeeEmail);
      if (existingAttendee) {
        return { 
          success: false, 
          error: 'Attendee already exists' 
        };
      }

      attendees.push({ email: attendeeEmail });

      const updateResult = await this.updateEvent(eventId, { attendees });
      return updateResult;
    } catch (error) {
      console.error('Error adding attendee:', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data || error
      };
    }
  }

  async removeAttendeeFromEvent(eventId, attendeeEmail) {
    try {
      const eventResult = await this.getEvent(eventId);
      if (!eventResult.success) {
        return eventResult;
      }

      const event = eventResult.eventData;
      const attendees = event.attendees || [];
      
      const filteredAttendees = attendees.filter(a => a.email !== attendeeEmail);
      
      if (filteredAttendees.length === attendees.length) {
        return { 
          success: false, 
          error: 'Attendee not found' 
        };
      }

      const updateResult = await this.updateEvent(eventId, { attendees: filteredAttendees });
      return updateResult;
    } catch (error) {
      console.error('Error removing attendee:', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data || error
      };
    }
  }

  async getEventMeetLink(eventId) {
    try {
      const eventResult = await this.getEvent(eventId);
      if (!eventResult.success) {
        return eventResult;
      }

      const event = eventResult.eventData;
      return {
        success: true,
        meetLink: event.hangoutLink,
        htmlLink: event.htmlLink,
        conferenceData: event.conferenceData
      };
    } catch (error) {
      console.error('Error getting meet link:', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data || error
      };
    }
  }

  async createQuickMeet(title, startTime, duration = 60) {
    try {
      const endTime = new Date(new Date(startTime).getTime() + duration * 60000).toISOString();
      
      const eventData = {
        title: title || 'Quick Meet',
        description: 'Quick Google Meet session',
        startTime: startTime,
        endTime: endTime,
        attendees: [],
        timeZone: 'UTC'
      };

      return await this.createEventWithMeet(eventData);
    } catch (error) {
      console.error('Error creating quick meet:', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data || error
      };
    }
  }

  async getUpcomingMeetings(maxResults = 10) {
    try {
      const now = new Date().toISOString();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const listResult = await this.listEvents({
        timeMin: now,
        timeMax: endOfDay.toISOString(),
        maxResults,
        orderBy: 'startTime'
      });

      if (!listResult.success) {
        return listResult;
      }

      // Filter only events with Meet links
      const meetingEvents = listResult.events.filter(event => event.hangoutLink);

      return {
        success: true,
        meetings: meetingEvents.map(event => ({
          id: event.id,
          title: event.summary,
          startTime: event.start.dateTime,
          endTime: event.end.dateTime,
          meetLink: event.hangoutLink,
          attendees: event.attendees || []
        }))
      };
    } catch (error) {
      console.error('Error getting upcoming meetings:', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data || error
      };
    }
  }

  async rescheduleEvent(eventId, newStartTime, newEndTime) {
    try {
      const updateData = {
        start: {
          dateTime: newStartTime,
          timeZone: 'UTC'
        },
        end: {
          dateTime: newEndTime,
          timeZone: 'UTC'
        }
      };

      return await this.updateEvent(eventId, updateData);
    } catch (error) {
      console.error('Error rescheduling event:', error);
      return {
        success: false,
        error: error.message,
        details: error.response?.data || error
      };
    }
  }
}

module.exports = GoogleMeetService;