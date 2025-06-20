import { Search, Calendar, Bell, Menu } from "lucide-react"
import { Link } from "react-router-dom"
import React from "react";
import { useState, useEffect } from "react"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_ROUTES from "../constant/APIRoutes";

const HospitalHeader = (props) => {
  const [staff, setStaff] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState(null)
  const navigate = useNavigate()
  let userId = localStorage.getItem("Id")
 
  useEffect( () => {
      async function Auth (){
        let userId = localStorage.getItem("Id")
        console.log(userId)
        const response = await axios.get(API_ROUTES.GET_USER(userId))
        
        if (response.data.is_staff === false){
            setStaff("Patient")
            setName(response.data.full_name)
            setRole(false)
        }else if(response.data.is_staff === true){
            setStaff("Staff")
            setName(response.data.full_name)
            setRole(true)
        }else{
          toast.error("Cannot fetch UserId")
          navigate("/")
        }
      }

    Auth()
    
  }, []);
  return (
    <header className="bg-sky-800 text-white px-10 py-2 flex items-center justify-between shadow-xl">
      {/* Left side - Logo and Title */}
      <Link to="/" className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">MEDICARE+</h1>
      </Link>

      {/* Center - Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-1 bg-white border-0 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
      </div>

      {/* Right side - Icons and User Profile */}
      <div className="flex items-center gap-4">
        {/* Calendar Icon */}
        <button className="p-2 text-white hover:bg-white/10 rounded-md transition-colors">
          <Calendar className="h-5 w-5" />
        </button>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button className="p-2 text-white hover:bg-white/10 rounded-md transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center border-2 border-sky-800 font-medium">
            1
          </span>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/20" />

        {/* User Profile */}
        <Link to={`/profile/${role ? "staff": "patient"}/${userId}`} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-medium">
            {name.charAt(0)}
          </div>
          <div className="text-sm">
            <div className="font-medium">{name}</div>
            <div className="text-white/80 text-xs">{staff}</div>
          </div>
        </Link>
      </div>
    </header>
  )
}

export default HospitalHeader