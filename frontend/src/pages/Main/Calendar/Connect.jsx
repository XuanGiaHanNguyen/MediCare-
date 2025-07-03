import { useState, useEffect } from "react";
import { X, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

import Calendar from "../../../assets/calendar.png"
import Meet from "../../../assets/meet.png"

import axios from "axios"
import API_ROUTE from "../../../constant/APIRoutes"
import toast from "react-hot-toast"

export default function ConnectGoogle({ isOpen, onClose }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Check if user is already connected when component mounts
  useEffect(() => {
    if (isOpen) {
      checkConnectionStatus();
    }
  }, [isOpen]);

  const checkConnectionStatus = async () => {
    try {
      const response = await axios.get(`${API_ROUTE}/auth/status`, {
        withCredentials: true // Important for session cookies
      });
      
      if (response.data.authenticated) {
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
      // User is not connected, which is fine for this modal
    }
  };

  const handleConnectGoogle = async () => {
    setIsConnecting(true);
    
    try {
      // Option 1: Redirect to backend OAuth route
      // This is the simpler approach
      window.location.href = `http://127.0.0.1:3000/auth/google`;
      
      // Option 2: Open popup window (more complex but better UX)
      // Uncomment the code below if you prefer popup approach
      /*
      const popup = window.open(
        `${API_ROUTE}/auth/google`,
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for popup completion
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          // Check if connection was successful
          checkConnectionStatus();
        }
      }, 1000);

      // Handle popup message (if you implement postMessage in your backend)
      window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          popup.close();
          setIsConnected(true);
          setIsConnecting(false);
          toast.success("Google account connected successfully!");
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          popup.close();
          setIsConnecting(false);
          toast.error("Failed to connect Google account");
        }
      });
      */
      
    } catch (error) {
      console.error('Error connecting to Google:', error);
      setIsConnecting(false);
      toast.error("Failed to connect Google account");
    }
  };

  const handleDisconnect = async () => {
    try {
      await axios.post(`${API_ROUTE}/auth/logout`, {}, {
        withCredentials: true
      });
      setIsConnected(false);
      toast.success("Google account disconnected");
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error("Failed to disconnect Google account");
    }
  };

  const handleSkipForNow = () => {
    onClose();
  };

  // Move the early return AFTER all hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 text-center space-y-6 px-10 mb-4">
          {/* Google Services Icons */}
          <div className="flex justify-center items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl">
              <img src={Calendar} width={60} height={60} alt="Google Calendar" className="mx-auto" />
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl">
              <img src={Meet} width={60} height={60} alt="Google Meet" className="mx-auto" />
            </div>
          </div>

          {/* Connection Status */}
          {isConnected && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Google Account Connected</span>
              </div>
            </div>
          )}

          {/* Main Message */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-700">
              {isConnected ? "Connected Successfully!" : "Get the Best Experience"}
            </h3>
            <p className="text-gray-500 leading-relaxed">
              {isConnected 
                ? "Your Google Calendar and Meet are now connected. You can sync events and schedule meetings seamlessly."
                : "Connect your Google account to sync events automatically and schedule meetings seamlessly for the optimal calendar experience."
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {!isConnected ? (
              <>
                <button
                  onClick={handleConnectGoogle}
                  disabled={isConnecting}
                  className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Connect Google Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleSkipForNow}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Skip for now
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleDisconnect}
                  className="w-full text-red-600 hover:text-red-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Disconnect Google Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}