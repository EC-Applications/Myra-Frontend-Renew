import { Api } from "@/modules/settings/administration/api";
import { NewApplication } from "@/modules/settings/administration/api/new-application";
import { NewWebhook } from "@/modules/settings/administration/api/new-webhook";
import { Applications } from "@/modules/settings/administration/applications";
import { Billing } from "@/modules/settings/administration/billing";
import { BillingPlans } from "@/modules/settings/administration/billing-plans";
import ImportExport from "@/modules/settings/administration/import-export";
import Security from "@/modules/settings/administration/security";
import AdministrationTeams from "@/modules/settings/administration/teams";

import { Workspace } from "@/modules/settings/administration/workspace";
import { Route, Routes } from "react-router";

const AdministrationRoutes = () => {
  return (
    <Routes>
      <Route path="workspace" element={<Workspace />} />
      <Route path="security" element={<Security />} />
      <Route path="api">
        <Route index element={<Api />} />
        <Route path="applications/new" element={<NewApplication />} />
        <Route path="webhooks/new" element={<NewWebhook />} />
      </Route>
      <Route path="applications" element={<Applications />} />
      <Route path="billing">
        <Route index element={<Billing />} />
        <Route path="plans" element={<BillingPlans />} />
      </Route>
      <Route path="import-export" element={<ImportExport />} />
      <Route>
        <Route path="teams" element={<AdministrationTeams />} />
      </Route>

    </Routes>
  );
};

export default AdministrationRoutes;
