import type { iProjectPayload } from "@/interfaces/project.interface";
import { createProjectUri } from "@/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface useCreateProjectParam {
  body: iProjectPayload;
  iconFile?: File;
  documentFiles?: File[];
  workspaceSlug? : string | number,
  teamId? : string | number
}

export const useCreateProjectHook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      body,
      documentFiles,
      iconFile,
      workspaceSlug,
      teamId
    }: useCreateProjectParam) => {
      const req = await createProjectUri(body, iconFile, documentFiles);
      return req.data;
    },
    onSuccess: (data,variable) => {
      queryClient.invalidateQueries({
        queryKey: ["all-project", variable.workspaceSlug],
      });
      queryClient.invalidateQueries({
         queryKey: ["project-teamId", variable.teamId],
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to Delete Milestone");
    },
  });
};
