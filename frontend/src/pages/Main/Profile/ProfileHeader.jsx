import { useState } from "react";
import { Camera, Edit, Save } from "lucide-react";
import { profileIcon } from "../../../assets/icon";

export default function ProfileHeader({ 
  name, 
  role, 
  isEditing, 
  onEditToggle 
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-20 bg-sky-700 rounded-t-2xl"></div>
        
        {/* Profile Info */}
        <div className="relative px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-2xl border-4 border-white shadow-lg object-cover">
                {profileIcon}
              </div>
              <button className="absolute bottom-2 right-2 w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            {/* Profile Details */}
            <div className="flex-1 mt-4 sm:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                    <span className="flex items-center gap-2">
                      <span>•</span>
                      {role}
                    </span>
                    <span className="flex items-center gap-2">
                      <span>•</span>
                      12 experience
                    </span>
                  </div>
                </div>
                <button
                  onClick={onEditToggle}
                  className="px-6 py-3 bg-white text-gray-800 border-1 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
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
  );
}