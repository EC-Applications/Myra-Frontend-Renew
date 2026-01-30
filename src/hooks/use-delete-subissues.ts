import type { iSubIssueDeletePayload } from "@/interfaces/issues";
import { deleteSubIssuesUri } from "@/services/sub-issues.service";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface deleteSubissueHookParams {
  body: iSubIssueDeletePayload;
  workspaceId: number;
  teamId: number;
}
export const useDeleteSubIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      body,
      teamId,
      workspaceId,
    }: deleteSubissueHookParams) => {
      const req = await deleteSubIssuesUri(body);

      return req.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["issues", variables.workspaceId, variables.teamId],
      });
    },
  });
};
