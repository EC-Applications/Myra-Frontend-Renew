//  ------------------- Create Sub-issue -------------------

import type {
  iIssues,
  iIussesDetail,
  iSubIssueDeletePayload,
  iSubIssuePayload,
} from "@/interfaces/issues";
import { Axios } from "./axios.service";
import type { iResponse } from "@/interfaces/common.interface";
import type { iIssuePayload } from "@/interfaces/issues.interface";

// services/sub-issue.service.ts
export const createSubIssueUri = async (body: iSubIssuePayload) => {
  const formData = new FormData();

  // Required fields
  formData.append("name", body.name);
  formData.append("team_id", body.team_id.toString());
  formData.append("workspace_id", body.workspace_id.toString());

  // Optional fields
  if (body.description) formData.append("description", body.description);
  if (body.priority_id)
    formData.append("priority_id", body.priority_id.toString());
  if (body.assignee_id)
    formData.append("assignee_id", body.assignee_id.toString());
  if (body.status_id) formData.append("status_id", body.status_id.toString());
  if (body.parent_issue_id)
    formData.append("issue_id", body.parent_issue_id.toString());
  if (body.due_date) formData.append("due_date", body.due_date);

  // Labels - array format
  if (body.label_id && body.label_id.length > 0) {
    body.label_id.forEach((labelId) => {
      formData.append("label_id[]", labelId.toString());
    });
  }

  // Documents/Attachments
  if (body.documents && body.documents.length > 0) {
    body.documents.forEach((file) => {
      formData.append("documents[]", file);
    });
  }

  return Axios.post(`/api/sub-issues/store`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => res.data as iResponse<iIssues>);
};

//----------- FETCH subissues -------------
export const fetchSubIssues = async (issueId: number) => {
  return Axios.get(`/api/sub-issues/list/${issueId}`, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iIssues[]>);
};

// --------------- Delete sub-issue uri -----------

export const deleteSubIssuesUri = async (body: iSubIssueDeletePayload) => {
  return Axios.post(`/api/sub-issues/delete`, body, { responseType: "json" });
};

// --------------- Fetch Subissues detail ----------

export const fetchSubissuesDetailUri = async (subissueId: number) => {
return Axios.get(`/api/sub-issues/detail/${subissueId}`, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iIussesDetail>);
};

//  --------------- Update Sub-issue ----------

export const updateSubIssuesUri = async (
  issueId: number,
  body: Partial<iIssuePayload>,
  newAttachments?: File[] // New files add karne ke liye
) => {
  const formData = new FormData();

  // Basic fields
  if (body.issue_id) formData.append("issue_id", body.issue_id.toString());
  if (body.name) formData.append("name", body.name);
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
      formData.append("label_id[]", JSON.stringify(x))
    );
  }

  // New Attachments
  if (newAttachments && newAttachments.length > 0) {
    newAttachments.forEach((file) => {
      formData.append("documents[]", file);
    });
  }

  return Axios.post(`/api/sub-issues/update/${issueId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => res.data as iResponse<iIssues>);
};

// delete attachment ---

export const deleteSubIssueAttachmentUri = async (
  workspace_id: number,
  subIssueId: number,
  attachmentIds: number[]
) => {
  const formData = new FormData();

  attachmentIds.forEach((id) => {
    formData.append("documents[]", id.toString());
  });

  return Axios.post(
    `/api/workspaces/${workspace_id}/sub-issues/${subIssueId}/delete-attachements`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
