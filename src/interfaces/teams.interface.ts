import type { iCycleResponse } from "./cycle.interface";

export interface iTeamsRequest {
  icon?:
    | {
        icon: string;
        type: "icon" | "emoji";
        color: string;
      }
    | string;
  name: string;
  description: string;
  workspace_id: string | number;
  identifier: string;
}

export interface iTeamsResponse {
  status: string;
  message: string;
}

export interface iTeamsState {
  id: number | string;
  workspace_id: number | string;
  name: string;
}

export interface iTeams {
  id: number | string;
  workspace_id: number | string;
  name: string;
  prefix: string;
  description: string;
  members?: iMember[];
  identifier?: number;
  created_at? : string;
  updated_at? : string;
  timezone: string | null ;
  icon?: iIcon;
  cyclesPeriod?: boolean;
  cycles_period: iCycleResponse;
}

export interface iIcon {
  icon: string;
  color: string;
  type: "icon" | "emoji";
  file: File;
}

export interface iMemberInviteInTeamsRequest {
  email: string;
}

export interface iTeamsMember {
  id: number;
  name: string | null;
  email: string;
  role: string;
  is_accept: boolean;
  joined_at: string;
}

export interface iMember {
  id: number;
  name: string;
  email: string;
  image?: string;
  avatar?: string;
  role?: string;
  is_accept?: boolean;
  pivot?: {
    role: string;
  };
}

export interface updateTeamPayload {
  workspace_id: number;
  name?: string;
  identifier?: string | number;
  icon?:
    | {
        icon: string;
        type: "icon" | "emoji";
        color: string;
      }
    | string;
}
