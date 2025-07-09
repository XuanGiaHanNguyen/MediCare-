const express = require('express');

const GoogleMeetService = require("../../google/googleMeet")
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

// Create a quick meeting (starts now, 60 minutes duration)
router.post('/quick/:userId', authMiddleware, async (req, res) => {
  try {
    const { title, duration = 60 } = req.body;
    const startTime = new Date().toISOString();

    const result = await req.meetService.createQuickMeet(title, startTime, duration);
    res.json(result);
  } catch (error) {
    console.error('Error creating quick meeting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create quick meeting',
      details: error.message
    });
  }
});

// Get upcoming meetings
router.get('/upcoming/:userId', authMiddleware, async (req, res) => {
  try {
    const maxResults = parseInt(req.query.maxResults) || 10;
    const result = await req.meetService.getUpcomingMeetings(maxResults);
    res.json(result);
  } catch (error) {
    console.error('Error getting upcoming meetings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get upcoming meetings',
      details: error.message
    });
  }
});

// Get all events (with optional filters)
router.get('/events/:userId', authMiddleware, async (req, res) => {
  try {
    const {
      timeMin,
      timeMax,
      maxResults = 10,
      orderBy = 'startTime',
      q
    } = req.query;

    const options = {
      timeMin,
      timeMax,
      maxResults: parseInt(maxResults),
      orderBy,
      q
    };

    const result = await req.meetService.listEvents(options);
    res.json(result);
  } catch (error) {
    console.error('Error listing events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list events',
      details: error.message
    });
  }
});

// Get specific event
router.get('/event/:userId/:eventId', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await req.meetService.getEvent(eventId);
    res.json(result);
  } catch (error) {
    console.error('Error getting event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get event',
      details: error.message
    });
  }
});

// Update event
router.put('/event/:userId/:eventId', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;

    const result = await req.meetService.updateEvent(eventId, updateData);
    res.json(result);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update event',
      details: error.message
    });
  }
});

// Delete event
router.delete('/event/:userId/:eventId', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await req.meetService.deleteEvent(eventId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete event',
      details: error.message
    });
  }
});

// Add attendee to event
router.post('/event/:userId/:eventId/attendee', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const result = await req.meetService.addAttendeeToEvent(eventId, email);
    res.json(result);
  } catch (error) {
    console.error('Error adding attendee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add attendee',
      details: error.message
    });
  }
});

// Remove attendee from event
router.delete('/event/:userId/:eventId/attendee', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const result = await req.meetService.removeAttendeeFromEvent(eventId, email);
    res.json(result);
  } catch (error) {
    console.error('Error removing attendee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove attendee',
      details: error.message
    });
  }
});

// Get Meet link for event
router.get('/event/:userId/:eventId/meet-link', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await req.meetService.getEventMeetLink(eventId);
    res.json(result);
  } catch (error) {
    console.error('Error getting meet link:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get meet link',
      details: error.message
    });
  }
});

// Reschedule event
router.put('/event/:userId/:eventId/reschedule', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { newStartTime, newEndTime } = req.body;

    if (!newStartTime || !newEndTime) {
      return res.status(400).json({
        success: false,
        error: 'New start time and end time are required'
      });
    }

    const result = await req.meetService.rescheduleEvent(eventId, newStartTime, newEndTime);
    res.json(result);
  } catch (error) {
    console.error('Error rescheduling event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reschedule event',
      details: error.message
    });
  }
});

// Health check endpoint
router.get('/health/:userId', authMiddleware, async (req, res) => {
  try {
    // Try to list calendars to test the connection
    const { google } = require('googleapis');
    const calendar = google.calendar({ version: 'v3', auth: req.meetService.auth });
    await calendar.calendarList.list({ maxResults: 1 });
    
    res.json({
      success: true,
      message: 'Google Meet service is healthy',
      user: req.userInfo?.email || 'Unknown',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      details: error.message
    });
  }
});

module.exports = router;