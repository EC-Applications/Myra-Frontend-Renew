import { issueDetailUri } from "@/services/issues.service"
import { useQuery } from "@tanstack/react-query"

export const useGetIssuesDetailHook = (issueId :number) => {
    return useQuery({
        queryKey: ["issue-detail", issueId],
        queryFn: async () => {
           const res = await issueDetailUri(issueId)
           return res.data;
        }
    })
}