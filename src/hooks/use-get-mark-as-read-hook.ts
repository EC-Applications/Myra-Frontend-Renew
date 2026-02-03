import { markAsReadUri } from "@/services/general.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useMarkAsReadHook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ workspaceSlug, inboxTileId }: { workspaceSlug: string; inboxTileId: number }) => {
            const res = await markAsReadUri(workspaceSlug, inboxTileId);
            return res.data;
        },
        onSuccess: (data, variable) => {
            // Invalidate inbox data to refresh the list
            queryClient.invalidateQueries({ queryKey: ["inbox", variable.workspaceSlug ] });
        },
    });
}