import type { iUserResponse } from "@/interfaces/auth.interface";
import type { iWorkspace } from "@/interfaces/workspace.interface";
import { useAppSelector } from "@/store/hook";
import { useMemo } from "react";

// Define the return type for the hook
interface UserHookResult {
  currentUser: iUserResponse | null;
  currentWorkspace: iWorkspace | null;
  isAuthenticated: boolean;
}

export const useUser = (): UserHookResult => {
  const auth = useAppSelector((state) => state.auth);

  // Memoize the result to avoid recalculating unless auth changes
  return useMemo(() => {
    const currentUser = auth.users[auth.currentUser] || null;
    const currentWorkspace =
      currentUser?.owned_workspaces.find(
        (ws) => ws.id === auth.currentWorkspace
      ) || null;

    return {
      currentUser,
      currentWorkspace,
      isAuthenticated: !!currentUser && auth.currentUser !== 0,
    };
  }, [auth]);
};
