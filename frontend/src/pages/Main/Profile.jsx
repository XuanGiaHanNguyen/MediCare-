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

  // Mock user profile data - replace with real data from API
  const [userProfile, setUserProfile] = useState({
    education: [
      {
        degree: "Doctor of Medicine (MD)",
        institution: "Harvard Medical School",
        year: "2018",
        specialization: "Internal Medicine"
      }
    ],
    experience: [
      {
        position: "Senior Internal Medicine Physician",
        hospital: "Massachusetts General Hospital",
        duration: "2021 - Present",
        department: "Internal Medicine"
      }
    ]
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
          setExperience(expanded.data.year)
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
      Object = {
        role: role, 
        year: experience 
      }
      const response = await axios.put(API_ROUTES.EDIT_STAFF(Id), Object)
      if (response.status === 200){
        toast.success("Successfully saved changes.")
      } else {
        toast.error("Error saving changes - Please try again later.")
      }

    } catch (error) {
      toast.error(error)
    }
  }

  const handleProfileSave = async (profileData) => {
    try {
      // Update bio
      setBio(profileData.bio);
      
      // Update user profile
      setUserProfile({
        education: profileData.education,
        experience: profileData.experience
      });

      // Here you would typically make an API call to save the data
      // Example:
      // await axios.put(API_ROUTES.UPDATE_STAFF_PROFILE(Id), {
      //   bio: profileData.bio,
      //   education: profileData.education,
      //   experience: profileData.experience
      // });

      console.log("Profile updated successfully");
    } catch (error) {
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