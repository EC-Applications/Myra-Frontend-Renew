import { baseUrl } from "@/constants";
import { logout } from "@/store/slices/auth.slice";
import { store } from "@/store/store";
import axios from "axios";

export const Axios = axios.create({
  baseURL: `${baseUrl}`,
  headers: {
    "Content-Type": "application/json",
  },
});
Axios.interceptors.request.use((config) => {
  const auth = store.getState().auth;
  const token = auth.tokens[auth.currentUser];
  // console.log("TOKEN", token)

  config.headers.Accept = "application/json";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(err.response.data);
  }
);
