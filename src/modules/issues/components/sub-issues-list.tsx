import { useState, useEffect } from "react";
import {
  CheckSquare,
  MoreHorizontal,
  Trash2,
  Calendar,
  Flag,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
// import { deleteSubIssuesUri } from "@/services/sub-issue.service";
import { toast } from "sonner";
import type { iIssues } from "@/interfaces/issues";
// import {  } from "@/services/issues.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { is } from "date-fns/locale";
import { setSubIssues } from "@/store/slices/sub-issues.slice";
import { IssuesStatusPicker } from "./issues-status-picker";
import type { iIssueStatus } from "@/interfaces/issues-status.interface";
import { useSelector } from "react-redux";
import { useUser } from "@/hooks/use-user";
import { updateSubIssuesUri } from "@/services/sub-issues.service";
import { ProjectDatePicker } from "@/modules/projects/components/date-picker";
import { format } from "date-fns";
import { useUpdateSubIssueHook } from "@/hooks/use-update-subissue";
import { useParams } from "react-router";

interface SubIssuesListProps {
  subIssues: iIssues[];
  onSubIssueClick?: (subIssue: iIssues) => void;
  onSubIssuesDeleted?: () => void;
  isDeleting: boolean;
  setIsDeleting: (deleting: boolean) => void;
  handleDelete?: (
    selectedSubIssues: number[],
    onSuccess?: () => void,
  ) => Promise<void>;
  onSubIssueUpdate?: (updatedSubIssue: iIssues) => void;
}

export default function SubIssuesList({
  subIssues,
  onSubIssueClick,
  // onSubIssuesDeleted,
  isDeleting,
  setIsDeleting,
  handleDelete,
  onSubIssueUpdate,
}: SubIssuesListProps) {
  const { currentWorkspace } = useUser();
  const { id } = useParams();
  const [selectedSubIssues, setSelectedSubIssues] = useState<number[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const updateSubIssue = useUpdateSubIssueHook();
  const toggleSelection = (id: number) => {
    setSelectedSubIssues((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const status = useSelector((state: any) => state.issuesStatus);
  const statusList = status ?? [];
  const isSelected = (id: number) => selectedSubIssues.includes(id);

  // console.log("subissue update", subIssues);

  const handleStatusUpdate = async (issue: iIssues, status: iIssueStatus) => {
    try {
      updateSubIssue.mutate({
        issueId: Number(issue.id),
        body: {
          issue_id: Number(id),
          status_id: status.id,
          workspace_id: currentWorkspace?.id,
          team_id: Number(issue.team_id),
        },
        teamId: Number(issue.team_id),
        workspaceId: Number(currentWorkspace?.id),
      });
      // const payload = {
      //   issue_id: issue.issue_id,
      //   status_id: status.id,
      //   workspace_id: currentWorkspace?.id,
      //   team_id: issue.team_id,
      // };
      // await updateSubIssuesUri(Number(issue.id), payload);

      // Update parent state
      onSubIssueUpdate?.({ ...issue, status, status_id: status.id });
      // toast.success("Status updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  // useEffect(() => {
  //   if (subIssues?.status) {
  //     setSelectedStatus(subIssues.status);
  //   }
  //   if (subIssues?.due_date) {
  //     setStartDate(subIssues.due_date);
  //   }
  // });

  const handleTargetDate = async (issue: iIssues, date: Date | null) => {
    try {
      const payload = {
        issue_id: issue.issue_id,
        due_date: date ? format(date, "yyyy-MM-dd") : undefined,
        workspace_id: currentWorkspace?.id,
        team_id: issue.team_id,
      };
      await updateSubIssuesUri(Number(issue.id), payload);

      // Update parent state
      const updatedDueDate = date ? format(date, "yyyy-MM-dd") : null;
      onSubIssueUpdate?.({ ...issue, due_date: updatedDueDate });
      // toast.success("Date updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update date");
    }
  };

  return (
    <>
      <div className="space-y-0.5">
        {subIssues.map((issue) => {
          const selected = isSelected(issue.id);
          // console.log("labels from subissue list", issue.labels);
          return (
            <div
              key={issue.id}
              className={cn(
                "group flex items-center justify-between rounded-md px-3 py-2",
                "hover:bg-muted/60 transition-colors",
                selected && "bg-blue-950/50 hover:bg-blue-950/70",
              )}
            >
              {/* LEFT SIDE */}
              <div
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                onClick={() => toggleSelection(issue.id)}
              >
                {/* Checkbox */}
                <div className="w-4 flex items-center justify-center">
                  {selected ? (
                    <CheckSquare className="h-4 w-4 text-blue-400" />
                  ) : (
                    <div
                      className={cn(
                        "h-4 w-4 rounded border-2 border-muted-foreground/30",
                        "opacity-0 group-hover:opacity-100 transition-opacity",
                      )}
                    />
                  )}
                </div>

                {/* Status dot */}
                {/* <div className="h-2.5 w-2.5 rounded-full border border-yellow-400" /> */}
                <div onClick={(e) => e.stopPropagation()}>
                  <IssuesStatusPicker
                    value={issue?.status ?? null}
                    onChange={(status) => handleStatusUpdate(issue, status)}
                    variant="icon-only"
                    statuses={statusList}
                    disabled={false}
                    className="pt-0.5"
                  />
                </div>
                {/* Title */}
                <span
                  className={cn(
                    "text-sm truncate",
                    selected ? "text-blue-100" : "text-foreground",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubIssueClick?.(issue);
                  }}
                >
                  {issue.name}
                </span>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Bug badge */}
                {/* {issue.labels.name !== null && (
                  <div className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
                    <span className="h-2 w-2 rounded-full" /> */}
                {/* {issue.labels.name} */}
                {/* </div>
                )} */}

                {/* Date */}
                <ProjectDatePicker
                  label="Due Date"
                  variant="inline"
                  value={issue.due_date ? new Date(issue.due_date) : undefined}
                  onChange={(date) => handleTargetDate(issue, date)}
                  className="border-0"
                  buttonVarient="dark"
                />

                {/* Avatar */}
                {issue.assignee_id && (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {issue.assignee?.name.charAt(3).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Actions Bar */}
      {selectedSubIssues.length > 0 && !isDeleting && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 bg-blue-950 border border-blue-700 rounded-lg px-4 py-3 shadow-lg">
            <span className="text-sm text-blue-100 mr-2">
              {selectedSubIssues.length} selected
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-400 hover:bg-red-950 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSubIssues([])}
              className="text-blue-100 hover:bg-blue-900 hover:text-blue-50"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete sub-issues?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedSubIssues.length}{" "}
              sub-issue
              {selectedSubIssues.length > 1 ? "s" : ""}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => {
                // console.log("Cancel clicked");
                // console.log("Current selectedSubIssues:", selectedSubIssues);
                // console.log("Current isDeleting:", isDeleting);
                setShowDeleteDialog(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                // console.log("Delete clicked - START");
                // console.log("selectedSubIssues:", selectedSubIssues);
                if (handleDelete) {
                  await handleDelete(selectedSubIssues, () => {
                    setSelectedSubIssues([]);
                    setShowDeleteDialog(false);
                  });
                }
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
