import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { toast, Toaster } from "sonner";
import { getTeams } from "./services/team.service";
import { useDispatch, useSelector } from "react-redux";
import { setTeams } from "./store/slices/team.slice";
import { fetchProjectUri, priorityFetchUri, projectStatusCateogryUri } from "./services/project.service";
import { setPriorityList } from "./store/slices/priority.slice";
import type { IPriority, iProject } from "./interfaces/project.interface";
import { projectCatetory } from "./store/slices/status.slice";
import { fetchissueStatusUri, getLabelListUri } from "./services/general.service";
import { setLabel } from "./store/slices/label.slice";
import { getMembers } from "./services/workspace.service";
import { setWorkspaceMember } from "./store/slices/workspace.slice";
import type { iResponse } from "./interfaces/common.interface";
import { useUser } from "./hooks/use-user";
import { store } from "./store/store";
import { setProject } from "./store/slices/project.slice";
import { getIssuesLabelListUri } from "./services/issues.service";
import { setIssuesLabel } from "./store/slices/issues-label.slice";
import { setIssuesSatus } from "./store/slices/issues-status.slice";



function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const auth = store.getState().auth;
  const { currentWorkspace } = useUser();
  const currentWorkspaceData = useSelector( 
    (state: any) => state.auth.currentWorkspace
  );

  const currentWorkspaceName = useSelector(
    (state: any) => state.auth.currentWorkspaceName
  );
  // const auth = store.getState().auth;
  const token = auth.tokens[auth.currentUser];
  // console.log("Token in dashboard", token);

  console.log("CURRENT WORKPSACE Id", currentWorkspace?.id)
  console.log("CURRENT WORKPSACE", currentWorkspaceName)


  useEffect(() => {
    if (!token || !currentWorkspace) return;
    // console.log("CURRENT slug",currentWorkspace!.slug)

    const fetchAllData = async () => {
      setLoading(true);

      try {
        await Promise.all([
          getMembers(currentWorkspace.slug, currentWorkspace.id).then((res) => {
            dispatch(setWorkspaceMember(res.data));
          }),

          fetchProjectUri(currentWorkspace.slug).then((res) => {
            dispatch(setProject(res.data));
          }),

          getTeams(currentWorkspaceName.name, currentWorkspaceData).then((res) => {
            dispatch(setTeams(res.data));
          }),

          priorityFetchUri().then((res) => {
            dispatch(setPriorityList(res.data));
          }),

          projectStatusCateogryUri(currentWorkspace.id).then((res) => {
            dispatch(projectCatetory(res.data));
          }),

          getLabelListUri(currentWorkspace.id).then((res) => {
            dispatch(setLabel(res.data));
          }),

          getIssuesLabelListUri(currentWorkspace?.id).then((res) => {
            dispatch(setIssuesLabel(res.data));
          }),

          fetchissueStatusUri().then((res) => {
            dispatch(setIssuesSatus(res.data));
          })
        ]);
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [currentWorkspace]);



  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/60 z-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }


  return (
    <>
      <Outlet />
      <Toaster richColors />
    </>
  );
}

export default App;
