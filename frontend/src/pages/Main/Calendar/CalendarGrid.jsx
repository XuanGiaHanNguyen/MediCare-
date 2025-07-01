import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import CalendarHeader from "./CalendarHeader"
import CalendarCell from "./CalendarCell"
import { getDaysInMonth, monthNames, dayNames } from "./utils/dateUtils";

export default function CalendarGrid({
  currentDate,
  selectedDate,
  onDateSelect,
  onNavigateMonth,
  events,
  isToday,
  isSelected,
  getEventsForDate
}) {
  const days = getDaysInMonth(currentDate);

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <CalendarHeader
        currentDate={currentDate}
        onNavigateMonth={onNavigateMonth}
      />

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
        {days.map((day, index) => (
          <CalendarCell
            key={index}
            day={day}
            events={getEventsForDate(day)}
            isToday={isToday(day)}
            isSelected={isSelected(day)}
            onSelect={() => day && onDateSelect(day)}
          />
        ))}
      </div>

      {/* Selected Date Info */}
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
  );
}