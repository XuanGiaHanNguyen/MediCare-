import { User, Calendar, Clock } from "lucide-react";

export default function StatisticsCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Statistics</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-sky-50 rounded-xl">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-sky-600" />
            <span className="font-medium text-gray-900">Total Patients</span>
          </div>
          <span className="text-2xl font-bold text-sky-600">1233</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-sky-50 rounded-xl">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-sky-600" />
            <span className="font-medium text-gray-900">This Month</span>
          </div>
          <span className="text-2xl font-bold text-sky-600">89</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-sky-50 rounded-xl">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-sky-600" />
            <span className="font-medium text-gray-900">Today</span>
          </div>
          <span className="text-2xl font-bold text-sky-600">4</span>
        </div>
      </div>
    </div>
  );
}