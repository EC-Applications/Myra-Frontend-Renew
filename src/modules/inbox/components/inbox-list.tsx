"use client";

import { Button } from "@/components/ui/button";
import type { iInboxResponse } from "@/interfaces/inbox.interface";
import { MoreVertical, Sliders } from "lucide-react";
import type { FC } from "react";
import InboxItem from "./inbox-view";
import { useMarkAsReadHook } from "@/hooks/use-get-mark-as-read-hook";
import { useUser } from "@/hooks/use-user";

interface InboxViewProps {
  inboxList: iInboxResponse[] | null;
  selectedItem: iInboxResponse | null;
  onSelectItem: (item: iInboxResponse) => void;
}

const InboxView: FC<InboxViewProps> = ({
  inboxList,
  selectedItem,
  onSelectItem,
}) => {
  const unreadCount = inboxList?.filter((item) => !item.is_read).length || 0;
  const { currentWorkspace } = useUser();
  const markAsRead = useMarkAsReadHook();

  return (
    <div className="flex flex-col border border-b-0 dark:border-zinc-800 h-full dark:bg-[#101012]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <h1 className="text-md font-semibold text-foreground">Inbox</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-1 dark:text-white text-xs rounded-md font-medium">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="More options"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Filter"
          >
            <Sliders className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Inbox List */}
      <div className="flex-1 overflow-y-auto">
        {!inboxList || inboxList.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            {/* <Empty
              title="No notifications"
              description="You're all caught up! Check back later."
            /> */}
          </div>
        ) : (
          <div className="">
            {inboxList.map((item) => (
              <InboxItem
                key={item.id}
                {...item}
                isSelected={selectedItem?.id === item.id}
                onClick={() => {
                  onSelectItem(item);
                  markAsRead.mutate({
                    workspaceSlug: currentWorkspace?.slug ?? "",
                    inboxTileId: Number(item.id),
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxView;
