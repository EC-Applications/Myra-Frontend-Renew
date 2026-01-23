import { formatCommentTime } from "@/components/date-converter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { iActivity } from "@/interfaces/activity.interface";
import type { FC } from "react";

const Activity: FC<{
  activityData: iActivity[];
}> = ({ activityData }) => {
  return (
    <div className="relative">
      {activityData.map((activity, index) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 relative pb-1.5"
        >
          <div className="relative flex flex-col items-center">
            <Avatar className="h-6 w-6 z-10">
              <AvatarImage src={activity.user?.avatar} />
              <AvatarFallback className="text-xs">
                {activity.user?.name?.slice(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {index !== activityData.length - 1 && (
              <div className="w-[2px] bg-border h-4 mt-1.5" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm">
              {/* <span className="font-medium">{activity.user?.name}</span>{" "} */}
              <span className="dark:hover:text-white text-muted-foreground font-semibold text-[13px]">
                {activity.description}
              </span>
              {activity.changes && activity.changes.length > 0 && (
                <span className="inline-flex gap-1 ml-1">
                  {activity.changes.map((change) => (
                    <span key={change.id} className="inline-flex items-center">
                      <span className="text-[15px] px-0.5" style={{color: change.color}}> • </span>
                      <span
                        className="inline-flex items-center rounded text-[13px] font-semibold text-muted-foreground dark:hover:text-white"
                      >
                        {change.name}
                      </span>
                    </span>
                  ))}
                </span>
              )}
              <span className="pl-2 text-muted-foreground "> . </span>
              <span className="text-muted-foreground dark:hover:text-white font-semibold  text-[13px]">
                {formatCommentTime(activity.created_at)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Activity;
