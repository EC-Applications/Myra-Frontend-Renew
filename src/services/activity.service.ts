import type { iResponse } from "@/interfaces/common.interface"
import { Axios } from "./axios.service"
import type { iActivity } from "@/interfaces/activity.interface"

export const fetchActivityUri = async (workspaceSlug : string | number , subject_type: string, subject_id: number) => {
    return Axios.get(`/api/${workspaceSlug}/teams/activity-logs?subject_type=${subject_type}&subject_id=${subject_id}`, {responseType:"json"})
    .then((res)=> res.data as iResponse<iActivity[]>)
}