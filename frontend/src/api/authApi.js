import axios from "axios";
import interceptorApi from "./interceptorApi";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const getLoginUserdata = async () => {
  try {
    const reponse = await interceptorApi.get("/djoser/users/me/");
    return reponse.data;
  } catch (e) {
    throw e;
  }
};

export const loginUser = async (loginCredentials) => {
  try {
    //this is for temporary only as we are now using cookies for tokens, this is just so that it doesn't break dashboard
    const token = await api.post("/auth/jwt/create/", loginCredentials);
    localStorage.setItem("accessToken", token.data.accessToken);
    localStorage.setItem("refreshToken", token.data.refreshToken);
    const user = await getLoginUserdata();
    return user;
  } catch (e) {
    throw e;
  }
};

export const registerUser = async (registerCredentials) => {
  try {
    const response = await api.post("/djoser/users/", registerCredentials);
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/logout/");
    return response;
  } catch (e) {
    throw e;
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await api.post("/djoser/users/reset_password/", { email });
    return response;
  } catch (e) {
    throw e;
  }
};

export const resetPasswordConfirm = async (uid, token, new_password) => {
  try {
    const response = await api.post("/djoser/users/reset_password_confirm/", {
      uid,
      token,
      new_password,
    });
    return response;
  } catch (e) {
    throw e;
  }
};
