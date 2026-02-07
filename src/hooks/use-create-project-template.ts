import type { iProjectTemplatePayload } from "@/interfaces/project-template.interface";

import { createProjectTemplateUri } from "@/services/project-template.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface useCreateProjectTemplateHookParams {
  body: iProjectTemplatePayload;
  iconFile?: File;
  documentFiles?: File[];
  workspace_id: number
}

export const useCreateProjectTemplateHook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      body,
      documentFiles,
      iconFile,
      workspace_id
    }: useCreateProjectTemplateHookParams) => {
      const req = await createProjectTemplateUri(body, documentFiles, iconFile);
      return req.data;
    },
    onSuccess: (data, variable)=> {
      queryClient.invalidateQueries(
        {
          queryKey: ["project-template", variable.workspace_id], 
        }
      )
      
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to Create Project Template");
    },
  });
};
