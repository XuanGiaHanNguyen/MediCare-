const express = require('express');
const { getAuthUrl, getAccessToken, setCredentials } = require('../../google/googleAuth');

const router = express.Router();

// Route to start OAuth flow
router.get('/google', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

// routes/auth.js - Enhanced OAuth callback route
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
      
      console.log('Session data stored, redirecting to frontend...');
      
      // Redirect to frontend with success
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=success`);
      
    } catch (userInfoError) {
      console.error('Error getting user info or testing calendar access:', userInfoError);
      console.error('Error details:', {
        message: userInfoError.message,
        code: userInfoError.code,
        response: userInfoError.response?.data
      });
      
      // Still store tokens but redirect with warning
      req.session.tokens = tokens;
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=partial&reason=userinfo_failed`);
    }
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error response:', error.response?.data);
    
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error&reason=callback_failed`);
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

// Get authentication status
router.get('/status', (req, res) => {
  res.json({ 
    authenticated: !!req.session.tokens,
    user: req.session.user || null 
  });
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get user profile
router.get('/profile', (req, res) => {
  if (!req.session.tokens) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json(req.session.user);
});

module.exports = router;