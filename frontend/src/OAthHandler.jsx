import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

// This component handles OAuth callback responses
export default function OAuthHandler() {
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authStatus = urlParams.get('auth');

    if (authStatus === 'success') {
      toast.success('Google account connected successfully!');
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authStatus === 'error') {
      toast.error('Failed to connect Google account. Please try again.');
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  return null; // This component doesn't render anything
}

// Alternative: Hook version if you prefer
export function useOAuthCallback() {
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authStatus = urlParams.get('auth');

    if (authStatus === 'success') {
      toast.success('Google account connected successfully!');
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    } else if (authStatus === 'error') {
      toast.error('Failed to connect Google account. Please try again.');
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      return false;
    }
    return null;
  }, [location]);
}
