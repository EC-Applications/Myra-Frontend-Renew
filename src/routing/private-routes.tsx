import MasterLayout from "@/components/master-layout";
import Members from "@/modules/members/members";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";

const ProjectRoutes = lazy(() => import("./project-routes"));
const TeamRoutes = lazy(() => import("./team-routes"));
const IssueRoutes = lazy(() => import("./issue-routes"));
const CustomerRoutes = lazy(() => import("./customer-routes"));
const SettingRoutes = lazy(() => import("./setting"));

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route
          path="/projects/*"
          element={
            <Suspense>
              <ProjectRoutes />
            </Suspense>
          }
        />
        <Route
          path="/teams/*"
          element={
            <Suspense>
              <TeamRoutes />
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
          path="/members"
          element={
            <Suspense>
              <Members />
            </Suspense>
          }
        />
        <Route path="/customers/*" element={<CustomerRoutes />} />
        <Route path="*" element={<Navigate to="/projects" replace={true} />} />
      </Route>
      <Route
        path="/settings/*"
        element={
          <Suspense>
            <SettingRoutes />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default PrivateRoutes;
