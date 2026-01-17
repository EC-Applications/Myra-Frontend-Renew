import { Box, ChevronRight, Layers2, SquareUser, Users } from "lucide-react";

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
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";

const NavWorkspace = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="w-fit focus-visible:ring-0 focus-visible:ring-offset-0">
            <span className="text-[14px]">Workspace</span>
            <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90 mt-1.5 ml-3" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={currentPath.startsWith('/projects')}>
                <Link to="/projects">
                  <Box />
                  <span className="font-semibold">Projects</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={currentPath.startsWith('/members')}>
                <Link to="/members">
                  <Users />
                  <span className="font-semibold">Members</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={currentPath === '/teams'}>
                <Link to="/teams">
                  <SquareUser />
                  <span className="font-semibold">Team</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              {/* <SidebarMenuButton asChild>
                <Link to="/customers">
                  <SquareUser />
                  <span>Customers</span>
                </Link>
              </SidebarMenuButton> */}
            </SidebarMenuItem>
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};

export default NavWorkspace;
