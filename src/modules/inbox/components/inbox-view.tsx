"use client";

import { useMemo, type FC } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { iNotifiable } from "@/interfaces/inbox.interface";
import { cn } from "@/lib/utils";
import { formatTimeShort } from "@/components/date-converter";

interface InboxItemProps extends iInboxItem {
  isSelected?: boolean;
  onClick?: () => void;
}

interface iInboxItem {
  id: number;
  user_id: number;
  actor_id: number;
  actor: string;
  actor_avatar: string | null;
  issue_key: string;
  due_status: string | null;
  notifiable: iNotifiable;
  type: string;
  is_read: boolean;
  created_at: string | null;
  meta?: {
    message: string | null;
  };
}

const AVATAR_COLORS = [
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-cyan-500",
  "bg-yellow-500",
];

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (id: number): string => {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
};

const getActionText = (type: string): string => {
  const actions: Record<string, string> = {
    updated: "updated",
    created: "created",
    added: "added",
    commented: "commented",
    assigned: "assigned",
  };
  return actions[type] || type;
};

const formatCommentTime = (dateString: string | null): string => {
  if (!dateString) return "";
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: false });
  } catch {
    return dateString;
  }
};

const InboxItem: FC<InboxItemProps> = ({
  id,
  actor,
  actor_avatar,
  actor_id,
  issue_key,
  notifiable,
  type,
  is_read,
  created_at,
  meta,
  isSelected = false,
  onClick,
}) => {
  const initials = useMemo(() => getInitials(actor), [actor]);
  const bgColor = useMemo(() => getAvatarColor(actor_id), [actor_id]);
  const actionText = getActionText(type);
  const timeAgo = formatTimeShort(created_at);

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex gap-4 px-4 py-3  transition-colors cursor-pointer",
        isSelected
          ? "dark:bg-[#292b30]  rounded m-2"
          : "hover:bg-accent/30 text-foreground",
        !is_read && !isSelected && "bg-accent/10",
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="h-10 w-10">
          {actor_avatar ? (
            <AvatarImage src={actor_avatar || "/placeholder.svg"} alt={actor} />
          ) : null}
          <AvatarFallback className={` font-semibold text-sm`}>
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{issue_key}</span>
              <h3
                className={cn(
                  "text-sm font-medium truncate",
                  isSelected ? "text-white" : "text-foreground",
                )}
              >
                {notifiable.name}
              </h3>
            </div>

            {/* Subtitle */}
            <p
              className={cn(
                "text-xs truncate mt-1",
                isSelected ? "text-white/80" : "text-muted-foreground",
              )}
            >
              {meta?.message ? meta.message : `${actionText} by ${actor}`}
            </p>
          </div>

          {/* Right side icons/info */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            {/* Status Icon */}
            {notifiable.status ? (
              <img
                src={notifiable.status || "/placeholder.svg"}
                alt="status"
                className="h-4 w-4 object-contain"
              />
            ) : null}

            {/* Time */}
            <span
              className={cn(
                "text-xs whitespace-nowrap ",
                isSelected ? "text-white/70" : "text-muted-foreground",
              )}
            >
              {timeAgo}
            </span>
          </div>
        </div>
      </div>

      {/* Unread indicator dot */}
      {/* {!is_read && (
        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
      )} */}
    </div>
  );
};

export default InboxItem;
