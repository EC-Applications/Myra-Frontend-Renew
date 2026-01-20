import type { iResponse } from "@/interfaces/common.interface";
import type {
  iWorkspace,
  iWorkspaceAddResponse,
  iWorkspaceInviteRequest,
  iWorkspaceInviteResponse,
  iWorkspaceMember,
  iWorkspaceRequest,
} from "@/interfaces/workspace.interface";
import { format } from "date-fns";
import { Axios } from "./axios.service";

export const addWorkspace = async (payload: iWorkspaceRequest) => {
  return await Axios.post("/api/workspaces/store", payload, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iWorkspaceAddResponse>);
};

export const checkExistingSlug = async (slug: string) => {
  return await Axios.get(`/api/workspaces/${slug}/check-slug-exist`, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iWorkspace | null>);
};
export const workspaceInvite = async (
  slug: string,
  workspace: number,
  payload: iWorkspaceInviteRequest
) => {
  const formData = new FormData();
  formData.append("role", payload.role);

  payload.emails.forEach((email) => {
    formData.append("email[]", email);
  });

  return await Axios.post<iResponse<iWorkspaceInviteResponse>>(
    `/api/workspaces/${slug}/${workspace}/invite`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  ).then((res) => res.data);
};

export const acceptInvite = async (token: string) => {
  return await Axios.post(`/api/workspaces/invitations/${token}/accept`, null, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iWorkspace>);
};

export const getMembers = async (slug: string, workspace: number) => {
  return await Axios.get(`/api/workspaces/${slug}/${workspace}`)
    .then((res) => res.data as iResponse<iWorkspaceMember[]>)
    .then((res) => ({
      ...res,
      data: res.data.map((x) => ({
        ...x,
        joined_at: format(x.joined_at, "MMM d"),
      })),
    }));
};


export const removeWorkspaceMemeber = async (workspaceId: number | undefined, memeberId: number | undefined) => {
  return Axios.delete(`/api/workspaces/${workspaceId}/members/${memeberId}`)
    .then((res) => res.data as iResponse<iWorkspaceMember[]>)
}