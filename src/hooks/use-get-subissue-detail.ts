import { fetchSubissuesDetailUri } from "@/services/sub-issues.service";
import { useQuery } from "@tanstack/react-query";

export const useGetSubIssuesDetailHook = (issueId :number) => {
    return useQuery({
        queryKey: ["subissue-detail", issueId],
        queryFn: async () => {
           const res = await fetchSubissuesDetailUri(issueId)
           return res.data;
        }
    })
}