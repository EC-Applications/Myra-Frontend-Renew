import type { iCommentPayload, iCommentResponse } from "@/interfaces/issues.interface";
import { Axios } from "./axios.service";
import type { iResponse } from "@/interfaces/common.interface";

export const postCommentUri = async (body: Partial<iCommentPayload>) => {
  return Axios.post(`/api/reyan-workspace/teams/comments/store`, body, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iCommentResponse>);
};

export const getCommentsUri = async (
  workspaceSlug: string | number,
  issueId: number,
) => {
  return Axios.get(`/api/${workspaceSlug}/teams/comments/list/${issueId}`, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iCommentResponse[]>);
};
