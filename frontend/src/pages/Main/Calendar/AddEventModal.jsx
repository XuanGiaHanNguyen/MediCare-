import { useState, useEffect } from "react";
import { X, Calendar, Clock, Users, FileText, MapPin, UserCheck, Video } from "lucide-react";

import axios from "axios";
import API_ROUTES from "../../../constant/APIRoutes";

import EventFormFields from "./addEvent/EventFormFields";
import ParticipantSelector from "./addEvent/ParticipantSelector";
import { useGoogleMeet } from "./addEvent/useGoogleMeet";



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
    participants: [],
    color: "bg-amber-500" 
  });

  const [isLoading, setIsLoading] = useState(false);
  const [participantsList, setParticipantsList] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const { createMeetEvent, isCreatingMeet } = useGoogleMeet();

  const Id = localStorage.getItem("Id");

  // Event type configurations
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

  // Update color when event type changes
  useEffect(() => {
    const selectedType = eventTypes.find(type => type.value === formData.type);
    setFormData(prev => ({
      ...prev,
      color: selectedType?.color || "bg-amber-500"
    }));
  }, [formData.type]);

  // Function to fetch participants based on event type
  const fetchParticipants = async (eventType) => {
    setLoadingParticipants(true);
    
    try {
      if (eventType === "meeting") {
        const response = await axios.get(API_ROUTES.GET_STAFFS);
        const List = response.data;
        
        const staffList = List.filter(staff => staff.userId !== Id);

        // Fetch emails in parallel
        const staffWithEmails = await Promise.all(
          staffList.map(async (staff) => {
            try {
              const emailResponse = await axios.get(API_ROUTES.GET_USER(staff.userId));
              const email = emailResponse.data.email;
              return { ...staff, email };
            } catch (err) {
              console.error("Failed to get email for staff:", staff.userId);
              return { ...staff, email: "N/A" };
            }
          })
        );

        setParticipantsList(staffWithEmails);

      } else if (eventType === "appointment") {
        const response = await axios.get(API_ROUTES.GET_PATIENTS);
        const List = response.data;
        
        const patientList = List.filter(patient => patient.staff_in_charge === Id);

        // Fetch emails in parallel
        const patientWithEmails = await Promise.all(
          patientList.map(async (patient) => {
            try {
              const emailResponse = await axios.get(API_ROUTES.GET_USER(patient.userId));
              const email = emailResponse.data.email;
              return { ...patient, email };
            } catch (err) {
              console.error("Failed to get email for patient:", patient.userId);
              return { ...patient, email: "N/A" };
            }
          })
        );

        setParticipantsList(patientWithEmails);
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
      setFormData(prev => ({ ...prev, participants: [] }));
    }
  }, [formData.type]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear meet link when switching to offline
    if (name === "session" && value === "offline") {
      setMeetLink("");
    }
  };

  // Handle participant selection
  const handleParticipantToggle = (participant) => {
    const participantId = participant.id || participant.userId;
    
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let eventData = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        userId: Id
      };

      // Create Google Meet event if session is online
      if (formData.session === "online") {
        const meetEventData = {
          title: formData.title,
          description: formData.description,
          startTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
          endTime: new Date(new Date(`${formData.date}T${formData.time}`).getTime() + (parseInt(formData.duration) * 60000)).toISOString(),
          attendees: formData.participants.map(p => p.email).filter(email => email !== "N/A")
        };

        const meetResult = await createMeetEvent(meetEventData);
        
        if (meetResult.success) {
          eventData.location = meetResult.meetLink;
          eventData.link = meetResult.meetLink;
          setMeetLink(meetResult.meetLink);

        } else {
          throw new Error(meetResult.error || "Failed to create Google Meet");
        }
      }

      // Call the parent component's save handler
      if (onSaveEvent) {
        await onSaveEvent(eventData);
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
        participants: [],
        color: "bg-amber-500"
      });
      setMeetLink("");
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      alert(error.message || 'Error saving event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <EventFormFields
            formData={formData}
            handleInputChange={handleInputChange}
            eventTypes={eventTypes}
            sessionTypes={sessionTypes}
            durations={durations}
            meetLink={meetLink}
          />

          <ParticipantSelector
            formData={formData}
            participantsList={participantsList}
            loadingParticipants={loadingParticipants}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleParticipantToggle={handleParticipantToggle}
          />

          {/* Modal Footer */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
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
              disabled={isLoading || isCreatingMeet || !formData.title || !formData.date || !formData.time}
              className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading || isCreatingMeet ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {formData.session === "online" ? "Creating Meet..." : "Requesting..."}
                </>
              ) : (
                <>
                  {formData.session === "online" && <Video className="w-4 h-4" />}
                  Request Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}