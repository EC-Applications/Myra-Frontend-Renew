import { cycleDetailUri } from "@/services/cycle.service";
import { useQuery } from "@tanstack/react-query";

export const useCycleDetailHook = (
  workspaceSlug: string,
  teamid: number,
  cycleId: number,
) => {
  return useQuery({
    queryKey: ["cycle-detail", teamid, cycleId],
    queryFn: async () => {
      const res = await cycleDetailUri(workspaceSlug, teamid, cycleId);
      return res.data;
    },
  });
};
