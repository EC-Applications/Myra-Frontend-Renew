import { fetchSubIssues } from "@/services/sub-issues.service";
import { useQuery } from "@tanstack/react-query";

export const useGetSubIssuesHook = (workpsaceId: number, teamId: number) => {
  return useQuery({
    queryKey: ["sub-issues", teamId],
    queryFn: async () => {
      const res = await fetchSubIssues(teamId);
      return res.data;
    },
  });
};
