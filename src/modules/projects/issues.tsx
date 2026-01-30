"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Issue } from "@/interfaces/issues";
import { Filter, LayoutGrid } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import IssueKanbanView from "../issues/components/issue-kanban-view";
import IssueListView from "../issues/components/issue-list-view";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@/hooks/use-user";
import { useParams } from "react-router";
import { fetchIssuesUri } from "@/services/issues.service";
import { setIssues } from "@/store/slices/issues.slice";
import type { ProjectFilters } from "@/components/filter-dropdown";
import { fetchProjectIssueUri } from "@/services/project.service";
import { useProjectIssuesHook } from "@/hooks/use-project-issues-hook";

const mockIssues: Issue[] = [
  {
    id: "ENG-55",
    title: "change dashboard and integrate APIs",
    status: "in-review",
    priority: "high",
    type: "bug",
    project: "Enroute",
    assignee: { name: "User", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "Jul 8",
    labels: ["Bug", "Enroute"],
  },
  {
    id: "ENG-100",
    title: "build password input › Authentication Pages Front End",
    status: "in-review",
    priority: "medium",
    type: "development",
    project: "Myra Cloud",
    assignee: { name: "User", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "Jul 22",
    labels: ["Development", "Myra Cloud"],
  },
  {
    id: "ENG-130",
    title: "Dashboard UI update - Rafay's design changes Deployment",
    status: "in-progress",
    priority: "high",
    type: "feature",
    project: "Enroute",
    assignee: { name: "User", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "Jul 16",
    labels: ["DevOps", "Feature", "Enroute"],
  },
  {
    id: "ENG-158",
    title: "Authentication Pages Front End",
    status: "in-progress",
    priority: "medium",
    type: "development",
    project: "Myra Cloud",
    assignee: { name: "User", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "Jul 20",
    labels: ["Development", "Myra Cloud"],
  },
  {
    id: "ENG-162",
    title: "Keyboard Shortcuts Foundation",
    status: "todo",
    priority: "low",
    type: "development",
    project: "Myra Cloud",
    assignee: { name: "User", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "Jul 20",
    labels: ["Development", "Myra Cloud"],
  },
  {
    id: "ENG-7",
    title: "Demo site not working",
    status: "done",
    priority: "high",
    type: "bug",
    project: "Enroute",
    assignee: { name: "User", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "Jul 7",
    labels: ["Bug", "Enroute"],
  },
  {
    id: "ENG-129",
    title: "Login Page Design Deployment",
    status: "done",
    priority: "medium",
    type: "feature",
    project: "Enroute",
    assignee: { name: "User", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "Jul 15",
    labels: ["Feature", "Enroute", "Mid-July Sprint"],
  },
  {
    id: "ENG-191",
    title: "Bug fixes told by sir Ahmed",
    status: "cancelled",
    priority: "low",
    type: "bug",
    project: "Enroute",
    assignee: { name: "User", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "Jul 22",
    labels: ["Bug", "Enroute"],
  },
];

const Issues = () => {
  const [view, setView] = useState(0);
  const { currentWorkspace } = useUser();
  const { "team-id": teamId, id: projectId } = useParams();

  console.log("TEAM ID", teamId);
  console.log("PROJECTID ID", projectId);
  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
  const dispatch = useDispatch();
  const { data: rawIssues } = useProjectIssuesHook(
    Number(currentWorkspace?.id),
    Number(projectId),
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamId && !projectId) return;
    // console.log(" Fetching issues for teamId:", teamId);
    // console.log(" Workspace ID:", currentWorkspace?.id);
    setLoading(true);
    const method = teamId
      ? fetchIssuesUri(currentWorkspace!.id, Number(teamId))
      : fetchProjectIssueUri(Number(projectId));
    method
      .then((res) => {
        console.log("PROJECT ISSUES DATA", res.data);
        dispatch(setIssues(res.data));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [teamId, currentWorkspace, dispatch]);

  const [activeFilters, setActiveFilters] = useState<ProjectFilters>({
    status: [],
    priority: [],
    teams: [],
    members: [],
    labels: [],
  });

  // const rawIssues = useSelector((state: any) => state.issues);
  const statusList = useSelector((state: any) => state.issuesStatus) ?? [];
  console.log("ROW ISSUES", rawIssues);
  console.log("STATUS LIST", statusList);

  const mappedIssues = Object.entries(rawIssues ?? []).reduce(
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
        labels: issue.labels,
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
        type: issue.type,
        issue_id: issue.issue_id,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        cycles: issue.cycles,
        parent_issue: issue.parent_issue,
      }));

      acc[mappedStatus] = mappedIssuesList;
      return acc;
    },
    {},
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
            issueLabels.includes(label),
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
    <>
      <div className="flex items-center  justify-end px-4 py-3 p border dark:border-zinc-800">
        {/* <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button> */}
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {view == 0 ? (
        <IssueListView
          issuesData={filteredIssues}
          showNewIssueDialog={showNewIssueDialog}
          setShowNewIssueDialog={setShowNewIssueDialog}
        />
      ) : (
        <IssueKanbanView issuesData={filteredIssues} />
      )}
    </>
  );
};

export default Issues;
