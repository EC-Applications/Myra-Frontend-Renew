import { fetchProjectById } from "@/services/project.service";
import { useQuery } from "@tanstack/react-query";

export const useGetProjectIdHook = (workspaceId: number, teamId: number) => {
  return useQuery({
    queryKey: ["project-teamId", teamId],
    queryFn: async () => {
      const res = await fetchProjectById(workspaceId, teamId);
      return res.data;
    },
  });
};
