import type { iResponse } from "@/interfaces/common.interface";
import type { iIssues, iIussesDetail } from "@/interfaces/issues";
import type { iIssuePayload } from "@/interfaces/issues.interface";
import { updateIssuesUri } from "@/services/issues.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface updateIssueHookParam {
  workspaceId: number;
  teamId: number;
  issueId: number;
  body: Partial<iIssuePayload>;
  /** Data to optimistically update UI - should match what UI reads */
  optimisticData?: Partial<iIussesDetail>;
  newAttachments?: File[];
}

interface MutationContext {
  previousIssue: iIussesDetail | undefined;
}

export const useUpdateIssueHook = () => {
  const queryClient = useQueryClient();
  return useMutation<
    iResponse<iIssues>,
    Error,
    updateIssueHookParam,
    MutationContext
  >({
    mutationFn: async ({ issueId, body, newAttachments }) => {
      const req = await updateIssuesUri(issueId, body, newAttachments);
      return req;
    },

    // Optimistic update - instant UI change
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["issue-detail", variables.issueId],
      });

      // Snapshot previous value for rollback
      const previousIssue = queryClient.getQueryData<iIussesDetail>([
        "issue-detail",
        variables.issueId,
      ]);

      // Only do optimistic update for non-file updates
      const hasFileUpload = variables.newAttachments?.length;

      if (previousIssue && !hasFileUpload && variables.optimisticData) {
        // Optimistically update the cache with optimisticData only
        queryClient.setQueryData<iIussesDetail>(
          ["issue-detail", variables.issueId],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              ...variables.optimisticData,
            } as iIussesDetail;
          }
        );
      }

      return { previousIssue };
    },

    // On success - merge server response with existing cache
    onSuccess: (response, variables) => {
      if (response?.data) {
        queryClient.setQueryData<iIussesDetail>(
          ["issue-detail", variables.issueId],
          (old) => {
            if (!old) return old;

            const serverData = response.data as unknown as iIussesDetail;

            // Smart merge: preserve full objects if server returned partial
            return {
              ...old,
              ...serverData,
              // Keep old due_date format (Date object)
              due_date: old.due_date,
              // Preserve labels if server didn't return full objects
              labels:
                serverData.labels?.[0] &&
                typeof serverData.labels[0] === "object" &&
                "name" in serverData.labels[0]
                  ? serverData.labels
                  : old.labels,
              // Preserve status if server didn't return full object
              status:
                serverData.status && "name" in serverData.status
                  ? serverData.status
                  : old.status,
              // Preserve priority if server didn't return full object
              priority_detail:
                serverData.priority_detail && "name" in serverData.priority_detail
                  ? serverData.priority_detail
                  : old.priority_detail,
              // Preserve assignee if server didn't return full object
              assignee:
                serverData.assignee && "first_name" in serverData.assignee
                  ? serverData.assignee
                  : old.assignee,
              // Preserve projects if server didn't return full object
              projects:
                serverData.projects && "name" in serverData.projects
                  ? serverData.projects
                  : old.projects,
            } as iIussesDetail;
          }
        );
      }

      // Invalidate related queries (not issue-detail to avoid flash)
      queryClient.invalidateQueries({
        queryKey: ["issues", variables.workspaceId, variables.teamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-issue", variables.workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["cycle-detail"],
      });
      queryClient.invalidateQueries({
        queryKey: ["activity", variables.issueId],
        exact: false,
      });
    },

    // Rollback on error
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to update issue");

      if (context?.previousIssue) {
        queryClient.setQueryData(
          ["issue-detail", variables.issueId],
          context.previousIssue
        );
      }
    },
  });
};
