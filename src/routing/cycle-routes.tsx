import AllCycles from "@/modules/cycles/all-cycles";
import Issues from "@/modules/cycles/cycle-issues";

import { Route, Routes } from "react-router";

const CycleRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<AllCycles />} />
      <Route path=":cycleId" element={<Issues />} />
    </Routes>
  );
};

export default CycleRoutes;
