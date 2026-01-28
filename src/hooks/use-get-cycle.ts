import { fetchCycleListUri } from "@/services/cycle.service";
import { useQuery } from "@tanstack/react-query";

export const useGetCyclesHook = (workspaceSlug: string, teamid: number) => {
  return useQuery({
    queryKey: ["cycles", workspaceSlug, teamid],
    queryFn: async () => {
      const res = await fetchCycleListUri(workspaceSlug, teamid);
      return res.data;
    },
  });
};
