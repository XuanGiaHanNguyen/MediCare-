const { google } = require('googleapis');
require('dotenv').config({path: "../.env"});


const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Scopes for Calendar and Meet
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/meetings.space.created',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'openid'
];

function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', 
    include_granted_scopes: true
  });
}

function getAccessToken(code) {
  return oauth2Client.getToken(code);
}

function setCredentials(tokens) {
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

module.exports = {
  oauth2Client,
  getAuthUrl,
  getAccessToken,
  setCredentials, 
  SCOPES
};