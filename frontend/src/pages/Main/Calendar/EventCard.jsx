// Figuring Gooogle Calendar Parse 
import React from "react";
import { Clock, Users, MapPin } from "lucide-react";
import { formatTime, formatDuration } from "./utils/dateUtils"

import API_ROUTES from "../../../constant/APIRoutes";
import axios from "axios";
import toast from "react-hot-toast"

export default function EventCard({ event, userId, onRefreshEvents }) {

  const handleApproveEvent = async () => {
    // TODO: Implement approve event functionality
    console.log('Approving event:', event._id);
    if (event.color === "bg-amber-500"){
      const approving = await axios.put(API_ROUTES.APPROVE_MEETING(event._id))
      if (approving.status === 200){
        toast.success(`${event.title} have been approved`)

        console.log(event)

        const userToNotify = event.participants.map(object => object.userId)
        const ownerToNotify = event.userId
        userToNotify.push(ownerToNotify)

        console.log(userToNotify)

        for (const item of userToNotify) {
            const requestData = {
              userId: item,
              type: "approved_appointment",
              title: `An appointment has been approved`,
              message: `One of your appointment on ${new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} have been approved. Please check your calendar for more details.`,
              isRead: false,
              createdAt: new Date()
            }
            await axios.post(API_ROUTES.CREATE_REQUEST, requestData)
        } 
        
        // Include owner's email in Google notifications
        const googleNotify = event.participants.map(object => ({ email: object.email, userId: object.userId }))
        
        // Add owner's email and userId to Google notifications
        // Assuming you have access to owner's email - you might need to fetch it or have it in the event object
        const owerInfo = await axios.get(API_ROUTES.GET_USER(ownerToNotify))
        const ownerEmail = owerInfo.data.email 
        googleNotify.push({ email: ownerEmail, userId: event.userId })

        console.log(googleNotify)
        
        for (const item of googleNotify){
          const eventData = {
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            duration: event.duration,
            location: event.session== "online"? event.link : event.location,
            participants: googleNotify.map(p => p.email), // Extract emails for participants
            session: event.session
          };

          console.log(eventData)
          const participantIds = googleNotify.map(p => p.userId)

          await axios.post(API_ROUTES.CREATE_GOOGLE_EVENT(participantIds), eventData)
        }

      } else {
        toast.error("There was an error in the process. Please try again.")
      }
    } else if (event.color === "bg-cyan-500"){
      const approving = await axios.put(API_ROUTES.APPROVE_APPOINTMENT(event._id))
      if (approving.status === 200){
        toast.success(`${event.title} have been approved`)

        const userToNotify = event.participants.map(object => object.userId)
        const ownerToNotify = event.userId
        userToNotify.push(ownerToNotify)

        console.log(userToNotify)

        for (const item of userToNotify) {
            const requestData = {
              userId: item,
              type: "approved_appointment",
              title: `An appointment has been approved`,
              message: `One of your appointment on ${new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} have been approved. Please check your calendar for more details.`,
              isRead: false,
              createdAt: new Date()
            }
            await axios.post(API_ROUTES.CREATE_REQUEST, requestData)
        }
        
        // Include owner's email in Google notifications for appointments too
        const googleNotify = event.participants.map(object => ({ email: object.email, userId: object.userId }))
        
        const owerInfo = await axios.get(API_ROUTES.GET_USER(ownerToNotify))
        const ownerEmail = owerInfo.data.email 
        googleNotify.push({ email: ownerEmail, userId: event.userId })
        
        for (const item of googleNotify){
          const eventData = {
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            duration: event.duration,
            location: event.session== "online"? event.link : event.location,
            participants: googleNotify.map(p => p.email), // Extract emails for participants
            session: event.session
          };

          console.log(eventData)
          const participantIds = googleNotify.map(p => p.userId)

          await axios.post(API_ROUTES.CREATE_GOOGLE_EVENT(participantIds), eventData)
        }
        
      } else {
        toast.error("There was an error in the process. Please try again.")
      }
    }
    onRefreshEvents();
  };

  const handleJoinMeeting = () => {
    console.log(event)
    if (event.link) {
      window.open(event.link, '_blank');
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${event.color}`}></div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col mb-2">
          <div className="text-sm font-medium text-gray-900 truncate">
            {event.title}
            {!event.approved && <span className="ml-1">(Scheduled)</span>}
          </div>
          <div className="text-xs flex mt-1">
            <div className="text-xs px-2 rounded-full bg-gray-300 text-gray-700">
              {event.session} meeting
            </div>
          </div>
        </div>
        
        {/* Time and Duration */}
        <div className="text-xs text-gray-500 mt-3 mb-1 flex flex-row">
          <Clock className="w-4 h-4 mr-1"/>
          {formatTime(event.time)} • {formatDuration(event.duration)}
        </div>
        
        {/* User */}
        <div className="flex flex-row my-1">
          <Users className="w-4 h-4 mr-1 text-gray-500"/>
          {event.user && (
            <div className="text-xs text-gray-500 truncate">{event.user}</div>
          )}
        </div>

        {/* Location */}
        <div className="flex flex-row my-1">
          <MapPin className="w-4 h-4 mr-1 text-gray-500"/>
          {event.location && (
            <div className="text-xs text-gray-500 truncate">{event.location}</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col mt-3 gap-1">
          {/* Approve Session Button */}
          {event.approved === false && event.approval === true && (
            <button 
              onClick={handleApproveEvent}
              className="text-xs py-1 text-white font-medium rounded-md bg-gray-400 hover:bg-gray-500 transition-colors"
            >
              Approve Session
            </button>
          )}

          {/* Join Meeting Button */}
          {event.approved === true && event.session === "online" && (
            <button 
              onClick={handleJoinMeeting}
              className={`text-xs py-1 text-white font-medium rounded-md ${
                event.color === "bg-cyan-500" ? "bg-sky-400 hover:bg-sky-600" : "bg-yellow-500 hover:bg-yellow-600"
              } transition-colors`}
            >
              Join Meeting
            </button>
          )}
        </div>
      </div>
    </div>
  );
}