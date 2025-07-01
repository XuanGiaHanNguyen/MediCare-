import React from "react";

export default function CalendarCell({ 
  day, 
  events, 
  isToday, 
  isSelected, 
  onSelect 
}) {
  if (!day) {
    return (
      <div className="h-32 border-r border-b border-gray-200 bg-gray-50 cursor-default"></div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`
        h-32 border-r border-b border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col
        ${isToday ? 'bg-sky-50 border-sky-300' : 'bg-white'}
        ${isSelected ? 'ring-2 ring-sky-500 ring-inset' : ''}
      `}
    >
      {/* Date number */}
      <div className={`
        text-sm font-medium mb-1 flex justify-between items-center
        ${isToday ? 'text-sky-600' : 'text-gray-900'}
      `}>
        <span>{day.getDate()}</span>
        {isToday && (
          <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
        )}
      </div>
      
      {/* Events */}
      <div className="flex-1 space-y-1 overflow-hidden">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            className={`
              text-xs px-2 py-1 rounded text-white truncate cursor-pointer
              ${event.color}
            `}
            title={`${event.time} ${event.title} - ${event.approved ? 'Approved' : 'Pending'}`}
          >
            <span className="font-medium">{event.time}</span> {event.title}
            {!event.approved && <span className="ml-1">(Scheduled)</span>}
          </div>
        ))}
        {events.length > 3 && (
          <div className="text-xs text-gray-500 px-2">
            +{events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}