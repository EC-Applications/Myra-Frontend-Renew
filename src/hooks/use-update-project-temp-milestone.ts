import type { ProjectTemplateMileStoneUpdatePayload } from "@/interfaces/project-template.interface";
import { updateProjectTemplateMilestone } from "@/services/project-template.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface useProjectTempMilestoneHookParams {
  project_template_id: number;
  body: ProjectTemplateMileStoneUpdatePayload;
}

export const useProjectTempMilestoneHook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      project_template_id,
      body,
    }: useProjectTempMilestoneHookParams) => {
      const req = await updateProjectTemplateMilestone(
        project_template_id,
        body,
      );
      return req.data;
    },
    onSuccess: (data, varaible) => {
      queryClient.invalidateQueries({
        queryKey: ["project-template-detail", varaible.body.project_template_id],
      });
    },

    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};
