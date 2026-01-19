import { fetchIssuesUri } from "@/services/issues.service";
import { useQuery } from "@tanstack/react-query";

export const useGetIssuesHook = (workpsaceId: number, teamId: number) => {
  return useQuery({
    queryKey: ["issues", workpsaceId, teamId],
    queryFn: async () =>{
       const res = await  fetchIssuesUri(workpsaceId, teamId)
       return res.data;
    },
  });
};
