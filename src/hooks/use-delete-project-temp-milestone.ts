import { projectTemplateMilestoneDeleteUri } from "@/services/project-template.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface useDeleteProjectTempMilestonePararm {
  milestone_id: number;
  project_template_id: number;
}

export const useDeleteProjectTempMilestoneHook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      milestone_id,
    }: useDeleteProjectTempMilestonePararm) => {
      const req = await projectTemplateMilestoneDeleteUri(milestone_id);
      return req.data;
    },
    onSuccess: (data, varaible) => {
      queryClient.invalidateQueries({
        queryKey: ["project-template-detail", varaible.project_template_id],
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete milestone");
    },
  });
};
