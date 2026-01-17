import { DocumentForm } from "@/modules/settings/features/documents-form";
import { TemplateForm as IssueTemplateForm } from "@/modules/settings/issues/template-form";
import { TemplateForm as ProjectTemplateForm } from "@/modules/settings/projects/template-form";
import Teams from "@/modules/settings/teams";
import Cycles from "@/modules/settings/teams/cycles";
import General from "@/modules/settings/teams/general";
import IssueLabels from "@/modules/settings/teams/issue-labels";
import { IssueStatusesAutomation } from "@/modules/settings/teams/issue-status-automation";
import Members from "@/modules/settings/teams/members";
import { RecurringIssues } from "@/modules/settings/teams/recurring-issues";
import { RecurringIssuesForm } from "@/modules/settings/teams/recurring-issues-form";
import SlackNotifications from "@/modules/settings/teams/slack-notifications";
import { Templates } from "@/modules/settings/teams/templates";
import { Route, Routes } from "react-router";

const TeamRoutes = () => {
  return (
    <Routes>
      <Route path=":id">
        <Route index element={<Teams />} />
        <Route path="general" element={<General />} />
        <Route path="members" element={<Members />} />
        <Route path="issue-labels" element={<IssueLabels />} />
        <Route path="templates">
          <Route index element={<Templates />} />
          <Route path="issues/:id" element={<IssueTemplateForm />} />
          <Route path="projects/:id" element={<ProjectTemplateForm />} />
          <Route path="documents/:id" element={<DocumentForm />} />
        </Route>
        <Route path="recurring-issues">
          <Route index element={<RecurringIssues />} />
          <Route path=":id" element={<RecurringIssuesForm />} />
        </Route>
        <Route path="slack-notifications" element={<SlackNotifications />} />
        <Route path="workflow" element={<IssueStatusesAutomation />} />
        <Route path="cycles" element={<Cycles />} />
      </Route>
    </Routes>
  );
};

export default TeamRoutes;
