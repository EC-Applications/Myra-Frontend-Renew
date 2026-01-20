import type { iResponse } from "@/interfaces/common.interface";
import { deleteProjectAttachmentUri } from "@/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteAttachmentParams {
  workspaceId: number;
  projectId: number;
  attachmentIds: number[];
}

export const useDeleteProjectAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation<iResponse<any>, Error, DeleteAttachmentParams>({
    mutationFn: async ({ workspaceId, projectId, attachmentIds }) => {
      const req = await deleteProjectAttachmentUri(
        workspaceId,
        projectId,
        attachmentIds
      );
      return req;
    },
    onSuccess: (_data, variables) => {
      toast.success("Attachment deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["project-detail", variables.projectId],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete attachment");
    },
  });
};
