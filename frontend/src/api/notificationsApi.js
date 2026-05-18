import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const getPollingNotification = async () => {
  try {
    const response = await api.get("polling_notifications/");
    return response;
  } catch (e) {
    throw e;
  }
};

export const getUnreadNotifications = async () => {
  try {
    const response = api.get("notifications/");
    return response;
  } catch (e) {
    throw e;
  }
};
