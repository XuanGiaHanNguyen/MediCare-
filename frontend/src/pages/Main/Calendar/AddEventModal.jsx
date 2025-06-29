import { useState, useEffect } from "react";
import { X, Calendar, Clock, Users, FileText, MapPin, UserCheck } from "lucide-react";

import axios from "axios"
import API_ROUTE from "../../../constant/APIRoutes"
import toast from "react-hot-toast"

export default function AddEventModal({ isOpen, onClose, selectedDate, onSaveEvent }) {
  const [formData, setFormData] = useState({
    title: "",
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
    time: "",
    duration: "30",
    type: "meeting",
    session: "online",
    description: "",
    location: "",
    participants: [], // New field for selected participants
    color: "bg-amber-500" 
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      color: formData.type === "meeting" ? "bg-amber-500" : "bg-cyan-500"
    }));
  }, [formData.type]);


  const [isLoading, setIsLoading] = useState(false);
  const [participantsList, setParticipantsList] = useState([]);
  const [email, setEmail] = useState([])
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const Id = localStorage.getItem("Id")

  const eventTypes = [
    { value: "meeting", label: "Meeting", color: "bg-amber-500" },
    { value: "appointment", label: "Appointment", color: "bg-cyan-600" }
  ];

  const sessionTypes = [
    { value: "online", label: "Online"},
    { value: "offline", label: "Offline"}
  ];

  const durations = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
    { value: "180", label: "3 hours" }
  ];

  // Function to fetch participants based on event type
  const fetchParticipants = async (eventType) => {
    setLoadingParticipants(true);
    
    try {
      
      // This is where you would make your actual API call
      // const response = await fetch(`/api/participants/${eventType}`);
      // const data = await response.json();
      
      // For now, using mock data
      if (eventType === "meeting") {
        try {
          const response = await axios.get(API_ROUTE.GET_STAFFS);
          const List = response.data;
          
          const staffList = List.filter(staff => staff.userId !== Id)
          console.log(staffList)

          // Fetch emails in parallel
          const staffWithEmails = await Promise.all(
            staffList.map(async (staff) => {
              try {
                const emailResponse = await axios.get(API_ROUTE.GET_USER(staff.userId));
                const email = emailResponse.data.email
                return { ...staff, email };
              } catch (err) {
                console.error("Failed to get email for staff:", staff.userId);
                return { ...staff, email: "N/A" }; // fallback if email fetch fails
              }
            })
          );

          setParticipantsList(staffWithEmails);

        } catch (error) {
          console.error("Failed to fetch staff list or emails:", error);
        }
      } else if (eventType === "appointment") {
        try {
          const response = await axios.get(API_ROUTE.GET_PATIENTS);
          const List = response.data;
          console.log(List)
          
          const patientList = List.filter(patient => patient.staff_in_charge === Id)
          console.log("Patient list:")
          console.log(patientList)

          // Fetch emails in parallel
          const patientWithEmails = await Promise.all(
            patientList.map(async (patient) => {
              try {
                const emailResponse = await axios.get(API_ROUTE.GET_USER(patient.userId));
                const email = emailResponse.data.email
                return { ...patient, email };
              } catch (err) {
                console.error("Failed to get email for patient:", patient.userId);
                return { ...patient, email: "N/A" }; // fallback if email fetch fails
              }
            })
          );

          setParticipantsList(patientWithEmails);
          console.log(participantsList.length)
        } catch (error) {
          console.error("Failed to fetch staff list or emails:", error);
        }
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      setParticipantsList([]);
    } finally {
      setLoadingParticipants(false);
    }
  };

  // Load participants when event type changes
  useEffect(() => {
    if (formData.type) {
      fetchParticipants(formData.type);
      // Reset selected participants when type changes
      setFormData(prev => ({ ...prev, participants: [] }));
    }
  }, [formData.type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update color when event type changes
    if (name === "type") {
      const selectedType = eventTypes.find(type => type.value === value);
      setFormData(prev => ({
        ...prev,
        color: selectedType?.color || "bg-sky-500"
      }));
    }
  };

  const handleParticipantToggle = (participant) => {
    const participantId = participant.id || participant.userId; // Use fallback
    
    setFormData(prev => {
      if (prev.type === "appointment") {
        // For appointments, only allow single selection
        return {
          ...prev,
          participants: prev.participants.some(p => (p.id || p.userId) === participantId) 
            ? [] 
            : [participant]
        };
      } else {
        // For meetings, allow multiple selection
        return {
          ...prev,
          participants: prev.participants.some(p => (p.id || p.userId) === participantId)
            ? prev.participants.filter(p => (p.id || p.userId) !== participantId)
            : [...prev.participants, participant]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare event data for API
      const eventData = {
        ...formData,
        attendees: formData.attendees ? formData.attendees.split(',').map(email => email.trim()).filter(email => email) : [],
        id: Date.now(), // Temporary ID - replace with backend generated ID
        createdAt: new Date().toISOString(),
        userId: "demo-user-id"
      };

      // For demo purposes, simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call the parent component's save handler
      if (onSaveEvent) {
        onSaveEvent(eventData);
      }

      // Reset form and close modal
      setFormData({
        title: "",
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
        time: "",
        duration: "30",
        type: "meeting",
        session: "online",
        description: "",
        location: "",
        attendees: "",
        participants: [],
        color: "bg-sky-500"
      });
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Schedule Event</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter event title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Session Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Format
            </label>
            <select
              name="session"
              value={formData.session}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              {sessionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Participants Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserCheck className="w-4 h-4 inline mr-1" />
              Select Attendant(s)
              {formData.type === "appointment" && (
                <span className="text-xs text-gray-500 ml-1">(Select one)</span>
              )}
            </label>
            
            {loadingParticipants ? (
              <div className="border border-gray-300 rounded-lg p-4 text-center text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Loading {formData.type === "meeting" ? "staff" : "patients"}...
                </div>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto bg-white">
                {participantsList.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No {formData.type === "meeting" ? "staff members" : "patients"} found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {participantsList.map((participant) => {
                      const participantId = participant.id || participant.userId; // Use consistent ID
                      const isSelected = formData.participants.some(p => 
                        (p.id || p.userId) === participantId
                      );
                      
                      return (
                        <label
                          key={participantId} // Use consistent ID
                          className={`flex items-center p-4 cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'bg-sky-50 border-l-4 border-sky-500' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex-shrink-0 mr-4">
                            <input
                              type={formData.type === "appointment" ? "radio" : "checkbox"}
                              name={formData.type === "appointment" ? "selectedPatient" : undefined}
                              checked={isSelected}
                              onChange={() => handleParticipantToggle(participant)}
                              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${
                                formData.type === "appointment" ? "rounded-full" : "rounded"
                              }`}
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {participant.name}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  {participant.email}
                                </p>
                              </div>
                              
                              {formData.type === "meeting" ? (
                                <div className="flex-shrink-0 ml-4 text-right">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"> 
                                    {participant.role}
                                  </span>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {participant.language}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex-shrink-0 ml-4 text-right">
                                  <p className="text-xs text-gray-500">
                                    {participant.phone || "Not available"}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Diagnosis: {participant.diagnosis}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                          </div>
                          
                          {isSelected && (
                            <div className="flex-shrink-0 ml-2">
                             
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              {durations.map(duration => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Meeting room, address, or virtual link"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Event description or agenda"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
            />
          </div>

          {/* Color Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Color
            </label>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${formData.color}`}></div>
              <span className="text-sm text-gray-600">
                {eventTypes.find(type => type.value === formData.type)?.label}
              </span>
            </div>
          </div>

          {/* Debug Info
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-1">Current Selection:</p>
            <p className="text-xs text-gray-600">
              Type: {formData.type} | Session: {formData.session} | Participants: {formData.participants.length}
            </p>
          </div> */}
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !formData.title || !formData.date || !formData.time}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isLoading ? "Requesting..." : "Request Event"}
          </button>
        </div>
      </div>
    </div>
  );
}