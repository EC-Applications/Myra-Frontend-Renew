// schemas/issue.schema.ts
import * as yup from "yup";

export const issueSchema = yup.object({
  name: yup.string().required("Issue title is required").min(3, "Title must be at least 3 characters"),
  description: yup.string(),
  status_id: yup.number(),
  priority_id: yup.number(),
  project_id: yup.number(),
  assignee_id: yup.number(),
  label: yup.array().of(yup.number()),
  due_date: yup.date().nullable(),
  external_link: yup.string().url("Must be a valid URL"),
  attachments: yup.array(),
});



export const subIssueValidationSchema = yup.object({
  name: yup.string()
    .trim()
    .required("Sub-issue title is required"),

  team_ids: yup.array()
    .min(1, "Please select at least one team")
    .required("Please select at least one team"),
});