import type { iMilestoneCreatePayload } from "@/interfaces/milestone.interface";
import { milesoneCreateUri } from "@/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface usePostMilestoneHookParam {
  body: iMilestoneCreatePayload;
  projectId: number;
}

export const usePostMilestoneHook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ body, projectId }: usePostMilestoneHookParam) => {
      const req = await milesoneCreateUri(body);
      return req.data;
    },
    onSuccess: (data, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["project-detail", variable.projectId],
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to Post Milestone");
    },
  });
};
