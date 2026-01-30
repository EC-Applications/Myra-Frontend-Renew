import type { iResponse } from "@/interfaces/common.interface";
import type {
  iMilestone,
  iMilestoneCreatePayload,
  iMilestoneResponse,
} from "@/interfaces/milestone.interface";
import type {
  iPojectStatus,
  IPriority,
  iProject,
  iProjectPayload,
  iProjectStatusUpdatePayload,
  MileStoneUpdatePayload,
  ProjectStatusPayload,
} from "@/interfaces/project.interface";
import { Axios } from "./axios.service";
import type { iIssues } from "@/interfaces/issues";

export const priorityFetchUri = async () => {
  return Axios.get("/api/priority/list", { responseType: "json" }).then(
    (res) => res.data as iResponse<IPriority[]>
  );
};

export const projectStatusCateogryUri = async (workspaceId:number) => {
  return Axios.get(`/api/status/list/${workspaceId}`, { responseType: "json" }).then(
    (res) => res.data as iResponse<iPojectStatus[]>
  );
};

export const projectStatusCreateUri = async (body: ProjectStatusPayload) => {
  return Axios.post("/api/status/store", body, { responseType: "json" });
};

export const projectStatusDelete = async (sub_status_id: number) => {
  return Axios.delete(`/api/status/delete/${sub_status_id}`, {
    responseType: "json",
  });
};

export const projectStatusUpdate = async (
  parent_status_id: number,
  body: iProjectStatusUpdatePayload
) => {
  return Axios.patch(`api/status/update/${parent_status_id}`, body, {
    responseType: "json",
  });
};

// -------------- Create Project

export const createProjectUri = async (
  body: iProjectPayload,
  iconFile?: File,
  documentFiles?: File[]
) => {
  const formData = new FormData();

  formData.append("name", body.name);
  if (body.description) formData.append("description", body.description);
  if (body.priority) formData.append("priority_id", body.priority);
  if (body.status) formData.append("status_id", body.status);
  if (body.start_date) formData.append("start_date", body.start_date);
  if (body.target_date) formData.append("target_date", body.target_date);
  if (body.workspace_id)
    formData.append("workspace_id", body.workspace_id.toString());
  if (body.team_id)
    body.team_id.forEach((x) =>
      formData.append("team_id[]", JSON.stringify(x))
    );
  if (body.lead_id !== undefined && body.lead_id !== null) {
    formData.append("lead_id", String(body.lead_id));
  }
  if (body.short_summary) formData.append("short_summary", body.short_summary);

  if (body.member && body.member.length > 0) {
    formData.append("member", JSON.stringify(body.member));
  }

  if (body.label) {
    body.label.forEach((x) => formData.append("label_id[]", JSON.stringify(x)));
  }

  if (body.milestones && body.milestones.length > 0) {
    body.milestones.forEach((milestone, index) => {
      (Object.keys(milestone) as (keyof iMilestone)[]).forEach((key) => {
        const value = milestone[key];
        if (value !== undefined && value !== null) {
          formData.append(`milestones[${index}][${key}]`, value.toString());
        }
      });
    });
  }

  if (body.icon) {
    const iconData = JSON.stringify({
      icon: body.icon.icon,
      type: body.icon.type,
      color: body.icon.color,
    });
    formData.append("icon", iconData);
  }

  if (iconFile) {
    // console.log("Appending icon file to formData");
    formData.append("icon_file", iconFile);
  }

  if (documentFiles && documentFiles.length > 0) {
    documentFiles.forEach((file) => {
      formData.append("documents[]", file);
    });
  }

  console.log("📋 FormData entries:");
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  return Axios.post("/api/projects/store", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ----- Project Detail ----------
export const projectDetailFetchUri = async (projectId: number) => {
  return Axios.get(`/api/projects/detail/${projectId}`, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iProject>);
};

// =---------------- FETCH PROJECT ---------------

export const fetchProjectUri = async (workspaceSlug: any) => {
  return Axios.get(`/api/projects/list/${workspaceSlug}`, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iProject[]>);
};

// ------------- DELETE PROJECT -------------

export const deleteProjectUri = async (projectId: number) => {
  return Axios.delete(`/api/projects/delete/${projectId}`, {
    responseType: "json",
  });
};

//  ----- update project --------------
export const updateProjectUri = async (
  projectId: number,
  body: Partial<iProject>,
  iconFile?: File,
  documentFiles?: File[]
) => {
  const formData = new FormData();

  if (body.name) formData.append("name", body.name);
  if (body.short_summary) formData.append("short_summary", body.short_summary);
  if (body.description) formData.append("description", body.description);
  if (body.priority_id) formData.append("priority_id", body.priority_id.toString());
  if (body.status_id) formData.append("status_id", body.status_id.toString());
  if (body.start_date)
    formData.append("start_date", body.start_date.toString());
  if (body.target_date) formData.append("target_date", body.target_date);
  if (body.workspace_id)
    formData.append("workspace_id", body.workspace_id.toString());
  if (body.lead_id) formData.append("lead_id", body.lead_id.toString());

  if (body.team_id && Array.isArray(body.team_id)) {
    body.team_id.forEach((id) => {
      formData.append("team_id[]", id.toString());
    });
  }
  if(body.members_id === null) {
    formData.append("members[]", "");
  }else if(body.members_id && body.members_id?.length > 0 ){
    body.members_id.forEach((x) =>
      formData.append("members[]", JSON.stringify(x)),
    );
  }

  // if(body.members_id && Array.isArray(body.members_id)){
  //   body.members_id.forEach((id)=>{
  //     formData.append("members[]", id.toString())
  //   })
  // }

  // Handle labels - send empty string to clear, or array of IDs
  if (body.labels_id === null) {
    formData.append("label_id[]", "");
  } else if (body.labels_id && Array.isArray(body.labels_id) && body.labels_id.length > 0) {
    body.labels_id.forEach((labelId) => {
      formData.append("label_id[]", labelId.toString());
    });
  }

  if (body.milestones && Array.isArray(body.milestones)) {
    formData.append("milestones", JSON.stringify(body.milestones));
  }

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

  if (documentFiles && documentFiles.length > 0) {
    documentFiles.forEach((file) => {
      formData.append("documents[]", file);
    });
  }

  return Axios.post(`/api/projects/update/${projectId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => res.data as iResponse<iProject>);
};

// fetch [project by id ]
export const fetchProjectById = async (
  workspaceId: number | undefined,
  teamId: number
) => {
  return Axios.get(
    `/api/workspaces/${workspaceId}/teams/${teamId}/projects`
  ).then((res) => res.data as iResponse<iProject[]>);
};

//  --------------- milestones APi
export const mileStoneUpdateUri = async (
  milestoneId: number | undefined,
  body: MileStoneUpdatePayload
) => {
  return Axios.patch(`/api/milestone/update/${milestoneId}`, body, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iMilestone>);
};

export const deleteMilestoneUri = async (milestoneId: number) => {
  return Axios.delete(`/api/milestone/delete/${milestoneId}`, {
    responseType: "json",
  });
};

export const milesoneCreateUri = async (body: iMilestoneCreatePayload) => {
  return Axios.post("/api/milestone/store", body).then(
    (res) => res.data as iResponse<iMilestoneResponse>
  );
};

// fetch milestone according to id

export const fetchMilestoneByProjectId = async (projectId: number) => {
  return Axios.get(`/api/projects/${projectId}/milestones`, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iMilestone[]>);
};

// delete attachment--------------------

export const deleteProjectAttachmentUri = async (
  workspace_id: number,
  projectId: number,
  attachmentIds: number[]
) => {
  const formData = new FormData();

  // Attachment IDs ko formData mein add karo
  attachmentIds.forEach((id) => {
    formData.append("documents[]", id.toString());
  });

  return Axios.post(
    `/api/workspaces/${workspace_id}/projects/${projectId}/delete-attachements`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// Issues against project 

export const fetchProjectIssueUri = async (projectId : number) => {
  return Axios.get(`/api/projects/${projectId}/issues`)
  .then((res)=> res.data as iResponse<iIssues[]>)
}