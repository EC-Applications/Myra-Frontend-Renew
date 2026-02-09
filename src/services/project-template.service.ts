import type {
  iProjectTemplatePayload,
  iProjectTemplateResoponse,
} from "@/interfaces/project-template.interface";
import { Axios } from "./axios.service";
import type { iMilestone } from "@/interfaces/milestone.interface";
import type { iResponse } from "@/interfaces/common.interface";

export const createProjectTemplateUri = (
  body: iProjectTemplatePayload,
  documentFiles?: File[],
  iconFile?: File,
) => {
  const formData = new FormData();
  if (body.descriptive_name)
    formData.append("descriptive_name", body.descriptive_name);
  if (body.name) formData.append("name", body.name);
  if (body.description) formData.append("description", body.description);
  if (body.priority) formData.append("priority_id", body.priority);
  if (body.status) formData.append("status_id", body.status);
  if (body.start_date) formData.append("start_date", body.start_date);
  if (body.target_date) formData.append("target_date", body.target_date);
  if (body.workspace_id)
    formData.append("workspace_id", body.workspace_id.toString());
  if (body.team_id)
    body.team_id.forEach((x) =>
      formData.append("team_id[]", JSON.stringify(x)),
    );
  if (body.lead_id !== undefined && body.lead_id !== null) {
    formData.append("lead_id", String(body.lead_id));
  }
  if (body.short_summary) formData.append("short_summary", body.short_summary);

  if (body.member && body.member.length > 0) {
    body.member.forEach((x) =>
      formData.append("members[]", JSON.stringify(x.id)),
    );
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

  // console.log("📋 FormData entries:");
  // for (const pair of formData.entries()) {
    // console.log(pair[0], pair[1]);
  // }

  return Axios.post("/api/projects/template/store", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const projectTemplateListUri = async (workspace_id: number) => {
  return Axios.get(`/api/projects/template/list/${workspace_id}`, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iProjectTemplateResoponse[]>);
};

export const fetchProjectTemplateDetailUri = async (id: number) => {
  return Axios.get(`api/projects/template/detail/${id}`, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iProjectTemplateResoponse>);
};

export const updateProjectTemplateUri = async (
  id: number,
  body: iProjectTemplatePayload,
  documentFiles?: File[],
  iconFile?: File,
) => {
  const formData = new FormData();
  if (body.descriptive_name)
    formData.append("descriptive_name", body.descriptive_name);
  if (body.name) formData.append("name", body.name);
  if (body.description) formData.append("description", body.description);
  if (body.priority) formData.append("priority_id", body.priority);
  if (body.status) formData.append("status_id", body.status);
  if (body.start_date) formData.append("start_date", body.start_date);
  if (body.target_date) formData.append("target_date", body.target_date);
  if (body.workspace_id)
    formData.append("workspace_id", body.workspace_id.toString());
  if (body.team_id)
    body.team_id.forEach((x) =>
      formData.append("team_id[]", JSON.stringify(x)),
    );
  if (body.lead_id !== undefined && body.lead_id !== null) {
    formData.append("lead_id", String(body.lead_id));
  }
  if (body.short_summary) formData.append("short_summary", body.short_summary);

  if (body.member && body.member.length > 0) {
    body.member.forEach((x) =>
      formData.append("members[]", JSON.stringify(x.id)),
    );
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

  // console.log("📋 FormData entries:");
  // for (const pair of formData.entries()) {
  //   console.log(pair[0], pair[1]);
  // }

  return Axios.post(`/api/projects/template/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const deleteProjectTemplateUri = async (id: number) => {
  return Axios.delete(`/api/projects/template/delete/${id}`, {responseType:"json"})              
}