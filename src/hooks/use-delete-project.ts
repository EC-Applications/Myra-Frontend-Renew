import { queryClient } from "@/query-client";
import { deleteProjectUri } from "@/services/project.service";
import { removeProject } from "@/store/slices/project.slice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface useDeleteProjectHookParam {
  projectId: number;
  workspaceSlug: number | string;
  teamId?: number;
}

export const useDeleteProjectHook = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async ({
      projectId,
      workspaceSlug,
      teamId,
    }: useDeleteProjectHookParam) => {
      const req = await deleteProjectUri(projectId);

      return req.data;
    },
    onSuccess: (data, variable) => {
      dispatch(removeProject({ projectId: variable.projectId }));
      queryClient.invalidateQueries({
        queryKey: ["all-project", variable.workspaceSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-teamId", variable.teamId],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to Delete Project");
    },
  });
};
