import type { iResponse } from "@/interfaces/common.interface";
import type { iProject } from "@/interfaces/project.interface";
import { updateProjectUri } from "@/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateProjectParams {
  projectId: number;
  body: Partial<iProject>;
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
        documentFiles,
      );
      return req;
    },

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["project-detail", variables.projectId],
      });

      const previousProject = queryClient.getQueryData<iProject>([
        "project-detail",
        variables.projectId,
      ]);

      // File uploads need server response
      const hasFileUpload =
        variables.iconFile || variables.documentFiles?.length;

      if (previousProject && !hasFileUpload && variables.optimisticData) {
        queryClient.setQueryData<iProject>(
          ["project-detail", variables.projectId],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              ...variables.optimisticData,
            };
          },
        );
      }

      return { previousProject };
    },

    onSuccess: (response, variables) => {
      if (response?.data) {
        queryClient.setQueryData<iProject>(
          ["project-detail", variables.projectId],
          (old) => {
            if (!old) return response.data;

            const serverData = response.data;

            // NEW SIMPLIFIED LOGIC:
            // If optimisticData was provided, trust it for nested objects
            // Only use server data for simple fields or when no optimistic update
            const hasOptimisticLabels =
              variables.optimisticData?.labels !== undefined;
            const hasOptimisticPriority =
              variables.optimisticData?.priority !== undefined;
            const hasOptimisticStatus =
              variables.optimisticData?.status !== undefined;
            const hasOptimisticLead =
              variables.optimisticData?.lead !== undefined;

            return {
              ...old,
              ...serverData,
              // Use optimistic data if provided, otherwise try server data
              labels: hasOptimisticLabels
                ? variables.optimisticData!.labels
                : serverData.labels?.[0] &&
                    typeof serverData.labels[0] === "object" &&
                    "name" in serverData.labels[0]
                  ? serverData.labels
                  : old.labels,

              priority: hasOptimisticPriority
                ? variables.optimisticData!.priority
                : serverData.priority && "name" in serverData.priority
                  ? serverData.priority
                  : old.priority,

              status: hasOptimisticStatus
                ? variables.optimisticData!.status
                : serverData.status && "name" in serverData.status
                  ? serverData.status
                  : old.status,

              lead: hasOptimisticLead
                ? variables.optimisticData!.lead
                : serverData.lead && "first_name" in serverData.lead
                  ? serverData.lead
                  : old.lead,
            };
          },
        );
      }

      // Invalidate without refetching project-detail
      queryClient.invalidateQueries({
        queryKey: ["project-teamId"],
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: ["all-project"],
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: ["activity", variables.projectId],
      });
    },

    onError: (_error, variables, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(
          ["project-detail", variables.projectId],
          context.previousProject,
        );
      }
      toast.error("Failed to update project");
    },
  });
};
