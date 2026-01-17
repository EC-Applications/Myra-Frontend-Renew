import Detail from "@/modules/projects/detail";
import DetailWrapper from "@/modules/projects/detail-wrapper";
import Issues from "@/modules/projects/issues";
import Projects from "@/modules/projects/projects";
import { Route, Routes } from "react-router";

const ProjectRoutes = () => {
  return (
    <Routes>
      <Route index element={<Projects />} />
      <Route path="detail/:id" element={<DetailWrapper />}>
        <Route index element={<Detail />} />
        <Route path="issues" element={<Issues />} />
      </Route>
    </Routes>
  );
};

export default ProjectRoutes;
