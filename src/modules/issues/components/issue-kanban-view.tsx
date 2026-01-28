"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanProvider,
} from "@/components/ui/kanban";
import type { Issue } from "@/interfaces/issues";
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Plus,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import NewIssueDialog from "../new-issue";
import { PriorityPicker } from "@/modules/projects/components/priority-picker";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { updateIssuesUri } from "@/services/issues.service";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useUpdateIssueHook } from "@/hooks/use-issue-update";
import { useUpdateSubIssueHook } from "@/hooks/use-update-subissue";

const columns = [
  { id: "todo", title: "Todo", count: 32, icon: Circle },
  { id: "in-progress", title: "In Progress", count: 33, icon: AlertTriangle },
  { id: "in-review", title: "In Review", count: 11, icon: CheckCircle },
  { id: "done", title: "Done", count: 9, icon: CheckCircle },
  { id: "cancelled", title: "Cancelled", count: 2, icon: Circle },
];

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "high":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "medium":
      return <Zap className="h-4 w-4 text-yellow-500" />;
    case "low":
      return <Clock className="h-4 w-4 text-green-500" />;
    default:
      return <Circle className="h-4 w-4 text-gray-400" />;
  }
};

const getLabelColor = (label: string) => {
  const colors: Record<string, string> = {
    Bug: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Feature:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Enroute:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Development:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Design:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    DevOps: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    "Jab Chaho":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "Myra Next JS":
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "Myra Cloud":
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    "Code1-WP": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };
  return (
    colors[label] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  );
};

const IssueKanbanView: FC<{ issuesData: any }> = ({ issuesData }) => {
  console.log("ISSUE DATA", issuesData);
  const { "team-id": id } = useParams();
  const { currentWorkspace } = useUser();
  const navigate = useNavigate();
  const updateIssueStatus = useUpdateIssueHook();

  const updateSubIssue = useUpdateSubIssueHook();

  const statusList =
    useSelector((state: RootState) => state.issuesStatus) ?? [];
  const statusConfig = Object.fromEntries(
    statusList.map((s) => [
      s.name.toLowerCase().replace(/\s+/g, "-"),
      { id: s.id, name: s.name, icon: s.icon },
    ]),
  );

  const initialIssues = Object.entries(issuesData).flatMap(
    ([status, issueArray]: [string, any]) =>
      (issueArray as any[]).map((issue) => ({
        ...issue,
        status,
      })),
  );

  const [issues, setIssues] = useState<any[]>(initialIssues);
  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
  const [defStatus, setDefaultStatus] = useState<number>();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const updatedIssues = Object.entries(issuesData).flatMap(
      ([status, issueArray]: [string, any]) =>
        (issueArray as any[]).map((issue) => ({
          ...issue,
          status,
        })),
    );
    setIssues(updatedIssues);
  }, [issuesData]);

  const draggedIssueRef = useRef<{
    id: string;
    originalColumn: string;
  } | null>(null);

  const kanbanColumns = Object.keys(issuesData).map((statusKey) => {
    const matchingColumn = columns.find((col) => col.id === statusKey);

    return {
      id: statusKey,
      name:
        statusKey === "backlog"
          ? "Backlog"
          : statusKey.charAt(0).toUpperCase() +
            statusKey.slice(1).replace(/-/g, " "),
      count: issuesData[statusKey].length,
      icon: matchingColumn?.icon || Circle,
    };
  });

  console.log("Kanban Columns:", kanbanColumns);

  const kanbanData = issues.map((issue) => ({
    ...issue,
    id: String(issue.id),
    name: issue.name || issue.title || "",
    column: issue.status,
    team: issue.id,
    type: issue.type,
  }));

  console.log("ISSUExyz", issues);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const issue = issues.find((i: any) => i.id === Number(event.active.id));
    if (issue) {
      draggedIssueRef.current = {
        id: String(issue.id),
        originalColumn: issue.status,
      };
      console.log("Drag Started:", draggedIssueRef.current);
    }
  };

  const handleDragEnd = async (
    event: DragEndEvent,
  ) => {
    console.log("DRAG END FIRED");
    const { active, over, collisions } = event;

    if (!over || !draggedIssueRef.current) {
      console.log("No valid drop target");
      draggedIssueRef.current = null;
      // Reset dragging state - was not a successful drag
      setIsDragging(false);
      return;
    }

    const { originalColumn } = draggedIssueRef.current;

    let targetColumnId: string | null = null;

    // Check if dropped on column directly
    const directColumn = kanbanColumns.find((c: any) =>
      collisions?.map((x) => x.id).includes(c.id),
    );

    if (directColumn) {
      targetColumnId = directColumn.id;
    } else {
      // Dropped on another issue, get that issue's column
      const overIssue = issues.find((i: any) => i.id === String(over.id));
      targetColumnId = overIssue?.status || null;
    }

    console.log("🔍 Comparison:", {
      originalColumn,
      targetColumn: targetColumnId,
      changed: originalColumn !== targetColumnId,
    });

    if (!targetColumnId || originalColumn === targetColumnId) {
      console.log("Skipping - Same column");
      draggedIssueRef.current = null;
      // Reset dragging state - no actual status change
      setIsDragging(false);
      return;
    }

    const activeIssue = issues.find((i: any) => i.id === String(active.id));

    if (!activeIssue) {
      draggedIssueRef.current = null;
      return;
    }

    console.log("TARGET COL NAME:", targetColumnId);
    const statusMapping: Record<string, number> = {
      backlog: 1,
      todo: 2,
      "in-progress": 3,
      "in-review": 4,
      done: 5,
      cancelled: 6,
    };

    const statusId = statusMapping[targetColumnId];

    if (!statusId) {
      console.error("Invalid status column:", targetColumnId);
      draggedIssueRef.current = null;
      return;
    }

    console.log("Mapped Status ID:", statusId);

    try {
      const mutate =
        activeIssue.type === "issue"
          ? updateIssueStatus.mutate({
              issueId: Number(activeIssue.id),
              body: {
                status_id: statusId,
                workspace_id: currentWorkspace?.id,
                team_id: activeIssue.team_id,
              },
              teamId: activeIssue.team_id,
              workspaceId: Number(currentWorkspace?.id),
            })
          : updateSubIssue.mutate({
              issueId: Number(activeIssue.id),
              body: {
                issue_id: activeIssue.issue_id,
                status_id: statusId,
                workspace_id: currentWorkspace?.id,
                team_id: Number(activeIssue.team_id),
              },
              teamId: Number(activeIssue.team_id),
              workspaceId: Number(currentWorkspace?.id),
            });
      // const response = await updateIssuesUri(Number(activeIssue.id), {
      //   status_id: statusId,
      //   workspace_id: currentWorkspace?.id,
      //   team_id: Number(id),
      // });

      // console.log("✅ API Success:", response);
      // toast.success("Status updated");
    } catch (error) {
      console.error("❌ API Error:", error);

      // Revert on failure
      setIssues((prev: any[]) =>
        prev.map((i) =>
          i.id === String(active.id)
            ? { ...i, status: originalColumn, column: originalColumn }
            : i,
        ),
      );

      toast.error("Failed to update status");
    } finally {
      // Reset dragging state after successful drag
      setIsDragging(false);
    }

    draggedIssueRef.current = null;
  };

  const handleDataChange = (newData: any[]) => {
    const updatedIssues = newData.map((item) => ({
      ...item,
      status: item.column,
    }));
    setIssues(updatedIssues);
  };

  const getIssuesByStatus = (status: string) => {
    return issues.filter((issue) => issue.status === status);
  };

  return (
    <>
      <div className="flex-1 overflow-hidden p-4">
        <KanbanProvider
          columns={kanbanColumns}
          data={kanbanData}
          onDataChange={handleDataChange}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          className="h-full max-w-0"
        >
          {(column) => {
            const columnIssues = getIssuesByStatus(column.id);
            const IconComponent = column.icon;
            console.log("Col ICon", column.icon);
            console.log("Col DATA", column);

            return (
              <KanbanBoard
                key={column.id}
                id={column.id}
                className="w-80 flex-shrink-0"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{column.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {columnIssues.length}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button> */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDefaultStatus(statusConfig[column.id]?.id);
                        setShowNewIssueDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Column Content */}
                <KanbanCards
                  id={column.id}
                  className="flex-1 space-y-3 overflow-y-auto"
                >
                  {(issue) => (
                    <KanbanCard
                      key={issue.id}
                      id={issue.id}
                      name={issue.due_date}
                      column={issue.column}
                      className="bg-card border gap-1 rounded p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (!isDragging) {
                          console.log("navigation");
                          {
                            issue.type === "issue"
                              ? navigate(`/issues/${issue.id}`)
                              : navigate(`/issues/${issue.id}/sub-issue`);
                          }
                        }
                      }}
                    >
                      {/* Issue Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground font-mono ">
                            {issue.key}
                          </span>
                          {/* <span className="text-sm text-muted-foreground font-mono ">
                            {issue.name}
                          </span> */}
                          {/* {getPriorityIcon(issue.priority)} */}
                        </div>
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={issue.assignee?.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-xs">
                            {issue.assignee?.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="text-sm text-muted-foreground font-mono bg-muted">
                            {issue.status}
                          </Badge>
                          <span className="text-sm tex-white font-semibold">
                            {issue.name}
                          </span>
                        </div>
                      </div>

                      {/* Issue Title */}
                      {issue.title && (
                        <div className="text-sm font-medium leading-tight">
                          {issue.title}
                        </div>
                      )}

                      {/* Labels */}
                      {issue.labels && issue.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {issue.labels.map((label: string) => (
                            <Badge
                              key={label}
                              variant="secondary"
                              className={`text-xs ${getLabelColor(label)}`}
                            >
                              {label}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Project */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {/* <BarChart3 className="h-3 w-3" /> */}
                        <div className=" p-1 border rounded border-zinc-600">
                          {issue.priority}
                        </div>
                        <span>{issue.project}</span>
                      </div>

                      {/* Footer */}
                      {/* <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {issue.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(issue.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {issue.progress && (
                            <Badge variant="outline" className="text-xs">
                              {issue.progress}%
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {issue.type}
                        </Badge>
                      </div> */}
                    </KanbanCard>
                  )}
                </KanbanCards>
              </KanbanBoard>
            );
          }}
        </KanbanProvider>
      </div>

      <NewIssueDialog
        open={showNewIssueDialog}
        onOpenChange={setShowNewIssueDialog}
        defStatus={defStatus}
      />
    </>
  );
};
export default IssueKanbanView;
