import type { iResponse } from "@/interfaces/common.interface";
import type { iIssues } from "@/interfaces/issues";
import type { iIssuePayload } from "@/interfaces/issues.interface";
import { updateIssuesUri } from "@/services/issues.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface updateIssueHookParam {
  workspaceId: number;
  teamId: number;
  issueId: number;
  body: Partial<iIssuePayload>;
  newAttachments?: File[];
}

export const useUpdateIssueHook = () => {
  const queryClient = useQueryClient();
  return useMutation<iResponse<iIssues>, Error, updateIssueHookParam>({
    mutationFn: async ({ issueId, body, newAttachments }) => {
      const req = await updateIssuesUri(issueId, body, newAttachments);
      return req;
    },
    onSuccess: (_data, variables) => {
      // toast.success("Issue updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["issues", variables.workspaceId, variables.teamId],
      });

      queryClient.invalidateQueries({
        queryKey: ["project-issue", variables.workspaceId],
      });

      queryClient.invalidateQueries({
        queryKey: ["cycle-detail"],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update issue");
    },
  });
};
