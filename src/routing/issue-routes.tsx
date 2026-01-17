import IssueDetailView from "@/modules/issues/issue-detail";
import SubIssueDetailView from "@/modules/issues/sub-issue-detail";
import { Route, Routes } from "react-router";

const IssueRoutes = () => {
  return (
    <Routes>
      <Route path=":id" element={<IssueDetailView />} />
      <Route path=":id/sub-issue" element={<SubIssueDetailView />} />
    </Routes>
  );
};

export default IssueRoutes;
