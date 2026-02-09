import type { iProjectTemplatePayload } from "@/interfaces/project-template.interface";
import { updateProjectTemplateUri } from "@/services/project-template.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface useUpdateProjectTemplateHookParams {
  body: iProjectTemplatePayload;
  iconFile?: File;
  documentFiles?: File[];
  workspace_id: number;
  id: number;
}

export const useUpdateProjectTemplateHook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      body,
      documentFiles,
      iconFile,
      id,
      workspace_id,
    }: useUpdateProjectTemplateHookParams) => {
      const req = await updateProjectTemplateUri(
        Number(id),
        body,
        documentFiles,
        iconFile,
      );
      return req.data;
    },
    onSuccess: (data, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["project-template", variable.workspace_id],
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to Create Project Template");
    },
  });
};
