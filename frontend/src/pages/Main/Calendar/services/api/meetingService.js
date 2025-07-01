import axios from "axios";
import API_ROUTES from "../../../../../constant/APIRoutes";

export const meetingService = {
  getMeetings: (userId) => axios.get(API_ROUTES.GET_MEETING(userId)),
  createMeeting: (meetingData) => axios.post(API_ROUTES.CREATE_MEETING, meetingData),
  updateMeeting: (meetingId, meetingData) => axios.put(API_ROUTES.UPDATE_MEETING(meetingId), meetingData),
  deleteMeeting: (meetingId) => axios.delete(API_ROUTES.DELETE_MEETING(meetingId)),
  approveMeeting: (meetingId) => axios.patch(API_ROUTES.APPROVE_MEETING(meetingId))
};