import { fetchProjectTempateMilestoneUri } from "@/services/project-template.service"
import { useQuery } from "@tanstack/react-query"

export const useGetProjectTempilestonesHook = (project_temp_id: number) => {
    return useQuery( 
        {
            queryKey : ["milestones", project_temp_id],
            queryFn : async () => {
                const res = await fetchProjectTempateMilestoneUri(project_temp_id);
                return res.data ;
            }
        }
    ) 
}