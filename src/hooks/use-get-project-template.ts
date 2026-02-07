import { projectTemplateListUri } from "@/services/project-template.service";
import { useQuery } from "@tanstack/react-query"

export const useGetProjectTemplateHook = (workspace_id: number) => {
    return useQuery({
        queryKey: ["project-template", workspace_id ],
        queryFn: async () => {
            const res = await projectTemplateListUri(workspace_id);
            return res.data;
        },
    })
}