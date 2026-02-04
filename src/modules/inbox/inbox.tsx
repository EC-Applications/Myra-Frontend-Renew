import { useState } from "react";
import { useGetInboxHook } from "@/hooks/use-get-inbox-hook";
import InboxView from "./components/inbox-list";
import { useUser } from "@/hooks/use-user";
import IssueDetailView from "../issues/issue-detail";
import SubIssueDetailView from "../issues/sub-issue-detail";
import type { iInboxResponse } from "@/interfaces/inbox.interface";
import CursorLoader from "@/components/cursor-loader";
import Detail from "../projects/detail";
import { useMarkAsReadHook } from "@/hooks/use-get-mark-as-read-hook";

export const Inbox = () => {
  const { currentWorkspace } = useUser();
  const { data: inboxData, isLoading } = useGetInboxHook(
    currentWorkspace?.slug ?? "",
  );
  console.log(inboxData, "inbix");
  const [selectedItem, setSelectedItem] = useState<iInboxResponse | null>(null);

  const handleSelectItem = (item: iInboxResponse) => {
    setSelectedItem(item);

  };

  // Render right side content based on selection
  const renderDetailView = () => {
    if (!selectedItem) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground font-semibold gap-4">
          <img src="/images/inbox/unread.png" alt="" className="h-60" />
          <p>Select an item to view details</p>
        </div>
      );
    }

    const { notifiable } = selectedItem;

    if (notifiable.type === "issue") {
      return <IssueDetailView issueId={notifiable.id} />;
    }

    if (notifiable.type === "subissue" || notifiable.type === "subissue") {
      return <SubIssueDetailView subIssueId={notifiable.id} />;
    }

    if (notifiable.type == "project") {
      return <Detail projectId={notifiable.id} />;
    }
    // Fallback for unknown types
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Unknown item type</p>
      </div>
    );
  };

  if (isLoading) {
    return <CursorLoader />;
  }

  return (
    <div className="flex w-full h-full ">
      {/* Left side – Inbox */}
      <div className=" w-[450px] shrink-0 border-r">
        <InboxView
          inboxList={inboxData ?? []}
          selectedItem={selectedItem}
          onSelectItem={handleSelectItem}
        />
      </div>

      {/* Right side – Detail view */}
      <div className="flex-1 overflow-hidden">{renderDetailView()}</div>
    </div>
  );
};
