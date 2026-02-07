import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useGetInboxHook } from "@/hooks/use-get-inbox-hook";
import InboxView from "./components/inbox-list";
import { useUser } from "@/hooks/use-user";
import type { iInboxResponse } from "@/interfaces/inbox.interface";
import CursorLoader from "@/components/cursor-loader";

// Hook for comment scroll
const useCommentScroll = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash.startsWith("#comment-")) {
      const commentId = location.hash.replace("#comment-", "");
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(`comment-${commentId}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [location.hash]);
};

export const InboxLayout = () => {
  const { currentWorkspace } = useUser();
  const { data: inboxData, isLoading } = useGetInboxHook(
    currentWorkspace?.slug ?? ""
  );

  console.log("inbox", inboxData)
  const navigate = useNavigate();
  const location = useLocation();

  // Handle comment scrolling
  useCommentScroll();

  const handleSelectItem = (item: iInboxResponse) => {
    const { notifiable } = item;
    let path = "/inbox";

    if (notifiable.type === "issue") {
      path = `/inbox/issue/${notifiable.id}`;
    } else if (notifiable.type === "subissue") {
      path = `/inbox/sub-issue/${notifiable.id}`;
    } else if (notifiable.type === "project") {
      path = `/inbox/project/${notifiable.id}`;
    }

    // Add comment hash if available
    if (item.comment_id) {
      path += `#comment-${item.comment_id}`;
    }

    navigate(path);
  };

  const getSelectedItem = (): iInboxResponse | null => {
    const path = location.pathname;
    const hash = location.hash;
    if (!inboxData) return null;

    // Extract comment_id from hash if present
    const commentMatch = hash.match(/#comment-(\d+)/);
    const commentId = commentMatch ? Number(commentMatch[1]) : null;

    // Extract id from URL and find matching item
    const issueMatch = path.match(/\/inbox\/issue\/(\d+)/);
    const subIssueMatch = path.match(/\/inbox\/sub-issue\/(\d+)/);
    const projectMatch = path.match(/\/inbox\/project\/(\d+)/);

    const findItem = (id: number, type: string) => {
      // If we have a comment_id in URL, match by that first (more specific)
      if (commentId) {
        const commentItem = inboxData.find(
          (item) => item.notifiable.id === id && item.notifiable.type === type && item.comment_id === commentId
        );
        if (commentItem) return commentItem;
      }
      // Otherwise find item without comment_id (e.g., assigned notification)
      return inboxData.find(
        (item) => item.notifiable.id === id && item.notifiable.type === type && !item.comment_id
      ) ?? inboxData.find(
        (item) => item.notifiable.id === id && item.notifiable.type === type
      ) ?? null;
    };
    

    if (issueMatch) return findItem(Number(issueMatch[1]), "issue");
    if (subIssueMatch) return findItem(Number(subIssueMatch[1]), "subissue");
    if (projectMatch) return findItem(Number(projectMatch[1]), "project");

    return null;
  };

  if (isLoading) {
    return <CursorLoader />;
  }

  return (
    <div className="flex w-full h-full">
      {/* Left side – Inbox List */}
      <div className="w-[450px] shrink-0 border-r">
        <InboxView
          inboxList={inboxData ?? []}
          selectedItem={getSelectedItem()}
          onSelectItem={handleSelectItem}
        />
      </div>

      {/* Right side – Detail view via Outlet */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

// Keep backward compatibility
export const Inbox = InboxLayout;
