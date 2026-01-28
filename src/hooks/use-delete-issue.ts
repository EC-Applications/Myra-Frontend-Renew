import { deleteIssueUri } from "@/services/issues.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Interface
interface DeleteIssueVariables {
  teamId: number;
  issueId: number;
  workspaceId: number;
}

// Hook
export const useDeleteIssueHook = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, DeleteIssueVariables>({
    mutationFn: async ({ issueId }) => {
      const res = await deleteIssueUri(issueId);
      return res.data;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["issues", variables.workspaceId, variables.teamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-issue"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cycle-detail"],
      });
      // toast.success("Issue deleted successfully!");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to delete issue");
      console.error("Delete error:", error);
    },
  });
};
