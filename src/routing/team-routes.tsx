import ProjectAgainstTeamId from "@/modules/projects/project-againts-id";
import Projects from "@/modules/projects/projects";
import Create from "@/modules/teams/create";
import Issues from "@/modules/teams/issues";
import Teams from "@/modules/teams/teams";
import { lazy } from "react";
import { Route, Routes } from "react-router";

const CycleRoutes = lazy(() => import("./cycle-routes"));

const TeamsRoutes = () => {
  return (
    <Routes>
      <Route index element={<Teams />} />
      <Route path="new" element={<Create />} />
      <Route path=":team-id/issues" element={<Issues />} />
      <Route path=":team-id/projects" element={<ProjectAgainstTeamId />} />
      <Route path=":team-id/cycles/*" element={<CycleRoutes />} />
    </Routes>
  );
};

export default TeamsRoutes;
