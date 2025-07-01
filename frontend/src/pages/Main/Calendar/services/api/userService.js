import axios from "axios";
import API_ROUTES from "../../../../../constant/APIRoutes";

export const userService = {
  getUser: (userId) => axios.get(API_ROUTES.GET_USER(userId)),
  getUserProfile: (userId) => axios.get(API_ROUTES.GET_USER_PROFILE(userId)),
  updateUser: (userId, userData) => axios.put(API_ROUTES.UPDATE_USER(userId), userData)
};