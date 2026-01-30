import type { updateWorkspacePayload } from "@/interfaces/workspace.interface";
import { updateWorkspaceUri } from "@/services/workspace.service";
import { updateWorkspace } from "@/store/slices/auth.slice";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface updateWorkspaceParam {
  body: updateWorkspacePayload;
  workspaceId: number;
}

export const useWorkpsaceUpdateHook = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async ({ body, workspaceId }: updateWorkspaceParam) => {
      const req = await updateWorkspaceUri(body, workspaceId);
      return { data: req.data, workspaceId };
    },
    onSuccess: ({ data, workspaceId }) => {
      if (data) {
        dispatch(
          updateWorkspace({
            workspaceId,
            updates: {
              name: data.name,
              slug: data.slug,
              description: data.description,
              logo: data.logo ?? null,
              url: data.url,
            },
          })
        );
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to Update Workspace");
    },
  });
};
