import SettingsLayout from "@/components/settings-layout";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";

const AccountRoutes = lazy(() => import("./account-routes"));
const IssueRoutes = lazy(() => import("./issue-routes"));
const ProjectRoutes = lazy(() => import("./project-routes"));
const FeatureRoutes = lazy(() => import("./feature-routes"));
const AdministrationRoutes = lazy(() => import("./administration-routes"));
const TeamRoutes = lazy(() => import("./team-routes"));

const SettingRoutes = () => {
  return (
    <Routes>
      <Route element={<SettingsLayout />}>
        <Route
          path="/account/*"
          element={
            <Suspense>
              <AccountRoutes />
            </Suspense>
          }
        />
        <Route
          path="/issues/*"
          element={
            <Suspense>
              <IssueRoutes />
            </Suspense>
          }
        />
        <Route
          path="/projects/*"
          element={
            <Suspense>
              <ProjectRoutes />
            </Suspense>
          }
        />
        <Route
          path="/features/*"
          element={
            <Suspense>
              <FeatureRoutes />
            </Suspense>
          }
        />
        <Route
          path="/administration/*"
          element={
            <Suspense>
              <AdministrationRoutes />
            </Suspense>
          }
        />
        <Route
          path="teams/*"
          element={
            <Suspense>
              <TeamRoutes />
            </Suspense>
          }
        />
        <Route path="/*" element={<Navigate to="/settings/account" />} />
      </Route>
    </Routes>
  );
};

export default SettingRoutes;
