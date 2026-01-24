import {
  ArrowRightLeft,
  BellDot,
  BookUser,
  ChartSpline,
  CircleChevronUp,
  CircleDotDashed,
  CircleUserRound,
  Code,
  Cpu,
  CreditCard,
  Earth,
  File,
  Flame,
  Hotel,
  LayoutGrid,
  Settings2,
  Shield,
  Smile,
  SpellCheck,
  StickyNote,
  Sun,
  Tag,
  Zap,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";




export function SettingsSidebar() {
  const navigate = useNavigate();
  const teamsData = useSelector((state: any) => state.teams) || [];
  const location = useLocation();
  const currentPath = location.pathname;
  const groups = [

    {
      title: "",
      items: [
        {
          title: "Preferences",
          url: "/settings/account/preferences",
          icon: Settings2,
        },
        {
          title: "Profile",
          url: "/settings/account/profile",
          icon: CircleUserRound,
        },
        {
          title: "Notifications",
          url: "/settings/account/notifications",
          icon: BellDot,
        },
        {
          title: "Security & Access",
          url: "/settings/account/security",
          icon: BellDot,
        },
        {
          title: "Connected Accounts",
          url: "/settings/account/connections",
          icon: Cpu,
        },
      ],
    },
    {
      title: "Issues",
      items: [
        {
          title: "Labels",
          url: "/settings/issues/labels",
          icon: Tag,
        },
        {
          title: "Templates",
          url: "/settings/issues/templates",
          icon: StickyNote,
        },
        {
          title: "SLAs",
          url: "/settings/issues/sla",
          icon: Flame,
        },
      ],
    },
    {
      title: "Projects",
      items: [
        {
          title: "Labels",
          url: "/settings/projects/labels",
          icon: Tag,
        },
        {
          title: "Templates",
          url: "/settings/projects/templates",
          icon: StickyNote,
        },
        {
          title: "Statuses",
          url: "/settings/projects/statuses",
          icon: CircleDotDashed,
        },
        {
          title: "Updates",
          url: "/settings/projects/updates",
          icon: ChartSpline,
        },
      ],
    },
    {
      title: "Features",
      items: [
        {
          title: "Initiatives",
          url: "/settings/features/initiatives",
          icon: CircleChevronUp,
        },
        {
          title: "Documents",
          url: "/settings/features/documents",
          icon: File,
        },
        {
          title: "Customer Requests",
          url: "/settings/features/customers-requests",
          icon: BookUser,
        },
        {
          title: "Pulse",
          url: "/settings/features/pulse",
          icon: Zap,
        },
        {
          title: "Product Intelligence",
          url: "/settings/features/product-intelligence",
          icon: Sun,
        },
        {
          title: "Asks",
          url: "/settings/features/asks",
          icon: SpellCheck,
        },
        {
          title: "Emojis",
          url: "/settings/features/emojis",
          icon: Smile,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "Workspace",
          url: "/settings/administration/workspace",
          icon: Hotel,
        },
        {
          title: "Teams",
          url: "/settings/administration/teams",
          icon: ArrowRightLeft,
        },
        {
          title: "Security",
          url: "/settings/administration/security",
          icon: Shield,
        },
        {
          title: "API",
          url: "/settings/administration/api",
          icon: Code,
        },
        {
          title: "Applications",
          url: "/settings/administration/applications",
          icon: LayoutGrid,
        },
        {
          title: "Billing",
          url: "/settings/administration/billing",
          icon: CreditCard,
        },
        {
          title: "Import / Export",
          url: "/settings/administration/import-export",
          icon: ArrowRightLeft,
        },
      ],
    },
    {
      title: "Your teams",
      items: teamsData.map((t: any) => ({
        title: t.name,
        url: `/settings/teams/${t.id}`,
        icon: Earth,
      })),
    },
  ];


  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <Button onClick={() => navigate('/')} className="cursor-pointer  hover:border hover:transition" variant="secondary" size="sm">
          Back To Home
        </Button>
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            {group.title ? (
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            ) : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item: any) => {
                  const isActive = currentPath === item.url ||
                    currentPath.startsWith(item.url + '/');
                  console.log('Current Path:', currentPath);
                  console.log('Item URL:', item.url);
                  console.log('Is Active:', isActive);

                  return (
                    <SidebarMenuItem key={item.title} >
                      <SidebarMenuButton asChild isActive={isActive} >
                        <Link to={item.url} >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
