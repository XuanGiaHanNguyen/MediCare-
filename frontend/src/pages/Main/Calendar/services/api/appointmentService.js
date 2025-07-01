import axios from "axios";
import API_ROUTES from "../../../../../constant/APIRoutes";

export const appointmentService = {
  getAppointments: (userId) => axios.get(API_ROUTES.GET_APPOINTMENT(userId)),
  createAppointment: (appointmentData) => axios.post(API_ROUTES.CREATE_APPOINTMENT, appointmentData),
  updateAppointment: (appointmentId, appointmentData) => axios.put(API_ROUTES.UPDATE_APPOINTMENT(appointmentId), appointmentData),
  deleteAppointment: (appointmentId) => axios.delete(API_ROUTES.DELETE_APPOINTMENT(appointmentId)),
  approveAppointment: (appointmentId) => axios.patch(API_ROUTES.APPROVE_APPOINTMENT(appointmentId))
};