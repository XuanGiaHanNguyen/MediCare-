import { useState, useEffect } from "react";
import { X, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useGoogleAuth } from "../../../useGoogleAuth"; // Adjust path as needed

import Calendar from "../../../assets/calendar.png"
import Meet from "../../../assets/meet.png"

import axios from "axios"
import API_ROUTES from "../../../constant/APIRoutes"
import toast from "react-hot-toast"

export default function ConnectGoogle({ isOpen, onClose }) {
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Use the global auth state instead of local state
  const { isAuthenticated, user, isLoading, checkAuthStatus } = useGoogleAuth();

  // Check for OAuth callback parameters when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    
    if (authStatus === 'success') {
      toast.success("Google account connected successfully!");
      // Refresh the global auth state
      checkAuthStatus();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Close the modal
      onClose();
    } else if (authStatus === 'error') {
      const reason = urlParams.get('reason');
      toast.error(`Failed to connect Google account: ${reason}`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authStatus === 'partial') {
      const reason = urlParams.get('reason');
      toast.warning(`Partial connection: ${reason}`);
      // Refresh the global auth state
      checkAuthStatus();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Close the modal
      onClose();
    }
  }, [checkAuthStatus, onClose]);

  // Close modal automatically if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  const handleConnectGoogle = async () => {
    setIsConnecting(true);
    
    try {
      // Build the complete OAuth URL
      const oauthUrl = `http://localhost:3000/auth/google`;
      
      // Debug: Log the URL being used
      console.log('Redirecting to OAuth URL:', oauthUrl);
      console.log('API_ROUTES value:', API_ROUTES);
      
      // Validate the URL format
      if (!oauthUrl.startsWith('http://') && !oauthUrl.startsWith('https://')) {
        console.error('Invalid OAuth URL format:', oauthUrl);
        toast.error("Invalid OAuth URL configuration - check API_ROUTES");
        setIsConnecting(false);
        return;
      }
      
      // Additional validation - make sure we're not creating a relative URL
      if (oauthUrl.includes('undefined') || oauthUrl.includes('null')) {
        console.error('OAuth URL contains undefined/null values:', oauthUrl);
        toast.error("OAuth URL configuration error");
        setIsConnecting(false);
        return;
      }
      
      // Use window.location.href for full page redirect to external URL
      console.log('Performing full page redirect to:', oauthUrl);
      window.location.href = oauthUrl;
      
    } catch (error) {
      console.error('Error connecting to Google:', error);
      setIsConnecting(false);
      toast.error("Failed to connect Google account");
    }
  };

  const handleDisconnect = async () => {
    try {
      await axios.post(`${API_ROUTES}/auth/logout`, {}, {
        withCredentials: true
      });
      // Refresh the global auth state
      await checkAuthStatus();
      toast.success("Google account disconnected");
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error("Failed to disconnect Google account");
    }
  };

  const handleSkipForNow = () => {
    onClose();
  };

  // Show loading state
  if (isLoading && isOpen) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
            <span className="text-gray-600">Checking authentication status...</span>
          </div>
        </div>
      </div>
    );
  }

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
          {isAuthenticated && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Google Account Connected</span>
              </div>
              {user && (
                <div className="mt-2 text-sm text-green-600">
                  Connected as: {user.email}
                </div>
              )}
            </div>
          )}

          {/* Main Message */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-700">
              {isAuthenticated ? "Connected Successfully!" : "Get the Best Experience"}
            </h3>
            <p className="text-gray-500 leading-relaxed">
              {isAuthenticated 
                ? "Your Google Calendar and Meet are now connected. You can sync events and schedule meetings seamlessly."
                : "Connect your Google account to sync events automatically and schedule meetings seamlessly for the optimal calendar experience."
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {!isAuthenticated ? (
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