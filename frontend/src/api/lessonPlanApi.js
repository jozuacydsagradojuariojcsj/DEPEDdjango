import axios from "axios";
import api from "./interceptorApi";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_BASE_URL,
//   withCredentials: true,
// });

export const getLessonPlan = async (params) => {
  try {
    const response = await api.get("/lessonplan/", {
      params,
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const submitLessonPlan = async (lessonPlan, quarter) => {
  const formData = new FormData();
  formData.append("lesson_plan", lessonPlan);
  formData.append("quarter", quarter);
  try {
    const response = await api.post("/lessonplan/", formData);
    return response;
  } catch (e) {
    throw e;
  }
};

export const reviewLessonPlan = async (lessonplanID, status, feedBack) => {
  try {
    const response = await api.patch(`/reviewlessonplan/${lessonplanID}/`, {
      status: status,
      feedback: feedBack,
    });
    console.log("Response Data:", response.data);
    return response;
  } catch (e) {
    console.log("Error:", e);
    throw e;
  }
};
