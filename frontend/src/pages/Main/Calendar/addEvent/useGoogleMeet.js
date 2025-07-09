import { useState } from 'react';
import axios from 'axios';

export function useGoogleMeet() {
  const [isCreatingMeet, setIsCreatingMeet] = useState(false);
  const [meetError, setMeetError] = useState(null);
  const API_ROUTE = "http://localhost:3000"
  const userId = localStorage.getItem("Id")

  const createMeetEvent = async (eventData) => {
    setIsCreatingMeet(true);
    setMeetError(null);

    try {
      const response = await axios.post(`${API_ROUTE}/api/calendar/create/${userId}`, eventData);

      console.log(response.data) 
      
      if (response.data.success) {
        return {
          success: true,
          meetLink: response.data.meetLink,
          eventId: response.data.id,
          event: response.data
        };

      } else {
        throw new Error('No Google Meet link received');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create Google Meet';
      setMeetError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };

    } finally {
      setIsCreatingMeet(false);
    }
  };

  const checkGoogleAuth = async () => {
    try {
      const response = await axios.get(`${API_ROUTE}/api/auth/status`);
      return response.data.authenticated;
    } catch (error) {
      console.error('Failed to check Google auth status:', error);
      return false;
    }
  };

  const initiateGoogleAuth = () => {
    window.location.href = `${API_ROUTE}/api/auth/google`;
  };

  return {
    createMeetEvent,
    checkGoogleAuth,
    initiateGoogleAuth,
    isCreatingMeet,
    meetError
  };
}