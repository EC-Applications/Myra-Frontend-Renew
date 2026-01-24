
import { getCommentsUri } from "@/services/comment.service";
import { useQuery } from "@tanstack/react-query"

export const useGetComments = (workspaceSlug: string , issueId: number) => {
    return useQuery({
        queryKey: ["comments", issueId],
        queryFn: async ()=>{
            const res = await getCommentsUri(workspaceSlug, issueId);
            return res.data;
        },
    })  
}