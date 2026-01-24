import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";
import type { iUserResponse } from "@/interfaces/auth.interface";
import { logout } from "@/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  changeAccount,
  changeWorkspace,
  logout as logoutAction,
} from "@/store/slices/auth.slice";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useState } from "react";
import Spinner from "./ui/spinner";

export function TeamSwitcher() {
  const [loggingOut, setLoggingOut] = useState(false);
  const { currentWorkspace, currentUser } = useUser();
  const { users } = useAppSelector((x) => x.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const switchWorkspace = (userId: number, workspaceId: number, workspaceName: string) => {
    dispatch(changeWorkspace({
      userId, workspaceId,
      workspaceName: workspaceName
    }));
    navigate("/", { replace: true });
    setTimeout(() => window.location.reload(), 100);
  };
  const handleLogout = () => {
    if (!loggingOut) {
      setLoggingOut(true);
      logout()
        .then(
          () => {
            dispatch(logoutAction());
          },
          (er) => {
            console.warn(er);
            toast.error("Something went wrong while trying to logout.");
          }
        )
        .finally(() => setLoggingOut(false));
    }
  };

  const getWorkspaceInitials = (name: string) => {
    const words = name?.trim().split(/\s+/) || [];
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name?.slice(0, 2).toUpperCase() || "";
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full px-1.5">
              {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 items-center justify-center rounded-md"> */}
              <Avatar className="h-6 rounded-sm">
                <AvatarFallback className="dark:bg-[#2a2c33] dark:text-white font-medium text-xs rounded-sm">
                  {getWorkspaceInitials(currentWorkspace?.name || "")}
                </AvatarFallback>
              </Avatar>
              {/* </div> */}
              <span className="truncate font-medium">
                {currentWorkspace?.name}
              </span>
              <ChevronDown className="opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/members")}>
                Invite and manage members
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Switch Workspace
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-56 ms-2 mt-1">
                    <DropdownMenuLabel className="px-1 mb-3 font-semibold text-muted-foreground text-xs">
                      Organizations
                    </DropdownMenuLabel>

                    {Object.values(users).map((x: iUserResponse) => (
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="px-2 font-semibold text-muted-foreground text-sm">
                          {x.email}
                        </DropdownMenuLabel>

                        {x.owned_workspaces.length == 0 ? (
                          <DropdownMenuItem
                            onClick={() => {
                              dispatch(changeAccount(x));
                              navigate("/workspace-setup");
                              setTimeout(() => window.location.reload(), 100);
                            }}
                          >
                            Create or join a workspace
                          </DropdownMenuItem>
                        ) : (
                          x.owned_workspaces.map((y) => (
                            <DropdownMenuCheckboxItem
                              checked={
                                currentWorkspace!.id == y.id &&
                                currentUser!.id == x.id
                              }
                              onCheckedChange={(e) => {
                                if (e) switchWorkspace(x.id, y.id, y.name);
                              }}
                            >
                              {y.name}
                            </DropdownMenuCheckboxItem>
                          ))
                        )}
                      </DropdownMenuGroup>
                    ))}
                    <DropdownMenuLabel className="px-1 my-3 font-semibold text-muted-foreground text-xs">
                      Account
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        navigate("/workspace-setup");
                      }}
                    >
                      Create or join a workspace
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/add-account")}>
                      Add an Account
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? (
                  <>
                    <Spinner size="xs" /> Logging out
                  </>
                ) : (
                  "Log out"
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
