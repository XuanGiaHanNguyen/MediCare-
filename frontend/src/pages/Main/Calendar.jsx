import { useState } from "react";
import {
  Calendar,
  Plus,
  Settings,
  Users,
  FileText,
  Home,
  Bed,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import DockHeader from "../../component/DockHeader"

export default function CalendarDock() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock events data
  const mockEvents = {
    '2025-05-31': [
      { id: 1, title: 'WEB102 Orientation', time: '03:00', color: 'bg-blue-500', url: 'https://us06web.zoom.us/...' },
      { id: 2, title: 'Summer 2025 Student Orient...', time: '03:00', color: 'bg-gray-500' }
    ],
    '2025-05-01': [
      { id: 3, title: 'Connect', time: '21:00', color: 'bg-blue-500' },
      { id: 4, title: 'Synced', time: '21:00', color: 'bg-blue-500' }
    ],
    '2025-05-02': [
      { id: 5, title: 'Connect', time: '21:00', color: 'bg-blue-500' }
    ],
    '2025-05-03': [
      { id: 6, title: 'Connect', time: '21:00', color: 'bg-blue-500' }
    ],
    '2025-05-04': [
      { id: 7, title: 'Cancelled', time: '21:00', color: 'bg-red-500' }
    ],
    '2025-05-05': [
      { id: 8, title: 'Connect', time: '21:00', color: 'bg-blue-500' }
    ],
    '2025-05-08': [
      { id: 9, title: 'PHY2048 Final', time: '21:00', color: 'bg-cyan-500' },
      { id: 10, title: 'PHY2048 Final', time: '21:00', color: 'bg-cyan-500' }
    ],
    '2025-05-21': [
      { id: 11, title: 'Xuan Gia Ha', time: '4:00', color: 'bg-blue-500' }
    ],
    '2025-05-27': [
      { id: 12, title: 'Tech Lead Interview', time: '3:30', color: 'bg-cyan-500' },
      { id: 13, title: 'Xuan Gia Ha', time: '4:30', color: 'bg-blue-500' }
    ]
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return mockEvents[dateString] || [];
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div>
      <DockHeader />
      <div className="w-full min-h-screen bg-gray-50 flex flex-row">
        {/* Sidebar */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center gap-4 py-6">
          <button className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <FileText className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Users className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Bed className="w-5 h-5" />
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex gap-3">
              <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
              </button>
              <button className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                <Settings className="w-5 h-5" />
                Add events
              </button>
            </div>
          </div>

          {/* Calendar and Events Layout */}
          <div className="flex gap-6">
            {/* Monthly Calendar */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-0 border border-gray-300 rounded-lg overflow-hidden">
                {days.map((day, index) => {
                  const events = getEventsForDate(day);
                  return (
                    <div
                      key={index}
                      onClick={() => day && setSelectedDate(day)}
                      className={`
                        h-32 border-r border-b border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col
                        ${!day ? 'bg-gray-50 cursor-default' : 'bg-white'}
                        ${isToday(day) ? 'bg-blue-50 border-blue-300' : ''}
                        ${isSelected(day) ? 'ring-2 ring-blue-500 ring-inset' : ''}
                      `}
                    >
                      {/* Date number */}
                      {day && (
                        <>
                          <div className={`
                            text-sm font-medium mb-1 flex justify-between items-center
                            ${isToday(day) ? 'text-blue-600' : 'text-gray-900'}
                          `}>
                            <span>{day.getDate()}</span>
                            {isToday(day) && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
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
                                title={`${event.time} ${event.title}`}
                              >
                                <span className="font-medium">{event.time}</span> {event.title}
                              </div>
                            ))}
                            {events.length > 3 && (
                              <div className="text-xs text-gray-500 px-2">
                                +{events.length - 3} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Selected Date Info (always visible at bottom of calendar) */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Selected: <span className="font-medium text-gray-900">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </p>
                  {isToday(selectedDate) && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Today
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Events Panel - Always visible */}
            <div className="w-80 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Events</h3>
                <span className="text-sm text-gray-500">
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              {selectedDateEvents.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${event.color}`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 mb-1 truncate">{event.title}</div>
                          <div className="text-xs text-gray-500 mb-2">{event.time}</div>
                          {event.url && (
                            <button className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                              Join Meeting
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedDateEvents.length > 5 && (
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
                  <p className="text-xs text-gray-400">Click a date to view events</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}