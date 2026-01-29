import type { iCycleListResponse } from "@/interfaces/cycle.interface";
import { CheckCircle, ChevronUpIcon, Play } from "lucide-react";
import { Link } from "react-router";

interface CycleViewKanbanProp {
  cycleData: iCycleListResponse | null;
}
export const CycleComponentKanaban = ({ cycleData }: CycleViewKanbanProp) => {
  return (
    <Link
      to={`/teams/${cycleData?.team_id}/cycles/${cycleData?.id}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="border flex items-center rounded min-h-[25px] px-1 gap-1 dark:hover:text-white font-semibold">
        {cycleData?.status == "current" ? (
          <div className="">
            <Play size={15} className="text-blue-500" />
          </div>
        ) : cycleData?.status == "upcoming" ? (
          <div className="">
            <ChevronUpIcon size={15} />
          </div>
        ) : (
          <div className="">
            {" "}
            <CheckCircle size={15} />
          </div>
        )}

        <div className="text-sm">{cycleData?.name ? cycleData.name : ""}</div>
      </div>
    </Link>
  );
};
