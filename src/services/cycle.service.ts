import type { iResponse } from "@/interfaces/common.interface";
import { Axios } from "./axios.service";
import type {
  CycleConfigResponse,
  CycleIssueDetail,
  iCycleListResponse,
  iCycleRange,
  iCycleResponse,
  iCycleUpdatePayload,
} from "@/interfaces/cycle.interface";

export const cycleConfigUri = async (workspaceSlug: string, teamid: number) => {
  return Axios.get(`/api/${workspaceSlug}/teams/${teamid}/cycles/periods`).then(
    (res) => res.data as iResponse<CycleConfigResponse>
  );
};

export const cycleSaveUri = (
  workspaceSlug: string,
  teamid: number,
  body: iCycleSave
) => {
  return Axios.post(
    `/api/${workspaceSlug}/teams/${teamid}/cycles/periods/store`,
    body,
    { responseType: "json" }
  );
};

export const fetchCycleUri = async (workspaceSlug: string, teamid: number) => {
  return Axios.get(
    `/api/${workspaceSlug}/teams/${teamid}/cycles/periods/retrieve`,
    { responseType: "json" }
  ).then((res) => res.data as iResponse<iCycleResponse>);
};

export const fetchCycleListUri = async (
  workspaceSlug: string,
  teamid: number
) => {
  return Axios.get(`/api/${workspaceSlug}/teams/${teamid}/cycles`, {
    responseType: "json",
  }).then((res) => res.data as iResponse<iCycleListResponse[]>);
};

export const cycleUpdateUri = (
  workspaceSlug: string,
  teamid: number,
  cycleId: number,
  body: iCycleUpdatePayload
) => {
  return Axios.post(
    `/api/${workspaceSlug}/teams/${teamid}/cycles/edit/${cycleId}`,
    body,
    { responseType: "json" }
  );
};

//  CYCLE RANGE
export const cycleRangeUpdateUri = (
  workspaceSlug: string,
  teamid: number,
  cycleId: number,
  body: iCycleRange
) => {
  return Axios.post(
    `/api/${workspaceSlug}/teams/${teamid}/cycles/${cycleId}/date-range`,
    body,
    { responseType: "json" }
  );
};

// cycle detail

export const cycleDetailUri = async (
  workspaceSlug: string,
  teamid: number,
  cycleId: number
) => {
  return Axios.get(
    `/api/${workspaceSlug}/teams/${teamid}/cycles/${cycleId}/detail`,
    { responseType: "json" }
  ).then((res) => res.data as iResponse<CycleIssueDetail>);
};

export const cycleChartUri = async (
  workspaceSlug: string,
  teamid: number,
  cycleId: number
) => {
  return Axios.get(
    `/api/${workspaceSlug}/teams/${teamid}/cycles/${cycleId}/chart`,
    { responseType: "json" }
  ).then((res) => res.data as iResponse<iCycleListResponse>);
};

export interface iCycleSave {
  cycle_period_id?: number;
  cycle_cooldown_id?: number;
  cycle_upcoming_id?: number;
  active_issues?: boolean;
  started_issues?: boolean;
  completed_issues?: boolean;
  cycle_start_on?: string;
  enable_cycle?: boolean;
}
