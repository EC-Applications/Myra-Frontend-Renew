import { fetchProjectUri } from "@/services/project.service";
import { useQuery } from "@tanstack/react-query";

export const useGetAllProject = (workspaceSlug: string | number) => {
  return useQuery({
    queryKey: ["all-project", workspaceSlug],
    queryFn: async () => {
      const res = await fetchProjectUri(workspaceSlug);

      return res.data;
    },
  });
};
