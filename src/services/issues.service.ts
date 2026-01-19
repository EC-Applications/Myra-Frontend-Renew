import type {
  iCommentPayload,
  iCommentResponse,
  iIssuePayload,
  iIssuesLabel,
  iIssuesLabelPayload,
} from "@/interfaces/issues.interface";
import { Axios } from "./axios.service";
import type { iResponse } from "@/interfaces/common.interface";
import type {
  iIssues,
  iIussesDetail,
  iSubIssuePayload,
} from "@/interfaces/issues";
import type { iLabelPayLoad } from "@/interfaces/label.interface";
// import type { iIssues } from "@/interfaces/issues"

// services/issue.service.ts
export const createIssuesUri = (body: iIssuePayload) => {
  const formData = new FormData();

  formData.append("name", body.name);
  if (body.description) formData.append("description", body.description);
  formData.append("team_id", body.team_id.toString());
  formData.append("workspace_id", body.workspace_id.toString());
  formData.append("status_id", body.status_id.toString());
  if (body.cycle_id) formData.append("cycle_id", body.cycle_id.toString());

  if (body.priority_id)
    formData.append("priority_id", body.priority_id.toString());
  if (body.project_id)
    formData.append("project_id", body.project_id.toString());
  if (body.assignee_id)
    formData.append("assignee_id", body.assignee_id.toString());
  if (body.due_date) formData.append("due_date", body.due_date);
  if (body.external_link) formData.append("external_link", body.external_link);

  // Labels
  if (body.labels) {
    body.labels.forEach((x) =>
      formData.append("label_id[]", JSON.stringify(x)),
    );
  }

  // Attachments
  if (body.attachments && body.attachments.length > 0) {
    body.attachments.forEach((file) => {
      formData.append("documents[]", file);
    });
  }

  return Axios.post("/api/issues/store", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchIssuesUri = async (workspaceId: number, teamId: number) => {
  return Axios.get(`api/issues/list/${workspaceId}?team=${teamId}`).then(
    (res) => res.data as iResponse<iIssues[]>,
  );
};

// ------------------- Update Issue -------------------

export const updateIssuesUri = async (
  issueId: number,
  body: Partial<iIssuePayload>,
  newAttachments?: File[], // New files add karne ke liye
) => {
  const formData = new FormData();

  // Basic fields
  if (body.name) formData.append("name", body.name);
  if (body.description) formData.append("description", body.description);
  if (body.team_id) formData.append("team_id", body.team_id.toString());
  if (body.workspace_id)
    formData.append("workspace_id", body.workspace_id.toString());
  if (body.status_id) formData.append("status_id", body.status_id.toString());
  if (body.priority_id)
    formData.append("priority_id", body.priority_id.toString());
  if (body.project_id)
    formData.append("project_id", body.project_id.toString());
  if (body.assignee_id)
    formData.append("assignee_id", body.assignee_id.toString());
  if (body.due_date) formData.append("due_date", body.due_date);
  if (body.external_link) formData.append("external_link", body.external_link);

  if (body.labels) {
    body.labels.forEach((x) =>
      formData.append("label_id[]", JSON.stringify(x)),
    );
  }

  // New Attachments
  if (newAttachments && newAttachments.length > 0) {
    newAttachments.forEach((file) => {
      formData.append("documents[]", file);
    });
  }

  return Axios.post(`/api/issues/update/${issueId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => res.data as iResponse<iIssues>);
};

//  isssue

export const createIssueLabels = async (body: iIssuesLabelPayload) => {
  return Axios.post("/api/issue-labels/store", body, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iIssuesLabelPayload[]>);
};

export const getIssuesLabelListUri = async (
  workpsaceId: number | undefined,
) => {
  return Axios.get(`/api/issue-labels/list/${workpsaceId}`).then(
    (res) => res.data as iResponse<iIssuesLabel[]>,
  );
};

export const deleteIssueUri = async (issueId: number) => {
  return Axios.delete(`/api/issues/delete/${issueId}`);
};

//  ------------------- Issue Detail -------------------

export const issueDetailUri = async (issueId: number) => {
  return Axios.get(`/api/issues/detail/${issueId}`).then(
    (res) => res.data as iResponse<iIussesDetail>,
  );
};

export const deleteIssueAttachmentUri = async (
  workspace_id: number,
  issueId: number,
  attachmentIds: number[],
) => {
  const formData = new FormData();

  attachmentIds.forEach((id) => {
    formData.append("documents[]", id.toString());
  });

  return Axios.post(
    `/api/workspaces/${workspace_id}/issues/${issueId}/delete-attachements`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

//  label ---------

export const delelteIssueLabelUri = async (label_id: number) => {
  return Axios.delete(`/api/issue-labels/delete/${label_id}`, {
    responseType: "json",
  });
};

// --------------- LABEL UPDATE ---------------
export const updateIssueLabelUri = async (
  label_id: number,
  body: iLabelPayLoad,
) => {
  return Axios.post(`/api/issue-labels/update/${label_id}`, body, {
    responseType: "json",
  });
};

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
