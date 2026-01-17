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
import { useState } from "react";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import IssueListView from "../issues/components/issue-list-view";
import IssueKanbanView from "../issues/components/issue-kanban-view";

const chartData = [
  { date: "Aug 25", scope: 135, started: 20, completed: 1 },
  { date: "Aug 26", scope: 135, started: 35, completed: 1 },
  { date: "Aug 27", scope: 135, started: 50, completed: 1 },
  { date: "Aug 28", scope: 135, started: 70, completed: 1 },
  { date: "Aug 29", scope: 135, started: 85, completed: 1 },
  { date: "Aug 30", scope: 135, started: 100, completed: 1 },
  { date: "Aug 31", scope: 135, started: 107, completed: 1 },
  { date: "Sep 1", scope: 135, started: 107, completed: 1 },
];

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

const assignees = [
  {
    name: "reyan",
    avatar: "/placeholder.svg?height=24&width=24",
    completed: 22,
    total: 31,
    icon: "🔒",
  },
  {
    name: "adil",
    avatar: "/placeholder.svg?height=24&width=24",
    completed: 18,
    total: 33,
    icon: "☁️",
  },
  {
    name: "ruhan",
    avatar: "/placeholder.svg?height=24&width=24",
    completed: 25,
    total: 21,
    icon: "⚡",
  },
  {
    name: "abdurrehman",
    avatar: "/placeholder.svg?height=24&width=24",
    completed: 18,
    total: 11,
    icon: "✅",
  },
  {
    name: "hamza",
    avatar: "/placeholder.svg?height=24&width=24",
    completed: 13,
    total: 6,
    icon: "🔧",
  },
  {
    name: "abubakar",
    avatar: "/placeholder.svg?height=24&width=24",
    completed: 13,
    total: 2,
    icon: "🧩",
  },
  {
    name: "musab",
    avatar: "/placeholder.svg?height=24&width=24",
    completed: 25,
    total: 1,
    icon: "🌊",
  },
  {
    name: "abdul_rafay",
    avatar: "/placeholder.svg?height=24&width=24",
    completed: 16,
    total: 8,
    icon: "⚫",
  },
  {
    name: "maria",
    avatar: "/placeholder.svg?height=24&width=24",
    completed: 25,
    total: 2,
    icon: "⚫",
  },
  {
    name: "faisal",
    avatar: "/placeholder.svg?height=24&width=24",
    completed: 0,
    total: 1,
    icon: "⚫",
  },
];

const labels = [
  { name: "Bug", color: "bg-red-500", completed: 15, total: 23 },
  { name: "Feature", color: "bg-purple-500", completed: 19, total: 21 },
  { name: "Refactor", color: "bg-amber-600", completed: 25, total: 21 },
  { name: "Design", color: "bg-orange-500", completed: 13, total: 12 },
  { name: "Development", color: "bg-blue-500", completed: 21, total: 12 },
  { name: "Mobile", color: "bg-sky-500", completed: 19, total: 8 },
  { name: "Docs", color: "bg-gray-500", completed: 13, total: 6 },
];

const priorities = [
  { name: "No priority", icon: "---", completed: 25, total: 15 },
  { name: "Urgent", icon: "🔥", completed: 15, total: 28 },
  { name: "High", icon: "📊", completed: 20, total: 53 },
  { name: "Medium", icon: "📊", completed: 24, total: 39 },
];
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

export default function Issues() {
  const [view, setView] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("assignees");

  const groupedIssues = mockIssues.reduce((acc, issue) => {
    if (!acc[issue.status]) acc[issue.status] = [];
    acc[issue.status].push(issue);
    return acc;
  }, {} as Record<string, Issue[]>);

  return (
    <div className="min-h-screen">
      <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b border-border">
        <div className="flex items-center gap-2 px-4">
          <Button variant="ghost" size="icon" className="size-7">
            <Menu className="w-4 h-4" />
          </Button>
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-foreground text-sm">Cycle 8</h1>
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
          <div className="flex items-center justify-between p-4 border-b">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
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
          {/* {view == 0 ? (
            <IssueListView issuesData={groupedIssues} />
          ) : (
            <IssueKanbanView issuesData={mockIssues} />
          )} */}
        </div>
        {/* Right Sidebar */}
        {sidebarOpen ? (
          <div className="border-l border-border bg-card p-4 w-[24rem]">
            <div className="space-y-6">
              {/* Cycle Header */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current</span>
                <span className="text-sm text-muted-foreground">
                  Aug 25 → Aug 31
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Cycle 8</span>
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
                    <div className="text-sm font-medium">135</div>
                    <div className="text-xs text-green-600">-9%</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-xs text-muted-foreground">
                        Started
                      </span>
                    </div>
                    <div className="text-sm font-medium">107</div>
                    <div className="text-xs text-muted-foreground">79%</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-xs text-muted-foreground">
                        Completed
                      </span>
                    </div>
                    <div className="text-sm font-medium">1</div>
                    <div className="text-xs text-muted-foreground">1%</div>
                  </div>
                </div>

                {/* Chart */}
                <div className="mb-2">
                  <ChartContainer config={chartConfig}>
                    <LineChart data={chartData}>
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis hide />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="scope"
                        stroke={chartConfig.scope.color}
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="started"
                        stroke={chartConfig.started.color}
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
                    {assignees.map((assignee: any) => (
                      <div
                        key={assignee.name}
                        className={`flex items-center justify-between p-2 rounded ${
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
                    {labels.map((label) => (
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
                                width: `${
                                  (label.completed / label.total) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {label.completed}% of {label.total}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Priority Tab */}
                {activeTab === "priority" && (
                  <div className="mt-4 space-y-3">
                    {priorities.map((priority) => (
                      <div
                        key={priority.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm w-6 text-center">
                            {priority.icon}
                          </span>
                          <span className="text-sm">{priority.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${
                                  (priority.completed / priority.total) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {priority.completed}% of {priority.total}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === "projects" && (
                  <div className="mt-4 space-y-3">
                    {assignees.map((project: any) => (
                      <div
                        key={project.name}
                        className={`flex items-center justify-between p-2 rounded ${
                          project.highlighted ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{project.icon}</span>
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
