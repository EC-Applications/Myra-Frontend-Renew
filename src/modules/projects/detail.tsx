"use client";

import { getFileIcon } from "@/components/helper-function-file";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import type { DocumentItem, iProject } from "@/interfaces/project.interface";
import type { iMember } from "@/interfaces/teams.interface";
import {
  deleteProjectAttachmentUri,
  fetchProjectById,
  projectDetailFetchUri,
} from "@/services/project.service";
import { updateProject } from "@/store/slices/project.slice";
import type { RootState } from "@/store/store";

import { ArrowRight, Download, Link2, Paperclip, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "sonner";
import { ProjectDatePicker } from "./components/date-picker";
import { IconPicker } from "./components/icon-picker";
import { ProjectFormLabels, type Label } from "./components/label-picker";
import { LeadPicker } from "./components/lead-picker";
import MilestoneSection from "./components/milestone";
import { PriorityPicker } from "./components/priority-picker";
import { ProjectFormStatus } from "./components/status-picker";
import { te } from "date-fns/locale";
import type { iLabel } from "@/interfaces/label.interface";
import { cn } from "@/lib/utils";
// import { useProjectDetail } from "@/hooks/use-project-detail";
import { useUpdateProjectHook } from "@/hooks/use-update-project";
import { useProjectDetail } from "@/hooks/use-project-detail";

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
  const projectData = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch();
  // const [project, setProject] = useState<iProject>();
  const [loading, setLoading] = useState(false);

  console.log("QUERY DATA", project);
  console.log("Members", members);

  // const project = useMemo(
  //   () => projectData?.projects.find((p) => id && p.id == parseInt(id)),
  //   [projectData, id]
  // );

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

  // States

  const [isFocused, setIsFocused] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [shortSummary, setShortSummary] = useState("");
  const [priority, setPriority] = useState<number | undefined>();
  const [selectedStatus, setSelectedStatus] = useState(statusList?.[0] ?? null);
  const [selectedLead, setSelectedLead] = useState<iMember | undefined>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<any[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(
    new Set(),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [projectIcon, setProjectIcon] = useState<{
    icon: string;
    color: string;
    type: "icon" | "emoji" | "image";
    file?: File;
    imageUrl?: string;
  }>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateProjectMutation = useUpdateProjectHook();

  // useEffect(() => {
  //   if (project && !isDataLoaded) {
  //     setProjectName(project.name || "");
  //     setShortSummary(project.short_summary || "");

  //     if (project.icon) {
  //       if (typeof project.icon === "object") {
  //         setProjectIcon({
  //           icon: project.icon.icon,
  //           color: project.icon.color,
  //           type: project.icon.type as "icon" | "emoji",
  //         });
  //       } else if (typeof project.icon === "string") {
  //         setProjectIcon({
  //           icon: project.icon,
  //           color: "#000000",
  //           type: "icon",
  //         });
  //       }
  //     }

  //     // Priority
  //     if (project.priority_id) {
  //       setPriority(project.priority_id);
  //     }

  //     if (project.status_id && statusList.length > 0) {
  //       const statusObj = statusList.find(
  //         (s: any) => s.id === project.status_id
  //       );
  //       if (statusObj) {
  //         setSelectedStatus(statusObj);
  //       }
  //     }

  //     if (project.lead_id && project.lead) {
  //       setSelectedLead(project.lead);
  //     }

  //     if (project.labels && project.labels.length > 0) {
  //       setSelectedLabels(project.labels);
  //     }

  //     if (project.start_date) {
  //       const date =
  //         typeof project.start_date === "string"
  //           ? new Date(project.start_date)
  //           : project.start_date;
  //       setStartDate(date);
  //     }

  //     if (project.target_date) {
  //       const date =
  //         typeof project.target_date === "string"
  //           ? new Date(project.target_date)
  //           : project.target_date;
  //       setEndDate(date);
  //     }

  //     if (project.documents && Array.isArray(project.documents)) {
  //       setDocuments(project.documents);
  //     }

  //     if (project.milestones && Array.isArray(project.milestones)) {
  //       setMilestones(project.milestones);
  //     }

  //     setIsDataLoaded(true);
  //   }
  // }, [
  //   project,
  //   priorityData.priority,
  //   statusList,
  //   members,
  //   project?.labels,
  //   isDataLoaded,
  // ]);

  // console.log("PROJECTN PRIORITY", priority);

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

  const handleUpdateName = async () => {
   if (!project) return;

    setSaving(true);
    const originalName = project.name;

    dispatch(
      updateProject({
        projectId: Number(id),
        data: { name: projectName },
      }),
    );

    updateProjectMutation.mutate(
      {
        projectId: Number(id),
        body: {
          name: projectName,
          workspace_id: workpsace.currentWorkspace?.id,
          team_id: project.teams?.map((x) => x.id as number) || [],
        },
      },
      {
        onError: () => {
          dispatch(
            updateProject({
              projectId: Number(id),
              data: { name: originalName },
            }),
          );
        },
        onSettled: () => {
          setSaving(false);
        },
      },
    );
  };

  const handleUpdateLabel = async (labels: Label[]) => {
    if (!project) return;

    const previousLabels = selectedLabels;
    setSelectedLabels(labels);
    setSaving(true);

    // dispatch(
    //   updateProject({
    //     projectId: Number(id),
    //     data: { labels: labels.map((x) => x.id) },
    //   })
    // );

    updateProjectMutation.mutate(
      {
        projectId: Number(id),
        body: {
          workspace_id: workpsace.currentWorkspace?.id,
          labels: labels.map((x) => x.id as number) as any,
          team_id: project.teams?.map((x) => x.id as number) || [],
        },
      },
      {
        onError: () => {
          setSelectedLabels(previousLabels);
          dispatch(
            updateProject({
              projectId: Number(id),
              data: { labels: previousLabels.map((x) => x.id) },
            }),
          );
        },
        onSettled: () => {
          setSaving(false);
        },
      },
    );
  };

  const handleUpdateSummary = async () => {
    if (!project) return;
    if (shortSummary === project.short_summary) return;

    setSaving(true);

    updateProjectMutation.mutate(
      {
        projectId: Number(id),
        body: {
          short_summary: shortSummary,
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
  };

  const handleUpdatePriority = async (newPriority: number) => {
    setPriority(newPriority);

    if (!project) return;

    setSaving(true);

    const priorityObj = priorityData.priority?.find(
      (p: any) => p.id === newPriority,
    );

    if (!priorityObj) {
      toast.error("Priority not found");
      setSaving(false);
      return;
    }

    dispatch(
      updateProject({
        projectId: Number(id),
        data: { priority: priorityObj.id },
      }),
    );

    updateProjectMutation.mutate(
      {
        projectId: Number(id),
        body: {
          priority_id: priorityObj.id.toString(),
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
  };

  const handleUpdateStatus = async (newStatus: any) => {
    setSelectedStatus(newStatus);

    if (!project) return;

    setSaving(true);

    dispatch(
      updateProject({
        projectId: Number(id),
        data: { status: newStatus.name.toLowerCase() },
      }),
    );
    console.log("IDDDDD", newStatus.id);

    updateProjectMutation.mutate(
      {
        projectId: Number(id),
        body: {
          status_id: newStatus.id,
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
  };

  const handleUpdateLead = async (newLead: iMember | undefined) => {
    setSelectedLead(newLead);

    if (!project || !newLead) return;

    setSaving(true);

    dispatch(
      updateProject({
        projectId: Number(id),
        data: { lead_id: newLead.id },
      }),
    );

    updateProjectMutation.mutate(
      {
        projectId: Number(id),
        body: {
          lead_id: newLead.id,
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
  };

  const handleUpdateStartDate = async (newDate: Date | null) => {
    setStartDate(newDate);

    if (!project || !newDate) return;

    setSaving(true);

    dispatch(
      updateProject({
        projectId: Number(id),
        data: { start_date: newDate.toISOString().split("T")[0] },
      }),
    );

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
  };

  const handleUpdateEndDate = async (newDate: Date | null) => {
    setEndDate(newDate);

    if (!project || !newDate) return;

    setSaving(true);

    dispatch(
      updateProject({
        projectId: Number(id),
        data: { target_date: newDate.toISOString().split("T")[0] },
      }),
    );

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
  };

  const handleDocumentUpload = async (files: FileList | null) => {
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
  };

  const handleIconUpdate = async (icon: any) => {
    setProjectIcon(icon);

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
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    const loadingToast = toast.loading("Deleting attachment...");

    try {
      await deleteProjectAttachmentUri(
        workpsace.currentWorkspace?.id as number,
        Number(id),
        [attachmentId],
      );

      const response = await projectDetailFetchUri(Number(id));
      toast.success("Attachment deleted successfully");
      // setProject(response.data);
    } catch (error) {
      toast.error("Failed to delete attachment");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleDeleteMultipleAttachments = async (ids: number[]) => {
    try {
      await deleteProjectAttachmentUri(
        Number(workpsace.currentWorkspace?.id),
        Number(id),
        ids,
      );
      const response = await projectDetailFetchUri(Number(id));
      toast.success("Attachments deleted successfully");
    } catch (error) {
      toast.error("Failed to delete attachments");
    }
  };

  const handleDownloadAttachment = (doc: any) => {
    const link = document.createElement("a");
    link.href = doc.file_url; // ya doc.download_url
    link.download = doc.doc_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // console.log("PROJECT ICON", projectIcon);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-y-auto flex justify-center h-[calc(100vh_-_80px)] dark:bg-[#17181b]  dark:border-zinc-800">
      <div className="flex-1 px-6 py-6 max-w-3xl">
        {/* Project Header */}
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-2">
            <IconPicker
              value={projectIcon}
              onChange={() => {}}
              variant="compact"
            />
          </div>
          <div className="space-y-2">
            <Input
              className="sm:text-lg md:text-2xl font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
              // value={projectName}
              defaultValue={project?.name}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={handleUpdateName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              disabled={saving}
            />

            <Textarea
              placeholder="Add a short summary..."
              // value={shortSummary}
              defaultValue={project?.short_summary}
              onChange={(e) => setShortSummary(e.target.value)}
              onBlur={handleUpdateSummary}
              className="md:text-lg border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent resize-none"
              disabled={saving}
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
          <Textarea
            placeholder=""
            value={shortSummary}
            onChange={(e) => setShortSummary(e.target.value)}
            className="min-h-36 md:text-lg border-0 px-3 shadow-none focus-visible:ring-0 dark:bg-transparent resize-none dark:text-white dark:placeholder:text-[#626366]"
          />
          <div className="flex items-center justify-end">
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
                  console.log("Calling handleDocumentUpload");
                  handleDocumentUpload(e.target.files);
                } else {
                  console.log("No files selected");
                }

                e.target.value = "";
              }}
            />
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
                            setDocuments((prev) =>
                              prev.filter((d) => d.id !== doc.id),
                            );
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
              initialMilestones={milestones}
              workspaceId={workpsace.currentWorkspace?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
