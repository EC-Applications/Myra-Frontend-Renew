"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFileIcon } from "@/components/helper-function-file";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import type { iIussesDetail } from "@/interfaces/issues";
import type { DocumentItem, iProject } from "@/interfaces/project.interface";
import type { iMember } from "@/interfaces/teams.interface";
import {
  deleteIssueAttachmentUri,
  issueDetailUri,
  updateIssuesUri,
} from "@/services/issues.service";
import {
  deleteSubIssuesUri,
  fetchSubIssues,
} from "@/services/sub-issues.service";
import { setSubIssues } from "@/store/slices/sub-issues.slice";
import { format } from "date-fns";
import {
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Paperclip,
  Plus,
  Reply,
  ReplyAll,
  Star,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { ProjectDatePicker } from "../projects/components/date-picker";
import {
  ProjectFormLabels,
  type Label,
} from "../projects/components/label-picker";
import { PriorityPicker } from "../projects/components/priority-picker";
import { SingleMemberPicker } from "../projects/components/single-member-picker";
import IssueForm from "./components/create-sub-issues";
import { IssuesStatusPicker } from "./components/issues-status-picker";
import { ProjectPicker } from "./components/project-picker";
import SubIssuesList from "./components/sub-issues-list";
import type { iIssueStatus } from "@/interfaces/issues-status.interface";
import type { RootState } from "@/store/store";
import { IconPicker } from "../projects/components/icon-picker";
import { Form, Formik, type FormikHelpers } from "formik";
import { usePostCommentHook } from "@/hooks/use-post-comments";
import type { iCommentPayload } from "@/interfaces/issues.interface";
import { useGetComments } from "@/hooks/use-get-comments";
import { formatCommentTime } from "@/components/date-converter";

interface SubIssue {
  id: string;
  title: string;
  priority: number;
  assignee: {
    name: string;
    avatar: string;
  };
}

interface ActivityItem {
  id: string;
  type: "created" | "moved" | "system";
  user: string;
  action: string;
  timestamp: string;
  icon?: React.ReactNode;
}

export default function IssueDetailView() {
  const issues = useSelector((state: any) => state.issues);
  const { id } = useParams();
  console.log("IssueID", id);
  const { currentWorkspace } = useUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<iIussesDetail | undefined>();

  const status = useSelector((state: RootState) => state.issuesStatus);
  const statusList = status ?? [];
  const [selectedStatus, setSelectedStatus] = useState<iIssueStatus | null>(
    null,
  );
  const [priorityId, setPriorityId] = useState<number | undefined>();
  const [issueName, setIssueName] = useState("");

  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const workspaceMember = useSelector((state: any) => state.workspace);
  const members = Array.isArray(workspaceMember) ? workspaceMember : [];
  const [selectedMember, setSelectedMember] = useState<iMember | undefined>();
  const [startDate, setStartDate] = useState<Date | null>(null);

  const projects = useSelector((state: any) => state.project.projects);
  const [selectedProjects, setSelectedProjects] = useState<
    iProject | undefined
  >();

  const labels = useSelector((state: any) => state.issuesLabel);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);

  const subIssueData = useSelector((state: any) => state.issuesDetail);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDocs, setUploadingDocs] = useState(false);

  const [repOpen, setRepOpen] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<Record<number, string>>({});

  // POST COMMENT
  const postComment = usePostCommentHook();
  const { data: comments } = useGetComments(
    currentWorkspace?.slug ?? "",
    Number(id),
  );

  useEffect(() => {
    setLoading(true);
    try {
      issueDetailUri(Number(id)).then((res) => {
        console.log("ISSUE DETAIL DATA", res.data);
        setData(res.data);
      });

      fetchSubIssues(Number(id)).then((res) => {
        console.log("SUB ISSUES DATA", res.data);
        dispatch(setSubIssues(res.data));
      });
    } catch (e) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (data?.name) {
      setIssueName(data?.name);
    }

    if (data?.description) {
      setDescription(data?.description);
    }
    if (data?.labels && data?.labels.length > 0) {
      setSelectedLabels(data?.labels);
    }
    if (data?.status) {
      setSelectedStatus(data.status);
    }
    if (data?.priority_id) {
      setPriorityId(data?.priority_detail.id);
    }
    if (data?.assignee_id) {
      setSelectedMember(data.assignee);
    }
    if (data?.project_id) {
      setSelectedProjects(data?.projects);
    }
    if (data?.labels) {
      console.log("Setting labels:", data.labels);
      setSelectedLabels(data.labels);
    }

    if (data?.due_date) {
      setStartDate(data.due_date);
    }
    if (data?.documents && Array.isArray(data?.documents)) {
      setDocuments(data?.documents);
    }
  }, [data, data?.labels]);

  console.log("ISSUES", issues);

  const [subIssuesExpanded, setSubIssuesExpanded] = useState(true);
  const [showAddSubIssue, setShowAddSubIssue] = useState(false);
  const [newSubIssueTitle, setNewSubIssueTitle] = useState("");
  const [newSubIssueDescription, setNewSubIssueDescription] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);

  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "created",
      user: "ahmedsaif",
      action: "created the issue",
      timestamp: "5w ago",
    },
    {
      id: "2",
      type: "moved",
      user: "abdurrehman",
      action: "moved from Todo to In Progress",
      timestamp: "1mo ago",
    },
    {
      id: "3",
      type: "system",
      user: "MyRa",
      action: "moved issue through four cycles to Cycle 7",
      timestamp: "4d ago",
    },
  ];

  const handlePriorityUpdate = async (issuid: number) => {
    try {
      const payload = {
        priority_id: issuid,
        workspace_id: currentWorkspace?.id,
        team_id: data?.team_id,
      };

      await updateIssuesUri(Number(id), payload);
      setPriorityId(issuid);
      // toast.success("Priority updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update priority");
    }
  };

  const handleStatusUpdate = async (status: iIssueStatus) => {
    try {
      const payload = {
        status_id: status.id,
        workspace_id: currentWorkspace?.id,
        team_id: data?.team_id,
      };
      await updateIssuesUri(Number(id), payload);
      setSelectedStatus(status);
      // toast.success("Status updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleMemberUpdate = async (member: iMember | undefined) => {
    try {
      const payload = {
        assignee_id: selectedMember?.id,
        workspace_id: currentWorkspace?.id,
        team_id: data?.team_id,
      };
      await updateIssuesUri(Number(id), payload);
      setSelectedMember(member);
      // toast.success("Assigne updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleProjectUpdate = async (project: iProject | undefined) => {
    try {
      const payload = {
        project_id: project?.id,
        workspace_id: currentWorkspace?.id,
        team_id: data?.team_id,
      };
      await updateIssuesUri(Number(id), payload);
      setSelectedProjects(project);
      // toast.success("Project updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleIssueName = async () => {
    try {
      const payload = {
        name: issueName,
        workspace_id: currentWorkspace?.id,
        team_id: data?.team_id,
      };
      await updateIssuesUri(Number(id), payload);
      setIssueName(issueName);
      // toast.success("Name updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleUpdateLabel = async (labels: Label[]) => {
    console.log("n");

    setSelectedLabels(labels); // Pehle state update karo
    // setSaving(true);

    try {
      await updateIssuesUri(Number(id), {
        workspace_id: currentWorkspace?.id,
        labels: labels.map((x) => x.id), // Updated labels use karo
        team_id: data?.team_id,
      });

      // dispatch(
      //   updateProject({
      //     projectId: Number(id),
      //     data: { labels: labels.map((x) => x.id) },
      //   })
      // );

      // toast.success("Issue Label updated");
    } catch (error) {
      setSelectedLabels(selectedLabels); // Error pe purani state revert karo
      toast.error("Failed to update issue labels");
    }
  };

  const handleTargetDate = async (date: Date | null) => {
    try {
      const payload = {
        due_date: date ? format(date, "yyyy-MM-dd") : undefined,
        workspace_id: currentWorkspace?.id,
        team_id: data?.team_id,
      };
      await updateIssuesUri(Number(id), payload);
      setStartDate(date);
      // toast.success("Date updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);

    // purana timer clear
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // naya debounce
    saveTimeoutRef.current = setTimeout(() => {
      handleDescriptionUpdate(value);
    }, 700); // 👈 700ms = Linear jaisa feel
  };

  const handleDescriptionUpdate = async (des: string) => {
    try {
      setIsSaving(true);

      const payload = {
        description: des,
        workspace_id: currentWorkspace?.id,
        team_id: data?.team_id,
      };

      await updateIssuesUri(Number(id), payload);
    } catch (error: any) {
      toast.error(error.message || "Failed to update description");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDocumentUpload = async (files: FileList | null) => {
    console.log("handleDocumentUpload called with:", files);

    if (!files || files.length === 0) {
      console.log("No files provided");
      return;
    }

    if (!data) {
      console.log("No Issue Found");
      return;
    }

    setUploadingDocs(true);
    const loadingToast = toast.loading("Uploading documents...");

    try {
      const filesArray = Array.from(files);
      console.log("Uploading files:", filesArray);

      await updateIssuesUri(
        Number(id),
        {
          workspace_id: currentWorkspace?.id,
          team_id: data.team_id,
        },
        // undefined,
        filesArray,
      );

      console.log("Upload successful, fetching updated data");

      const response = await issueDetailUri(Number(id));

      console.log("Updated documents:", response.data.documents);
      setDocuments(response.data.documents || []);

      toast.dismiss(loadingToast);
      toast.success(`${filesArray.length} document(s) uploaded`);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.dismiss(loadingToast);
      toast.error(
        error?.response?.data?.message || "Failed to upload documents",
      );
    } finally {
      setUploadingDocs(false);
    }
  };

  const handleSubIssueDelete = async (
    selectedSubIssues: number[],
    onSuccess?: () => void,
  ) => {
    if (selectedSubIssues.length === 0) return;

    setIsDeleting(true);
    const loadingToast = toast.loading(
      `Deleting ${selectedSubIssues.length} sub-issue${
        selectedSubIssues.length > 1 ? "s" : ""
      }...`,
    );

    try {
      // Payload hamesha array format mein bhejo
      await deleteSubIssuesUri({
        issue_id: Number(id),
        sub_issue_ids: selectedSubIssues, // Yahan directly array pass karo
      });

      toast.dismiss(loadingToast);
      toast.success(
        `${selectedSubIssues.length} sub-issue${
          selectedSubIssues.length > 1 ? "s" : ""
        } deleted successfully`,
      );

      onSuccess?.();

      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sub_issues:
            prev.sub_issues?.filter(
              (sub) => !selectedSubIssues.includes(sub.id),
            ) || [],
        };
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(
        error?.response?.data?.message || "Failed to delete sub-issues",
      );
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    const loadingToast = toast.loading("Deleting attachment...");

    try {
      await deleteIssueAttachmentUri(
        currentWorkspace?.id as number,
        Number(id),
        [attachmentId],
      );

      const response = await issueDetailUri(Number(id));
      toast.success("Attachment deleted successfully");
      setDocuments(response.data.documents || []);
    } catch (error) {
      toast.error("Failed to delete attachment");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const refreshIssueData = async () => {
    try {
      const response = await issueDetailUri(Number(id));
      setData(response.data);
    } catch (error) {
      console.error("Failed to refresh:", error);
    }
  };

  // REPLAY

  // PARENT COMMENT

  const initialVal = {
    comment_body: "",
  };

  const handleCommentSubmit = (
    values: typeof initialVal,
    { resetForm }: { resetForm: () => void },
  ) => {
    if (!values.comment_body.trim()) return;

    postComment.mutate(
      {
        issueId: Number(id),
        body: {
          body: values.comment_body,
          commentable_id: Number(id),
          commentable_type: "issue",
          parent_id: null,
        },
      },
      {
        onSuccess: () => {
          resetForm();
        },
      },
    );
  };

  const handleReplySubmit = (commentId: number) => {
    const text = replyText[commentId]?.trim();
    if (!text) return;

    postComment.mutate(
      {
        issueId: Number(id),
        body: {
          body: text,
          commentable_id: Number(id),
          commentable_type: "issue",
          parent_id: commentId,
        },
      },
      {
        onSuccess: () => {
          setReplyText((prev) => ({ ...prev, [commentId]: "" }));
          setRepOpen(null);
        },
      },
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/60 z-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div
      className="flex h-[calc(100vh-1rem)] bg-background dark:border-zinc-800
dark:bg-[#101012]"
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <NavLink to={`/teams/${data?.team.id}/issues`}>
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-1 text-sm text-muted-foreground dark:hover:bg-muted p-1 rounded text-[14px] font-semibold  ${
                      isActive ? "" : " text-muted-foreground "
                    }`}
                  >
                    <IconPicker value={data?.team.icon} variant="inline" />
                    {data?.team.name}
                  </div>
                )}
              </NavLink>
            </div>
            <span>›</span>

            <span className="mb-0.5 font-semibold">{data?.issue_key}</span>

            {/* <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            <Star className="h-4 w-4 text-muted-foreground" /> */}
          </div>
          <div className="flex items-center gap-2">
            {/* <span className="text-sm text-muted-foreground">13 / 14</span>
            <Button variant="ghost" size="sm">
              <ChevronDown className="h-4 w-4" />
            </Button> */}
            <Button variant="ghost" size="sm">
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 py-6 px-12 overflow-auto">
          {/* Title */}
          <Input
            className="md:text-2xl font-semibold mb-6 border-0 p-0 focus-visible:ring-0 dark:bg-transparent"
            defaultValue={issueName}
            onChange={(e) => setIssueName(e.target.value)}
            onBlur={handleIssueName}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
          />
          {/* Description */}
          <div className="mb-8">
            <Textarea
              placeholder="Write a description, a project brief, or collect ideas..."
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className=" min-h-[100px]
    resize-none
    border-0
    shadow-none
    focus-visible:ring-0
    dark:bg-transparent

    text-[18px] leading-7
    placeholder:text-[18px]"
            />
            {documents.length > 0 ? (
              <div className="pt-2 space-y-2">
                {documents.map((doc) => {
                  const isSelected = selectedId === doc.id;

                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedId(doc.id)}
                      className={`
                                    relative flex items-center gap-3 p-3 rounded-md border cursor-pointer
                                    transition-all
                                    ${
                                      isSelected
                                        ? "border-blue-500 bg-blue-500/5"
                                        : "border-border hover:bg-muted/30"
                                    }
                                  `}
                    >
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        {getFileIcon(doc.doc_type)}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-medium">{doc.doc_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAttachment(Number(doc.id));
                            setDocuments((prev) =>
                              prev.filter((d) => d.id !== doc.id),
                            );
                            setSelectedId(null);
                          }}
                          className="absolute right-2 top-2 p-1 rounded hover:bg-destructive/10 text-destructive"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className=""></div>
            )}
          </div>
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 mb-8 w-full">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingDocs}
            >
              <Paperclip className="h-4 w-4" />
              {uploadingDocs && (
                <span className="ml-2 text-xs">Uploading...</span>
              )}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              className="hidden"
              onChange={(e) => {
                console.log("Input onChange triggered");
                console.log("Files selected:", e.target.files);
                console.log("Files count:", e.target.files?.length);
                if (e.target.files && e.target.files.length > 0) {
                  console.log(" Calling handleDocumentUpload");
                  handleDocumentUpload(e.target.files);
                } else {
                  console.log(" No files selected");
                }

                e.target.value = "";
              }}
            />
          </div>
          {/* Sub-issues */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSubIssuesExpanded(!subIssuesExpanded)}
                className="flex items-center gap-2 p-0 h-auto font-medium"
              >
                {subIssuesExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4 mb-1" />
                )}
                Sub-issues
                <Badge
                  variant="secondary"
                  className="ml-2 text-muted-foreground bg-muted"
                >
                  {data?.sub_issues?.length}
                </Badge>
              </Button>
              <div className="flex items-center gap-2">
                {/* <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button> */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddSubIssue(!showAddSubIssue)}
                  className="mb-4"
                >
                  <Plus className="h-4 w-4" />
                  {/* {showAddSubIssue ? "Hide" : "Add Issue"} */}
                </Button>
              </div>
            </div>
            {showAddSubIssue && (
              <IssueForm
                parentIssueId={Number(id)}
                onCancel={() => setShowAddSubIssue(!showAddSubIssue)}
                onSuccess={(updatedData) => {
                  setData(updatedData);
                  setShowAddSubIssue(!showAddSubIssue);
                }}
              />
            )}

            {subIssuesExpanded && (
              <div className="space-y-2">
                {data?.sub_issues && data.sub_issues.length > 0 ? (
                  <SubIssuesList
                    isDeleting={isDeleting}
                    setIsDeleting={setIsDeleting}
                    handleDelete={handleSubIssueDelete}
                    subIssues={data.sub_issues}
                    onSubIssueClick={(subIssue) => {
                      navigate(`/issues/${subIssue.id}/sub-issue`);
                    }}
                    onSubIssueUpdate={(updatedSubIssue) => {
                      setData((prev: any) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          sub_issues: prev.sub_issues?.map((sub: any) =>
                            sub.id === updatedSubIssue.id
                              ? updatedSubIssue
                              : sub,
                          ),
                        };
                      });
                    }}
                  />
                ) : (
                  <div className=""></div>
                )}
              </div>
            )}
          </div>
          {/* Activity */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Activity</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  Unsubscribe
                </Button>
                <div className="flex -space-x-2">
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                    <AvatarFallback className="text-xs">AS</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                    <AvatarFallback className="text-xs">AR</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                    <AvatarFallback className="text-xs">
                      {activity.user.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action} •{" "}
                      <span className="text-muted-foreground">
                        {activity.timestamp}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Comment Box */}

          <div className="space-y-4">
            {comments?.map((comment) => (
              <div
                key={comment.id}
                className="border rounded-lg dark:bg-[#17181b] border-zinc-800 pb-4"
              >
                <div className="">
                  {/* Row: Avatar + Content + Actions */}
                  <div className="flex gap-3 p-2">
                    {/* Avatar */}
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={comment?.author?.avatar} />
                      <AvatarFallback className="text-xs bg-primary/10">
                        {comment?.author?.name?.slice(0, 2)?.toUpperCase() ||
                          "NA"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-semibold dark:text-white">
                            {comment?.author?.name}
                          </span>
                          <span className="text-[14px] font-semibold  text-muted-foreground">
                            {formatCommentTime(comment?.created_at)}
                          </span>
                        </div>

                        {/* Action Buttons (Right Side) */}
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-white"
                            onClick={() =>
                              setRepOpen(
                                repOpen === comment.id ? null : comment.id,
                              )
                            }
                          >
                            <Reply className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-white"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Comment Text */}
                      <p className="text-[15px] font-semibold dark:text-white whitespace-pre-line leading-relaxed">
                        {comment.body}
                      </p>

                      {/* Replies Section */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 space-y-3 pl-2   border-zinc-700">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="flex border-t gap-2 pt-2"
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={reply?.author?.avatar} />
                                <AvatarFallback className="text-[10px] bg-primary/10">
                                  {reply?.author?.name
                                    ?.slice(0, 2)
                                    ?.toUpperCase() || "NA"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[15px] font-semibold dark:text-white">
                                    {reply?.author?.name}
                                  </span>
                                  <span className="text-[13px] font-semibold text-muted-foreground">
                                  {formatCommentTime(reply?.created_at)}
                                  </span>
                                </div>
                                <p className="text-sm font-semibold dark:text-white/90 mt-0.5">
                                  {reply.body}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reply Input Box - only show for this specific comment */}
                  {repOpen === comment.id && (
                    <div className="border-t px-2 mt-3 py-0.5">
                      <div className="mt-3 flex gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={comment?.author?.avatar} />
                          <AvatarFallback className="text-xs bg-primary/10">
                            {comment?.author?.name
                              ?.slice(0, 2)
                              ?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 flex items-start gap-2">
                          <Textarea
                            placeholder="Leave a reply..."
                            className="flex-1 border-0 resize-none focus:outline-none focus-visible:ring-0 text-sm text-white placeholder:text-muted-foreground min-h-[20px] dark:bg-transparent dark:placeholder:font-semibold font-semibold"
                            value={replyText[comment.id] || ""}
                            onChange={(e) =>
                              setReplyText((prev) => ({
                                ...prev,
                                [comment.id]: e.target.value,
                              }))
                            }
                          />
                          <Button
                            size="icon"
                            type="button"
                            className="h-7 w-7 shrink-0"
                            variant="noBorder"
                            disabled={postComment.isPending}
                            onClick={() => handleReplySubmit(comment.id)}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Formik initialValues={initialVal} onSubmit={handleCommentSubmit}>
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="pt-5">
                <div className="border dark:border-zinc-800 dark:bg-[#17181b] rounded-lg">
                  <Textarea
                    placeholder="Leave a comment..."
                    value={values.comment_body}
                    onChange={(e) =>
                      setFieldValue("comment_body", e.target.value)
                    }
                    className="border-0 resize-none focus-visible:ring-0 dark:bg-transparent p-3 dark:placeholder:font-semibold font-semibold"
                    rows={3}
                  />
                  <div className="flex items-center justify-end p-2">
                    {/* <Button variant="ghost" size="sm" type="button">
                      <Paperclip className="h-4 w-4" />
                    </Button> */}
                    <Button
                      size="sm"
                      type="submit"
                      variant="custom"
                      disabled={isSubmitting || postComment.isPending}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Properties Sidebar */}
      <div className="w-80 border-l border-border bg-muted/20 px-4 py-2 border dark:border-zinc-800">
        <h3 className="font-medium mb-6">Properties</h3>

        <div className="space-y-6">
          {/* Status */}
          <div>
            <div className="flex items-center gap-2">
              <IssuesStatusPicker
                statuses={statusList}
                value={selectedStatus}
                onChange={handleStatusUpdate}
                className="border-0 "
                buttonVarient="dark"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="gap-2">
            <PriorityPicker
              value={priorityId}
              // varirent="create"
              onChange={handlePriorityUpdate}
              buttonVarient="dark"
              className="border-0"
            />

            {/* <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">{data?.priority_detail.name}</span>
            </div> */}
          </div>

          {/* Assignee */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <SingleMemberPicker
                value={selectedMember}
                members={members}
                onChange={handleMemberUpdate}
                className="border-0"
                variant="full"
                buttonVarient="dark"
              />
            </div>
          </div>

          {/* Labels */}
          <div className="text-md dark:text-[#7e7f82] font-semibold">
            Labels
          </div>
          <div className="gap-2">
            <ProjectFormLabels
              labels={labels}
              value={selectedLabels}
              onChange={handleUpdateLabel}
              className="border-0"
              buttonVarient="dark"
            />
          </div>

          {/* Cycle */}
          {/* <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Cycle
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Cycle 7</span>
            </div>
          </div> */}

          {/* Project */}
          <div className="text-md dark:text-[#7e7f82] font-semibold">
            Project
          </div>
          <div>
            <ProjectPicker
              projects={projects}
              value={selectedProjects}
              onChange={handleProjectUpdate}
              buttonVarient="dark"
              className="border-0"
            />
          </div>

          <hr />
          <div className="flex items-center gap-2">
            <ProjectDatePicker
              label="Due Date"
              value={startDate ? new Date(startDate) : undefined}
              onChange={handleTargetDate}
              className="border-0"
              buttonVarient="dark"
            />
          </div>

          {/* Milestone */}
          {/* <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Milestone
              </span>
            </div> */}
          {/* <Button
              variant="ghost"
              className="justify-start p-0 h-auto text-muted-foreground"
            >
              <Target className="h-4 w-4 mr-2" />
              Set milestone
            </Button> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
