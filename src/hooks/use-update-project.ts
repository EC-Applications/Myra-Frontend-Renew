import type { iResponse } from "@/interfaces/common.interface";
import type { iProject } from "@/interfaces/project.interface";
import { updateProjectUri } from "@/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProjectParams {
  projectId: number;
  body: Partial<iProject>;
  /** Data to optimistically update UI - should match what UI reads */
  optimisticData?: Partial<iProject>;
  iconFile?: File;
  documentFiles?: File[];
}

interface MutationContext {
  previousProject: iProject | undefined;
}

export const useUpdateProjectHook = () => {
  const queryClient = useQueryClient();
  return useMutation<
    iResponse<iProject>,
    Error,
    UpdateProjectParams,
    MutationContext
  >({
    mutationFn: async ({ projectId, body, iconFile, documentFiles }) => {
      const req = await updateProjectUri(
        projectId,
        body,
        iconFile,
        documentFiles
      );
      console.log(req);
      return req;
    },

    // Optimistic update - instant UI change
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to prevent overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: ["project-detail", variables.projectId],
      });

      // Snapshot the previous value for rollback
      const previousProject = queryClient.getQueryData<iProject>([
        "project-detail",
        variables.projectId,
      ]);

      // Only do optimistic update for non-file updates
      // File uploads need server response for URLs
      const hasFileUpload = variables.iconFile || variables.documentFiles?.length;

      if (previousProject && !hasFileUpload) {
        // Use optimisticData if provided, otherwise fall back to body
        // optimisticData should contain full objects (priority, status, lead)
        // body contains IDs for API (priority_id, status_id, lead_id)
        const dataToMerge = variables.optimisticData || variables.body;

        // Optimistically update the cache
        queryClient.setQueryData<iProject>(
          ["project-detail", variables.projectId],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              ...dataToMerge,
            };
          }
        );
      }

      // Return context with previous value for rollback
      return { previousProject };
    },

    // On success - merge server response with existing cache
    onSuccess: (response, variables) => {
      if (response?.data) {
        queryClient.setQueryData<iProject>(
          ["project-detail", variables.projectId],
          (old) => {
            if (!old) return response.data;

            const serverData = response.data;

            // Smart merge: use server data but preserve full objects
            // if server only returned IDs/partial data
            return {
              ...serverData,
              // Preserve labels if server didn't return full objects
              labels:
                serverData.labels?.[0] &&
                typeof serverData.labels[0] === "object" &&
                "name" in serverData.labels[0]
                  ? serverData.labels
                  : old.labels,
              // Preserve priority if server didn't return full object
              priority:
                serverData.priority && "name" in serverData.priority
                  ? serverData.priority
                  : old.priority,
              // Preserve status if server didn't return full object
              status:
                serverData.status && "name" in serverData.status
                  ? serverData.status
                  : old.status,
              // Preserve lead if server didn't return full object
              lead:
                serverData.lead && "first_name" in serverData.lead
                  ? serverData.lead
                  : old.lead,
            };
          }
        );
      }

      // Invalidate related queries (not project-detail to avoid flash)
      queryClient.invalidateQueries({
        queryKey: ["project-teamId"],
      });
      queryClient.invalidateQueries({
        queryKey: ["activity", variables.projectId],
      });
    },

    // Rollback on error
    onError: (_error, variables, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(
          ["project-detail", variables.projectId],
          context.previousProject
        );
      }
    },
  });
};
