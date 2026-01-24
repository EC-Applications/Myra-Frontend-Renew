import type { iUserResponse } from "./auth.interface";

export interface iActivity {
  id: number;
  user_id: number;
  workspace_id: number;
  action: string;
  description: string;
  subject_type: string;
  subject_id: number;
  changes: iChanges[] | null;
  created_at: string;
  updated_at: string;
  user: iUserResponse
}

export interface iChanges {
  id: number;
  name: string;
  color: string;
}
