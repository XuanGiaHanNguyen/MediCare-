import { useState } from "react";
import {
  Calendar,
  Plus,
  Users,
  FileText,
  Home,
  Bed,
  Upload,
  Search,
  Grid,
  List,
  Folder,
  File,
  Download,
  Share,
  MoreVertical,
  Star,
  Eye
} from "lucide-react";
import DockHeader from "../../component/DockHeader"

export default function PaDock() {

  return (
    <div>
      <DockHeader />
      <div className="w-full min-h-screen bg-gray-50 flex flex-row">
        {/* Sidebar */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center gap-4 py-6">
          <button className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-colors">
            <FileText className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Users className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Bed className="w-5 h-5" />
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Patients</h1>
              <p className="text-gray-600">Your list of patients and their status</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                <Upload className="w-5 h-5" />
                Upload
              </button>
              <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}