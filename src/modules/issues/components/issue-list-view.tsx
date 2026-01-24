import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import type { iCycleListResponse } from "@/interfaces/cycle.interface";
import type { iIssues } from "@/interfaces/issues";
import type { iIssueStatus } from "@/interfaces/issues-status.interface";
import type { iMember } from "@/interfaces/teams.interface";
import { ProjectDatePicker } from "@/modules/projects/components/date-picker";
import { PriorityPicker } from "@/modules/projects/components/priority-picker";
import { SingleMemberPicker } from "@/modules/projects/components/single-member-picker";
import { fetchCycleListUri } from "@/services/cycle.service";
import {
  deleteIssueUri,
  fetchIssuesUri,
  updateIssuesUri,
} from "@/services/issues.service";
import { setIssues } from "@/store/slices/issues.slice";
import type { RootState } from "@/store/store";
import { format } from "date-fns";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  MoreHorizontal,
  Plus,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import NewIssueDialog from "../new-issue";
import { IssuesStatusPicker } from "./issues-status-picker";
import { fetchProjectIssueUri } from "@/services/project.service";
import { useTheme } from "@/components/theme-provider";
import { useUpdateIssueHook } from "@/hooks/use-issue-update";
import { useDeleteIssueHook } from "@/hooks/use-delete-issue";

const IssueListView: FC<{
  issuesData: Record<string, iIssues[]>;
  showNewIssueDialog: boolean;
  setShowNewIssueDialog: Dispatch<SetStateAction<boolean>>;
}> = ({ issuesData, setShowNewIssueDialog, showNewIssueDialog }) => {
  const { "team-id": teamId, id: projectId } = useParams();
  const teamset = useSelector((state: RootState) => state.useTeamId);

  console.log("TEAM ID", teamId);
  console.log("ProjectID", projectId);
  const { currentWorkspace } = useUser();
  console.log("ISSUES DATA IN LIST VIEW", issuesData);
  const [expandedSections, setExpandedSections] = useState<string[]>(
    Object.keys(issuesData),
  );
  const updateIssueStatus = useUpdateIssueHook();
  const deleteIssue = useDeleteIssueHook();

  const [defStatus, setDefaultStatus] = useState<number>();
  const [defProject, setDefProject] = useState<number>();

  console.log("SET TEAM ID", teamset);

  const [cycleData, setCycleData] = useState<iCycleListResponse[]>();
  useEffect(() => {
    try {
      fetchCycleListUri(currentWorkspace?.slug ?? "", Number(teamId)).then(
        (res) => {
          setCycleData(res.data);
          console.log("CYCLE DATA IN LIST", cycleData);
        },
      );
    } catch (error) {
      console.log(error);
    }
  }, [teamId]);

  useEffect(() => {
    const statusKeys = Object.keys(issuesData);
    if (statusKeys.length > 0) {
      setExpandedSections(statusKeys);
    }
  }, [issuesData]);

  // MEMBER GET
  const workspaceMember = useSelector((state: any) => state.workspace);
  const members = Array.isArray(workspaceMember) ? workspaceMember : [];

  // STATUS GET
  const status = useSelector((state: RootState) => state.issuesStatus);
  const statusList = status ?? [];

  console.log("DYNMAIC STATUS", statusList);

  const [priorityId, setPriorityId] = useState<number | undefined>();
  const [activeTab, setActiveTab] = useState("all");

  const dispatch = useDispatch();
  const statusConfig = Object.fromEntries(
    statusList.map((s) => [
      s.name.toLowerCase().replace(/\s+/g, "-"), // slug
      { id: s.id, name: s.name, icon: s.icon },
    ]),
  );

  const toggleSection = (status: string) => {
    setExpandedSections((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const handleIssueDelete = async (issueId: number, teamid: number) => {
    const loadingToast = toast.loading("Deleting issue...");

    console.log(issueId);

    try {
      deleteIssue.mutate({
        issueId: Number(issueId),
        teamId: teamid,
        workspaceId: Number(currentWorkspace?.id),
      });
      // const res = await deleteIssueUri(issueId);
      // toast.success(res.data.message);
      const method = teamId
        ? fetchIssuesUri(currentWorkspace!.id, Number(teamId))
        : fetchProjectIssueUri(Number(projectId));
      method.then((res) => {
        dispatch(setIssues(res.data));
      });
    } catch (e) {
      console.log(e);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handlePriorityUpdate = async (
    issuid: number,
    priorityId: number,
    tId: number,
  ) => {
    try {
      updateIssueStatus.mutate({
        issueId: Number(issuid),
        body: {
          priority_id: priorityId,
          workspace_id: currentWorkspace?.id,
          team_id: Number(tId),
        },
        teamId: Number(tId),
        workspaceId: Number(currentWorkspace?.id),
      });
      // const payload = {
      //   priority_id: priorityId,
      //   workspace_id: currentWorkspace?.id,
      //   team_id: tId,
      // };

      // await updateIssuesUri(Number(issuid), payload);
      // setPriorityId(priorityId);

      const method = teamId
        ? fetchIssuesUri(currentWorkspace!.id, Number(teamId))
        : fetchProjectIssueUri(Number(projectId));
      method.then((res) => {
        dispatch(setIssues(res.data));
      });
      // toast.success("Priority updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update priority");
    }
  };

  const handleTargetDate = async (
    issueId: number,
    date: Date | null,
    tId: number,
  ) => {
    try {
      updateIssueStatus.mutate({
        issueId: Number(issueId),
        body: {
          due_date: date ? format(date, "yyyy-MM-dd") : undefined,
          workspace_id: currentWorkspace?.id,
          team_id: Number(tId),
        },
        teamId: Number(tId),
        workspaceId: Number(currentWorkspace?.id),
      });
      // const payload = {
      //   due_date: date ? format(date, "yyyy-MM-dd") : undefined,
      //   workspace_id: currentWorkspace?.id,
      //   team_id: Number(tId),
      // };
      // await updateIssuesUri(Number(issueId), payload);

      const method = teamId
        ? fetchIssuesUri(currentWorkspace!.id, Number(teamId))
        : fetchProjectIssueUri(Number(projectId));
      method.then((res) => {
        dispatch(setIssues(res.data));
      });
      // toast.success("Date updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleAssigneUpdate = async (
    issueId: number,
    member: iMember | undefined,
    tId: number,
  ) => {
    try {
      updateIssueStatus.mutate({
        issueId: Number(issueId),
        body: {
          assignee_id: member?.id,
          workspace_id: currentWorkspace?.id,
          team_id: Number(tId),
        },
        teamId: Number(tId),
        workspaceId: Number(currentWorkspace?.id),
      });
      // const payload = {
      //   assignee_id: member?.id,
      //   workspace_id: currentWorkspace?.id,
      //   team_id: tId,
      // };
      // await updateIssuesUri(Number(issueId), payload);

      const method = teamId
        ? fetchIssuesUri(currentWorkspace!.id, Number(teamId))
        : fetchProjectIssueUri(Number(projectId));
      method.then((res) => {
        dispatch(setIssues(res.data));
      });
      // toast.success("Assigne updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleStatusUpdate = async (
    issueId: number,
    status: iIssueStatus,
    tId: number,
  ) => {
    try {
      updateIssueStatus.mutate({
        issueId: Number(issueId),
        body: {
          status_id: status.id,
          workspace_id: currentWorkspace?.id,
          team_id: Number(tId),
        },
        teamId: Number(tId),
        workspaceId: Number(currentWorkspace?.id),
      });
      // const payload = {
      //   status_id: status.id,
      //   workspace_id: currentWorkspace?.id,
      //   team_id: Number(tId),
      // };
      // await updateIssuesUri(Number(issueId), payload);

      const method = teamId
        ? fetchIssuesUri(currentWorkspace!.id, Number(teamId))
        : fetchProjectIssueUri(Number(projectId));
      method.then((res) => {
        dispatch(setIssues(res.data));
      });
      // toast.success("Status updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Status colors mapping (left to right gradient)
  const statusColors: Record<string, { from: string; to: string }> = isDark
    ? {
        "In Review": { from: "#171d1c", to: "#17181a" },
        Todo: { from: "#1a1b1d", to: "#18191b" },
        "In Progress": { from: "#1c1b1b", to: "#18181b" },
        Done: { from: "#1a1b24", to: "#18191c" },
        Backlog: { from: "#1b1c1e", to: "#17181a" },
        Canceled: { from: "#1b1c1e", to: "#17181a" },
        Duplicate: { from: "#1b1c1e", to: "#17181a" },
      }
    : {
        "In Review": { from: "#f3f6f4", to: "#f5f6f5" },
        Todo: { from: "#f6f6f6", to: "#f5f6f5" },
        "In Progress": { from: "#f7f5f3", to: "#f5f6f5" },
        Done: { from: "#f5f5fc", to: "#f5f6f5" },
        Backlog: { from: "#f5f5f5", to: "#f5f6f5" },
        Canceled: { from: "#f5f5f6", to: "#f5f6f5" },
        Duplicate: { from: "#f5f5f6", to: "#f5f6f5" },
      };

  console.log("def status", defStatus);
  return (
    <>
      <div className="flex-1  overflow-auto dark:bg-[#17181b]">
        {Object.keys(issuesData).length === 0 ||
        Object.values(issuesData).every((issues) => issues.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                No issues yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Get started by creating your first issue to track work and bugs.
              </p>
            </div>
            <Button
              onClick={() => setShowNewIssueDialog(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New issue
            </Button>
          </div>
        ) : (
          // Regular issue list
          <div className="">
            {Object.keys(issuesData).map((status) => {
              console.log(issuesData);
              const issues = issuesData[status] || [];
              const isExpanded = expandedSections.includes(status);
              const config = statusConfig[
                status as keyof typeof statusConfig
              ] || {
                label:
                  status.charAt(0).toUpperCase() +
                  status.slice(1).replace(/-/g, " "),
                icon: Circle,
                color: "text-gray-600",
              };

              if (issues.length === 0) return null;
              console.log("DYANAMIC COFIG", config);
              const gradientColors = statusColors[config.name] || {
                from: "#191b22",
                to: "#191b22",
              };
              return (
                <div key={status} className="">
                  <div
                    onClick={() => toggleSection(status)}
                    className="w-full flex items-center justify-between transition-colors cursor-pointer p-1 bg-gradient-to-r border dark:border-zinc-900"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.to})`,
                    }}
                  >
                    <div className="flex items-center gap-2 ">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 " />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <img className="h-4 w-4" src={config.icon} alt="" />
                      <span className="font-medium text-[#565758] dark:text-white">
                        {config.name}
                      </span>
                      <Badge variant="noBorder" className="text-xs">
                        {issues.length}
                      </Badge>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDefaultStatus(statusConfig[status].id);
                        setShowNewIssueDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {isExpanded && issues.length > 0 && (
                    <div className="">
                      {issues.map((issue) => {
                        console.log("issuedadtada", issue);
                        return (
                          <div
                            key={issue.id}
                            className="flex items-center gap-2 py-2 px-6  hover:bg-muted/50  last:border-b-0"
                          >
                            <PriorityPicker
                              variant="icon-only"
                              className="border-0"
                              buttonVarient="dark"
                              value={issue.priority_id ?? undefined}
                              onChange={(newPriorityId) => {
                                handlePriorityUpdate(
                                  issue.id,
                                  newPriorityId,
                                  issue.team_id,
                                );
                                console.log(
                                  "Update priority:",
                                  issue.id,
                                  newPriorityId,
                                );
                              }}
                            />

                            <IssuesStatusPicker
                              variant="icon-only"
                              statuses={statusList}
                              value={
                                statusList.find(
                                  (s) => s.id === issue.status_id,
                                ) ?? null
                              }
                              onChange={(newStatus) => {
                                handleStatusUpdate(
                                  issue.id,
                                  newStatus,
                                  issue.team_id,
                                );
                              }}
                            />

                            <Link
                              to={`/issues/${issue.id}`}
                              className="flex items-center gap-2 min-w-0 flex-1"
                            >
                              <Badge
                                variant="noBorder"
                                className="text-[13px] text-muted-foreground py-1.5"
                              >
                                {issue.key}
                              </Badge>
                              <span className="text-sm font-semibold truncate">
                                {issue.name}
                              </span>
                            </Link>

                            <div className="flex items-center gap-2">
                              {(issue.labels as any)?.map(
                                (label: any, idx: number) => (
                                  <Badge
                                    key={idx}
                                    variant={
                                      label === "Bug"
                                        ? "destructive"
                                        : label === "Feature"
                                          ? "default"
                                          : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {label}
                                  </Badge>
                                ),
                              )}
                              {/* <Badge variant="outline" className="text-xs">
                                {issue.projects}
                              </Badge> */}

                              <ProjectDatePicker
                                variant="inline"
                                value={
                                  issue.due_date &&
                                  !isNaN(new Date(issue.due_date).getTime())
                                    ? new Date(issue.due_date)
                                    : undefined
                                }
                                onChange={(newDate) => {
                                  handleTargetDate(
                                    issue.id,
                                    newDate,
                                    issue.team_id,
                                  );
                                  console.log(
                                    "Update due date:",
                                    issue.id,
                                    newDate,
                                  );
                                }}
                              />

                              <SingleMemberPicker
                                variant="avatar-only"
                                value={issue.assignee ?? undefined}
                                members={members}
                                onChange={(newMember) => {
                                  handleAssigneUpdate(
                                    issue.id,
                                    newMember,
                                    issue.team_id,
                                  );
                                  console.log(
                                    "Update assignee:",
                                    issue.id,
                                    newMember,
                                  );
                                }}
                              />

                              {/* <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {issue.assignee?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar> */}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded hover:bg-muted transition">
                                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleIssueDelete(issue.id, issue.team_id)
                                  }
                                >
                                  Delete Issue
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <NewIssueDialog
        open={showNewIssueDialog}
        onOpenChange={setShowNewIssueDialog}
        cycleData={cycleData}
        defStatus={defStatus}
        defProject={Number(projectId)}
      />
    </>
  );
};

export default IssueListView;
