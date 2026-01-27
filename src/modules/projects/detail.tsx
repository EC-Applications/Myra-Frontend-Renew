"use client";

import { getFileIcon } from "@/components/helper-function-file";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import type { iMember } from "@/interfaces/teams.interface";
import { useDeleteProjectAttachment } from "@/hooks/use-delete-project-attachment";

import { ArrowRight, Download, Paperclip } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "sonner";
import { ProjectDatePicker } from "./components/date-picker";
import { IconPicker } from "./components/icon-picker";
import { ProjectFormLabels, type Label } from "./components/label-picker";
import { LeadPicker } from "./components/lead-picker";
import MilestoneSection from "./components/milestone";
import { PriorityPicker } from "./components/priority-picker";
import { ProjectFormStatus } from "./components/status-picker";
import type { iLabel } from "@/interfaces/label.interface";
import { cn } from "@/lib/utils";
import { useUpdateProjectHook } from "@/hooks/use-update-project";
import { useProjectDetail } from "@/hooks/use-project-detail";
import { useFormik } from "formik";
import {
  detectIconType,
  parseEmojiFromUnicode,
} from "@/components/parse-emoji";

export default function Detail() {
  const { id } = useParams();
  const { data: project } = useProjectDetail(Number(id));
  const workpsace = useUser();
  const priorityData = useSelector((state: any) => state.priority);
  const status = useSelector((state: any) => state.status);
  const statusList = useMemo(() => status?.status ?? [], [status]);
  const workspaceMember = useSelector((state: any) => state.workspace);
  const members = useMemo(
    () => (Array.isArray(workspaceMember) ? workspaceMember : []),
    [workspaceMember],
  );

  const labelState = useSelector((state: any) => state.label);
  const labels = labelState?.labels ?? [];
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   try {
  //     projectDetailFetchUri(Number(id)).then((res) => {
  //       console.log("PROJECT DETAIL DATA", res.data);
  //       // setProject(res.data);
  //     });
  //   } catch (e) {
  //     setLoading(false);
  //     console.log(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [id]);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const descriptionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // UI States (non-form related)
  const [isFocused, setIsFocused] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSavingDescription, setIsSavingDescription] = useState(false);

  // Formik for form state management
  // enableReinitialize: automatically syncs form when project data changes from server
  const formik = useFormik({
    initialValues: {
      name: project?.name || "",
      short_summary: project?.short_summary || "",
      description: project?.description || "",
    },
    enableReinitialize: true, // Auto-sync when React Query cache updates
    onSubmit: () => {}, // Auto-save on blur, no form submission needed
  });

  const updateProjectMutation = useUpdateProjectHook();
  const deleteAttachmentMutation = useDeleteProjectAttachment();

  // Keyboard and click outside handlers
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Escape") {
        setIsFocused(false);
      }
    };

    const handleClickOutside = (e: any) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUpdateName = useCallback(() => {
    if (!project) return;
    if (formik.values.name === project.name) return;

    setSaving(true);

    updateProjectMutation.mutate(
      {
        projectId: Number(id),
        body: {
          name: formik.values.name,
          workspace_id: workpsace.currentWorkspace?.id,
          team_id: project.teams?.map((x) => x.id as number) || [],
        },
      },
      {
        onSettled: () => {
          setSaving(false);
        },
      },
    );
  }, [
    project,
    formik.values.name,
    id,
    workpsace.currentWorkspace?.id,
    updateProjectMutation,
  ]);

  const handleUpdateLabel = useCallback(
    (newLabels: Label[]) => {
      if (!project) return;

      setSaving(true);

      updateProjectMutation.mutate(
        {
          projectId: Number(id),
          body: {
            workspace_id: workpsace.currentWorkspace?.id,
            labels_id:
              newLabels.length > 0
                ? newLabels.map((x) => x.id as number)
                : null,
            team_id: project.teams?.map((x) => x.id as number) || [],
          },
          optimisticData: {
            labels: newLabels, // ← Yeh instantly UI update karega
          },
        },
        {
          onSettled: () => {
            setSaving(false);
          },
        },
      );
    },
    [project, id, workpsace.currentWorkspace?.id, updateProjectMutation],
  );

  const handleUpdateSummary = useCallback(() => {
    if (!project) return;
    if (formik.values.short_summary === project.short_summary) return;

    setSaving(true);

    updateProjectMutation.mutate(
      {
        projectId: Number(id),
        body: {
          short_summary: formik.values.short_summary,
          workspace_id: workpsace.currentWorkspace?.id,
          team_id: project.teams?.map((x) => x.id as number) || [],
        },
      },
      {
        onSettled: () => {
          setSaving(false);
        },
      },
    );
  }, [
    project,
    formik.values.short_summary,
    id,
    workpsace.currentWorkspace?.id,
    updateProjectMutation,
  ]);

  const handleDescriptionChange = useCallback(
    (value: string) => {
      formik.setFieldValue("description", value);

      // Clear previous timeout
      if (descriptionTimeoutRef.current) {
        clearTimeout(descriptionTimeoutRef.current);
      }

      // Debounce API call - 700ms delay
      descriptionTimeoutRef.current = setTimeout(() => {
        if (!project) return;
        if (value === project.description) return;

        setIsSavingDescription(true);

        updateProjectMutation.mutate(
          {
            projectId: Number(id),
            body: {
              description: value,
              workspace_id: workpsace.currentWorkspace?.id,
              team_id: project.teams?.map((x) => x.id as number) || [],
            },
          },
          {
            onSettled: () => {
              setIsSavingDescription(false);
            },
          },
        );
      }, 700);
    },
    [
      project,
      id,
      workpsace.currentWorkspace?.id,
      updateProjectMutation,
      formik,
    ],
  );

  const handleUpdatePriority = useCallback(
    (newPriority: number) => {
      if (!project) return;

      // Find full priority object for optimistic update
      const priorityObj = priorityData.priority?.find(
        (p: any) => p.id === newPriority,
      );

      setSaving(true);

      updateProjectMutation.mutate(
        {
          projectId: Number(id),
          body: {
            priority_id: newPriority,
            workspace_id: workpsace.currentWorkspace?.id,
            team_id: project.teams?.map((x) => x.id as number) || [],
          },
          // Full object for instant UI update
          optimisticData: {
            priority: priorityObj,
            priority_id: newPriority,
          },
        },
        {
          onSettled: () => {
            setSaving(false);
          },
        },
      );
    },
    [
      project,
      id,
      workpsace.currentWorkspace?.id,
      updateProjectMutation,
      priorityData.priority,
    ],
  );

  const handleUpdateStatus = useCallback(
    (newStatus: any) => {
      if (!project) return;

      setSaving(true);

      updateProjectMutation.mutate(
        {
          projectId: Number(id),
          body: {
            status_id: newStatus.id,
            workspace_id: workpsace.currentWorkspace?.id,
            team_id: project.teams?.map((x) => x.id as number) || [],
          },
          // Full object for instant UI update
          optimisticData: {
            status: newStatus,
            status_id: newStatus.id,
          },
        },
        {
          onSettled: () => {
            setSaving(false);
          },
        },
      );
    },
    [project, id, workpsace.currentWorkspace?.id, updateProjectMutation],
  );

  const handleUpdateLead = useCallback(
    (newLead: iMember | undefined) => {
      if (!project || !newLead) return;

      setSaving(true);

      updateProjectMutation.mutate(
        {
          projectId: Number(id),
          body: {
            lead_id: newLead.id,
            workspace_id: workpsace.currentWorkspace?.id,
            team_id: project.teams?.map((x) => x.id as number) || [],
          },
          // Full object for instant UI update
          optimisticData: {
            lead: newLead,
            lead_id: newLead.id,
          },
        },
        {
          onSettled: () => {
            setSaving(false);
          },
        },
      );
    },
    [project, id, workpsace.currentWorkspace?.id, updateProjectMutation],
  );

  const handleUpdateStartDate = useCallback(
    (newDate: Date | null) => {
      if (!project || !newDate) return;

      setSaving(true);

      updateProjectMutation.mutate(
        {
          projectId: Number(id),
          body: {
            start_date: newDate.toISOString().split("T")[0],
            workspace_id: workpsace.currentWorkspace?.id,
            team_id: project.teams?.map((x) => x.id as number) || [],
          },
        },
        {
          onSettled: () => {
            setSaving(false);
          },
        },
      );
    },
    [project, id, workpsace.currentWorkspace?.id, updateProjectMutation],
  );

  const handleUpdateEndDate = useCallback(
    (newDate: Date | null) => {
      if (!project || !newDate) return;

      setSaving(true);

      updateProjectMutation.mutate(
        {
          projectId: Number(id),
          body: {
            target_date: newDate.toISOString().split("T")[0],
            workspace_id: workpsace.currentWorkspace?.id,
            team_id: project.teams?.map((x) => x.id as number) || [],
          },
        },
        {
          onSettled: () => {
            setSaving(false);
          },
        },
      );
    },
    [project, id, workpsace.currentWorkspace?.id, updateProjectMutation],
  );

  const handleDocumentUpload = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      if (!project) return;

      setUploadingDocs(true);
      const loadingToast = toast.loading("Uploading documents...");
      const filesArray = Array.from(files);

      updateProjectMutation.mutate(
        {
          projectId: Number(id),
          body: {
            workspace_id: workpsace.currentWorkspace?.id,
            team_id: project.teams?.map((x) => x.id as number) || [],
          },
          documentFiles: filesArray,
        },
        {
          onSuccess: () => {
            toast.dismiss(loadingToast);
          },
          onError: (error: any) => {
            console.error("Upload error:", error);
            toast.dismiss(loadingToast);
          },
          onSettled: () => {
            setUploadingDocs(false);
          },
        },
      );
    },
    [project, id, workpsace.currentWorkspace?.id, updateProjectMutation],
  );

  const handleIconUpdate = useCallback(
    (icon: any) => {
      if (!project) return;

      setUploadingIcon(true);
      const loadingToast = toast.loading("Updating icon...");

      updateProjectMutation.mutate(
        {
          projectId: Number(id),
          body: {
            workspace_id: workpsace.currentWorkspace?.id,
            team_id: project.teams?.map((x) => x.id as number) || [],
            icon: {
              icon: icon.icon,
              type: icon.type,
              color: icon.color,
            },
          },
          iconFile: icon.file,
        },
        {
          onSuccess: () => {
            toast.dismiss(loadingToast);
          },
          onError: (error: any) => {
            console.error("Icon update error:", error);
            toast.dismiss(loadingToast);
          },
          onSettled: () => {
            setUploadingIcon(false);
          },
        },
      );
    },
    [project, id, workpsace.currentWorkspace?.id, updateProjectMutation],
  );

  const handleDeleteAttachment = useCallback(
    (attachmentId: number) => {
      deleteAttachmentMutation.mutate({
        workspaceId: workpsace.currentWorkspace?.id as number,
        projectId: Number(id),
        attachmentIds: [attachmentId],
      });
    },
    [deleteAttachmentMutation, workpsace.currentWorkspace?.id, id],
  );

  const handleDownloadAttachment = useCallback((doc: any) => {
    const link = document.createElement("a");
    link.href = doc.file_url;
    link.download = doc.doc_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const backendIcon = "\\ud83d\\ude00"; // Backend se aisa aata hai
  console.log("Length:", backendIcon.length); // 12 characters
  console.log("First char:", backendIcon[0]); // "\"
  console.log("Starts with \\u:", backendIcon.startsWith("\\u")); // true ya false?

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-y-auto flex justify-center h-[calc(100vh_-_80px)] dark:bg-[#17181b]  dark:border-zinc-800">
      <div className="flex-1 py-10 max-w-3xl">
        {/* Project Header */}
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-2">
            <IconPicker
              value={
                typeof project?.icon === "object"
                  ? {
                      ...project.icon,
                      icon: parseEmojiFromUnicode(project.icon.icon), // ← Parse nested icon
                    }
                  : project?.icon
                    ? {
                        icon: parseEmojiFromUnicode(project.icon),
                        color: "#000000",
                        type: detectIconType(project.icon),
                      }
                    : undefined
              }
              onChange={handleIconUpdate}
              variant="compact"
            />
          </div>
          <div className="space-y-2">
            <Input
              className="sm:text-lg md:text-2xl font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={handleUpdateName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
            />

            <Textarea
              placeholder="Add a short summary..."
              name="short_summary"
              value={formik.values.short_summary}
              onChange={formik.handleChange}
              onBlur={handleUpdateSummary}
              className="md:text-lg border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent resize-none"
            />
          </div>
        </div>

        {/* Properties */}
        <div className="flex items-center  mb-6 flex-nowrap">
          <h3 className="text-[15px] font-semibold text-muted-foreground whitespace-nowrap ">
            Properties:
          </h3>
          <div className="flex items-center pl-1">
            <ProjectFormStatus
              statuses={statusList}
              value={project?.status}
              onChange={handleUpdateStatus}
              className="border-0 "
              buttonVarient="dark"
            />
            <PriorityPicker
              value={Number(project?.priority?.id)}
              onChange={handleUpdatePriority}
              className="border-0 "
              buttonVarient="dark"
            />
            <LeadPicker
              members={members}
              value={project?.lead}
              onChange={handleUpdateLead}
              className="border-0 "
              buttonVarient="dark"
            />

            <ProjectDatePicker
              label="Start date"
              value={
                project?.start_date ? new Date(project.start_date) : undefined
              }
              onChange={handleUpdateStartDate}
              className="border-0 "
              buttonVarient="dark"
            />
            <ArrowRight />
            <ProjectDatePicker
              label="End date"
              value={
                project?.target_date ? new Date(project.target_date) : undefined
              }
              onChange={handleUpdateEndDate}
              className="border-0 "
              buttonVarient="dark"
            />
          </div>
        </div>

        {/* Labels */}
        <div className="flex items-center gap-3 mb-6 flex-nowrap">
          <h3 className="text-[15px] text-muted-foreground whitespace-nowrap font-semibold">
            Label
          </h3>
          <div className="flex items-center gap-2">
            <ProjectFormLabels
              labels={labels}
              value={project?.labels || []}
              onChange={handleUpdateLabel}
              className="rounded-full"
              buttonVarient="dark"
            />
          </div>
        </div>

        {/* Blocking */}
        {/* <div className="mb-6">
          <h3 className="text-xs font-medium mb-3 text-muted-foreground">
            Blocking
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 text-xs">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Testing Project
            </Badge>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div> */}

        {/* Resources */}
        {/* <div className="mb-6">
          <h3 className="text-xs font-medium mb-3 text-muted-foreground">
            Resources
          </h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground gap-1.5"
              >
                <Plus className="w-3 h-3" />
                Add document or link...
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-56 rounded-md bg-popover p-1 shadow-lg"
            >
              <DropdownMenuItem className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm cursor-pointer transition-colors hover:bg-muted">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-muted-foreground" />
                  <span>Add a link...</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}

        {/* Project Update */}
        {/* <div
          ref={containerRef}
          className={`
              mb-6 rounded-md border border-border bg-muted/30
              transition-all duration-300 ease-in-out
              ${isFocused ? "shadow-md" : ""}
            `}
        >
          <div className="flex items-center gap-2 p-3">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs font-medium text-green-600">On track</span>
          </div>

          <textarea
            placeholder="Write a project update..."
            value={projectUpdate}
            onChange={(e) => setProjectUpdate(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className={`
                w-full bg-transparent px-3 text-sm resize-none
                focus:outline-none
                transition-all duration-300 ease-in-out
                ${isFocused ? "min-h-[120px] pb-3" : "min-h-[60px] pb-2"}
              `}
          />

          <div
            className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isFocused ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}
              `}
          >
            <div className="flex items-center justify-between px-3 py-2 border-t border-border">
              <button className="text-muted-foreground hover:text-foreground">
                📎
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsFocused(false);
                    setProjectUpdate("");
                  }}
                  className="px-3 py-1 text-sm rounded-md hover:bg-muted"
                >
                  Cancel
                </button>

                <button className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground">
                  Post update
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-[15px] font-semibold  mb-3 text-muted-foreground">
            Description
          </h3>
          <div className="relative">
            <Textarea
              placeholder="Add a description..."
              value={formik.values.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="min-h-36 md:text-lg border-0 px-3 shadow-none focus-visible:ring-0 dark:bg-transparent resize-none dark:text-white dark:placeholder:text-[#626366]"
            />
            {/* {isSavingDescription && (
              <span className="absolute top-2 right-2 text-xs text-muted-foreground">
                Saving...
              </span>
            )} */}
          </div>

          {(project?.documents ?? []).length > 0 ? (
            <div className="space-y-2">
              {project?.documents.map((doc) => {
                const isSelected = selectedId === doc.id;

                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedId(doc.id)}
                    className={cn(
                      "relative flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all",
                      isSelected
                        ? "border-blue-500 bg-blue-500/5"
                        : "border-border hover:bg-muted/30",
                    )}
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
                      <div className="absolute right-2 top-2 flex gap-1">
                        {/* Download */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadAttachment(doc);
                          }}
                          className="p-1  rounded hover:bg-primary/10 text-primary"
                          title="Download"
                        >
                          <Download className="h-5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAttachment(Number(doc.id));
                            setSelectedId(null);
                          }}
                          className="p-1 rounded hover:bg-destructive/10 text-destructive"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No documents</p>
          )}

          <div className="flex items-center pt-1 justify-end">
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
                // console.log("Input onChange triggered");
                // console.log("Files selected:", e.target.files);
                // console.log("Files count:", e.target.files?.length);
                if (e.target.files && e.target.files.length > 0) {
                  // console.log("Calling handleDocumentUpload");
                  handleDocumentUpload(e.target.files);
                } else {
                  console.log("No files selected");
                }

                e.target.value = "";
              }}
            />
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-muted-foreground">
            Milestones
          </h3>
          <div className="space-y-3">
            {/* <div>
                <div
                  className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
                  onClick={() => toggleMilestone("Backend Development")}
                >
                  <div className="flex items-center gap-3">
                    {expandedMilestones.has("Backend Development") ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Backend Development</span>
                  </div>
                  <span className="text-sm text-muted-foreground">4 issues • 25%</span>
                </div>
                {expandedMilestones.has("Backend Development") && (
                  <div className="ml-7 mt-2 mb-2">
                    <textarea
                      className="w-full p-3 text-sm bg-transparent border-0 resize-none focus:outline-none text-muted-foreground"
                      placeholder="Add a description..."
                      rows={1}
                    />
                  </div>
                )}
              </div> */}

            {/* <div
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                onClick={() => toggleMilestone("Milestone name")}
              >
                <div className="flex items-center gap-2">
                  {expandedMilestones.has("Milestone name") ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Milestone name</span>
                </div>
              </div> */}
            {/* {expandedMilestones.has("Milestone name") && (
                <div className="ml-8 mb-2">
                  <textarea
                    className="w-full p-2 text-sm bg-transparent border-0 resize-none focus:outline-none text-muted-foreground placeholder:text-muted-foreground"
                    placeholder="Add a description..."
                    rows={1}
                  />
                </div>
              )} */}

            <MilestoneSection
              mode="update"
              project={project}
              initialMilestones={project?.milestones}
              workspaceId={workpsace.currentWorkspace?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
