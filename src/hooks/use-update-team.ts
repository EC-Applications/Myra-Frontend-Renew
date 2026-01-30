import type { updateTeamPayload } from "@/interfaces/teams.interface";
import { updateteamUri } from "@/services/team.service";
import { updateTeam } from "@/store/slices/team.slice";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface UpdateTeamProps {
  workspace_slug: string | number;
  team_id: number;
  body: Partial<updateTeamPayload>;
  iconFile?: File;
}

export const useUpdateTeamHook = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async ({
      workspace_slug,
      team_id,
      body,
      iconFile,
    }: UpdateTeamProps) => {
      const res = await updateteamUri(workspace_slug, team_id, body);
      return res.data;
    },
    onSuccess: (response, variables) => {
      dispatch(updateTeam(response));
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update team");
    },
  });
};
