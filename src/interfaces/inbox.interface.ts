export interface iInboxResponse {
  id: number;
  user_id: number;
  actor_id: number;
  actor: string;
  actor_avatar: string | null;
  issue_key: string;
  meta: {
    message : string | null
  }
  due_status: string | null;
  notifiable: iNotifiable;
  type: string;
  is_read: boolean;
  created_at: string | null;
}

export interface iNotifiable {
  id: number;
  name: string;
  type: string;
  status: string;
  due_date: string | null;
  due_status: string | null;
}
