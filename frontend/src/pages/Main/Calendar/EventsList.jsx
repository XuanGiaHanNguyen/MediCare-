import React from "react";
import { Calendar } from "lucide-react";
import EventCard from "./EventCard"

export default function EventsList({ 
  selectedDate, 
  events, 
  userId, 
  onRefreshEvents 
}) {
  return (
    <div className="w-85 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Events</h3>
        <span className="text-sm text-gray-500">
          {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      
      {events.length > 0 ? (
        <>
          <div className="space-y-3">
            {events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                userId={userId}
                onRefreshEvents={onRefreshEvents}
              />
            ))}
          </div>

          {events.length > 5 && (
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                View all events
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-2">No events scheduled</p>
        </div>
      )}
    </div>
  );
}