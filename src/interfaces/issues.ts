import type { iCycleListResponse } from "./cycle.interface";
import type { iIssueStatus } from "./issues-status.interface";
import type { iLabel } from "./label.interface";
import type { iMilestone } from "./milestone.interface";
import type { DocumentItem, IPriority, iProject } from "./project.interface";
import type { iMember, iTeams } from "./teams.interface";
import type { Label } from "@/modules/projects/components/label-picker";

export interface Issue {
  id: string;
  title: string;
  status: "in-review" | "in-progress" | "todo" | "done" | "cancelled";
  priority: "high" | "medium" | "low";
  type: "bug" | "feature" | "development";
  project: string;
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  labels: string[];
  progress?: number;
}

export interface iStatus {
  id: number;
  name: string | null;
  active: number;
}

export interface iIssues {
  id: number;
  key: string;
  issue_id?: number;
  name: string;
  description: string | null;
  workspace_id: number;
  team_id: number;
  status_id: number | null;
  priority_id: number | null;
  project_id: number | null;
  assignee_id: number | null;
  milestone_id: number | null;
  cycle: string | null;
  due_date: string | null;
  is_recurring: boolean;
  recurring_first_due: string | null;
  recurring_repeats_every: number | null;
  recurring_type: string | null;
  external_link: string | null;
  customer_request: string | null;
  sub_issue: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  priority_detail: any | null;
  status: iIssueStatus | null;
  projects: any | null;
  milestones: iMilestone | null;
  labels: iLabel;
  assignee: iMember | null;
  start_date?: string;
  type?: "issue" | "sub_issue";
}

export interface iIussesDetail {
  id: number;
  issue_id?: number;
  issue_key: string;
  name: string;
  description: string | null;
  workspace_id: number;
  team_id: number;
  status_id: number | null;
  priority_id: number | null;
  project_id: number | null;
  assignee_id: number | null;
  milestone_id: number | null;
  cycles: iCycleListResponse | null;
  cycle_id: number | null;
  due_date: Date | null;
  is_recurring: boolean;
  recurring_first_due: string | null;
  recurring_repeats_every: number | null;
  recurring_type: string | null;
  external_link: string | null;
  customer_request: string | null;
  sub_issues: iIssues[] | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  documents: DocumentItem[];
  priority_detail: IPriority;
  status: iIssueStatus;
  projects: iProject | null;
  milestones: iMilestone;
  labels: Label[];
  assignee: iMember;
  team: iTeams;
  parent_issue?: iIussesDetail;
}

export interface iSubIssuePayload {
  name: string;
  team_id: number;
  workspace_id: number;
  description?: string;
  label_id?: number[];
  priority_id?: number;
  assignee_id?: number;
  due_date?: string | null;
  status_id?: number;
  parent_issue_id?: number;
  documents?: File[];
}

// -------------- sub issue delete ----------

export interface iSubIssueDeletePayload {
  issue_id: number;
  sub_issue_ids: number | number[];
}
