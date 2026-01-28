import MasterLayout from "@/components/master-layout";
import Members from "@/modules/members/members";
import { useAppSelector } from "@/store/hook";
import { lazy, Suspense, useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from "react-router";

const ProjectRoutes = lazy(() => import("./project-routes"));
const TeamRoutes = lazy(() => import("./team-routes"));
const IssueRoutes = lazy(() => import("./issue-routes"));
const CustomerRoutes = lazy(() => import("./customer-routes"));
const SettingRoutes = lazy(() => import("./setting"));

const PrivateRoutes = () => {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirectTo");
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((x) => x.auth);

  useEffect(() => {
    if (redirectUrl && currentUser) navigate(redirectUrl);
  }, [redirectUrl, navigate, currentUser]);

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
