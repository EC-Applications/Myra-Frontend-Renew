import type { MileStoneUpdatePayload } from "@/interfaces/project.interface";
import { mileStoneUpdateUri } from "@/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface useUpdateMilestoneHookParam {
  milestoneId: number | undefined;
  body: MileStoneUpdatePayload;
  project_id : number
}
export const useUpdateMilestoneHook = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({milestoneId, body, project_id}:useUpdateMilestoneHookParam) => {
      const req = await mileStoneUpdateUri(milestoneId,body);

      return req.data;
    },
    onSuccess: (data, varaible) => {
        queryClient.invalidateQueries(
            {
                queryKey: ["project-detail", varaible.project_id]
            }
        )
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to Update Milestone");
    },
  });
};
