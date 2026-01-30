"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import type { iIssuePayload } from "@/interfaces/issues.interface";
import { issueSchema } from "@/schema/issue-schema";
import { useCreateIssueHook } from "@/hooks/use-create-issue";
import { Form, Formik, type FormikHelpers } from "formik";
import { LucideSquareArrowRight, Paperclip, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { ProjectDatePicker } from "../projects/components/date-picker";
import { ProjectFormLabels } from "../projects/components/label-picker";
import { PriorityPicker } from "../projects/components/priority-picker";
import { SingleMemberPicker } from "../projects/components/single-member-picker";
import { IssuesStatusPicker } from "./components/issues-status-picker";
import { ProjectPicker } from "./components/project-picker";
import { cn } from "@/lib/utils";
import type { RootState } from "@/store/store";
import { cycleDetailUri } from "@/services/cycle.service";
import { setCycleIssues } from "@/store/slices/cycle-issues.slice";
import type {
  iCycleListResponse,
  iCycleResponse,
} from "@/interfaces/cycle.interface";
import { CyclePicker } from "../cycles/components/cycle-picker";
import { TeamPicker } from "../projects/components/team-picker";
import type { iTeams } from "@/interfaces/teams.interface";
import { SingleTeamPicker } from "@/components/single-team-picker";

interface NewIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cycleData?: iCycleListResponse[];
  defStatus?: number;
  defProject?: number;
}

export default function NewIssueDialog({
  open,
  onOpenChange,
  cycleData,
  defStatus,
  defProject,
}: NewIssueDialogProps) {
  const { "team-id": teamId, cycleId: cycleID } = useParams();
  const projects = useSelector((state: any) => state.project.projects);
  const teams = useSelector((state: any) => state.teams);
  const status = useSelector((state: RootState) => state.issuesStatus);
  const statusList = status ?? [];
  const labels = useSelector((state: any) => state.issuesLabel);
  const workspaceMember = useSelector((state: any) => state.workspace);
  const members = Array.isArray(workspaceMember) ? workspaceMember : [];
  const workspace = useUser();

  const dispatch = useDispatch();
  const createIssue = useCreateIssueHook();

  const fiterTeam = teams.find((f: any) => f.id == teamId);
  // console.log("FILTER TEAM", fiterTeam);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Find current cycle by default
  const currentCycle = cycleData?.find((cycle) => cycle.status === "current");

  // USE STATES
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<iTeams | null>();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const teamset = useSelector((state: RootState) => state.useTeamId);
  const [selectedCycle, setSelectedCycle] = useState<
    iCycleListResponse | undefined
  >(currentCycle);

  // console.log("TEAM ID", teamId);
  useEffect(() => {
    if (open && currentCycle) {
      setSelectedCycle(currentCycle);
    }
  }, [open, currentCycle]);

  // console.log("LOAD DATA IN NEW ISSUE", currentCycle?.id);
  // console.log("SELECTED TEAM ID", selectedTeams?.id);

  // console.log("SET TEAM ID", teamset);
  // console.log("CYCLE ID", cycleID);

  // Initial values
  const initialValues: iIssuePayload = {
    name: "",
    description: "",
    cycle_id: selectedCycle?.id || currentCycle?.id,
    team_id: Number(selectedTeams?.id) || Number(teamId) || teamset,
    workspace_id: workspace?.currentWorkspace?.id || 0,
    status_id: defStatus || statusList?.[0]?.id || 0,
    priority_id: undefined,
    project_id: defProject || undefined,
    assignee_id: undefined,
    labels: [],
    due_date: null,
    external_link: "",
    attachments: [],
  };

  const handleSubmit = (
    values: iIssuePayload,
    { resetForm }: FormikHelpers<iIssuePayload>,
  ) => {
    const payload: iIssuePayload = {
      ...values,
      team_id: selectedTeams?.id ? Number(selectedTeams.id) : 0,
      due_date: values.due_date
        ? new Date(values.due_date).toISOString().split("T")[0]
        : null,
    };

    setSelectedCycle(undefined);

    createIssue.mutate(payload, {
      onSuccess: () => {
        // Cycle issues ke liye Redux update (kyunki React Query use nahi ho raha)
        if (cycleID) {
          cycleDetailUri(
            workspace.currentWorkspace?.slug ?? "",
            Number(teamId),
            Number(cycleID),
          ).then((res) => dispatch(setCycleIssues(res.data)));
        }

        resetForm();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Formik
        initialValues={initialValues}
        validationSchema={issueSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, resetForm }) => {
          const handleCloseAttempt = () => {
            if (!values.name?.trim() && !values.description?.trim()) {
              resetForm();
              onOpenChange(false);
              return;
            }
            setShowDiscardDialog(true);
          };

          const handleDiscard = () => {
            setShowDiscardDialog(false);
            resetForm();
            onOpenChange(false);
          };

          return (
            <>
              <DialogContent
                className="border dark:border-zinc-600 md:max-w-4xl dark:bg-[#1c1d1f] w-full max-h-[50vh] overflow-y-auto p-0 gap-0"
                showCloseButton={false}
              >
                <Form>
                  {/* Header */}
                  <DialogHeader className="flex flex-row items-center justify-between py-1 px-3 dark:border-zinc-700">
                    <div className="flex items-center gap-2 pt-2">
                      <SingleTeamPicker
                        teams={teams}
                        value={selectedTeams ?? null}
                        onChange={setSelectedTeams}
                      />
                      {/* <LucideSquareArrowRight className="h-4 w-4" /> */}

                      <DialogTitle className="h-4 dark:text-muted-foreground">
                        ›
                      </DialogTitle>
                      <DialogTitle className="text-md dark:text-muted-foreground">
                        New issue
                      </DialogTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCloseAttempt}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </DialogHeader>

                  {/* Content */}
                  <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
                    {/* Title Input */}
                    <div>
                      <Input
                        placeholder="Issue title"
                        value={values.name}
                        onChange={(e) => setFieldValue("name", e.target.value)}
                        className={`sm:text-lg md:text-lg font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent dark:placeholder:text-[#616265]`}
                      />
                      {errors.name && touched.name && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Description Editor */}
                    <div
                      className="rounded-md"
                      onDrop={(e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files);
                        setFieldValue("attachments", [
                          ...(values.attachments || []),
                          ...files,
                        ]);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <Textarea
                        placeholder="Add description..."
                        value={values.description}
                        onChange={(e) =>
                          setFieldValue("description", e.target.value)
                        }
                        onPaste={(e) => {
                          const files = Array.from(e.clipboardData.files);
                          if (files.length) {
                            setFieldValue("attachments", [
                              ...(values.attachments || []),
                              ...files,
                            ]);
                          }
                        }}
                        className="min-h-[80px] dark:placeholder:text-[#616265] placeholder:text-[20px] resize-none border-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
                      />

                      {/* Attachments */}
                      {values.attachments && values.attachments.length > 0 && (
                        <div className="mt-3 space-y-3">
                          {values.attachments.map((file, index) => {
                            const isImage = file.type.startsWith("image/");
                            const isSelected = selectedIndex === index;

                            return (
                              <div
                                key={index}
                                onClick={() => setSelectedIndex(index)}
                                className={`relative cursor-pointer rounded-md transition ${
                                  isSelected ? "ring-2 ring-blue-500" : ""
                                }`}
                              >
                                {isImage ? (
                                  <div className="relative">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      className="max-h-[420px] w-full rounded-md object-contain"
                                      alt="attachment"
                                    />
                                    {isSelected && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setFieldValue(
                                            "attachments",
                                            values.attachments?.filter(
                                              (_, i) => i !== index,
                                            ),
                                          );
                                          setSelectedIndex(null);
                                        }}
                                        className="absolute right-2 top-2 rounded bg-background p-1 shadow"
                                      >
                                        🗑️
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <div
                                    className={`flex items-center gap-3 rounded-md border p-2 ${
                                      isSelected ? "border-blue-500" : ""
                                    }`}
                                  >
                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                                      📎
                                    </div>
                                    <div className="flex-1 truncate">
                                      <p className="truncate text-sm">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                    {isSelected && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setFieldValue(
                                            "attachments",
                                            values.attachments?.filter(
                                              (_, i) => i !== index,
                                            ),
                                          );
                                          setSelectedIndex(null);
                                        }}
                                        className="text-sm"
                                      >
                                        🗑️
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

                    {/* Property Buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      <PriorityPicker
                        value={values.priority_id}
                        onChange={(priorityId) =>
                          setFieldValue("priority_id", priorityId)
                        }
                      />

                      <ProjectDatePicker
                        label="Date"
                        value={
                          values.due_date
                            ? new Date(values.due_date)
                            : undefined
                        }
                        onChange={(date) => setFieldValue("due_date", date)}
                      />

                      <IssuesStatusPicker
                        statuses={statusList}
                        value={
                          statusList.find(
                            (s: any) => s.id === values.status_id,
                          ) || null
                        }
                        onChange={(status) =>
                          setFieldValue("status_id", status.id)
                        }
                        buttonVarient="light"
                      />

                      <SingleMemberPicker
                        members={members}
                        value={members.find(
                          (m: any) => m.id === values.assignee_id,
                        )}
                        onChange={(member) =>
                          setFieldValue("assignee_id", member?.id)
                        }
                        buttonVarient="light"
                      />

                      <ProjectPicker
                        projects={projects}
                        value={projects.find(
                          (p: any) => p.id === values.project_id,
                        )}
                        onChange={(project) =>
                          setFieldValue("project_id", project?.id)
                        }
                      />

                      <ProjectFormLabels
                        labels={labels}
                        value={labels.filter((l: any) =>
                          values.labels?.includes(l.id),
                        )}
                        onChange={(selectedLabels) =>
                          setFieldValue(
                            "labels",
                            selectedLabels.map((l) => l.id),
                          )
                        }
                      />
                      <CyclePicker
                        cycles={cycleData || []}
                        value={selectedCycle}
                        onChange={(cycle) => setSelectedCycle(cycle || undefined)}
                        variant="default"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between p-3 border-t dark:border-zinc-700 bg-muted/20">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                      className="hidden"
                      onChange={(e) => {
                        if (!e.target.files) return;
                        const files = Array.from(e.target.files);
                        setFieldValue("attachments", [
                          ...(values.attachments || []),
                          ...files,
                        ]);
                        e.target.value = "";
                      }}
                    />

                    <div className="flex items-center gap-4">
                      <Button
                        type="submit"
                        variant="custom"
                        size="custom"
                        disabled={createIssue.isPending}
                        className="cursor-pointer hover:bg-gray-400"
                      >
                        {createIssue.isPending ? "Creating..." : "Create issue"}
                      </Button>
                    </div>
                  </div>
                </Form>
              </DialogContent>

              <Dialog
                open={showDiscardDialog}
                onOpenChange={setShowDiscardDialog}
              >
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
            </>
          );
        }}
      </Formik>

      {/* Discard Confirmation Dialog */}
    </Dialog>
  );
}
