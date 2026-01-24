import type { iResponse } from "@/interfaces/common.interface";
import type { iProject } from "@/interfaces/project.interface";
import { updateProjectUri } from "@/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProjectParams {
  projectId: number;
  body: Partial<iProject>;
  iconFile?: File;
  documentFiles?: File[];
}

export const useUpdateProjectHook = () => {
  const queryClient = useQueryClient();
  return useMutation<iResponse<iProject>, Error, UpdateProjectParams>({
    mutationFn: async ({ projectId, body, iconFile, documentFiles }) => {
      const req = await updateProjectUri(
        projectId,
        body,
        iconFile,
        documentFiles
      );
      console.log(req);
      return req;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["project-detail", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-teamId"]
      });
      queryClient.invalidateQueries({
        queryKey: ["activity", variables.projectId]
      })
    },
  });
};
