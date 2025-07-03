import { useState, useEffect } from "react";
import {
  Calendar,
  Pill,
  Settings,
  FileText,
  Home,
  Bed,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar1, 
  Users, 
  BedDouble
} from "lucide-react";
import DockHeader from "../../component/DockHeader"

import axios from "axios";
import API_ROUTES from "../../constant/APIRoutes";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

const patientData = [
  { no: 1, id: "P001", name: "John Doe", date: "2024-03-15", age: 45, country: "USA", gender: "Male" },
  { no: 2, id: "P002", name: "Jane Smith", date: "2024-03-14", age: 32, country: "Canada", gender: "Female" },
  { no: 3, id: "P003", name: "Bob Johnson", date: "2024-03-13", age: 58, country: "UK", gender: "Male" },
  { no: 4, id: "P004", name: "Alice Brown", date: "2024-03-12", age: 29, country: "Australia", gender: "Female" },
  { no: 5, id: "P005", name: "Charlie Wilson", date: "2024-03-11", age: 67, country: "Germany", gender: "Male" }
];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [patientData, setPatientData] = useState([])
  const Id = localStorage.getItem("Id")

  useEffect(()=> {
    async function getPatients(){
      const response = await axios.get(API_ROUTES.GET_PATIENTS)
      const allPatient = response.data
      const staffPatient = allPatient.filter(patient => patient.staff_in_charge === Id)
      console.log(staffPatient)
      setPatientData(staffPatient)

    }
    getPatients()
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

  const navigate = useNavigate()

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Adjust for Monday start
    
    const days = [];
    
    // Previous month days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = year === today.getFullYear() && 
                     month === today.getMonth() && 
                     day === today.getDate();
      days.push({
        day,
        isCurrentMonth: true,
        isToday
      });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };

  return (
    <div>
      <DockHeader />
      <div className="w-full min-h-screen bg-gray-50 flex flex-row">
        {/* Sidebar */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center gap-4 py-6">
          <button onClick={(e)=>navigate(`/dock/staff/${Id}`)} className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/calendar/staff/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/prescription/staff/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Pill className="w-5 h-5" />
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                <Settings className="w-5 h-5" />
                Manage Widgets
              </button>
            </div>
          </div>


          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Calendar Widget */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => navigateMonth("prev")}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button 
                    onClick={() => navigateMonth("next")}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
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
                        w-10 h-10 flex items-center justify-center text-sm rounded-xl cursor-pointer transition-all
                        ${
                          day.isCurrentMonth
                            ? day.isToday
                              ? "bg-sky-600 text-white shadow-lg"
                              : "text-gray-900 hover:bg-gray-100"
                            : "text-gray-400"
                        }
                      `}
                    >
                      {day.day}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions or Summary */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl">
                  <div className="w-11 h-11 bg-sky-600 rounded-xl flex items-center justify-center text-white">
                    <Users/>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">New patient registered</p>
                    <p className="text-sm text-gray-600">John Doe - 5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl">
                  <div className="w-11 h-11 bg-sky-600 rounded-xl flex items-center justify-center text-white">
                    <Calendar1 />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Appointment scheduled</p>
                    <p className="text-sm text-gray-600">Jane Smith - 15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl">
                  <div className="w-11 h-11 bg-sky-600 rounded-xl flex items-center justify-center text-white">
                    <BedDouble/>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Bed assignment updated</p>
                    <p className="text-sm text-gray-600">Room 205 - 30 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Patient List</h3>
                <button onClick={(e)=> navigate(`/patinfo/${Id}`)} className="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>       
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>                 
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telehealth</th>
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patientData.map((patient, index) => (
                    <tr key={index+1} className="hover:bg-gray-50 transition-colors">
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-900">{index+1}</td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm font-medium text-sky-800 hover:text-blue-800 cursor-pointer">{patient.name}</td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-900">{patient.diagnosis}</td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-900">{patient.tele_avail}</td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-900">{patient.phone}</td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}