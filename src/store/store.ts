import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import teamsReducer from "./slices/team.slice";
import milestoneReducer from "./slices/milestone.slice";
import priorityReducer from "./slices/priority.slice";
import statusReducer from "./slices/status.slice";
import labelReducer from "./slices/label.slice";
import projectReducer from "./slices/project.slice";
import workspaceReducer from "./slices/workspace.slice";
import issuesReducer from "./slices/issues.slice";
import issuesLabelReducer from "./slices/issues-label.slice";
import subIssuesReducer from "./slices/sub-issues.slice";
import issuesStatusReducer from "./slices/issues-status.slice";
import cycleIssuesReducer from "./slices/cycle-issues.slice";
import useTeamIdReducer from "./slices/use-team-id";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams: teamsReducer,
    milestone: milestoneReducer,
    priority: priorityReducer,
    status: statusReducer,
    label: labelReducer,
    project: projectReducer,
    workspace: workspaceReducer,
    issues: issuesReducer,
    issuesLabel: issuesLabelReducer,
    subIssues: subIssuesReducer,
    issuesStatus: issuesStatusReducer,
    cycleIssues: cycleIssuesReducer,
    useTeamId : useTeamIdReducer
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
