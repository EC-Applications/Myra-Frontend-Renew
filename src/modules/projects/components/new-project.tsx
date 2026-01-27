import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import type { iProjectPayload } from "@/interfaces/project.interface";
import type { iMember, iTeams } from "@/interfaces/teams.interface";
import { createProjectUri, fetchProjectUri } from "@/services/project.service";
import { clearMilestones } from "@/store/slices/milestone.slice";
import { setProject } from "@/store/slices/project.slice";
import type { RootState } from "@/store/store";
import { format } from "date-fns";
import {
  Delete,
  FileIcon,
  PaperclipIcon,
  Trash2,
  Trash2Icon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ProjectDatePicker } from "./date-picker";
import { IconPicker } from "./icon-picker";
import { ProjectFormLabels } from "./label-picker";
import { LeadPicker } from "./lead-picker";
import { MemberPicker } from "./member-picker";
import MilestoneSection from "./milestone";
import { PriorityPicker } from "./priority-picker";
import { ProjectFormStatus } from "./status-picker";
import { TeamPicker } from "./team-picker";
import { setTeams } from "@/store/slices/team.slice";
import * as yup from "yup";
interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defStatus?: number;
}

const createProjectSchema = yup.object({
  name: yup.string().trim().required("Project name is required"),

  team_id: yup
    .array()
    .of(yup.number())
    .min(1, "Please select at least one team"),

  start_date: yup.date().nullable(),

  target_date: yup
    .date()
    .nullable()
    .when("start_date", (startDate, schema) => {
      if (startDate) {
        return schema.min(startDate, "Due date cannot be before start date");
      }
      return schema;
    }),
});

export function NewProject({
  open,
  onOpenChange,
  defStatus,
}: NewProjectModalProps) {
  const dispatch = useDispatch();
  const { currentWorkspace } = useUser();
  const priorityData = useSelector((state: any) => state.priority);
  const teamsData = useSelector((state: any) => state.teams);
  console.log("Team data", teamsData);
  const status = useSelector((state: any) => state.status);
  const projects = useSelector((state: RootState) => state.project.projects);

  const workspaceMember = useSelector((state: any) => state.workspace);
  const members = Array.isArray(workspaceMember) ? workspaceMember : [];

  console.log("WORKSPACE DATA", members);
  console.log("DEF STATUS", defStatus);

  const statusList = status?.status ?? [];

  const [selectedStatus, setSelectedStatus] = useState(statusList?.[0] ?? null);

  // DEF status matching
  useEffect(() => {
    if (open && defStatus) {
      const matchingStatus = statusList.find((s: any) => s.id === defStatus);
      if (matchingStatus) {
        setSelectedStatus(matchingStatus);
      }
    } else if (open && !defStatus) {
      setSelectedStatus(statusList[0] ?? null);
    }
  }, [open, defStatus, statusList]);

  const labelState = useSelector((state: any) => state.label);
  const labels = labelState?.labels ?? [];

  const [selectedLabels, setSelectedLabels] = useState<any[]>([]);

  const [projectName, setProjectName] = useState("");
  const [shortSummary, setShortSummary] = useState("");
  const [milestoneName, setMilestoneName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const milestones = useSelector((state: any) => state.milestone);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [projectIcon, setProjectIcon] = useState<{
    icon: string;
    color: string;
    type: "icon" | "emoji";
    file?: File;
  }>();

  const [selectedMembers, setSelectedMembers] = useState<iMember[]>([]);
  const [selectedLead, setSelectedLead] = useState<iMember | undefined>();
  const [selectedTeams, setSelectedTeams] = useState<iTeams[]>([]);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [priority, setPriority] = useState<number | undefined>();
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const resetForm = () => {
    setProjectName("");
    setShortSummary("");
    setMilestoneName("");
    setMilestoneDescription("");
    setDescription("");

    setSelectedStatus(statusList?.[0] ?? null);
    setPriority(undefined);

    setStartDate(new Date());
    setEndDate(null);

    setSelectedMembers([]);
    setSelectedLead(undefined);

    setSelectedLabels([]);

    setProjectIcon(undefined);

    setAttachments([]);
    setSelectedIndex(null);

    setEditingIndex(null);
    setShowEditModal(false);
    setIsOpen(false);
    setSelectedTeams([]);
    setStartDate(null);
    setShowDiscardDialog(false);
    dispatch(clearMilestones());
  };

  const handleCloseAttempt = () => {
    if (!projectName.trim() && !description.trim()) {
      resetForm();
      onOpenChange(false);
      return;
    }
    setShowDiscardDialog(true);
  };

  const handleDiscard = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (selectedTeams.length === 0) {
      toast.error("Please select at least one team");
      return;
    }
    const loadingToast = toast.loading("Creating project...");

    try {
      const payload: iProjectPayload = {
        workspace_id: currentWorkspace?.id,
        icon: projectIcon,
        name: projectName,
        description,
        short_summary: shortSummary,
        priority: priority
          ? priorityData.priority.find((p: any) => p.id === priority)?.id
          : undefined,
        status: selectedStatus?.id,
        start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
        target_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
        member: selectedMembers,
        lead_id: selectedLead?.id,
        team_id: selectedTeams?.map((t) => t.id),
        label: selectedLabels.map((l) => l.id),
        milestones,
      };
      const iconFile = projectIcon?.file;
      console.log(payload, "PAYLOAD");

      const res = await createProjectUri(payload, iconFile, attachments);
      fetchProjectUri(currentWorkspace?.slug).then((res) =>
        dispatch(setProject(res.data)),
      );
      toast.success("Project created successfully");

      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      console.error("=== API ERROR ===", error);

      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="md:max-w-5xl w-full h-[85vh] overflow-y-auto p-0 gap-0 dark:bg-[#1c1d1f] flex flex-col"
        showCloseButton={false}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 h-14 space-y-0">
          <div className="flex items-center gap-2">
            <TeamPicker
              teams={teamsData}
              value={selectedTeams}
              onChange={setSelectedTeams}
            />
            <span className="text-muted-foreground">›</span>
            <DialogTitle className="text-md dark:text-white">
              New project
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-pointer"
            onClick={handleCloseAttempt}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="px-6 space-y-4 flex flex-1 flex-col">
          {/* Project Icon and Name */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <IconPicker value={projectIcon} onChange={setProjectIcon} />
            </div>

            <div className="">
              <Input
                className="!text-2xl font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent dark:text-white dark:placeholder:text-[#626366] h-auto py-1"
                placeholder="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />

              <Textarea
                placeholder="Add a short summary..."
                value={shortSummary}
                onChange={(e) => setShortSummary(e.target.value)}
                className="text-base border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent resize-none dark:text-white dark:placeholder:text-[#626366] min-h-0 h-auto py-0"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 ">
            <PriorityPicker
              value={priority}
              onChange={setPriority}
              buttonVarient="light"
            />

            <ProjectFormStatus
              statuses={statusList}
              value={selectedStatus}
              onChange={setSelectedStatus}
            />

            <ProjectDatePicker
              label="Start"
              value={startDate ? new Date(startDate) : undefined}
              onChange={setStartDate}
              buttonVarient="light"
            />

            <ProjectDatePicker
              label="Target"
              value={endDate ? new Date(endDate) : undefined}
              onChange={setEndDate}
              buttonVarient="light"
            />
            <ProjectFormLabels
              labels={labels}
              value={selectedLabels}
              onChange={setSelectedLabels}
              buttonVarient="light"
            />

            <MemberPicker
              members={members}
              value={selectedMembers}
              onChange={setSelectedMembers}
              // className="w-full"
            />

            {/* Lead Picker */}
            <LeadPicker
              members={members}
              value={selectedLead}
              onChange={setSelectedLead}
              // className="w-full"
            />

            <Label className="h-7.5 w-auto rounded-md justify-start align-center gap-2 px-2 text-sm   text-muted-foreground dark:text-muted-foreground hover:font-semibold font-semibold hover:text-white border dark:bg-[#2a2c33] dark:hover:bg-[#32333a]">
              <PaperclipIcon className="size-3.5" />

              <span className="text-[13px]">Attachment</span>
              <input
                type="file"
                className="hidden"
                onChange={(ev) => {
                  const files = ev.target.files;
                  if (files && files.length > 0) {
                    setAttachments((prev) => [...prev, ...Array.from(files)]);
                  }
                }}
              />
            </Label>
          </div>

          <hr className="dark:text-zinc-700" />

          {/* Description */}
          <div
            className="rounded-md "
            onDrop={(e) => {
              e.preventDefault();
              setAttachments((prev) => [
                ...prev,
                ...Array.from(e.dataTransfer.files),
              ]);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {/* Text */}
            <Textarea
              placeholder="Write a description, a project brief, or collect ideas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onPaste={(e) => {
                const files = Array.from(e.clipboardData.files);
                if (files.length) {
                  setAttachments((prev) => [...prev, ...files]);
                }
              }}
              className="min-h-[100px] placeholder:text-[17px] font-semibold dark:placeholder:text-[#626366] resize-none border-0  shadow-none focus-visible:ring-0 dark:bg-transparent  px-0"
            />

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-3">
                {attachments.map((file, index) => {
                  const isImage = file.type.startsWith("image/");
                  const isSelected = selectedIndex === index;

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`relative cursor-pointer rounded-md transition
            ${isSelected ? "ring-2 ring-blue-500" : ""}
          `}
                    >
                      {/* IMAGE */}
                      {isImage ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            className="max-h-[420px] w-full rounded-md object-contain"
                          />

                          {isSelected && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAttachments((prev) =>
                                  prev.filter((_, i) => i !== index),
                                );
                                setSelectedIndex(null);
                              }}
                              className="absolute right-2 top-2 rounded bg-background p-1 shadow"
                            >
                              <Trash2Icon className="size-5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        /* FILE */
                        <div
                          className={`flex items-center gap-3 rounded-md border p-2
                ${isSelected ? "border-blue-500" : ""}
              `}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                            <PaperclipIcon className="size-5" />
                          </div>

                          <div className="flex-1 truncate">
                            <p className="truncate text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>

                          {isSelected && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAttachments((prev) =>
                                  prev.filter((_, i) => i !== index),
                                );
                                setSelectedIndex(null);
                              }}
                              className="text-sm"
                            >
                              <Trash2Icon className="size-5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="mt-auto pt-4">
            <MilestoneSection />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 py-2 px-4  border-t border-zinc-700 mt-auto sticky bottom-0 bg-[#1c1d1f] cursor-pointer">
          <Button variant="customDark" onClick={handleCloseAttempt}>
            Cancel
          </Button>

          <Button
            className="cursor-pointer"
            onClick={handleCreateProject}
            variant="custom"
          >
            Create project
          </Button>
        </div>
      </DialogContent>
      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent
          className="max-w-sm dark:bg-[#1c1d1f]"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="text-base font-semibold dark:text-white">
              Want to discard?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            If you discard, details will be lost.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="customDark"
              onClick={() => setShowDiscardDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="custom" onClick={handleDiscard}>
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
