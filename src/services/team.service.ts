import type { iResponse } from "@/interfaces/common.interface";
import { Axios } from "./axios.service";
import type {
  iMemberInviteInTeamsRequest,
  iTeams,
  iTeamsRequest,
  iTeamsResponse,
  updateTeamPayload,
} from "@/interfaces/teams.interface";

export const getTeams = async (workspaceName: string, workspaceId: number) => {
  return Axios.get(`/api/${workspaceName}/teams/${workspaceId}`, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iTeams[]>);
};

export const addTeams = async (payload: iTeamsRequest, iconFile?: File) => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description || "");
  formData.append("workspace_id", String(payload.workspace_id));
  formData.append("identifier", payload.identifier || "");

  // Icon data JSON string ke form mein
  if (payload.icon && typeof payload.icon === "object") {
    const iconData = JSON.stringify({
      icon: payload.icon.icon,
      type: payload.icon.type,
      color: payload.icon.color,
    });
    formData.append("icon", iconData);
  } else if (typeof payload.icon === "string") {
    formData.append("icon", payload.icon);
  }

  // Icon file (agar hai toh)
  if (iconFile) {
    formData.append("icon_file", iconFile);
  }

  return Axios.post(`/api/Testing/teams/store`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const inviteMemberInTeamUri = async (
  workspaceName: string,
  teamId: number,
  payload: iMemberInviteInTeamsRequest,
) => {
  return Axios.post(`/api/${workspaceName}/teams/member/${teamId}`, payload, {
    responseType: "json",
  }).then((res) => res.data as iTeamsResponse);
};

export const removeMemberFromTeamUri = async (
  workspaceName: string,
  teamId: number,
  memberId: number,
) => {
  return Axios.delete(
    `/api/${workspaceName}/teams/member/${teamId}/${memberId}`,
  ).then((res) => res.data as iTeamsResponse);
};

export const removeTeamUri = async (workspaceName: string, teamId: number) => {
  return Axios.delete(`/api/${workspaceName}/teams/delete/${teamId}`).then(
    (res) => res.data as iTeamsResponse,
  );
};

export const updateteamUri = async (
  workspace_slug : string | number,
  team_id: number,
  body: Partial<updateTeamPayload>,
  iconFile?: File,
) => {
  const formData = new FormData();

  if (body.workspace_id)
    formData.append("workspace_id", body.workspace_id.toString());
  if (body.name) formData.append("name", body.name);
  if (body.identifier)
    formData.append("identifier", body.identifier.toString());

  if (body.icon) {
    if (typeof body.icon === "object") {
      const iconData = JSON.stringify({
        icon: body.icon.icon,
        type: body.icon.type,
        color: body.icon.color,
      });
      formData.append("icon", iconData);
    } else if (typeof body.icon === "string") {
      // Icon string hai (old format or URL)
      formData.append("icon", body.icon);
    }
  }

  if (iconFile) {
    console.log("Appending icon file to formData");
    formData.append("icon_file", iconFile);
  }

  return Axios.post(`/api/${workspace_slug}/teams/update/${team_id}`, formData , {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  }).then((res) => res.data as iResponse<iTeams>)
};
