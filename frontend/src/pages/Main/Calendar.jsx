import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  FileText,
  Home,
  Bed,
  ChevronLeft,
  ChevronRight, 
  Clock, 
  Users, 
  MapPin
} from "lucide-react";
import DockHeader from "../../component/DockHeader"
import { useNavigate } from "react-router-dom";

import AddEventModal from "./Calendar/AddEventModal";
import axios from "axios";
import API_ROUTES from "../../constant/APIRoutes";
import toast from "react-hot-toast";

export default function CalendarDock() {
  const Id = localStorage.getItem("Id")

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState({});

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const fetchEvents = async () => {
  try {
    // Make both API calls simultaneously
    console.log(Id)
    const [appointmentsResponse, meetingsResponse] = await Promise.all([
      axios.get(API_ROUTES.GET_MEETING(Id)),
      axios.get(API_ROUTES.GET_APPOINTMENT(Id))
    ]);

    const appointments = appointmentsResponse.data || [];
    const meetings = meetingsResponse.data || [];

    const combinedEvents = {};

    // Helper function to get user name from userId (with caching to avoid duplicate requests)
    const userCache = {};

    const getUserName = async (userId) => {
      if (userCache[userId]) return userCache[userId];
      const res = await axios.get(API_ROUTES.GET_USER(userId));
      const name = res.data?.full_name || "Unknown";
      userCache[userId] = name;
      return name;
    };

    // Helper to transform event format
    const transformEvent = async (event, type, color) => {
      const userName = await getUserName(event.userId);
      return {
        id: `${event.id}`,
        title: event.title || (type === "appointment" ? "Appointment" : "Meeting"),
        time: event.time || event.startTime,
        description: event.description || event.notes || event.agenda,
        location: event.location,
        url: event.meetingUrl || event.url,
        color,
        type,
        approved: event.approved || false,
        approval: event.userId !== Id,        // new field
        user: userName,                       // replacing userId
        participants: event.participants,     // if applicable
        duration: event.duration,
        ...event
      };

      
    };

    // Process all events in parallel
    const transformedAppointments = await Promise.all(
      appointments.map(appt =>
        transformEvent(appt, "appointment", "bg-blue-500")
      )
    );

    const transformedMeetings = await Promise.all(
      meetings.map(meet =>
        transformEvent(meet, "meeting", "bg-green-500")
      )
    );

    // Group events by date
    [...transformedAppointments, ...transformedMeetings].forEach(event => {
      const eventDate = event.date;
      if (!combinedEvents[eventDate]) {
        combinedEvents[eventDate] = [];
      }
      combinedEvents[eventDate].push(event);
    });

    // Sort by time within each date group
    Object.keys(combinedEvents).forEach(date => {
      combinedEvents[date].sort((a, b) => a.time.localeCompare(b.time));
    });

    // Set state
    setEvents(combinedEvents);

  } catch (error) {
    console.error('Error fetching events:', error);
    toast.error('Failed to load events');
  }
};

  // Call this function when component mounts and when you need to refresh
  useEffect(() => {
    if (Id) {
      fetchEvents();
    }
  }, [Id]); 

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

  const navigate = useNavigate()

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
    return events[dateString] || [];
  };

  // Handler for opening the modal
  const handleAddEventClick = () => {
    setIsModalOpen(true);
  };

  // Handler for closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handler for saving a new event
  const handleSaveEvent = async (eventData) => {
    try {

      const { attendees, id, ...eventToStore } = eventData;

      const modifiedEvent = {
        ...eventToStore,
        userId: Id, 
        approved: false 
      };

      console.log('Event saved successfully:', modifiedEvent); 

      if (modifiedEvent.type === "appointment" ){

        const {type, ...saveObject} = modifiedEvent
        const response = await axios.post(API_ROUTES.CREATE_APPOINTMENT, saveObject)
        if (response.status === 200){
          toast.success("Appointment Successfully Requested.")

           const {userId, participants,... eventList} = modifiedEvent

            // Fetch userId 
            const getName = await axios.get(API_ROUTES.GET_USER(userId))
            const name = getName.data.full_name

            // Fetch if they can approve meeting or not
            const approval = Id === userId

            const updatedData = {
              ...eventList,
              participants, 
              user: name, 
              approval
            }

            const dateKey = eventData.date;
                setEvents(prevEvents => ({
              ...prevEvents,
              [dateKey]: [
                ...(prevEvents[dateKey] || []),
                updatedData
              ]
            }));

          setSelectedDate(new Date(eventData.date));

        }else {
          toast.error("Error occured during the requesting process.")
        }

      } else if (modifiedEvent.type === "meeting" ){

         const {type, ...saveObject} = modifiedEvent
          const response = await axios.post(API_ROUTES.CREATE_MEETING, saveObject)
          if (response.status === 200){
            toast.success("Meeting Successfully Requested.")

            const {userId, participants,... eventList} = modifiedEvent

            // Fetch userId 
            const getName = await axios.get(API_ROUTES.GET_USER(userId))
            const name = getName.data.fullname

            // Fetch if they can approve meeting or not
            const approval = Id === userId

            const updatedData = {
              ...eventList,
              participants, 
              user: name, 
              approval
            }

            const dateKey = eventData.date;
                setEvents(prevEvents => ({
              ...prevEvents,
              [dateKey]: [
                ...(prevEvents[dateKey] || []),
                updatedData
              ]
            }));

            setSelectedDate(new Date(eventData.date));

          }else {
            toast.error("Error occured during the requesting process.")
          }
        }else {
          toast.error("Cannot determine the type of the event")
        }

    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div>
      <DockHeader />
      <div className="w-full min-h-screen bg-gray-50 flex flex-row">
        {/* Sidebar */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center gap-4 py-6">
          <button onClick={(e)=>navigate(`/dock/staff/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/calendar/staff/${Id}`)} className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/docs/staff/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <FileText className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/patinfo/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
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
              <button 
                onClick={handleAddEventClick}
                className="p-3 bg-sky-600 flex flex-row gap-3 hover:bg-sky-700 text-white border border-blue-600 rounded-xl transition-colors shadow-sm"
                title="Add new event"
              >
                <Plus className="w-6 h-6" />
                Add Event
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
                  const dayEvents = getEventsForDate(day);
                  return (
                    <div
                      key={index}
                      onClick={() => day && setSelectedDate(day)}
                      className={`
                        h-32 border-r border-b border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col
                        ${!day ? 'bg-gray-50 cursor-default' : 'bg-white'}
                        ${isToday(day) ? 'bg-sky-50 border-sky-300' : ''}
                        ${isSelected(day) ? 'ring-2 ring-sky-500 ring-inset' : ''}
                      `}
                    >
                      {/* Date number */}
                      {day && (
                        <>
                          <div className={`
                            text-sm font-medium mb-1 flex justify-between items-center
                            ${isToday(day) ? 'text-sky-600' : 'text-gray-900'}
                          `}>
                            <span>{day.getDate()}</span>
                            {isToday(day) && (
                              <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                            )}
                          </div>
                          
                          {/* Events */}
                          <div className="flex-1 space-y-1 overflow-hidden">
                            {dayEvents.slice(0, 3).map((event) => (
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
                                {event.approved && <span></span>}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-gray-500 px-2">
                                +{dayEvents.length - 3} more
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
            <div className="w-85 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
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
                        <div className="flex flex-col mb-2">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {event.title}
                            {!event.approved && <span className="ml-1">(Scheduled)</span>}
                            {event.approved && <span className=""></span>}
                          </div>
                          <div className="text-xs flex mt-1">
                            <div className="text-xs px-2  rounded-full bg-gray-300 text-gray-700">
                              {event.session} meeting
                            </div>
                          </div>
                        </div>
                          
                          <div className="text-xs text-gray-500 mt-3 mb-1 flex flex-row ">
                            <Clock className="w-4 h-4 mr-1"/>
                            {(() => {
                              const [hours, minutes] = event.time.split(":");
                              const date = new Date();
                              date.setHours(+hours);
                              date.setMinutes(+minutes);
                              return date.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true
                              });
                            })()}  • 
                            {(() => {
                              const hours = Math.floor(event.duration / 60);
                              const minutes = event.duration % 60;
                              return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m` : ""}`.trim();
                            })()}
                          </div>
                          
                          <div className="flex flex-row my-1">
                            <Users className="w-4 h-4 mr-1 text-gray-500"/>
                            {event.userId && (
                              <div className="text-xs text-gray-500 truncate">{event.user}</div>
                            )}
                          </div>

                          <div className="flex flex-row my-1">
                            <MapPin className="w-4 h-4 mr-1 text-gray-500"/>
                            {event.description && (
                              <div className="text-xs text-gray-500 truncate">{event.location}</div>
                            )}
                          </div>

                          <div className="flex flex-col mt-3 gap-1">
                            {/* Confirm meeting */}
                            {event.approved === false && event.approval === true  && (
                              <button className={`text-xs  py-1 text-white font-medium rounded-md bg-neutral-400 transition-colors`}>
                                Approve Session
                              </button>
                            )}

                            {/* Join Meeting */}
                            {event.approved === true && event.session === "online"  && (
                              <button className={`text-xs  py-1 text-white font-medium rounded-md ${event.color === "bg-cyan-500"? "bg-sky-400" : "bg-yellow-500"} ${event.color === "bg-cyan-500"? "hover:bg-sky-600" : "hover:bg-yellow-600"} transition-colors`}>
                                Join Meeting
                              </button>
                            )}

                          </div>
                          
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        onSaveEvent={handleSaveEvent}
      />
    </div>
  );
}