const express = require('express');

const GoogleMeetService = require("../../google/googleMeet")
const GoogleCalendarService = require("../../google/googleCalendar"); 
const {setCredentials} = require("../../google/googleAuth")
const database = require("../../connect")

const router = express.Router();

// Helper function to get tokens from MongoDB
async function getTokensFromMongo(userId) {
  try {
    const db = database.getDB();
    const collection = db.collection('google');
    const result = await collection.findOne({ userId: userId });
    return result;
  } catch (error) {
    console.error('Error getting tokens from MongoDB:', error);
    return null;
  }
}

// Middleware to authenticate and set up Google Meet service
async function authMiddleware(req, res, next) {
  try {
    const userId = req.params.userId || req.body.userId || req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID is required' 
      });
    }

    // Try to get tokens from session first
    let tokens = req.session.tokens;
    let userInfo = req.session.user;

    // If no session tokens, try to get from MongoDB
    if (!tokens) {
      const storedAuth = await getTokensFromMongo(userId);
      if (storedAuth && storedAuth.tokens) {
        tokens = storedAuth.tokens;
        userInfo = storedAuth.userInfo;
        
        // Restore session
        req.session.tokens = tokens;
        req.session.user = userInfo;
      }
    }

    if (!tokens) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authenticated. Please authenticate with Google first.' 
      });
    }

    // Set up Google auth and Meet service
    const auth = setCredentials(tokens);
    req.meetService = new GoogleMeetService(auth);
    req.userId = userId;
    req.userInfo = userInfo;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Authentication failed',
      details: error.message 
    });
  }
}

// Create a meeting with Google Meet
router.post('/create/:userId', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      attendees = [],
      timeZone = 'UTC'
    } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: 'Title, start time, and end time are required'
      });
    }

    const result = await req.meetService.createEventWithMeet({
      title,
      description,
      startTime,
      endTime,
      attendees,
      timeZone
    });

    res.json(result);
    
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create meeting',
      details: error.message
    });
  }
});

// Create Google Calendar event from your event data
router.post('/calendar-event/:userId', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      duration,
      location,
      participants = [],
      session
    } = req.body;

    if (!title || !date || !time || !duration) {
      return res.status(400).json({
        success: false,
        error: 'Title, date, time, and duration are required'
      });
    }

    // Parse the date and time to create start and end DateTime
    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + (parseInt(duration) * 60000)); // Add duration in minutes

    // Transform participants to Google Calendar attendees format
    const attendees = participants.map(participant => ({
      email: participant.email || participant, // Handle both object and string formats
      displayName: participant.name || participant.displayName || undefined
    }));

    // Create calendar service instance
    const calendarService = new GoogleCalendarService(req.meetService.auth);

    // Prepare event data for Google Calendar
    const eventData = {
      title,
      description: description || `${title} - ${session === 'online' ? 'Online Session' : 'In-Person Session'}`,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      timeZone: 'UTC', // You can make this configurable
      attendees
    };

    // Add location if provided
    if (location && location !== 'Google Meet') {
      eventData.location = location;
    }

    const result = await calendarService.createEvent(eventData);

    res.json({
      success: true,
      message: 'Calendar event created successfully',
      event: result,
      eventId: result.id,
      htmlLink: result.htmlLink
    });
    
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create calendar event',
      details: error.message
    });
  }
});


module.exports = router;