"use client";

import { useState, useRef } from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { LinkIcon, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IssuesStatusPicker } from "./issues-status-picker";
import { useSelector } from "react-redux";
import { SingleMemberPicker } from "@/modules/projects/components/single-member-picker";
import { ProjectFormLabels } from "@/modules/projects/components/label-picker";
import { ProjectDatePicker } from "@/modules/projects/components/date-picker";
import { PriorityPicker } from "@/modules/projects/components/priority-picker";
// import { createSubIssueUri } from "@/services/sub-issue.service"
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useUser } from "@/hooks/use-user";
import type { iIussesDetail, iSubIssuePayload } from "@/interfaces/issues";
import { SingleTeamPicker } from "@/components/single-team-picker";
import type { iTeams } from "@/interfaces/teams.interface";
import { createSubIssueUri } from "@/services/sub-issues.service";
import { issueDetailUri } from "@/services/issues.service";
import type { RootState } from "@/store/store";

// Validation schema
const subIssueSchema = yup.object({
  name: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  team_id: yup.number().required("Team is required"),
  description: yup.string(),
  status_id: yup.number().required("Status is required"),
  priority_id: yup.number(),
  assignee_id: yup.number(),
  label_id: yup.array().of(yup.number()),
  due_date: yup.date().nullable(),
  documents: yup.array(),
});

interface SubIssueFormProps {
  parentIssueId: number;
  onSuccess?: (updatedData?: iIussesDetail) => void;
  onCancel?: () => void;
}

export default function SubIssueForm({
  parentIssueId,
  onSuccess,
  onCancel,
}: SubIssueFormProps) {
  const { id } = useParams();
  console.log("ISSUES ID",id)
  const { currentWorkspace } = useUser();

  const status = useSelector((state: RootState) => state.issuesStatus);
  const statusList = status ?? [];
  const workspaceMember = useSelector((state: any) => state.workspace);
  const members = Array.isArray(workspaceMember) ? workspaceMember : [];
  const labels = useSelector((state: any) => state.issuesLabel);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const teamsData = useSelector((state: any) => state.teams);
  const [selectedTeam, setSelectedTeam] = useState<iTeams | null>(null);

  const initialValues: iSubIssuePayload = {
    name: "",
    description: "",
    team_id: Number(selectedTeam?.id),
    workspace_id: currentWorkspace?.id || 0,
    status_id: statusList?.[0]?.id || 0,
    priority_id: undefined,
    assignee_id: undefined,
    label_id: [],
    due_date: null,
    parent_issue_id: parentIssueId,
    documents: [],
  };

  const handleSubmit = async (
    values: iSubIssuePayload,
    { setSubmitting, resetForm }: any
  ) => {
    const loadingToast = toast.loading("Creating sub-issue...");
    try {
      const payload: iSubIssuePayload = {
        ...values,
        due_date: values.due_date
          ? new Date(values.due_date).toISOString().split("T")[0]
          : null,
      };

      const response = await createSubIssueUri(payload);

      toast.dismiss(loadingToast);
      toast.success(response.message || "Sub-issue created successfully");
      const res = await issueDetailUri(Number(parentIssueId));
      resetForm();
      onSuccess?.(res.data);
    } catch (e: any) {
      toast.dismiss(loadingToast);
      toast.error(e.response?.data?.message || "Failed to create sub-issue");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={subIssueSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => (
        <Form>
          <div className="border border-border rounded-lg bg-card dark:bg-[#1c1d1f] p-3 space-y-1">
            {/* Status and Title */}
            <div className="flex items-center gap-3">
              <IssuesStatusPicker
                statuses={statusList}
                value={
                  statusList.find((s: any) => s.id === values.status_id) || null
                }
                onChange={(status) => setFieldValue("status_id", status.id)}
                variant="icon-only"
              />

              <div className="flex-1">
                <Input
                  placeholder="Sub-issue title..."
                  value={values.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  className="sm:text-lg md:text-sm font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent dark:placeholder:text-[#616265]"
                />
                {errors.name && touched.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <Textarea
              placeholder="Add description..."
              value={values.description}
              onChange={(e) => setFieldValue("description", e.target.value)}
              className="sm:text-lg md:text-sm font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent dark:placeholder:text-[#616265]"
            />

            {/* Attachments Preview */}
            {values.documents && values.documents.length > 0 && (
              <div className="ml-9 space-y-2">
                {values.documents.map((file, index) => {
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
                            className="max-h-[200px] w-full rounded-md object-contain"
                            alt="attachment"
                          />
                          {isSelected && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFieldValue(
                                  "documents",
                                  values.documents?.filter(
                                    (_, i) => i !== index
                                  )
                                );
                                setSelectedIndex(null);
                              }}
                              className="absolute right-2 top-2 rounded bg-background p-1 shadow"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`flex items-center gap-3 rounded-md border p-2 ${
                            isSelected ? "border-blue-500" : ""
                          }`}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                            📎
                          </div>
                          <div className="flex-1 truncate">
                            <p className="truncate text-sm">{file.name}</p>
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
                                  "documents",
                                  values.documents?.filter(
                                    (_, i) => i !== index
                                  )
                                );
                                setSelectedIndex(null);
                              }}
                              className="text-sm"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Metadata and Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              {/* Left: Metadata Buttons */}
              <div className="flex items-center gap-2">
                <SingleTeamPicker
                  teams={teamsData}
                  value={selectedTeam}
                  onChange={setSelectedTeam}
                />

                {/* Priority */}
                <PriorityPicker
                  value={values.priority_id}
                  onChange={(priorityId) =>
                    setFieldValue("priority_id", priorityId)
                  }
                />

                {/* Assignee */}
                <SingleMemberPicker
                  members={members}
                  value={members.find((m: any) => m.id === values.assignee_id)}
                  onChange={(member) =>
                    setFieldValue("assignee_id", member?.id)
                  }
                  buttonVarient="light"
                />

                {/* Labels */}
                <ProjectFormLabels
                  labels={labels}
                  value={labels.filter((l: any) =>
                    values.label_id?.includes(l.id)
                  )}
                  onChange={(selectedLabels) =>
                    setFieldValue(
                      "label_id",
                      selectedLabels.map((l) => l.id)
                    )
                  }
                />

                {/* Due Date */}
                <ProjectDatePicker
                  label="Due date"
                  value={
                    values.due_date ? new Date(values.due_date) : undefined
                  }
                  onChange={(date) => setFieldValue("due_date", date)}
                />

                {/* Attach File */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 hover:bg-muted rounded transition-colors"
                  title="Attach files"
                >
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    const files = Array.from(e.target.files);
                    setFieldValue("documents", [
                      ...(values.documents || []),
                      ...files,
                    ]);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="border-border text-muted-foreground hover:text-foreground bg-transparent"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  // size="sm"
                  disabled={isSubmitting}
                  variant="custom"
                  size="custom"
                  className="cursor-pointer hover:bg-gray-400"
                >
                  {isSubmitting ? "Creating..." : "Create sub-issue"}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
