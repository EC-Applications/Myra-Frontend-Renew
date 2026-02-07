import IssueDetailView from "@/modules/issues/issue-detail";
import SubIssueDetailView from "@/modules/issues/sub-issue-detail";
import Detail from "@/modules/projects/detail";
import { InboxLayout } from "@/modules/inbox/inbox";
import { Route, Routes } from "react-router";

// Empty state when nothing selected
const InboxEmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-muted-foreground font-semibold gap-4">
    <img src="/images/inbox/unread.png" alt="" className="h-60" />
    <p>Select an item to view details</p>
  </div>
);

const InboxRoutes = () => {
  return (
    <Routes>
      <Route element={<InboxLayout />}>
        <Route index element={<InboxEmptyState />} />
        <Route path="issue/:id" element={<IssueDetailView />} />
        <Route path="sub-issue/:id" element={<SubIssueDetailView />} />
        <Route path="project/:id" element={<Detail />} />
      </Route>
    </Routes>
  );
};

export default InboxRoutes;
