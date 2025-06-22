import { useState } from "react";
import { X, Calendar, Clock, Users, FileText, MapPin } from "lucide-react";

export default function AddEventModal({ isOpen, onClose, selectedDate, onSaveEvent }) {
  const [formData, setFormData] = useState({
    title: "",
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
    time: "",
    duration: "30",
    type: "meeting",
    description: "",
    location: "",
    attendees: "",
    color: "bg-sky-500"
  });

  const [isLoading, setIsLoading] = useState(false);

  const eventTypes = [
    { value: "meeting", label: "Meeting", color: "bg-sky-500" },
    { value: "appointment", label: "Appointment", color: "bg-cyan-600" },
    { value: "consultation", label: "Consultation", color: "bg-green-500" },
    { value: "interview", label: "Interview", color: "bg-purple-500" },
    { value: "personal", label: "Personal", color: "bg-amber-500" },
    { value: "other", label: "Other", color: "bg-gray-500" }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare event data for API
      const eventData = {
        ...formData,
        attendees: formData.attendees.split(',').map(email => email.trim()).filter(email => email),
        id: Date.now(), // Temporary ID - replace with backend generated ID
        createdAt: new Date().toISOString(),
        userId: localStorage.getItem("Id") // Get user ID from localStorage
      };

      // TODO: Replace this with your actual API call
      // Example API call structure:
      /*
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // if using auth tokens
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const savedEvent = await response.json();
      */

      // For now, simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call the parent component's save handler
      onSaveEvent(eventData);

      // Reset form and close modal
      setFormData({
        title: "",
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
        time: "",
        duration: "30",
        type: "meeting",
        description: "",
        location: "",
        attendees: "",
        color: "bg-sky-500"
      });
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      // TODO: Show error message to user
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

          {/* Attendees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Attendees
            </label>
            <input
              type="text"
              name="attendees"
              value={formData.attendees}
              onChange={handleInputChange}
              placeholder="Enter email addresses separated by commas"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple emails with commas
            </p>
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
        </form>

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
            {isLoading ? "Saving..." : "Save Event"}
          </button>
        </div>
      </div>
    </div>
  );
}