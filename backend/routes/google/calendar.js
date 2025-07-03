const express = require('express');
const { setCredentials } = require("../../google/googleAuth")
const GoogleCalendarService = require("../../google/googleCalendar")
const GoogleMeetService = require("../../google/googleMeet")

const router = express.Router();

// Middleware to check authentication
function requireAuth(req, res, next) {
  if (!req.session.tokens) {
    return res.redirect('/auth/google');
  }
  next();
}

// Get calendar events
router.get('/events', requireAuth, async (req, res) => {
  try {
    const auth = setCredentials(req.session.tokens);
    const calendarService = new GoogleCalendarService(auth);
    
    const events = await calendarService.listEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create new event
router.post('/events', requireAuth, async (req, res) => {
  try {
    const auth = setCredentials(req.session.tokens);
    const calendarService = new GoogleCalendarService(auth);
    
    const event = await calendarService.createEvent(req.body);
    res.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Create event with Google Meet
router.post('/events/with-meet', requireAuth, async (req, res) => {
  try {
    const auth = setCredentials(req.session.tokens);
    const meetService = new GoogleMeetService(auth);
    
    const event = await meetService.createEventWithMeet(req.body);
    res.json(event);
  } catch (error) {
    console.error('Error creating event with Meet:', error);
    res.status(500).json({ error: 'Failed to create event with Meet' });
  }
});

module.exports = router;