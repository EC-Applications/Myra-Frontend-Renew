
import { fetchProjectIssueUri } from "@/services/project.service";
import { useQuery } from "@tanstack/react-query";

export const useProjectIssuesHook = (workpsaceId: number, projectId: number) => {
  return useQuery({
    queryKey: ["project-issue", workpsaceId],
    queryFn: async () => {
      const res = await fetchProjectIssueUri(projectId);
      return res.data;
    },
  });
};
