import { useState, useEffect } from "react";
import axios from "axios";
import API_ROUTES from "../../constant/APIRoutes";
import {
  Calendar,
  Home,
  Bed,
  ChevronLeft,
  ChevronRight,
  Mail,
  Ambulance, 
  Headset, 
  Phone
} from "lucide-react";

import HospitalHeader from "../../component/DockHeader";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ProfileHeader from "./profile/ProfileHeaderP";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function ProfileP() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);

  const [email, setEmail] = useState("")
  const [staff, setStaff] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [age, setAge] = useState("")
  const [name, setName] =useState("")
  const [phone, setPhone] = useState("")
  const [tele, setTele] = useState("")

  const Id = localStorage.getItem("Id")

  const navigate = useNavigate()

  useEffect(()=>{
    async function GetAllData (){

      const Id = localStorage.getItem("Id")

      const response = await axios.get(API_ROUTES.GET_USER(Id))
      const expanded = await axios.get(API_ROUTES.GET_PATIENT(Id))

      if (response.status === 200){
        setEmail(response.data.email)
        setName(response.data.full_name)
      }
      if (expanded.status === 200){
        setDiagnosis(expanded.data.diagnosis)
        // setStaff(expanded.data.staff_in_charge)
        const findingStaffName = await axios.get(API_ROUTES.GET_STAFF(expanded.data.staff_in_charge))
        if (findingStaffName.status === 200){
          setStaff(findingStaffName.data.name)
        }
        setPhone(expanded.data.phone || "Not given")
        setAge(expanded.data.age)
        setTele(expanded.data.tele_avail)
      }
      
    }
    GetAllData()
  }, [])

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

  const handleHeaderSave = async (diagnosis, age) => {
    try {
      setDiagnosis(diagnosis)
      setAge(age)
      const requestData = {
        diagnosis: diagnosis, 
        age: age
      }
      const response = await axios.put(API_ROUTES.EDIT_PATIENT(Id), requestData)
      console.log(response)
      if (response.status === 200){
        toast.success("Successfully saved changes.")
      } else {
        toast.error("Error saving changes - Please try again later.")
      }

    } catch (error) {
      toast.error("Error saving changes - Please try again later.")
      console.error("Error:", error)
    }
  }

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
            <button onClick={(e)=>navigate(`/dock/patient/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Home className="w-5 h-5" />
            </button>
            <button onClick={(e)=>navigate(`/calendar/patient/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Calendar className="w-5 h-5" />
            </button>
            <button onClick={(e)=>navigate(`/docs/patient/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Bed className="w-5 h-5" />
            </button>
          </div>

        {/* Main Content */}
        <div className="flex-1">

          <div className="p-8">
          
          <ProfileHeader
            name={name}
            diagnosis={diagnosis}
            age={age}
            isEditing={isEditing}
            onEditToggle={() => setIsEditing(!isEditing)}
            onSave={handleHeaderSave}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-700 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-50" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-700 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-gray-50" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{phone || "None"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-700 rounded-xl flex items-center justify-center">
                      <Headset className="w-5 h-5 text-gray-50" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telegraph Availability</p>
                      <p className="font-medium text-gray-900">{ tele || "None"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-700 rounded-xl flex items-center justify-center">
                      <Ambulance className="w-5 h-5 text-gray-50" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Staff In Charge</p>
                      <p className="font-medium text-gray-900">{staff || "None"}</p>
                    </div>
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
                                ? "bg-sky-600 text-white shadow-lg"
                                : day.hasAppointment
                                ? "bg-sky-100 text-sky-800 hover:bg-sky-200"
                                : "text-gray-900 hover:bg-gray-100"
                              : "text-gray-400"
                          }
                        `}
                      >
                        {day.day}
                        {day.hasAppointment && day.isCurrentMonth && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-sky-600 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-3 h-3 bg-sky-600 rounded-full"></div>
                    <span>Days with appointments</span>
                  </div>
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