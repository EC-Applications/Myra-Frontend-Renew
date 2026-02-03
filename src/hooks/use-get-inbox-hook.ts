import { inboxUri } from "@/services/general.service";
import { useQuery } from "@tanstack/react-query";

export const useGetInboxHook = (workspace_slug: string | number) => {
  return useQuery({
    queryKey: ["inbox", workspace_slug],
    queryFn : async () => {
        const res = await inboxUri(workspace_slug);
        return res.data;
    },
  });
};
