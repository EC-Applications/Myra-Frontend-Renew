"use client";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import type { Issue } from "@/interfaces/issues";
import type { iIssues } from "@/interfaces/issues";
import type {
  Issue as CycleIssue,
  iCycleListResponse,
} from "@/interfaces/cycle.interface";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  Filter,
  FolderOpen,
  LayoutGrid,
  Menu,
  MoreHorizontal,
  PanelRightIcon,
  Star,
  Tag,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import IssueListView from "../issues/components/issue-list-view";
import IssueKanbanView from "../issues/components/issue-kanban-view";
import { useParams } from "react-router";
import { useUser } from "@/hooks/use-user";
import { cycleChartUri, cycleDetailUri } from "@/services/cycle.service";
import type { CycleIssueDetail } from "@/interfaces/cycle.interface";
import { setIssues } from "@/store/slices/issues.slice";
import { useDispatch, useSelector } from "react-redux";
import { setCycleIssues } from "@/store/slices/cycle-issues.slice";
import type { RootState } from "@/store/store";
import { Badge } from "@/components/ui/badge";
import { useCycleDetailHook } from "@/hooks/use-cycle-detail-hook";
import { IconPicker } from "../projects/components/icon-picker";
import {
  detectIconType,
  parseEmojiFromUnicode,
} from "@/components/parse-emoji";
// import type { Cycle } from "@/interfaces/cycle.interface";

const chartConfig = {
  scope: {
    label: "Scope",
    color: "#9ca3af",
  },
  started: {
    label: "Started",
    color: "#fbbf24",
  },
  completed: {
    label: "Completed",
    color: "#3b82f6",
  },
};

export default function Issues() {
  const [view, setView] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("assignees");
  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
  const [chartData, setChartData] = useState<iCycleListResponse>();
  const { currentWorkspace } = useUser();
  const [loading, setLoading] = useState(false);
  const { cycleId: id } = useParams();
  const { "team-id": teamid } = useParams();
  // console.log("cycle id", id);
  // console.log("team id", teamid);

  // Redux
  const dispatch = useDispatch();
  // const issueData = useSelector((state: RootState) => state.cycleIssues);

  const { data: issueData, isLoading } = useCycleDetailHook(
    currentWorkspace?.slug ?? "",
    Number(teamid),
    Number(id),
  );
  // console.log("ISSUE DATA IN CYCLE", issueData);
  // console.log("SLUG IN CYCLE", currentWorkspace?.slug);
  // console.log("ID IN CYCLE", Number(id));
  // console.log("TEAM ID IN CYCLE", Number(teamid));

  useEffect(() => {
    const fetchCycleDetail = async () => {
      setLoading(true);
      try {
        //       const res = await cycleDetailUri(
        //         currentWorkspace?.slug ?? "",
        //         Number(teamid),
        //         Number(id),
        //       );
        //       dispatch(setCycleIssues(res.data));
        //       console.log("cycle detail data", res.data);

        const res2 = await cycleChartUri(
          currentWorkspace?.slug ?? "",
          Number(teamid),
          Number(id),
        );

        console.log("CHART DATA", res2);
        setChartData(res2.data);
      } catch (e: any) {
        console.log(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCycleDetail();
  }, [currentWorkspace?.slug, teamid, id, dispatch]);

  // console.log(issueData, "CYCLE DETAIL");

  const groupedIssues: Record<string, iIssues[]> = Object.entries(
    issueData?.issues || {},
  ).reduce(
    (acc, [statusName, issues]) => {
      // Type guard: ensure issues is an array
      if (!Array.isArray(issues)) {
        return acc;
      }

      const statusSlug = statusName.toLowerCase().replace(/\s+/g, "-");

      acc[statusSlug] = (issues as CycleIssue[]).map((issue) => ({
        id: issue.id,
        key: issue.issue_key,
        name: issue.name,
        description: issue.description,
        workspace_id: issue.workspace_id,
        team_id: issue.team_id,
        status_id: issue.status_id,
        priority_id: issue.priority_id,
        project_id: issue.project_id,
        assignee_id: issue.assignee_id,
        milestone_id: issue.milestone_id,
        cycle: null,
        due_date: issue.due_date,
        is_recurring: issue.is_recurring,
        recurring_first_due: issue.recurring_first_due,
        recurring_repeats_every: issue.recurring_repeats_every,
        recurring_type: issue.recurring_type,
        external_link: issue.external_link,
        customer_request: issue.customer_request,
        sub_issue: null,
        deleted_at: issue.deleted_at ?? null,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        priority_detail: issue.priority_detail,
        status: issue.status ? { ...issue.status, active: 1 } : null,
        projects: null,
        milestones: null,
        labels: [] as any,
        type: issue.type ?? undefined,
        assignee: issue.assignee
          ? {
              ...issue.assignee,
              avatar: issue.assignee.avatar ?? undefined,
            }
          : null,
        parent_issue: issue.parent_issue ?? null,
      }));
      return acc;
    },
    {} as Record<string, iIssues[]>,
  );

  // console.log("setIssues called with:", groupedIssues);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen border rounded">
      <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b border-border">
        <div className="flex items-center gap-2 px-4">
          <Button variant="ghost" size="icon" className="size-7">
            <Menu className="w-4 h-4" />
          </Button>
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-foreground text-sm font-semibold">
            {issueData?.name || "Cycle"}
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <PanelRightIcon />
            <span className="sr-only">Toggle Properties</span>
          </Button>
        </div>
      </header>
      <div className="flex">
        <div className="flex-1">
          <div className="flex items-center justify-end p-4 border-b">
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
              issuesData={groupedIssues}
              showNewIssueDialog={showNewIssueDialog}
              setShowNewIssueDialog={setShowNewIssueDialog}
            />
          ) : (
            <IssueKanbanView issuesData={groupedIssues} />
          )}
        </div>
        {/* Right Sidebar */}
        {sidebarOpen && chartData ? (
          <div className="border-l border-border bg-card p-4 w-[24rem]">
            <div className="space-y-6">
              {/* Cycle Header */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-md capitalize">
                  {chartData.status}
                </Badge>
                {/* <span className="text-sm text-muted-foreground">
                  {chartData.status}
                </span> */}
                <span className="text-sm text-muted-foreground">
                  {new Date(chartData.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  →{" "}
                  {new Date(chartData.end_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{chartData.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              </div>

              {/* Progress Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium">Progress</span>
                  <ChevronDown className="w-4 h-4" />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      <span className="text-xs text-muted-foreground">
                        Scope
                      </span>
                    </div>
                    <div className="text-sm font-medium">{chartData.scope}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-xs text-muted-foreground">
                        Started
                      </span>
                    </div>
                    <div className="text-sm font-medium">
                      {chartData.issue_progress?.toFixed(1) ?? "0"}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-xs text-muted-foreground">
                        Completed
                      </span>
                    </div>
                    <div className="text-sm font-medium">
                      {chartData.completed}
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="mb-2">
                  <ChartContainer config={chartConfig}>
                    <LineChart data={chartData.chart}>
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                        dy={10}
                        tickFormatter={(value) => {
                          // Format date: "2026-01-09" -> "Jan 9"
                          const date = new Date(value);
                          const month = date.toLocaleDateString("en-US", {
                            month: "short",
                          });
                          const day = date.getDate();
                          return `${month} ${day}`;
                        }}
                        interval="preserveStartEnd"
                      />

                      <YAxis hide />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="remaining"
                        stroke="#9ca3af"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="issue_progress"
                        stroke="#fbbf24"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke={chartConfig.completed.color}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </div>

              {/* Analytics Tabs */}
              <div>
                <div className="flex border-b border-border">
                  {[
                    { id: "assignees", label: "Assignees", icon: Users },
                    { id: "labels", label: "Labels", icon: Tag },
                    { id: "priority", label: "Priority", icon: AlertCircle },
                    { id: "projects", label: "Projects", icon: FolderOpen },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <tab.icon className="w-3 h-3" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Assignees Tab */}
                {activeTab === "assignees" && (
                  <div className="mt-4 space-y-3">
                    {issueData?.assignees.map((assignee: any) => (
                      <div
                        key={assignee.name}
                        className={`flex items-center justify-between p-2 rounded font-semibold ${
                          assignee.highlighted ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{assignee.icon}</span>
                          <span className="text-sm">{assignee.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${
                                  (assignee.completed / assignee.total) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {assignee.completed}% of {assignee.total}
                          </span>
                        </div>
                        {assignee.highlighted && (
                          <span className="text-xs text-blue-600 ml-2">
                            See issues
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Labels Tab */}
                {activeTab === "labels" && (
                  <div className="mt-4 space-y-3">
                    {issueData?.label?.map((label) => (
                      <div
                        key={label.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${label.color}`}
                          />
                          <span className="text-sm">{label.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                // width: `${
                                //   (label.completed / label.total) * 100
                                // }%`,
                              }}
                            />
                          </div>
                          {/* <span className="text-xs text-muted-foreground">
                            {label.completed}% of {label.total}
                          </span> */}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Priority Tab */}
                {activeTab === "priority" && (
                  <div className="mt-4 space-y-3">
                    {issueData?.priorities.map((priority) => (
                      <div
                        key={priority.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={priority.icon}
                            className="text-sm h-4 w-4 text-center dark:filter dark:invert"
                          ></img>
                          <span className="font-semibold text-[13px]">{priority.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={
                                {
                                  // width: `${
                                  //   // (priority.completed / priority.total) * 100
                                  // }%`,
                                }
                              }
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {/* {priority.completed}% of {priority.total} */}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === "projects" && (
                  <div className="mt-4 space-y-3">
                    {issueData?.projects.map((project: any) => (
                      <div
                        key={project.name}
                        className={`flex items-center justify-between p-2 rounded ${
                          project.highlighted ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {/* <span className="text-sm">{project.icon}</span> */}
                          <IconPicker
                            variant="inline"
                            size={18}
                            value={
                              typeof project?.icon === "object"
                                ? {
                                    ...project.icon,
                                    icon: parseEmojiFromUnicode(
                                      project.icon.icon,
                                    ), // ← Parse nested icon
                                  }
                                : project?.icon
                                  ? {
                                      icon: parseEmojiFromUnicode(project.icon),
                                      color: "#000000",
                                      type: detectIconType(project.icon),
                                    }
                                  : undefined
                            }
                          />
                          <span className="text-sm">{project.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${
                                  (project.completed / project.total) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {project.completed}% of {project.total}
                          </span>
                        </div>
                        {project.highlighted && (
                          <span className="text-xs text-blue-600 ml-2">
                            See issues
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
