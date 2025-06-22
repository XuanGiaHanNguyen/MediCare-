import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_ROUTES from "../../constant/APIRoutes";
import HospitalHeader from "../../component/DockHeader";

import SidebarNav from "./Profile/SidebarNav";
import ProfileHeader from "./Profile/ProfileHeader";
import ContactInfo from "./Profile/ContactInfo";
import StatisticsCard from "./Profile/StatisticsCard";
import UserProfileSection from "./Profile/UserProfileSection";
import ScheduleCalendar from "./Profile/ScheduleCalendar";

import toast from "react-hot-toast";

export default function MedicalProfile() {

  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [tele, setTele] = useState("");
  const [language, setLanguage] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("")
  
  const Id = localStorage.getItem("Id");
  const navigate = useNavigate();

  // Updated to use state instead of mock data
  const [userProfile, setUserProfile] = useState({
    education: [],
    experience: []
  });

  useEffect(() => {
    async function GetAllData() {
      const Id = localStorage.getItem("Id");

      try {
        const response = await axios.get(API_ROUTES.GET_USER(Id));
        const expanded = await axios.get(API_ROUTES.GET_STAFF(Id));

        if (response.status === 200) {
          setEmail(response.data.email);
          setName(response.data.full_name);
        }
        
        if (expanded.status === 200) {
          setTele(expanded.data.tele_avail);
          setRole(expanded.data.role);
          setLanguage(expanded.data.language);
          setBio(expanded.data.bio);
          setPhone(expanded.data.phone);
          setExperience(expanded.data.year);
          
          // Set education and experience from API response
          // If they don't exist in the API, use default empty arrays
          setUserProfile({
            education: expanded.data.education,
            experience: expanded.data.experience 
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    GetAllData();
  }, []);

  const handleHeaderSave = async (role, experience) => {
    try {
      setRole(role)
      setExperience(experience)
      const requestData = {
        role: role, 
        year: experience 
      }
      const response = await axios.put(API_ROUTES.EDIT_STAFF(Id), requestData)
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

  const handleProfileSave = async (profileData) => {
    try {
      // Update local state
      setBio(profileData.bio);
      setUserProfile({
        education: profileData.education,
        experience: profileData.experience
      });

      // Prepare data for API call
      const requestData = {
        bio: profileData.bio,
        education_list: profileData.education,
        experience_list: profileData.experience
      };

      // Make API call to save the data
      const response = await axios.put(API_ROUTES.EDIT_STAFF(Id), requestData);
      
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Error updating profile - Please try again later.");
      }

      console.log("Profile updated successfully", response.data);
    } catch (error) {
      toast.error("Error updating profile - Please try again later.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <HospitalHeader />
      <div className="w-full min-h-screen bg-gray-50 flex flex-row">
        {/* Sidebar */}
        <SidebarNav userId={Id} />

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">
            {/* Profile Header */}
            <ProfileHeader 
              name={name}
              role={role}
              experience={experience}
              isEditing={isEditing}
              onEditToggle={() => setIsEditing(!isEditing)}
              onSave={handleHeaderSave}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-1 space-y-6">
                <ContactInfo 
                  email={email}
                  phone={phone}
                  tele={tele}
                />
                <StatisticsCard />
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                <UserProfileSection 
                  bio={bio}
                  setBio={setBio}
                  userProfile={userProfile}
                  onSave={handleProfileSave}
                />
                <ScheduleCalendar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}