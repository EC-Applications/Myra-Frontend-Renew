import { deleteProjectTemplateUri } from "@/services/project-template.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface deleteParam {
  id: number;
  workspace_id: number;
}

export const useDeleteProjectTemplateHook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, workspace_id }: deleteParam) => {
      const req = await deleteProjectTemplateUri(id);
      return req.data;
    },
    onSuccess: (data, varaible) => {
      queryClient.invalidateQueries({
        queryKey: ["project-template", varaible.workspace_id],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete template");
    },
  });
};
