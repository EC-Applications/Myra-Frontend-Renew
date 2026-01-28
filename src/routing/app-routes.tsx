import App from "@/App";
import AddAccount from "@/modules/auth/add-account.component";
import SignIn from "@/modules/auth/sign-in.component";
import WorkspaceSetup from "@/modules/auth/workspace-setup.component";
import { useAppSelector } from "@/store/hook";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import PrivateRoutes from "./private-routes";
import SocialLogin from "@/modules/auth/social-login";
import { useEffect } from "react";

const NavigateToSignin = () => {
  const { pathname } = useLocation();
  const redirectTo = encodeURIComponent(pathname);
  return <Navigate to={`/sign-in?redirectTo=${redirectTo}`} replace={true} />;
};

const AppRoutes = () => {
  const { currentUser, currentWorkspace } = useAppSelector((x) => x.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          {currentUser != 0 ? (
            <>
              <Route path="/workspace-setup" element={<WorkspaceSetup />} />
              <Route path="/add-account" element={<AddAccount />} />
              {currentWorkspace == 0 ? (
                <>
                  <Route
                    path="*"
                    element={<Navigate to="/workspace-setup" replace={true} />}
                  />
                </>
              ) : (
                <Route path="/*" element={<PrivateRoutes />} />
              )}
            </>
          ) : (
            <>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/social-login" element={<SocialLogin />} />
              <Route path="*" element={<NavigateToSignin />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
