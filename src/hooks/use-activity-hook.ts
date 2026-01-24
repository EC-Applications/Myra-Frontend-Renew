import { fetchActivityUri } from "@/services/activity.service";
import { useQuery } from "@tanstack/react-query";

export const useActivityHook = (
//   issueId: number,
  workspaceSlug: string | number,
  subject_type: string,
  subject_id: number,
) => {
  return useQuery({
    queryKey: ["activity", subject_id],
    queryFn: async () => {
      return await fetchActivityUri(workspaceSlug, subject_type, subject_id);
    },
  });
};
