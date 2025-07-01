import { useState, useEffect } from "react";

import { fetchAllEvents } from "../services/api/eventService";

export function useEvents(userId) {
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(false);

  const refreshEvents = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const eventData = await fetchAllEvents(userId);
      setEvents(eventData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, [userId]);

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return events[dateString] || [];
  };

  return {
    events,
    loading,
    refreshEvents,
    getEventsForDate
  };
}
