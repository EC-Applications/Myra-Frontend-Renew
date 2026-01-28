// import type { iStatus } from "./issues";
import type { iUserResponse } from "./auth.interface";
import type { iLabel } from "./label.interface";
import type { iMilestone } from "./milestone.interface";
import type { iMember } from "./teams.interface";

// types/issue.interface.ts
export interface iIssuePayload {
  name: string;
  description?: string;
  team_id: number;
  workspace_id: number;
  status_id: number;
  priority_id?: number;
  project_id?: number | null;
  assignee_id?: number;
  labels?: number[] | null;
  due_date?: string | null;
  external_link?: string;
  attachments?: File[];
  issue_id?: number;
  cycle_id?: number | null;
}

export interface iIssuesLabelPayload {
  workspace_id?: number;
  name?: string | null;
  description?: string | null;
  color?: string;
  label_group_name?: string | null;
  label_group_description?: string | null;
}

export interface iIssuesLabel {
  id: number;
  workspace_id: number;
  label_group_id?: number;
  label_group_name?: string;
  name: string;
  description: string;
  color: string;
  created_at?: string;
}



// export interface iStatus {
//     id: number;
//     name: String | null;
//     active: number

// }

// export interface iIssues {
//     id: number;
//     issue_key: string;
//     name: string;
//     description: string | null;
//     workspace_id: number;
//     team_id: number;
//     status_id: number | null;
//     priority_id: number | null;
//     project_id: number | null;
//     assignee_id: number | null;
//     milestone_id: number | null;
//     cycle: string | null;
//     due_date: string | null;
//     is_recurring: boolean;
//     recurring_first_due: string | null;
//     recurring_repeats_every: number | null;
//     recurring_type: string | null;
//     external_link: string | null;
//     customer_request: string | null;
//     sub_issue: string | null;
//     deleted_at: string | null;
//     created_at: string;
//     updated_at: string;
//     priority_detail: any | null;
//     statuses: iStatus | null;
//     projects: any | null;
//     milestones: iMilestone | null;
//     labels: iLabel;
//     assignee: iMember | null;
// }
