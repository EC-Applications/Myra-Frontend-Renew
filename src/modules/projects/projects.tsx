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
import { useMemo, useState } from "react";
import { NewProject } from "./components/new-project";
import ProjectKanban from "./components/project-kanban";
import ProjectList from "./components/project-list";
import ProjectTimeline from "./components/project-timeline";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useUser } from "@/hooks/use-user";
import {
  FilterDropdown,
  type ProjectFilters,
} from "@/components/filter-dropdown";
import type { RootState } from "@/store/store";
import { useGetAllProject } from "@/hooks/use-get-all-project";

const Projects = () => {
  const { "team-id": teamId } = useParams();
  const { currentUser, currentWorkspace } = useUser();
  const { data} = useGetAllProject(currentWorkspace?.slug || "" );
  // const projectState = useSelector((state: any) => state.project);
  const status = useSelector((state: RootState) => state.status);
  // console.log("STATAUS", status);

  // const data = useMemo(
  //   () => projectState?. projects || [],
  //   [projectState?.projects]
  // );
  // console.log("extracted data", data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
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
    if (!data) return [];

    // console.log("🔍 Filtering with:", activeFilters);

    return data.filter((project: any) => {
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
        const projectMemberIds = project.members?.map((m: any) => m.id) || [];
        const hasMatchingMember = activeFilters.members.some((id) =>
          projectMemberIds.includes(id)
        );
        const hasMatchingLead =
          project.lead_id && activeFilters.members.includes(project.lead_id);

        // console.log("👤 Members Filter:", {
        //   projectName: project.name,
        //   projectMemberIds,
        //   projectLeadId: project.lead_id,
        //   selectedFilters: activeFilters.members,
        //   hasMatchingMember,
        //   hasMatchingLead,
        //   willPass: hasMatchingMember || hasMatchingLead,
        // });

        if (!hasMatchingMember && !hasMatchingLead) {
          return false;
        }
      }

      // Check teams filter
      if (activeFilters.teams.length > 0) {
        // Extract team IDs from teams array of objects
        const projectTeamIds = project.teams?.map((t: any) => t.id) || [];
        const hasMatchingTeam = activeFilters.teams.some((id) =>
          projectTeamIds.includes(id)
        );

        // console.log("👥 Teams Filter:", {
        //   projectName: project.name,
        //   projectTeams: project.teams,
        //   projectTeamIds,
        //   selectedFilters: activeFilters.teams,
        //   hasMatchingTeam,
        // });

        if (!hasMatchingTeam) {
          return false;
        }
      }

      // Check labels filter
      if (activeFilters.labels.length > 0) {
        const projectLabelIds = project.labels || [];
        const hasMatchingLabel = activeFilters.labels.some((label) =>
          projectLabelIds.includes(label)
        );

        if (!hasMatchingLabel) {
          return false;
        }
      }

      return true;
    });
  }, [data, activeFilters]);

  return (
    <>
      <div className="border rounded dark:border-zinc-800 min-h-screen dark:bg-[#17181b]">
        <div className="space-y-4 ">
          {/* Header */}
          <header className="flex justify-between h-12 shrink-0 border-b px-4 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <h1 className="text-foreground text-md font-semibold">Projects</h1>
              <div className="flex items-center space-x-1">
                <Button variant="noBorder" className="text-[14px]">
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
            <div className="flex items-center gap-2 ">
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
                <Button variant="noBorder" size="sm">
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
export default Projects;
