import type { iResponse } from "@/interfaces/common.interface";
import type { iIssues } from "@/interfaces/issues";
import type { iIssuePayload } from "@/interfaces/issues.interface";
import { updateSubIssuesUri } from "@/services/sub-issues.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface updateSubIssueHookParam {
  workspaceId: number;
  teamId: number;
  issueId: number;
  parentIssueId?: number;
  body: Partial<iIssuePayload>;
  newAttachments?: File[];
}

export const useUpdateSubIssueHook = () => {
  const queryClient = useQueryClient();
  return useMutation<iResponse<iIssues>, Error, updateSubIssueHookParam>({
    mutationFn: async ({ issueId, body, newAttachments }) => {
      const req = await updateSubIssuesUri(issueId, body, newAttachments);
      return req;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["subissue-detail", variables.issueId],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["issue-detail", variables.issueId],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["sub-issues", variables.issueId],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: [
          "issues",
          variables.body.workspace_id,
          variables.body.team_id,
        ],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["cycle-detail", variables.teamId, _data.data.cycle_id],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update issue");
    },
  });
};
