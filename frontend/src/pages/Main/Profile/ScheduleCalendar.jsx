import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

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
  );
}