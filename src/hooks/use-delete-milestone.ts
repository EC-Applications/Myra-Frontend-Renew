import { deleteMilestoneUri } from "@/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface useDeleteMilestoneParam {
  milestoneId: number;
  project_id: number;
}
export const useDeleteMilestone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      milestoneId,
      project_id,
    }: useDeleteMilestoneParam) => {
      const req = await deleteMilestoneUri(milestoneId);

      return req.data;
    },
    onSuccess: (data, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["project-detail", variable.project_id],
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to Delete Milestone");
    },
  });
};
