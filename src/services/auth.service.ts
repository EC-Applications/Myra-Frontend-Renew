import type {
  iLoginRequest,
  iLoginResponse,
  iOtpRequest,
} from "@/interfaces/auth.interface";
import type { iResponse } from "@/interfaces/common.interface";
import { Axios } from "./axios.service";

export const login = async (payload: iLoginRequest) => {
  return Axios.post("/api/auth/email", payload, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iLoginResponse>);
};

export const verifyCode = async (payload: iOtpRequest) => {
  return Axios.post("/api/auth/verify-code", payload, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iLoginResponse>);
};

export const logout = async () => {
  return await Axios.post("/api/auth/logout", null, {
    responseType: "json",
  }).then((res) => res.data);
};


// MEEE 

export const userProfileUri = async () => {
  return Axios.get(`/api/auth/me`)
  .then((res)=> res.data as iResponse<iLoginResponse>)
}

