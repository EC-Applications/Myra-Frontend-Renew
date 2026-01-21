import type {
  iCommentPayload,
  iCommentResponse,
  iCommentUpdatePayload,
} from "@/interfaces/comment.interface";
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

export const deleteCommentUri = (
  workspaceSlug: string | number,
  commentId: number,
) => {
  return Axios.delete(
    `/api/${workspaceSlug}/teams/comments/delete/${commentId}`,
    { responseType: "json" },
  );
};

export const upadateCommentUri = async (
  body: Partial<iCommentUpdatePayload>,
  workspaceSlug: string | number,
  commentId: number,
) => {
  const form = new FormData();
  if (body.comment) form.append("body", body.comment.toString());

  if (body.attachments && body.attachments.length > 0) {
    body.attachments.forEach((file) => {
      form.append("attachments[]", file);
    });
  }

  return await Axios.post(
    `/api/${workspaceSlug}/teams/comments/update/${commentId}`,
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  ).then((res) => res.data as iResponse<iCommentResponse>);
};
