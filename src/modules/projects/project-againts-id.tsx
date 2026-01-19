import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Activity,
  AlertTriangle,
  Box,
  Cloud,
  Database,
  DiamondPlus,
  Filter,
  LayoutGrid,
  Lock,
  Plus,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NewProject } from "./components/new-project";
import ProjectKanban from "./components/project-kanban";
import ProjectList from "./components/project-list";
import ProjectTimeline from "./components/project-timeline";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useUser } from "@/hooks/use-user";
import { fetchProjectById } from "@/services/project.service";
import type { iProject } from "@/interfaces/project.interface";
import ProjectSkeleton from "./skelton-loader";
import {
  FilterDropdown,
  type ProjectFilters,
} from "@/components/filter-dropdown";
import { useGetProjectIdHook } from "@/hooks/use-get-project-id";

// const projects = [
//     {
//         id: 1,
//         name: "Myra Next JS",
//         description: "Backend Development",
//         progress: 25,
//         icon: Settings,
//         iconColor: "text-cyan-400",
//         health: { status: "At risk", color: "bg-yellow-500", duration: "5w" },
//         priority: "high",
//         lead: { name: "John", avatar: "/placeholder.svg?height=32&width=32" },
//         targetDate: "Aug 31",
//         status: 39,
//     },
//     {
//         id: 2,
//         name: "Enroute",
//         description: "Website/Landing Launch",
//         progress: 45,
//         icon: Settings,
//         iconColor: "text-green-400",
//         health: { status: "Off track", color: "bg-red-500", duration: "5w" },
//         priority: "high",
//         lead: { name: "Sarah", avatar: "/placeholder.svg?height=32&width=32" },
//         targetDate: "Aug 2025",
//         status: 63,
//     },
//     {
//         id: 3,
//         name: "Jab Chaho",
//         description: "Change Requests Closure • Jul 20",
//         progress: 32,
//         icon: Lock,
//         iconColor: "text-yellow-400",
//         health: { status: "On track", color: "bg-green-500", duration: "5w" },
//         priority: "medium",
//         lead: { name: "Mike", avatar: "/placeholder.svg?height=32&width=32" },
//         targetDate: "Aug 31",
//         status: 49,
//     },
//     {
//         id: 4,
//         name: "JC Refactor",
//         description: "Admin Portal Revamp",
//         progress: 25,
//         icon: AlertTriangle,
//         iconColor: "text-yellow-400",
//         health: { status: "At risk", color: "bg-yellow-500", duration: "5w" },
//         priority: "medium",
//         lead: { name: "Alex", avatar: "/placeholder.svg?height=32&width=32" },
//         targetDate: "Aug 15",
//         status: 25,
//     },
//     {
//         id: 5,
//         name: "Myra Cloud",
//         description: "Figma Design Completion • Jul 31",
//         progress: 0,
//         icon: Cloud,
//         iconColor: "text-blue-400",
//         health: { status: "On track", color: "bg-green-500", duration: "1mo" },
//         priority: "medium",
//         lead: { name: "Emma", avatar: "/placeholder.svg?height=32&width=32" },
//         targetDate: "Sep 30",
//         status: 42,
//     },
//     {
//         id: 6,
//         name: "IT Vault",
//         description: "",
//         progress: 0,
//         icon: Zap,
//         iconColor: "text-gray-400",
//         health: { status: "No updates", color: "bg-gray-500", duration: "" },
//         priority: "low",
//         lead: { name: "Tom", avatar: "/placeholder.svg?height=32&width=32" },
//         targetDate: "H2 2025",
//         status: 0,
//     },
//     {
//         id: 7,
//         name: "Blynk AI",
//         description: "",
//         progress: 0,
//         icon: Sparkles,
//         iconColor: "text-blue-400",
//         health: { status: "No updates", color: "bg-gray-500", duration: "" },
//         priority: "low",
//         lead: { name: "Lisa", avatar: "/placeholder.svg?height=32&width=32" },
//         targetDate: "2026",
//         status: 0,
//     },
//     {
//         id: 8,
//         name: "Scrape Flow",
//         description: "",
//         progress: 0,
//         icon: Activity,
//         iconColor: "text-gray-400",
//         health: { status: "No updates", color: "bg-gray-500", duration: "" },
//         priority: "none",
//         lead: { name: "Chris", avatar: "/placeholder.svg?height=32&width=32" },
//         targetDate: "",
//         status: 25,
//     },
//     {
//         id: 9,
//         name: "Mealer",
//         description: "",
//         progress: 0,
//         icon: Database,
//         iconColor: "text-gray-400",
//         health: { status: "No updates", color: "bg-gray-500", duration: "" },
//         priority: "none",
//         lead: { name: "Jordan", avatar: "/placeholder.svg?height=32&width=32" },
//         targetDate: "",
//         status: 0,
//     },
// ];

const ProjectAgainstTeamId = () => {
  const { "team-id": teamId } = useParams();
  const { currentWorkspace } = useUser();
  // const projectState = useSelector((state: any) => state.project);
  // const data = projectState?.projects || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState(0);

  const [loading, setLoading] = useState(false);
  // const [data, setData] = useState<iProject[]>([]);
  // console.log("extracted data", data);

  const { data } = useGetProjectIdHook(
    Number(currentWorkspace?.id),
    Number(teamId),
  );

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetchProjectById(
  //         currentWorkspace?.id,
  //         Number(teamId),
  //       );
  //       console.log("DATADAA", res.data);
  //       setData(res.data || []);
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [teamId, currentWorkspace?.id]);

  const [activeFilters, setActiveFilters] = useState<ProjectFilters>({
    status: [],
    priority: [],
    teams: [],
    members: [],
    labels: [],
  });

  const handleFilterChange = (filters: ProjectFilters) => {
    setActiveFilters(filters);
  };

  // Apply filters to project data
  const filteredData = useMemo(() => {
    console.log("🔍 Filtering with:", activeFilters);

    // Debug: Log first project's team structure
    // if (data.length > 0) {
    //   console.log("📊 Sample Project Data:", {
    //     name: data[0].name,
    //     team_id: data[0].team_id,
    //     teams: data[0].teams,
    //     members: data[0].members,
    //   });
    // }

    return data?.filter((project: any) => {
      // Check status filter
      if (
        activeFilters.status.length > 0 &&
        !activeFilters.status.includes(project.status_id)
      ) {
        return false;
      }

      // Check priority filter
      if (
        activeFilters.priority.length > 0 &&
        !activeFilters.priority.includes(project.priority_id)
      ) {
        return false;
      }

      // Check members filter (includes both members array and lead)
      if (activeFilters.members.length > 0) {
        // Extract member IDs from members array of objects
        const projectMemberIds = project.members?.map((m: any) => m.id) || [];

        // Also include lead_id if exists
        const allMemberIds = project.lead_id
          ? [...projectMemberIds, project.lead_id]
          : projectMemberIds;

        const hasMatchingMember = activeFilters.members.some((id) =>
          allMemberIds.includes(id),
        );

        console.log("👤 Members Filter:", {
          projectName: project.name,
          projectMembers: project.members,
          projectMemberIds,
          projectLeadId: project.lead_id,
          allMemberIds,
          selectedFilters: activeFilters.members,
          hasMatchingMember,
        });

        if (!hasMatchingMember) {
          return false;
        }
      }

      // Check teams filter
      if (activeFilters.teams.length > 0) {
        // Extract team IDs from teams array of objects
        const projectTeamIds = project.teams?.map((t: any) => t.id) || [];
        const hasMatchingTeam = activeFilters.teams.some((id) =>
          projectTeamIds.includes(id),
        );

        console.log("👥 Teams Filter:", {
          projectName: project.name,
          projectTeams: project.teams,
          projectTeamIds,
          selectedFilters: activeFilters.teams,
          hasMatchingTeam,
        });

        if (!hasMatchingTeam) {
          return false;
        }
      }

      // Check labels filter
      if (activeFilters.labels.length > 0) {
        const projectLabelIds = project.labels || [];
        const hasMatchingLabel = activeFilters.labels.some((label) =>
          projectLabelIds.includes(label),
        );

        if (!hasMatchingLabel) {
          return false;
        }
      }

      return true;
    });
  }, [data, activeFilters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="border rounded dark:border-zinc-800 min-h-screen dark:bg-[#101011]">
        <div className="space-y-4 ">
          {/* Header */}
          <header className="flex justify-between h-12 shrink-0 border-b px-4 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <h1 className="text-foreground text-[14px] font-semibold">
                Projects
              </h1>
              <div className="flex items-center space-x-1">
                <Button variant="outline" className="text-xs">
                  <Box />
                  All projects
                </Button>
                {/* <Button
                  variant="ghost"

                  className="text-xs text-muted-foreground"
                >
                  <DiamondPlus />
                  New view
                </Button> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add project
              </Button>
            </div>
          </header>

          {/* Controls */}
          <div className="flex items-center justify-between px-4">
            <FilterDropdown onFilterChange={handleFilterChange} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Display
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="left">
                <DropdownMenuCheckboxItem
                  checked={view == 0}
                  onCheckedChange={(e) => {
                    if (e) setView(0);
                  }}
                >
                  List
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={view == 1}
                  onCheckedChange={(e) => {
                    if (e) setView(1);
                  }}
                >
                  Board
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={view == 2}
                  onCheckedChange={(e) => {
                    if (e) setView(2);
                  }}
                >
                  Timeline
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {view == 0 ? (
            <ProjectList projects={filteredData} />
          ) : view == 1 ? (
            <ProjectKanban projectsData={filteredData} />
          ) : (
            <ProjectTimeline />
          )}
        </div>
      </div>
      <NewProject open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};
export default ProjectAgainstTeamId;
