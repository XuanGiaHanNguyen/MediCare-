// Database + middleware 
const connect = require("./connect")
const express = require("express")
const cors = require("cors")
const session = require('express-session');

//Routes 
const appointment = require("./routes/appointRoute")
const document = require("./routes/docRoute")
const meeting = require("./routes/meetingRoute")
const patient = require("./routes/noneRoute")
const staff = require("./routes/staffRoute")
const user = require("./routes/userRoute")
const request = require("./routes/request")

const authRoutes = require('./routes/google/auth');
const calendarRoutes = require('./routes/google/calendar');

require('dotenv').config({path: "./.env"});

const app = express()
const PORT = 3000

//MiddleWare
app.use(express.urlencoded({ extended: true }));

// Session configuration BEFORE CORS
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  } 
}));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Your frontend URLs
  credentials: true, // Allow cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json())

// Your auth status routes
app.get('/api/auth/status', (req, res) => {
  res.json({ 
    authenticated: !!req.session.tokens,
    user: req.session.user || null 
  });
});

app.get('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

// Routes
app.use(appointment)
app.use(document)
app.use(meeting)
app.use(patient)
app.use(staff)
app.use(user)
app.use(request)
app.use('/auth', authRoutes);
app.use('/api/calendar', calendarRoutes);

app.listen(PORT, ()=>{
    connect.connectToServer()
    console.log("Server is running")
})