import type { Label } from "@/modules/projects/components/label-picker";
import type { iLabel } from "./label.interface";
import type { iMilestone } from "./milestone.interface";
import type { iMember, iTeams } from "./teams.interface";
import type { DocumentItem, IPriority, iProjectHealth } from "./project.interface";
import type { Status } from "./cycle.interface";

export interface iProjectTemplatePayload {
  workspace_id: number;
  descriptive_name: string;
  name: string;
  icon?: {
    icon: string;
    color: string;
    type: "icon" | "emoji";
    file?: File;
  }; // Icon as file
  // lead: any
  description?: string;
  priority?: string;
  status?: string;
  start_date?: string;
  target_date?: string;
  label?: iLabel[];
  member?: iMember[];
  lead_id?: number;
  short_summary?: string;
  milestones?: iMilestone[];
  documents?: File[];
  team_id?: (number | string)[];
}

export interface iProjectTemplateResoponse {
  id: number;
  name: string;
  descriptive_name: string;
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
  members_id?: number[] | null;
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
