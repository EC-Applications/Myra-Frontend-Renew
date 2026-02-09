"use client";

import { Editor } from "@/components/blocks/editor-00/editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProjectTemplateHook } from "@/hooks/use-create-project-template";
import { useGetProjectTemplateDetailHook } from "@/hooks/use-get-project-template-detail";
import { useUpdateProjectTemplateHook } from "@/hooks/use-update-project-template";
import { useUser } from "@/hooks/use-user";
import type { iProjectTemplatePayload } from "@/interfaces/project-template.interface";
import type { iMember, iTeams } from "@/interfaces/teams.interface";
import { ProjectDatePicker } from "@/modules/projects/components/date-picker";
import { IconPicker } from "@/modules/projects/components/icon-picker";
import { ProjectFormLabels } from "@/modules/projects/components/label-picker";
import { LeadPicker } from "@/modules/projects/components/lead-picker";
import { MemberPicker } from "@/modules/projects/components/member-picker";
import MilestoneSection from "@/modules/projects/components/milestone";
import { PriorityPicker } from "@/modules/projects/components/priority-picker";
import { ProjectFormStatus } from "@/modules/projects/components/status-picker";
import { TeamPicker } from "@/modules/projects/components/team-picker";
import { clearMilestones } from "@/store/slices/milestone.slice";
import type { RootState } from "@/store/store";
import { format } from "date-fns";
import { useFormik } from "formik";
import { PaperclipIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import * as yup from "yup";

const templateSchema = yup.object({
  descriptive_name: yup.string().trim().required("Template name is required"),
  name: yup.string().trim().required("Project name is required"),
  short_summary: yup.string(),
});

export function TemplateForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const isEditMode = !!params?.id && params?.id !== "new";
  const templateId = isEditMode ? Number(params.id) : undefined;
  const { data: templateDetail } = useGetProjectTemplateDetailHook(templateId);
  const { currentWorkspace } = useUser();
  const priorityData = useSelector((state: any) => state.priority);
  const teamsData = useSelector((state: any) => state.teams);
  const status = useSelector((state: any) => state.status);

  const workspaceMember = useSelector((state: any) => state.workspace);
  const members = Array.isArray(workspaceMember) ? workspaceMember : [];
  const statusList = status?.status ?? [];

  const labelState = useSelector((state: any) => state.label);
  const labels = labelState?.labels ?? [];

  const milestones = useSelector((state: any) => state.milestone);

  const createTemplate = useCreateProjectTemplateHook();
  const updateTemplate = useUpdateProjectTemplateHook();

  // UI-only states (not form data)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const initialValues = useMemo(() => {
    if (isEditMode && templateDetail) {
      return {
        descriptive_name: templateDetail.descriptive_name ?? "",
        name: templateDetail.name ?? "",
        short_summary: templateDetail.short_summary ?? "",
        description: templateDetail.description ?? "",
        priority: templateDetail.priority_id ?? undefined,
        status: templateDetail.status ?? statusList?.[0] ?? null,
        start_date: templateDetail.start_date
          ? new Date(templateDetail.start_date)
          : null,
        target_date: templateDetail.target_date
          ? new Date(templateDetail.target_date)
          : null,
        labels: templateDetail.labels ?? [],
        members: templateDetail.members ?? [],
        lead: templateDetail.lead ?? undefined,
        teams: templateDetail.teams ?? [],
        icon:
          templateDetail.icon && typeof templateDetail.icon === "object"
            ? (templateDetail.icon as {
                icon: string;
                color: string;
                type: "icon" | "emoji";
                file?: File;
              })
            : undefined,
        attachments: [] as File[],
      };
    }
    return {
      descriptive_name: "",
      name: "",
      short_summary: "",
      description: "",
      priority: undefined as number | undefined,
      status: statusList?.[0] ?? null,
      start_date: null as Date | null,
      target_date: null as Date | null,
      labels: [] as any[],
      members: [] as iMember[],
      lead: undefined as iMember | undefined,
      teams: [] as iTeams[],
      icon: undefined as
        | { icon: string; color: string; type: "icon" | "emoji"; file?: File }
        | undefined,
      attachments: [] as File[],
    };
  }, [isEditMode, templateDetail, statusList]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: templateSchema,
    onSubmit: async (values) => {
      const loadingToast = toast.loading(
        isEditMode ? "Saving template..." : "Creating template...",
      );

      try {
        const payload: iProjectTemplatePayload = {
          workspace_id: currentWorkspace?.id as number,
          descriptive_name: values.descriptive_name,
          name: values.name,
          description: values.description,
          short_summary: values.short_summary,
          icon: values.icon,
          priority: values.priority
            ? priorityData.priority.find((p: any) => p.id === values.priority)
                ?.id
            : undefined,
          status: values.status?.id,
          start_date: values.start_date
            ? format(values.start_date, "yyyy-MM-dd")
            : undefined,
          target_date: values.target_date
            ? format(values.target_date, "yyyy-MM-dd")
            : undefined,
          member: values.members,
          lead_id: values.lead?.id,
          team_id: values.teams.map((t) => t.id),
          label: values.labels.map((l) => l.id),
          milestones,
        };

        if (isEditMode) {
          await updateTemplate.mutateAsync({
            id: templateId!,
            body: payload,
            iconFile: values.icon?.file,
            documentFiles: values.attachments,
            workspace_id: Number(currentWorkspace?.id),
          });
        } else {
          await createTemplate.mutateAsync({
            body: payload,
            iconFile: values.icon?.file,
            documentFiles: values.attachments,
            workspace_id: Number(currentWorkspace?.id),
          });
        }

        toast.success(
          isEditMode
            ? "Template saved successfully"
            : "Template created successfully",
        );
        formik.resetForm();
        setSelectedIndex(null);
        dispatch(clearMilestones());
        navigate("../");
      } catch (error: any) {
        console.error("=== API ERROR ===", error);
        toast.error(
          error?.message ||
            `Failed to ${isEditMode ? "update" : "create"} template`,
        );
      } finally {
        toast.dismiss(loadingToast);
      }
    },
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {isEditMode ? "Edit" : "New"} project template
        </h1>

        <div className="">
          {/* Descriptive Name Field */}
          <div className="lg:col-span-3 space-y-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input
              placeholder="Add a descriptive name..."
              className="bg-card border-border mt-2"
              name="descriptive_name"
              value={formik.values.descriptive_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.descriptive_name &&
              formik.errors.descriptive_name && (
                <p className="text-sm text-red-500">
                  {formik.errors.descriptive_name}
                </p>
              )}
          </div>
        </div>
        <Card>
          <CardContent className="md:max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0 gap-0">
            <div className="px-6 space-y-6">
              {/* Project Icon and Name */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg  flex items-center justify-center">
                    <IconPicker
                      value={formik.values.icon}
                      onChange={(val: any) => formik.setFieldValue("icon", val)}
                      variant="compact"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Input
                    className="!text-2xl font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent dark:text-white dark:placeholder:text-[#626366] h-auto py-1"
                    placeholder="Project name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-sm text-red-500">{formik.errors.name}</p>
                  )}

                  <Textarea
                    placeholder="Add a short summary..."
                    name="short_summary"
                    value={formik.values.short_summary}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="text-base border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent resize-none dark:text-white dark:placeholder:text-[#626366] min-h-0 h-auto py-0"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 ">
                <PriorityPicker
                  value={formik.values.priority}
                  onChange={(val: any) => formik.setFieldValue("priority", val)}
                  buttonVarient="light"
                />

                <ProjectFormStatus
                  statuses={statusList}
                  value={formik.values.status}
                  onChange={(val: any) => formik.setFieldValue("status", val)}
                />

                <ProjectDatePicker
                  label="Start"
                  value={
                    formik.values.start_date
                      ? new Date(formik.values.start_date)
                      : undefined
                  }
                  onChange={(val: any) =>
                    formik.setFieldValue("start_date", val)
                  }
                  buttonVarient="light"
                />

                <ProjectDatePicker
                  label="Target"
                  value={
                    formik.values.target_date
                      ? new Date(formik.values.target_date)
                      : undefined
                  }
                  onChange={(val: any) =>
                    formik.setFieldValue("target_date", val)
                  }
                  buttonVarient="light"
                />
                <ProjectFormLabels
                  labels={labels}
                  value={formik.values.labels}
                  onChange={(val: any) => formik.setFieldValue("labels", val)}
                  buttonVarient="light"
                />

                <MemberPicker
                  members={members}
                  value={formik.values.members}
                  onChange={(val: any) => formik.setFieldValue("members", val)}
                />

                {/* Lead Picker */}
                <LeadPicker
                  members={members}
                  value={formik.values.lead}
                  onChange={(val: any) => formik.setFieldValue("lead", val)}
                />

                <Label className="h-7.5 w-auto rounded-md justify-start align-center gap-2 px-2 text-sm   text-muted-foreground dark:text-muted-foreground hover:font-semibold font-semibold hover:text-black dark:hover:text-white border dark:bg-[#2a2c33] dark:hover:bg-[#32333a]">
                  <PaperclipIcon className="size-3.5" />

                  <span className="text-[13px] textmute">Attachment</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(ev) => {
                      const files = ev.target.files;
                      if (files && files.length > 0) {
                        formik.setFieldValue("attachments", [
                          ...formik.values.attachments,
                          ...Array.from(files),
                        ]);
                      }
                    }}
                  />
                </Label>

                <TeamPicker
                  teams={teamsData}
                  value={formik.values.teams}
                  onChange={(val: any) => formik.setFieldValue("teams", val)}
                />
              </div>
              {formik.touched.teams && formik.errors.teams && (
                <p className="text-sm text-red-500">
                  {formik.errors.teams as string}
                </p>
              )}

              <hr className="dark:text-zinc-700" />

              {/* Description */}
              <div
                className="rounded-md "
                onDrop={(e) => {
                  e.preventDefault();
                  formik.setFieldValue("attachments", [
                    ...formik.values.attachments,
                    ...Array.from(e.dataTransfer.files),
                  ]);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                {/* Text */}
                <Editor
                  editorHtmlState={formik.values.description}
                  onHtmlChange={(e: string) =>
                    formik.setFieldValue("description", e)
                  }
                  placeholder="Write a description, a project brief, or collect ideas..."
                />

                {/* Attachments */}
                {formik.values.attachments.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {formik.values.attachments.map((file, index) => {
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
                                    formik.setFieldValue(
                                      "attachments",
                                      formik.values.attachments.filter(
                                        (_, i) => i !== index,
                                      ),
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
                                    formik.setFieldValue(
                                      "attachments",
                                      formik.values.attachments.filter(
                                        (_, i) => i !== index,
                                      ),
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

              {/* Milestone Section */}
              <div className="mt-auto pt-4">
                <MilestoneSection />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="bg-card border-border"
            onClick={() => navigate("../")}
          >
            Cancel
          </Button>
          <Button
          variant="custom"
            onClick={() => formik.handleSubmit()}
            disabled={createTemplate.isPending || updateTemplate.isPending}
          >
            {isEditMode ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
