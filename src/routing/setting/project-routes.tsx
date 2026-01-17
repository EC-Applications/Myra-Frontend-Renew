import { Labels } from "@/modules/settings/projects/labels";
import Statuses from "@/modules/settings/projects/statuses";
import { TemplateForm } from "@/modules/settings/projects/template-form";
import { Templates } from "@/modules/settings/projects/templates";
import { Updates } from "@/modules/settings/projects/updates";
import { Navigate, Route, Routes } from "react-router";

const IssueRoutes = () => {
  return (
    <Routes>
      <Route path="labels" element={<Labels />} />
      <Route path="templates">
        <Route index element={<Templates />} />
        <Route path="new" element={<TemplateForm />} />
        <Route path=":id/edit" element={<TemplateForm />} />
      </Route>
      <Route path="statuses" element={<Statuses />} />
      <Route path="updates" element={<Updates />} />
      <Route path="/*" element={<Navigate to="../labels" />} />
    </Routes>
  );
};

export default IssueRoutes;
