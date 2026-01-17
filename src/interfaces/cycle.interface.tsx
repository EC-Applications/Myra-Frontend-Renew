export interface CyclePeriodItem {
  id: number;
  period: string;
}

export interface CycleConfigResponse {
  cycle_periods: CyclePeriodItem[];
  cycle_cooldowns: CyclePeriodItem[];
  cycle_upcomings: CyclePeriodItem[];
}

export interface iCycleResponse {
  id: number;
  team_id: number;
  enable_cycle: boolean;

  cycle_period_id: number;
  cycle_cooldown_id: number;
  cycle_upcoming_id: number;

  cycle_period_label: string;
  cycle_cooldown_label: string;
  cycle_upcoming_label: string;

  cycle_start_on: string; // ISO / date string
  active_issues: boolean;
  started_issues: boolean;
  completed_issues: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface iChart{
  date : string;
  completed : number;
  remaining : number;
  issue_progress : number
}

export interface iCycleListResponse {
  id: number;
  team_id: number;
  cycle_number: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  scope: string;
  started: string;
  completed: string;
  created_at: string;
  updated_at: string;
        issue_progress?: number,
  
  chart : iChart[]
}



export interface iCycleUpdatePayload {
  name?: string;
  description?: string;
}


export interface iCycleRange {
  end_date : string
}



// cycle detail

// ---------- Common ----------
export interface BaseTimestamps {
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// ---------- Priority ----------
export interface Priority {
  id: number;
  name: string;
  icon: string;
}

// ---------- User / Assignee ----------
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  email_verified_at?: string;
  timezone?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ---------- Status ----------
export interface Status {
  id: number;
  name: string;
  icon: string;
  status: string;
  created_at: string;
  updated_at: string;
  icon_url: string;
}

// ---------- Issue ----------
export interface Issue extends BaseTimestamps {
  id: number;
  issue_key: string;
  name: string;
  description: string | null;

  workspace_id: number;
  cycle_id: number;
  created_by: number;
  team_id: number;
  status_id: number;
  priority_id: number;
  project_id: number | null;
  assignee_id: number | null;
  milestone_id: number | null;

  cycle: null;
  due_date: string | null;

  is_recurring: boolean;
  recurring_first_due: string | null;
  recurring_repeats_every: number | null;
  recurring_type: string | null;

  external_link: string | null;
  customer_request: string | null;
  sub_issue: any;
  milestones: any;
  sub_issues: Issue[];

  priority_detail: Priority | null;
  status: Status;
  assignee: User | null;

  group: string;
}

export type IssuesByStatus = Record<string, Issue[]>;

// ---------- Team ----------
export interface Team extends BaseTimestamps {
  id: number;
  workspace_id: number;
  name: string;
  icon: string;
  description: string | null;
  prefix: string | null;
  created_by: number;
  is_active: boolean;
  identifier: string;
  parent_team_id: number | null;
  is_private: number;
  timezone: string;
  copied_from_team_id: number | null;
  projects: any[];
}

// ---------- Cycle ----------
export interface CycleIssueDetail extends BaseTimestamps {
  id: number;
  team_id: number;
  cycle_number: number;
  name: string;
  description: string | null;

  start_date: string;
  end_date: string;
  status: 'current' | 'completed' | 'upcoming';

  priorities: Priority[];
  team: Team;
  issues: IssuesByStatus;

  assignees: Pick<User, 'id' | 'name' | 'email' | 'avatar'>[];
  projects: any[];
}
