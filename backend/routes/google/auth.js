const express = require('express');
const { getAuthUrl, getAccessToken, setCredentials } = require('../../google/googleAuth');

const router = express.Router();

// Route to start OAuth flow
router.get('/google', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

// OAuth callback route
router.get('/google/callback', async (req, res) => {
  try {
    const { code, error } = req.query;
    
    if (error) {
      console.error('OAuth error:', error);
      // Redirect to frontend with error
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error`);
    }

    if (!code) {
      console.error('No authorization code received');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error`);
    }

    const { tokens } = await getAccessToken(code);
    
    // Get user info
    const auth = setCredentials(tokens);
    const { google } = require('googleapis');
    const oauth2 = google.oauth2({ version: 'v2', auth });
    const userInfo = await oauth2.userinfo.get();
    
    // Store tokens and user info in session
    req.session.tokens = tokens;
    req.session.user = {
      id: userInfo.data.id,
      email: userInfo.data.email,
      name: userInfo.data.name,
      picture: userInfo.data.picture
    };
    
    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=success`);
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error`);
  }
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