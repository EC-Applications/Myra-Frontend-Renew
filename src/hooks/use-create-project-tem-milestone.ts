import type { iProjectTemplateMilestonePayload } from "@/interfaces/project-template.interface";
import { createProjectTempateMilestoneUri } from "@/services/project-template.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface MilestoneProps {
  body: iProjectTemplateMilestonePayload;
}

export const useCreateProjectTemMilestoneHook = () => {
  return useMutation({
    mutationFn: async ({ body }: MilestoneProps) => {
      const req = await createProjectTempateMilestoneUri(body);
      return req.data;
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to Create Project Template");
    },
  });
};
