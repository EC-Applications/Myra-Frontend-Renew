import type { iProject } from "@/interfaces/project.interface";
import { projectDetailFetchUri } from "@/services/project.service";
import { useQuery } from "@tanstack/react-query";

export const useProjectDetail = (projectId: number) => {
  return useQuery<iProject>({
    queryKey: ["project-detail", projectId],
    queryFn: async () => {
      console.log("PROJECT DETAIL FETCH");

      const response = await projectDetailFetchUri(projectId);
      return response.data;
    },
  });
};
