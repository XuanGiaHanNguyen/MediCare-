import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthNames } from "./utils/dateUtils";


export default function CalendarHeader({ currentDate, onNavigateMonth }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
      </h2>
      <div className="flex gap-2">
        <button
          onClick={() => onNavigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onNavigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}