"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";
import type { Issue } from "@/interfaces/issues";
import { fetchIssuesUri } from "@/services/issues.service";
import { setIssues } from "@/store/slices/issues.slice";
import { Box, Filter, LayoutGrid, Loader, PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import IssueKanbanView from "../issues/components/issue-kanban-view";
import IssueListView from "../issues/components/issue-list-view";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterDropdown } from "@/components/filter-dropdown";
import {
  IssueFilterDropdown,
  type ProjectFilters,
} from "@/components/issue-filter-dropdown";

export default function Issues() {
  const { currentWorkspace } = useUser();
  const { "team-id": teamId } = useParams();
  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamId) return;
    console.log(" Fetching issues for teamId:", teamId);
    console.log(" Workspace ID:", currentWorkspace?.id);
    setLoading(true);

    fetchIssuesUri(currentWorkspace!.id, Number(teamId))
      .then((res) => {
        dispatch(setIssues(res.data));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [teamId, currentWorkspace, dispatch]);

  const [view, setView] = useState(0);
  const [activeFilters, setActiveFilters] = useState<ProjectFilters>({
    status: [],
    priority: [],
    teams: [],
    members: [],
    labels: [],
  });

  const rawIssues = useSelector((state: any) => state.issues);
  const statusList = useSelector((state: any) => state.issuesStatus) ?? [];
  console.log("ROW ISSUES", rawIssues);
  console.log("STATUS LIST", statusList);

  const mappedIssues = Object.entries(rawIssues).reduce(
    (acc: Record<string, any[]>, [status, issues]: any) => {
      const mappedStatus = status.toLowerCase().replace(/\s+/g, "-");

      const mappedIssuesList = (issues || []).map((issue: any) => ({
        id: issue.id,
        key: issue.issue_key,
        name: issue.name,
        description: issue.description,
        priority: issue.priority_detail?.name?.toLowerCase() || "low",
        priority_id: issue.priority_id, 
        status_id: issue.status_id, 
        // labels: issue.labels?.map((label: any) => label.name || label) || [],
        projects: issue.projects?.name || "No Project",
        due_date: issue.due_date || null, 
        due_date_formatted: issue.due_date
          ? new Date(issue.due_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "No date", // Formatted version for display
        assignee: {
          name: issue.assignee?.name || "Unassigned",
          avatar: issue.assignee?.avatar || null,
          id: issue.assignee?.id, // Keep assignee ID for filtering
        },
        status: status,
        sub_issues: issue.sub_issues,
        team_id: issue.team_id,
      }));

      acc[mappedStatus] = mappedIssuesList;
      return acc;
    },
    {}
  );

  const finalIssues = useMemo(() => {
    const result: Record<string, any[]> = {};

    statusList.forEach((status: any) => {
      const slug = status.name.toLowerCase().replace(/\s+/g, "-");
      result[slug] = mappedIssues[slug] || [];
    });

    return result;
  }, [mappedIssues, statusList]);

  // Handle filter changes
  const handleFilterChange = (filters: ProjectFilters) => {
    setActiveFilters(filters);
  };

  // Apply filters to issues data
  const filteredIssues = useMemo(() => {
    // If no filters active, return all issues
    if (Object.values(activeFilters).every((arr) => arr.length === 0)) {
      return finalIssues;
    }

    // Filter each status group
    const filtered: Record<string, any[]> = {};

    Object.entries(finalIssues).forEach(([status, issues]) => {
      filtered[status] = (issues as any[]).filter((issue: any) => {
        // Check status filter
        if (activeFilters.status.length > 0) {
          if (!activeFilters.status.includes(issue.status_id)) {
            return false;
          }
        }

        // Check priority filter
        if (activeFilters.priority.length > 0) {
          if (!activeFilters.priority.includes(issue.priority_id)) {
            return false;
          }
        }

        // Check team filter
        if (activeFilters.teams.length > 0) {
          if (!activeFilters.teams.includes(issue.team_id)) {
            return false;
          }
        }

        // Check members filter (assignee)
        if (activeFilters.members.length > 0) {
          const assigneeId = issue.assignee?.id;
          if (!assigneeId || !activeFilters.members.includes(assigneeId)) {
            return false;
          }
        }

        // Check labels filter
        if (activeFilters.labels.length > 0) {
          const issueLabels = issue.labels || [];
          const hasMatchingLabel = activeFilters.labels.some((label) =>
            issueLabels.includes(label)
          );
          if (!hasMatchingLabel) {
            return false;
          }
        }

        return true;
      });
    });

    return filtered;
  }, [finalIssues, activeFilters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background dark:bg-[#17181b] border border-b">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between border-b h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" className="text-xs">
                <Box />
                All Issues
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewIssueDialog(true)}
              >
                <PlusIcon className="h-4 w-4" />
                Add Issue
              </Button>

              {/* <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
              >
                <CirclePlay />
                Active
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
              >
                <CircleDashed />
                Backlog
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
              >
                <SquarePlus />
                New view
              </Button> */}
            </div>
          </div>
        </header>
        <div className="flex items-center justify-between px-3 py-1 border-b">
          <IssueFilterDropdown onFilterChange={handleFilterChange} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <LayoutGrid className="w-2 h-2 mr-2" />
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {view == 0 ? (
          // <div className=""></div>
          <IssueListView
            issuesData={filteredIssues}
            showNewIssueDialog={showNewIssueDialog}
            setShowNewIssueDialog={setShowNewIssueDialog}
          />
        ) : (
          <IssueKanbanView issuesData={filteredIssues} />
        )}
      </div>
    </div>
  );
}
