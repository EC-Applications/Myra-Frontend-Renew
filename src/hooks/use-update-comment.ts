import type {
  iCommentResponse,
  iCommentUpdatePayload,
} from "@/interfaces/comment.interface";
import type { iResponse } from "@/interfaces/common.interface";
import { upadateCommentUri } from "@/services/comment.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface useCommentUpadteProps {
  body: Partial<iCommentUpdatePayload>;
  workspaceSlug: string | number;
  commentId: number;
  issueId : number
}

export const useCommentUpdateHook = () => {
  const queryClient = useQueryClient();
  return useMutation<iResponse<iCommentResponse>, Error, useCommentUpadteProps>(
    {
      mutationFn: async ({ workspaceSlug, commentId, body }) => {
        return await upadateCommentUri(body, workspaceSlug, commentId);
      },
      onSuccess: (data, variables) => {
        toast.success("Comment deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["comments", variables.issueId],
        });
      },

      onError: (error) => {
        toast.error(error.message || "Failed to delete comment");
      },
    },
  );
};
