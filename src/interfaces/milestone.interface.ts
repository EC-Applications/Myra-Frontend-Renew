export interface iMilestone {
  id?: number; // server id
  tempId?: string;
  name: string;
  description: string;
  dueDate?: Date;
}

export interface iMilestoneCreatePayload {
  name?: string;
  description?: string;
  target_date?: string;
}

export interface iMilestoneResponse {
  id: number;
  name: string;
  description: string;
  project_id: string;
}
