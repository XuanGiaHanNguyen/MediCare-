import { useState } from "react";
import {
  Calendar,
  Plus,
  Settings,
  FileText,
  Home,
  Bed,
  Edit,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Activity,
  Clock,
  AlertCircle,
  Camera,
  Save
} from "lucide-react";
import { profileIcon } from "../../assets/icon";
import HospitalHeader from "../../component/DockHeader";

// Mock profile data
const profileData = {
  name: "Dr. Sarah Johnson",
  title: "Cardiologist",
  email: "sarah.johnson@medicenter.com",
  phone: "+1 (555) 123-4567",
  address: "123 Medical Plaza, Suite 400, New York, NY 10001",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
  specialization: "Interventional Cardiology",
  experience: "12 years",
  patients: "1,234",
  department: "Cardiology Department"
};

const upcomingAppointments = [
  { time: "09:00", patient: "John Smith", type: "Consultation", status: "confirmed" },
  { time: "10:30", patient: "Mary Wilson", type: "Follow-up", status: "pending" },
  { time: "14:00", patient: "Robert Davis", type: "Surgery", status: "confirmed" },
  { time: "15:30", patient: "Lisa Brown", type: "Consultation", status: "confirmed" }
];

const recentActivity = [
  { action: "Completed surgery for", patient: "Michael Chen", time: "2 hours ago", type: "surgery" },
  { action: "Updated treatment plan for", patient: "Emma Watson", time: "4 hours ago", type: "update" },
  { action: "Reviewed lab results for", patient: "David Kim", time: "6 hours ago", type: "review" },
  { action: "Scheduled follow-up with", patient: "Anna Rodriguez", time: "1 day ago", type: "schedule" }
];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function MedicalProfile() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);

  const navigate = (path) => {
    console.log(`Navigating to ${path}`);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
    
    const days = [];
    
    // Previous month days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false,
        hasAppointment: false
      });
    }
    
    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = year === today.getFullYear() && 
                     month === today.getMonth() && 
                     day === today.getDate();
      // Mock appointment data for some days
      const hasAppointment = [5, 12, 18, 25, 28].includes(day);
      days.push({
        day,
        isCurrentMonth: true,
        isToday,
        hasAppointment
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        hasAppointment: false
      });
    }
    
    return days;
  };

  return (
    <div>
      <HospitalHeader />
    <div className="w-full min-h-screen bg-gray-50 flex flex-row">
      {/* Sidebar */}
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center gap-4 py-6">
        <button onClick={() => navigate("/dock")} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Home className="w-5 h-5" />
        </button>
        <button onClick={() => navigate("/calendar")} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Calendar className="w-5 h-5" />
        </button>
        <button onClick={() => navigate("/docs")} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <FileText className="w-5 h-5" />
        </button>
        <button onClick={() => navigate("/patinfo")} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bed className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">

        <div className="p-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-20 bg-sky-600 rounded-t-2xl"></div>
            
            {/* Profile Info */}
            <div className="relative px-8 py-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6 -mt-16">
                {/* Avatar */}
                <div className="relative">
                  <div
                    className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-2xl border-4 border-white shadow-lg object-cover"
                  >
                    {profileIcon}
                  </div>
                  <button className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Profile Details */}
                <div className="flex-1 mt-4 sm:mt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                        <span className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          {profileData.specialization}
                        </span>
                        <span className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-green-500" />
                          {profileData.experience} experience
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                      {isEditing ? "Save Profile" : "Edit Profile"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{profileData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{profileData.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Total Patients</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{profileData.patients}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">This Month</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">89</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-gray-900">Today</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">4</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Schedule Calendar</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigateMonth("prev")}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button 
                      onClick={() => navigateMonth("next")}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-gray-500 font-medium py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth(currentDate).map((day, index) => (
                    <div
                      key={index}
                      className={`
                        relative w-12 h-12 flex items-center justify-center text-sm rounded-xl cursor-pointer transition-all
                        ${
                          day.isCurrentMonth
                            ? day.isToday
                              ? "bg-blue-600 text-white shadow-lg"
                              : day.hasAppointment
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              : "text-gray-900 hover:bg-gray-100"
                            : "text-gray-400"
                        }
                      `}
                    >
                      {day.day}
                      {day.hasAppointment && day.isCurrentMonth && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span>Days with appointments</span>
                </div>
              </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Today's Schedule</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{appointment.time}</div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {appointment.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border-l-4 border-blue-200 bg-blue-50 rounded-r-xl">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                      activity.type === 'surgery' ? 'bg-red-500' :
                      activity.type === 'update' ? 'bg-blue-500' :
                      activity.type === 'review' ? 'bg-green-500' : 'bg-purple-500'
                    }`}>
                      {activity.type === 'surgery' ? <AlertCircle className="w-4 h-4" /> :
                       activity.type === 'update' ? <Edit className="w-4 h-4" /> :
                       activity.type === 'review' ? <FileText className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">
                        <span className="font-medium">{activity.action}</span>
                        <span className="text-blue-600 font-medium"> {activity.patient}</span>
                      </p>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
  );
}