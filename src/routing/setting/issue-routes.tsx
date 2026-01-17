import { Labels } from "@/modules/settings/issues/labels";
import SLAs from "@/modules/settings/issues/slas";
import { TemplateForm } from "@/modules/settings/issues/template-form";
import { Templates } from "@/modules/settings/issues/templates";
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
      <Route path="sla" element={<SLAs />} />
      <Route path="/*" element={<Navigate to="../labels" />} />
    </Routes>
  );
};

export default IssueRoutes;
