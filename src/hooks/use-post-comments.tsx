import type { iCommentPayload, iCommentResponse } from "@/interfaces/comment.interface";
import type { iResponse } from "@/interfaces/common.interface";
import type {
} from "@/interfaces/issues.interface";
import { postCommentUri } from "@/services/comment.service";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface commentProps {
    issueId: number;
  body: Partial<iCommentPayload>;
}

export const usePostCommentHook = () => {
  const queryClient = useQueryClient();
  return useMutation<iResponse<iCommentResponse>, Error, commentProps>({
    mutationFn: async ({ body , issueId}) => {
      const req = await postCommentUri(body);
      console.log(req);
      return req;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to Post Comment");
    },
  });
};
