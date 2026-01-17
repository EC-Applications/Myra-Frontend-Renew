import type { iLabel, iLabelPayLoad } from "@/interfaces/label.interface";
import { Axios } from "./axios.service";
import type { iResponse } from "@/interfaces/common.interface";
import type { iIssueStatus } from "@/interfaces/issues-status.interface";

export const createLableUri = async (body: iLabelPayLoad) => {
  return Axios.post(`/api/label/store`, body, { responseType: "json" }).then(
    (res) => res.data as iResponse<iLabel[]>
  );
};

export const getLabelListUri = async (workspace_id: number) => {
  return Axios.get(`/api/label/list/${workspace_id}`, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iLabel[]>);
};

export const delelteLabelUri = async (label_id: number) => {
  return Axios.delete(`/api/label/delete/${label_id}`, {
    responseType: "json",
  });
};

export const updateLabelUri = async (label_id: number, body: iLabelPayLoad) => {
  return Axios.post(`/api/label/update/${label_id}`, body, {
    responseType: "json",
  });
};

// ------------------- Isssue Status ------------------
export const fetchissueStatusUri = async () => {
  return Axios.get("/api/issue/status", { responseType: "json" }).then(
    (res) => res.data as iResponse<iIssueStatus[]>
  );
};

