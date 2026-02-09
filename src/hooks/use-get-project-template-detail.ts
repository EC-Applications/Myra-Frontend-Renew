import { fetchProjectTemplateDetailUri } from "@/services/project-template.service";
import { useQuery } from "@tanstack/react-query";

export const useGetProjectTemplateDetailHook = (id: number | undefined) => {
  return useQuery({
    queryKey: ["project-template-detail", id],
    queryFn: async () => {
      const res = await fetchProjectTemplateDetailUri(id!);
      return res.data;
    },
    enabled: !!id && !isNaN(id),
  });
};
    