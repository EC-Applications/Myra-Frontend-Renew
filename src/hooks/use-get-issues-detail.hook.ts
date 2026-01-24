import { useQuery } from "@tanstack/react-query"

export const useGetIssuesDetailHook = (issueId :number, workspaceId: number) => {
    return useQuery({
        queryKey: ["issue-detail", issueId],
        queryFn: async () => {
            
        }
    })
}