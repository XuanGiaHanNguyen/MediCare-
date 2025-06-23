import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google"

const CLIENT_ID = "607978367163-isj9r29e4eu9cmmdpv08r9jhv83av23f.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
