export interface iCommentPayload {
  commentable_type: "issue" | "subissue";
  commentable_id: number;
  parent_id: number | null;
  body: String;
}

export interface iAuthor {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  microsoft_id?: string;
  github_id?: string;
  email_verified_at?: string;
  timezone?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface iCommentResponse {
  parent_id: number;
  body: string;
  user_id: number;
  commentable_id: number;
  commentable_type: string;
  updated_at: string;
  created_at: string;
  id: number;
  author: iAuthor;
  replies?: iCommentResponse[]
  // author : string
}