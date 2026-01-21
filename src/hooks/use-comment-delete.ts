import { deleteCommentUri } from "@/services/comment.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteCommentVariables {
  workspaceSlug: string;
  commentId: number;
  issueId: number; 
}

export const useDeleteCommentHook = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, DeleteCommentVariables>({
    mutationFn: async ({ workspaceSlug, commentId }) => {
      const req = await deleteCommentUri(workspaceSlug, commentId);
      return req.data;
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
  });
};