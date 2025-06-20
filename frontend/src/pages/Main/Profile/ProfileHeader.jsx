import { useState } from "react";
import { Camera, Edit, Save, X } from "lucide-react";
import { profileIcon } from "../../../assets/icon";

export default function ProfileHeader({ 
  name, 
  role, 
  experience = "12 experience",
  onSave 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: name,
    role: role,
    experience: experience
  });

  const handleSave = async () => {
    // Call the parent's save function
    await onSave(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: name,
      role: role,
      experience: experience
    });
    setIsEditing(false);
  };

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
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
                      <div className="flex flex-col sm:flex-row gap-2 pr-10">
                        <input
                          value={editData.role}
                          onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))}
                          className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-600"
                          placeholder="Your Role/Title"
                        />
                        <input
                          value={editData.experience}
                          onChange={(e) => setEditData(prev => ({ ...prev, experience: e.target.value }))}
                          className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-600"
                          placeholder="Years of experience"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                        <span className="flex items-center gap-2">
                          <span>•</span>
                          {role}
                        </span>
                        <span className="flex items-center gap-2">
                          <span>•</span>
                          {experience}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Edit/Save/Cancel Buttons */}
                <div className="flex gap-2 mt-4 sm:mt-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-white text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}