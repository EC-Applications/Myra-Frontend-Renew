import { cycleConfigUri } from "@/services/cycle.service"
import { useQuery } from "@tanstack/react-query"
 
export const useCycleHook  = (workspaceSlug : string , teamId : number) => {
    return useQuery({
        queryKey: ['cyles' , teamId],   
        queryFn: () => cycleConfigUri(workspaceSlug, teamId)

    })
}