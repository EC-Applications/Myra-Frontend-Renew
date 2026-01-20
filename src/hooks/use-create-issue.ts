import type { iIssuePayload } from "@/interfaces/issues.interface";
import { createIssuesUri } from "@/services/issues.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateIssueHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: iIssuePayload) => {
      const res = await createIssuesUri(body);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Issue created successfully");

      // Invalidate all issue-related queries
      queryClient.invalidateQueries({
        queryKey: ["issues"],
      });

      queryClient.invalidateQueries({
        queryKey: ["project-issue"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cycle-detail"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create issue");
    },
  });
};
