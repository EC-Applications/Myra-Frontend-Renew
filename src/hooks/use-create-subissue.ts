import type { iSubIssuePayload } from "@/interfaces/issues";
import type { iIssuePayload } from "@/interfaces/issues.interface";
import { createSubIssueUri } from "@/services/sub-issues.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateSubIssueHook = (parentIssueId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: iSubIssuePayload) => {
      const res = await createSubIssueUri(body);
      return res.data;
    },
    onMutate: () => {
      // Loading toast show karo
      toast.loading("Creating sub-issue...", { id: 'create-sub-issue' });
    },
    onSuccess: (data) => {
      // Loading toast dismiss aur success show karo
      toast.dismiss('create-sub-issue');
      toast.success("Sub-issue created successfully");

      // Cache invalidate karo
      queryClient.invalidateQueries({
        queryKey: ["issue-detail", parentIssueId],
      });
    },
    onError: (error: any) => {
      // Loading toast dismiss aur error show karo
      toast.dismiss('create-sub-issue');
      toast.error(error.response?.data?.message || "Failed to create sub-issue");
    },
  });
};
