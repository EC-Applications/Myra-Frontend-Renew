import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { format, addDays } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // Your calendar component

export const DueDateDropdown = ({ onDateSelect }: { onDateSelect: (date: Date) => void }) => {
  const [openCalendar, setOpenCalendar] = useState(false);

  const handleSelect = (type: "tomorrow" | "week" | "custom") => {
    const today = new Date();
    if (type === "tomorrow") {
      onDateSelect(addDays(today, 1));
    } else if (type === "week") {
      onDateSelect(addDays(today, 7));
    } else if (type === "custom") {
      setOpenCalendar(true);
    }
  };

  return (
    <>
      <DropdownMenu modal>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs">
            Set due date
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="min-w-[180px]">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Set due date</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="min-w-[160px]">
              <DropdownMenuItem onClick={() => handleSelect("tomorrow")}>
                Tomorrow
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSelect("week")}>
                In one week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSelect("custom")}>
                Custom…
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom calendar popover */}
      <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
        <PopoverTrigger>
          <div />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          {/* <Calendar
            mode="single"
            // selected={null | undefined}
            onSelect={(date: Date) => {
              onDateSelect(date);
              setOpenCalendar(false);
            }}
          /> */}
        </PopoverContent>
      </Popover>
    </>
  );
};
