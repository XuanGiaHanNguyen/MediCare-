import { Search, Calendar, Bell, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import React from "react";
import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_ROUTES from "../constant/APIRoutes";
import { formatDistanceToNow } from 'date-fns'

const HospitalHeader = (props) => {
  const [staff, setStaff] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState(null)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  
  const navigate = useNavigate()
  const notificationRef = useRef(null)
  let userId = localStorage.getItem("Id")

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
 
  useEffect(() => {
    async function Auth() {
      let userId = localStorage.getItem("Id")
      if (!userId) {
        toast.error("User ID not found. Please log in again");
        navigate("/");
        return;
      }
      
      try {
        const response = await axios.get(API_ROUTES.GET_USER(userId))
        
        if (response.data.is_staff === false) {
          setStaff("Patient")
          setName(response.data.full_name)
          setRole(false)
        } else if (response.data.is_staff === true) {
          setStaff("Staff")
          setName(response.data.full_name)
          setRole(true)
        } else {
          toast.error("Cannot fetch UserId")
          navigate("/")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Error fetching user data")
        navigate("/")
      }
    }

    Auth()
  }, [navigate]);

  
  useEffect(() => {
  async function getData() {
    let userId = localStorage.getItem("Id")
    if (!userId) {
      toast.error("User ID not found. Please log in again");
      navigate("/");
      return;
    }
    
    // Don't proceed if staff role hasn't been determined yet
    if (!staff) {
      return;
    }
    
    try {
      let response;
      response = await axios.get(API_ROUTES.GET_REQUEST(userId))
      const notifications = response.data 

      let notificationsData = []
  
      if (Array.isArray(response.data)) {
        // Filter array to only include notifications where seen is false
        notificationsData = response.data.filter(notification => notification.isRead === false)
      } else if (response.data && typeof response.data === 'object') {
        if (response.data.isRead === false) {
          notificationsData = [response.data]
        }
      } else {
        notificationsData = []
      }
      
      console.log("Filtered notifications (unseen only):", notificationsData)
      setNotifications(notificationsData)

    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Failed to fetch notifications")
    }
  }
  
  getData()
}, [staff, navigate]) // Add staff to dependency array


  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen)
  }

  const handleCloseNotifications = async () => {
    try {
      // Get all unread notification IDs
      const unreadNotificationIds = notifications
        .filter(notif => !notif.isRead)
        .map(notif => notif._id);

      setIsNotificationOpen(false);

      if (unreadNotificationIds.length > 0) {
        if (staff === "Staff"){
          await axios.put(API_ROUTES.SEEN_REQUEST_STAFF(userId));

          // Update local state after successful API call
          setNotifications(prev => 
            prev.map(notif => ({ ...notif, isRead: true }))
          );

        }else if ( staff === "Patient"){
          await axios.put(API_ROUTES.SEEN_REQUEST(userId));

          // Update local state after successful API call
          setNotifications(prev => 
            prev.map(notif => ({ ...notif, isRead: true }))
          );

        }else{
          toast.error("Error occured while closing tab")
        }
      }
      
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };


  // Safe filter with fallback to empty array
  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter(notif => !notif.isRead).length 
    : 0

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
        <button onClick={(e)=> navigate(`/calendar/${role ? "staff": "patient"}/${userId}`)} className="p-2 text-white hover:bg-white/10 rounded-md transition-colors">
          <Calendar className="h-5 w-5" />
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={toggleNotifications}
            className="p-2 text-white hover:bg-white/10 rounded-md transition-colors relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center border-2 border-sky-800 font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-full mt-3 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCloseNotifications}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-96 overflow-y-auto">
                {!Array.isArray(notifications) || notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-md font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                             {notification.title} 
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDistanceToNow(new Date(notification.createdAt), {addSuffix: true})}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {Array.isArray(notifications) && notifications.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200">
                  <button className="w-full text-sm text-sky-600 hover:text-sky-700 font-medium">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
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