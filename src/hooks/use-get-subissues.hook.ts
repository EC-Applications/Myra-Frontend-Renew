import { fetchSubIssues } from "@/services/sub-issues.service";
import { useQuery } from "@tanstack/react-query";

export const useGetSubIssuesHook = (issueId: number) => {
  return useQuery({
    queryKey: ["sub-issues", issueId],
    queryFn: async () => {
      const res = await fetchSubIssues(issueId);
      return res.data;
    },
  });
};
