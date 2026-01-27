import type { Label } from "@/modules/projects/components/label-picker";
import type { Status } from "./cycle.interface";
import type { iLabel } from "./label.interface";
import type { iMilestone } from "./milestone.interface";
import type { iMember, iTeams } from "./teams.interface";

export interface ProjectMember {
  name: string;
  avatar: string;
}

export interface Project {
  id: number;
  name: string;
  icon: string;
  iconColor: string;
  status: string;
  statusColor: string;
  progress: number;
  dueDate: string;
  priority: string;
  priorityColor: string;
  members: ProjectMember[];
}

export interface IPriority {
  id: number;
  status: string;
  description: string;
  icon: string;
  name?: string;
}

export interface iPojectStatus {
  id: number;
  name: string;
  sub_statuses: ProjectSubStatus;
  color?: string;
  icon?: string 
}

export interface ProjectSubStatus {
  id: number;
  status_id: number;
  name: string;
  description: string;
  icon?: string;
  // icon: React.ReactNode;
}

export interface ProjectCreatePayload {
  status_id: number;
  name: string;
  description: string;
}
export interface ProjectStatusPayload {
  workspace_id: number;
  status_id: number;
  name: string;
  description: string;
}

export interface iProjectStatusUpdatePayload {
  workspace_id?: number;
  name: string;
  status_id: number;
}

export interface iProjectPayload {
  icon?: {
    icon: string;
    color: string;
    type: "icon" | "emoji";
    file?: File;
  }; // Icon as file
  // lead: any
  name: string;
  description?: string;
  priority?: string;
  status?: string;
  start_date?: string;
  target_date?: string;
  workspace_id?: number;
  label?: iLabel[];
  member?: iMember[];
  lead_id?: number;
  short_summary?: string;
  milestones?: iMilestone[];
  documents?: File[];
  team_id?: (number | string)[];
}

export interface iProjectHealth {
  status: string;
  color: string;
  duration: string;
}

export interface iProject {
  id: number;
  name: string;
  description?: string;
  priority?: IPriority;
  priority_id?: number;
  status?: Status;
  status_id?: number;
  start_date?: string;
  target_date?: string;
  workspace_id?: number;
  labels?: Label[] | null;
   labels_id?: number[] | null;
  health?: iProjectHealth[];
  members?: iMember[];
  members_id? : number[] | null;
  lead_id?: number;
  short_summary?: string;
  icon?:
    | {
        icon: string;
        type: "icon" | "emoji";
        color: string;
      }
    | string;
  milestones?: iMilestone[];
  progress: number;
  lead?: iMember | undefined;
  documents: DocumentItem[];
  teams: iTeams[] | undefined;
  team_id: number[] | undefined;
}

export interface DocumentItem {
  id: string;
  doc_name: string;
  doc_type: string;
  file_path: string;
  created_at: string;
}

// ---------- MILESTONE ------------
export interface MileStoneUpdatePayload {
  project_id: number;
  name?: string;
  description: string;
  target_date: string;
}

// export interface MilestoneDeletePayload {
//   project_id: number
// }
