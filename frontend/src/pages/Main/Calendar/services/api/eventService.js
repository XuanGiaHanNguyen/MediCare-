import axios from "axios";
import API_ROUTES from "../../../../../constant/APIRoutes";

import {appointmentService} from "./appointmentService"
import { meetingService } from "./meetingService";
import { userService } from "./userService";
import { transformEventData } from "../../utils/eventUtils";

export const fetchAllEvents = async (userId) => {
  try {
    const [appointmentsResponse, meetingsResponse] = await Promise.all([
      appointmentService.getAppointments(userId),
      meetingService.getMeetings(userId)
    ]);

    const appointments = appointmentsResponse.data || [];
    const meetings = meetingsResponse.data || [];

    const combinedEvents = {};
    const userCache = {};

    const getUserName = async (userId) => {
      if (userCache[userId]) return userCache[userId];
      const user = await userService.getUser(userId);
      const name = user.data?.full_name || "Unknown";
      userCache[userId] = name;
      return name;
    };

    // Process appointments
    const transformedAppointments = await Promise.all(
      appointments.map(async (appt) => {
        const userName = await getUserName(appt.userId);
        return transformEventData(appt, "appointment", "bg-blue-500", userName, userId);
      })
    );

    // Process meetings
    const transformedMeetings = await Promise.all(
      meetings.map(async (meet) => {
        const userName = await getUserName(meet.userId);
        return transformEventData(meet, "meeting", "bg-green-500", userName, userId);
      })
    );

    // Group events by date
    [...transformedAppointments, ...transformedMeetings].forEach(event => {
      const eventDate = event.date;
      if (!combinedEvents[eventDate]) {
        combinedEvents[eventDate] = [];
      }
      combinedEvents[eventDate].push(event);
    });

    // Sort by time within each date group
    Object.keys(combinedEvents).forEach(date => {
      combinedEvents[date].sort((a, b) => a.time.localeCompare(b.time));
    });

    return combinedEvents;

  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Save Event 
export const saveEvent = async (eventData, userId) => {
  try {
    const { attendees, id, ...eventToStore } = eventData;

    const modifiedEvent = {
      ...eventToStore,
      userId,
      approved: false
    };

    if (modifiedEvent.type === "appointment") {
      const { type, ...saveObject } = modifiedEvent;

      const userToNotify = saveObject.participants.map(object => object.userId)
      console.log(userToNotify)

     for (const item of userToNotify) {

        const requestData = {
          userId: item,
          type: "scheduled_appointment",
          title: `An appointment has been scheduled`,
          message: `You have been added to a scheduled appointment on ${new Date(saveObject.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Please check your calendar to approve it.`,
          isRead: false,
          createdAt: new Date()
        }

        await axios.post(API_ROUTES.CREATE_REQUEST, requestData)

      }

      console.log(saveObject)
      const response = await appointmentService.createAppointment(saveObject);
      return response.status === 200;

    } else if (modifiedEvent.type === "meeting") {
      const { type, ...saveObject } = modifiedEvent;

      const userToNotify = saveObject.participants.map(object => object.userId)

      for (const item of userToNotify) {
          const requestData = {
            userId: item,
            type: "scheduled_meeting",
            title: `A meeting has been scheduled`,
            message: `You have been added to a scheduled meeting on ${new Date(saveObject.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Please check your calendar to approve it.`,
            isRead: false,
            createdAt: new Date()
          }

          await axios.post(API_ROUTES.CREATE_REQUEST, requestData)

        }

      console.log(saveObject)
      const response = await meetingService.createMeeting(saveObject);
      return response.status === 200;
    }

    return false;
  } catch (error) {
    console.error('Error saving event:', error);
    throw error;
  }
};
