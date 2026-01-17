import type { iWorkspaceInviteDto, iWorkspace } from "./workspace.interface";

export interface iLoginRequest {
  email: string;
}
export interface iLoginResponse {
  token: string;
  user: iUserResponse;
}
export interface iUserResponse {
  id: number;
  name: string;
  email: string;
  owned_workspaces: iWorkspace[];
  invites_workspaces: iWorkspaceInviteDto[];
}
export interface iAuthState {
  currentUser: number;
  currentWorkspace: number;
  currentWorkspaceName: string;
  users: iUserState;
  tokens: iTokenState;
}
export interface iUserState {
  [id: number]: iUserResponse;
}
export interface iTokenState {
  [id: number]: string;
}
export interface iSwitchWorkspace {
  userId?: number;
  workspaceId: number;
  workspaceName: string;
}
