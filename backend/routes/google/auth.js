const express = require('express');
const { getAuthUrl, getAccessToken, setCredentials } = require('../../google/googleAuth');
const database = require("../../connect")

const router = express.Router();

// Helper function to save tokens to MongoDB
async function saveTokensToMongo(userId, tokens, userInfo) {
  try {
    const db = database.getDB()
    const collection = db.collection('google');
    
    const googleAuth = {
      userId: userId,
      tokens: tokens,
      userInfo: userInfo,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Upsert - update if exists, insert if doesn't
    await collection.replaceOne(
      { userId: userId },
      googleAuth,
      { upsert: true }
    );
    
    console.log('Tokens saved to MongoDB for user:', userId);
    return true;
  } catch (error) {
    console.error('Error saving tokens to MongoDB:', error);
    return false;
  }
}

// Helper function to get tokens from MongoDB
async function getTokensFromMongo(userId) {
  try {
    const db = database.getDB()
    const collection = db.collection('google');
    const result = await collection.findOne({ userId: userId });
    return result;
  } catch (error) {
    console.error('Error getting tokens from MongoDB:', error);
    return null;
  }
}

// Helper function to delete tokens from MongoDB
async function deleteTokensFromMongo(userId) {
  try {
    const db = database.getDB()
    const collection = db.collection('google');
    await collection.deleteOne({ userId: userId });
    console.log('Tokens deleted from MongoDB for user:', userId);
    return true;
  } catch (error) {
    console.error('Error deleting tokens from MongoDB:', error);
    return false;
  }
}

// Route to start OAuth flow
router.get('/google', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

// Enhanced OAuth callback route with MongoDB storage
router.get('/google/callback', async (req, res) => {
  try {
    const { code, error, error_description } = req.query;
    
    // Log the full callback URL for debugging
    console.log('OAuth callback received:', {
      code: code ? 'present' : 'missing',
      error: error || 'none',
      error_description: error_description || 'none',
      full_url: req.originalUrl
    });
    
    if (error) {
      console.error('OAuth error from Google:', error, error_description);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error&reason=${error}`);
    }

    if (!code) {
      console.error('No authorization code received');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error&reason=no_code`);
    }

    // Exchange code for tokens
    console.log('Exchanging code for tokens...');
    const { tokens } = await getAccessToken(code);
    
    if (!tokens || !tokens.access_token) {
      console.error('No valid tokens received:', tokens);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error&reason=no_tokens`);
    }

    console.log('Tokens received successfully:', {
      access_token: tokens.access_token ? 'present' : 'missing',
      refresh_token: tokens.refresh_token ? 'present' : 'missing',
      expiry_date: tokens.expiry_date
    });
    
    // Set credentials and get user info
    const auth = setCredentials(tokens);
    const { google } = require('googleapis');
    
    try {
      const oauth2 = google.oauth2({ version: 'v2', auth });
      const userInfo = await oauth2.userinfo.get();
      
      console.log('User info retrieved:', {
        id: userInfo.data.id,
        email: userInfo.data.email,
        name: userInfo.data.name
      });
      
      // Test calendar access to ensure permissions work
      const calendar = google.calendar({ version: 'v3', auth });
      await calendar.calendarList.list({ maxResults: 1 });
      console.log('Calendar access verified');
      
      // Store tokens and user info in session
      req.session.tokens = tokens;
      req.session.user = {
        id: userInfo.data.id,
        email: userInfo.data.email,
        name: userInfo.data.name,
        picture: userInfo.data.picture
      };

      const userEmail = userInfo.data.email;

      // Get your own user from the users collection
      const db = database.getDB()
      const usersCollection = db.collection('user');
      const existingUser = await usersCollection.findOne({ email: userEmail });

      if (!existingUser) {
        console.error("User not found in internal database");
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error&reason=user_not_found`);
      }

      // Debug the _id field
      console.log('Raw _id:', existingUser._id);
      console.log('_id type:', typeof existingUser._id);
      console.log('_id constructor:', existingUser._id?.constructor?.name);

      // Ensure proper string conversion
      let userId;
      if (existingUser._id) {
        if (typeof existingUser._id === 'string') {
          userId = existingUser._id;
        } else if (existingUser._id.toString) {
          userId = existingUser._id.toString();
        } else {
          userId = String(existingUser._id);
        }
      }
      
      const isStaff = existingUser.is_staff;
      console.log('User ID:', userId, 'Is Staff:', isStaff);
      
      // Validate userId is a string
      if (typeof userId !== 'string' || !userId) {
        console.error('Invalid userId:', userId, 'Type:', typeof userId);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error&reason=invalid_user_id`);
      }
      
      // Save tokens to MongoDB
      const saveResult = await saveTokensToMongo(userId, tokens, req.session.user);
      
      if (saveResult) {
        console.log('Tokens saved to database successfully');
      } else {
        console.error('Failed to save tokens to database');
      }
      
      console.log('Session data stored, redirecting to frontend...');
      
      // Fixed redirect URLs
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      console.log('About to redirect with:', {
        frontendUrl,
        userId,
        isStaff,
        userIdType: typeof userId
      });
      
      if (isStaff === true) {
        const redirectUrl = `${frontendUrl}/calendar/staff/${userId}?auth=success`;
        console.log('Staff redirect URL:', redirectUrl);
        res.redirect(redirectUrl);
      } else if (isStaff === false) {
        const redirectUrl = `${frontendUrl}/calendar/patient/${userId}?auth=success`;
        console.log('Patient redirect URL:', redirectUrl);
        res.redirect(redirectUrl);
      } else {
        res.redirect(`${frontendUrl}?auth=error&reason=invalid_user_type`);
      }
      
    } catch (userInfoError) {
      console.error('Error getting user info or testing calendar access:', userInfoError);
      console.error('Error details:', {
        message: userInfoError.message,
        code: userInfoError.code,
        response: userInfoError.response?.data
      });
      
      // Still store tokens but redirect with warning
      req.session.tokens = tokens;

      // Declare userEmail here since we need it in the catch block
      let userEmail;
      try {
        // Try to get user email from the stored user info in session
        userEmail = req.session.user?.email;
        
        // If not available, we might need to get it from the tokens
        if (!userEmail) {
          console.error('Cannot determine user email for database lookup');
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error&reason=no_user_email`);
        }
      } catch (emailError) {
        console.error('Error getting user email:', emailError);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error&reason=no_user_email`);
      }

      // Get your own user from the users collection
      const db = database.getDB()
      const usersCollection = db.collection('user');
      const existingUser = await usersCollection.findOne({ email: userEmail });

      if (!existingUser) {
        console.error("User not found in internal database");
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error&reason=user_not_found`);
      }

      // Debug the _id field
      console.log('Raw _id (catch block):', existingUser._id);
      console.log('_id type (catch block):', typeof existingUser._id);
      console.log('_id constructor (catch block):', existingUser._id?.constructor?.name);

      // Ensure proper string conversion
      let userId;
      if (existingUser._id) {
        if (typeof existingUser._id === 'string') {
          userId = existingUser._id;
        } else if (existingUser._id.toString) {
          userId = existingUser._id.toString();
        } else {
          userId = String(existingUser._id);
        }
      }

      const isStaff = existingUser.is_staff;
      console.log('User ID (partial auth):', userId, 'Is Staff:', isStaff);
      
      // Validate userId is a string
      if (typeof userId !== 'string' || !userId) {
        console.error('Invalid userId in catch block:', userId, 'Type:', typeof userId);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error&reason=invalid_user_id`);
      }
      
      // Fixed redirect URLs for partial auth
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      console.log('About to redirect (partial auth) with:', {
        frontendUrl,
        userId,
        isStaff,
        userIdType: typeof userId
      });
      
      if (isStaff === true) {
        const redirectUrl = `${frontendUrl}/calendar/staff/${userId}?auth=partial&reason=userinfo_failed`;
        console.log('Staff partial redirect URL:', redirectUrl);
        res.redirect(redirectUrl);
      } else if (isStaff === false) {
        const redirectUrl = `${frontendUrl}/calendar/patient/${userId}?auth=partial&reason=userinfo_failed`;
        console.log('Patient partial redirect URL:', redirectUrl);
        res.redirect(redirectUrl);
      } else {
        res.redirect(`${frontendUrl}?auth=error&reason=invalid_user_type`);
      }
    }
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error response:', error.response?.data);
    
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error&reason=callback_failed`);
  }
});

// Check if user is authenticated (checks MongoDB first, then session)
router.get('/status', async (req, res) => {
  try {
    // First check session
    if (req.session.tokens && req.session.user) {
      return res.json({ 
        authenticated: true,
        user: req.session.user 
      });
    }
    
    // If no session, check if we have userId to look up in MongoDB
    // You'll need to implement user identification logic here
    // For now, we'll check if there's any stored authentication
    
    // If you have a way to identify the current user (e.g., from another auth system),
    // you can check MongoDB for their tokens
    const userId = req.query.userId || req.session.userId;
    
    if (userId) {
      const storedAuth = await getTokensFromMongo(userId);
      
      if (storedAuth && storedAuth.tokens) {
        // Restore session from MongoDB
        req.session.tokens = storedAuth.tokens;
        req.session.user = storedAuth.userInfo;
        
        return res.json({ 
          authenticated: true,
          user: storedAuth.userInfo 
        });
      }
    }
    
    // Not authenticated
    res.json({ 
      authenticated: false,
      user: null 
    });
    
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.json({ 
      authenticated: false,
      user: null 
    });
  }
});

// Get all stored Google authentications (for debugging)
router.get('/stored-auths', async (req, res) => {
  try {
    const collection = db.collection('google');
    const auths = await collection.find({}, { 
      projection: { 
        userId: 1, 
        'userInfo.email': 1, 
        'userInfo.name': 1,
        createdAt: 1 
      } 
    }).toArray();
    
    res.json(auths);
  } catch (error) {
    console.error('Error getting stored auths:', error);
    res.status(500).json({ error: 'Failed to get stored authentications' });
  }
});

// Load authentication for a specific user
router.get('/load-auth/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const storedAuth = await getTokensFromMongo(userId);
    
    if (storedAuth && storedAuth.tokens) {
      // Restore session from MongoDB
      req.session.tokens = storedAuth.tokens;
      req.session.user = storedAuth.userInfo;
      
      res.json({ 
        authenticated: true,
        user: storedAuth.userInfo,
        message: 'Authentication loaded successfully' 
      });
    } else {
      res.json({ 
        authenticated: false,
        user: null,
        message: 'No stored authentication found' 
      });
    }
  } catch (error) {
    console.error('Error loading auth:', error);
    res.status(500).json({ error: 'Failed to load authentication' });
  }
});

// Add a debug route to check session
router.get('/debug', (req, res) => {
  res.json({
    hasTokens: !!req.session.tokens,
    hasUser: !!req.session.user,
    user: req.session.user || null,
    tokenInfo: req.session.tokens ? {
      hasAccessToken: !!req.session.tokens.access_token,
      hasRefreshToken: !!req.session.tokens.refresh_token,
      expiryDate: req.session.tokens.expiry_date
    } : null
  });
});

// Logout route (also removes from MongoDB)
router.post('/logout', async (req, res) => {
  try {
    const userId = req.session.user?.id;
    
    // Delete from MongoDB if we have a user ID
    if (userId) {
      await deleteTokensFromMongo(userId);
    }
    
    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Get user profile
router.get('/profile', (req, res) => {
  if (!req.session.tokens) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json(req.session.user);
});

module.exports = router;