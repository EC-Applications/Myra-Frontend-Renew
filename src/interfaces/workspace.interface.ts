import type { iUserResponse } from "./auth.interface";

export interface iWorkspaceRequest {
  name: string;
  slug: string;
}
export interface iWorkspace {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  url: string;
  is_owner: boolean;
}

export interface iWorkspaceDto extends iWorkspace {
  owner: iUserResponse;
}
export interface iWorkspaceInviteDto {
  id: number;
  workspace_id: number;
  email: string;
  status: string;
  token: string;
  workspace_name: string;
}
export interface iWorkspaceAddResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo? : string;
  owner_id: number;
  settings: any[];
  created_at: string;
  updated_at: string;
  url: string;
  // is_owner : boolean
}
export interface iWorkspaceInviteRequest {
  emails: string[];
  role: "member" | "owner";
}
export interface iWorkspaceInviteResponse {
  workspace_id: number;
  invited_by: number;
  email: string;
  role: string;
  status: string;
  token: string;
  expires_at: string;
  updated_at: string;
  created_at: string;
  id: number;
}

export interface iWorkspaceMember {
  id: number;
  name: string | null;
  email: string;
  role: string;
  is_accept: boolean;
  joined_at: string;
  image? : string
}




export interface  updateWorkspacePayload {
  name? : string | null;
  description? : string | null;
  logo?  : File | null;
  slug?: string | number | null 
}