import { useState } from "react";
import { User, GraduationCap, Stethoscope, Edit, Save, X } from "lucide-react";

export default function UserProfileSection({ 
  bio, 
  setBio, 
  userProfile, 
  onSave 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: bio,
    education: userProfile.education,
    experience: userProfile.experience
  });

  const handleSave = async () => {
    // Call the parent's save function
    await onSave(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      bio: bio,
      education: userProfile.education,
      experience: userProfile.experience
    });
    setIsEditing(false);
  };

  const addEducation = () => {
    setEditData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: "",
        institution: "",
        year: "",
        specialization: ""
      }]
    }));
  };

  const addExperience = () => {
    setEditData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        position: "",
        hospital: "",
        duration: "",
        department: ""
      }]
    }));
  };

  const removeEducation = (index) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const removeExperience = (index) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const updateExperience = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">User's Profile</h3>
        <div className="flex gap-2">
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
                className="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-sky-700 text-white rounded-xl hover:bg-sky-800 transition-colors text-sm flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Bio Section */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-sky-800" />
            <h4 className="font-semibold text-sky-800">About</h4>
          </div>
          {isEditing ? (
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm leading-relaxed resize-none"
              rows="4"
              placeholder="Write about yourself..."
            />
          ) : (
            <p className="text-gray-800 text-sm leading-relaxed">{bio}</p>
          )}
        </div>

        {/* Education Section */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-sky-800" />
              <h4 className="font-semibold text-sky-800">Education</h4>
            </div>
            {isEditing && (
              <button
                onClick={addEducation}
                className="px-3 py-1 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700 transition-colors"
              >
                Add Education
              </button>
            )}
          </div>
          <div className="space-y-3">
            {editData.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-sky-500 pl-4 relative">
                {isEditing && (
                  <button
                    onClick={() => removeEducation(index)}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        placeholder="Degree"
                        className="flex-1 p-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        value={edu.year}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                        placeholder="Year"
                        className="w-20 p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <input
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      placeholder="Institution"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      value={edu.specialization}
                      onChange={(e) => updateEducation(index, 'specialization', e.target.value)}
                      placeholder="Specialization"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{edu.degree}</p>
                      <span className="text-sm text-sky-800 font-medium">{edu.year}</span>
                    </div>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.specialization}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Medical Experience Section */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-sky-800" />
              <h4 className="font-semibold text-sky-800">Medical Experience</h4>
            </div>
            {isEditing && (
              <button
                onClick={addExperience}
                className="px-3 py-1 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700 transition-colors"
              >
                Add Experience
              </button>
            )}
          </div>
          <div className="space-y-3">
            {editData.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-sky-500 pl-4 relative">
                {isEditing && (
                  <button
                    onClick={() => removeExperience(index)}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        placeholder="Position"
                        className="flex-1 p-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                        placeholder="Duration"
                        className="w-32 p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <input
                      value={exp.hospital}
                      onChange={(e) => updateExperience(index, 'hospital', e.target.value)}
                      placeholder="Hospital/Organization"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      value={exp.department}
                      onChange={(e) => updateExperience(index, 'department', e.target.value)}
                      placeholder="Department"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{exp.position}</p>
                      <span className="text-sm text-sky-800 font-medium">{exp.duration}</span>
                    </div>
                    <p className="text-sm text-gray-600">{exp.hospital}</p>
                    <p className="text-xs text-gray-500">{exp.department}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}