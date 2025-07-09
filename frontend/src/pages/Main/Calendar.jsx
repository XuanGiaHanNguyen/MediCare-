import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useGoogleAuth } from "../../useGoogleAuth";

import DockHeader from "../../component/DockHeader"
import NavigationSidebar from "./Calendar/Sidebar/NavigationSidebar"
import CalendarGrid from "./Calendar/CalendarGrid"
import EventsList from "./Calendar/EventsList"
import AddEventModal from "./Calendar/AddEventModal"
import ConnectGoogle from "./Calendar/Connect";

import { useCalendar } from "./Calendar/Hooks/useCalendar"
import { useEvents } from "./Calendar/Hooks/useEvents"
import { saveEvent } from "./Calendar/services/api/eventService";

export default function CalendarDock() {

  const Id = localStorage.getItem("Id");
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAuthenticated, user, isLoading } = useGoogleAuth();
  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    // Show connect modal only if user is not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      setShowConnectModal(true);
    }
  }, [isLoading, isAuthenticated]);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show connect modal if user is already authenticated
  const shouldShowModal = showConnectModal && !isAuthenticated;
  
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    navigateMonth,
    isToday,
    isSelected
  } = useCalendar();

  const {
    events,
    refreshEvents,
    getEventsForDate
  } = useEvents(Id);

  const selectedDateEvents = getEventsForDate(selectedDate);

  const handleAddEventClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      const success = await saveEvent(eventData, Id);
      
      if (success) {
        toast.success(`${eventData.type === 'appointment' ? 'Appointment' : 'Meeting'} Successfully Requested.`);
        await refreshEvents();
      } else {
        toast.error("Error occurred during the requesting process.");
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error("Error occurred during the requesting process.");
    }
  };

  return (
    <div>
      <DockHeader />
      <div className="w-full min-h-screen bg-gray-50 flex flex-row">
        <NavigationSidebar currentPage="calendar" userId={Id} />
        
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
            <CalendarGrid
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onNavigateMonth={navigateMonth}
              events={events}
              isToday={isToday}
              isSelected={isSelected}
              getEventsForDate={getEventsForDate}
            />

            <EventsList
              selectedDate={selectedDate}
              events={selectedDateEvents}
              userId={Id}
              onRefreshEvents={refreshEvents}
            />
          </div>
        </div>
      </div>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        onSaveEvent={handleSaveEvent}
      />
      
      {/* Changed: Pass isOpen prop and use correct close handler */}
      <ConnectGoogle 
        isOpen={shouldShowModal} 
        onClose={() => setShowConnectModal(false)} 
      />
    </div>
  );
}