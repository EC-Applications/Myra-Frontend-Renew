import {
  Box,
  ChevronRight,
  CirclePlay,
  Copy,
  Layers2,
  MoreHorizontal,
  SquareUser,
  Users,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setTeamId } from "@/store/slices/use-team-id";
import { IconPicker } from "@/modules/projects/components/icon-picker";

const NavTeams = () => {
  const teamsData = useSelector((state: any) => state.teams) || [];
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentPath = location.pathname;
  console.log("LOG NAV TEAM", teamsData);

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="w-fit focus-visible:ring-0 focus-visible:ring-offset-0">
            <span className="text-[14px]">Your Teams</span>
            <ChevronRight className=" transition-transform group-data-[state=open]/collapsible:rotate-90 mt-1.5 ml-3" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarMenu>
            {teamsData.length > 0 &&
              teamsData.map((t: any) => (
                <SidebarMenuItem key={t.id}>
                  <Collapsible defaultOpen className="group/sub">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <IconPicker variant="inline" value={t.icon} size={18} />
                        <span className="font-semibold dark:text-white">
                          {t.name}
                        </span>
                        <ChevronRight className="transition-transform group-data-[state=open]/sub:rotate-90 cursor-pointer" />

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <MoreHorizontal className="ml-auto cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/settings/teams/${t.id}`)
                              }
                            >
                              Team settings
                            </DropdownMenuItem>
                            <DropdownMenuItem>Copy link</DropdownMenuItem>
                            <DropdownMenuItem>Open archive</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Subscribe</DropdownMenuItem>
                            <DropdownMenuItem>
                              Configure Slack notifications…
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuButton
                            asChild
                            isActive={currentPath.startsWith(
                              `/teams/${t.id}/projects`,
                            )}
                            onClick={() => dispatch(setTeamId(t.id))}
                          >
                            <Link to={`/teams/${t.id}/projects`}>
                              <Box />
                              <span className="font-semibold">Projects</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>

                        <SidebarMenuSubItem>
                          <SidebarMenuButton
                            asChild
                            isActive={currentPath.startsWith(
                              `/teams/${t.id}/issues`,
                            )}
                          >
                            <Link to={`/teams/${t.id}/issues`}>
                              <Copy className="rotate-180" />
                              <span className="font-semibold">Issues</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>

                        {t.cycles_period.enable_cycle ? (
                          <SidebarMenuSubItem>
                            <SidebarMenuButton
                              asChild
                              isActive={currentPath.startsWith(
                                `/teams/${t.id}/cycles`,
                              )}
                            >
                              <Link to={`/teams/${t.id}/cycles`}>
                                <CirclePlay />
                                <span className="font-semibold">Cycles</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ) : (
                          <div className=""></div>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};

export default NavTeams;
