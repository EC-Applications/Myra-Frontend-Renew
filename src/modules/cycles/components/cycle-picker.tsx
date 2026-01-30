import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { iCycleListResponse } from "@/interfaces/cycle.interface";
import { cn } from "@/lib/utils";
import { Check, PlayCircleIcon, Repeat, X } from "lucide-react";

interface CyclePickerProps {
  cycles: iCycleListResponse[];
  value?: iCycleListResponse | null;
  onChange: (cycle: iCycleListResponse | null) => void;
  className?: string;
  variant?: "default" | "icon-only" | "inline";
  buttnVarient?: "light" | "dark";
}

export function CyclePicker({
  cycles,
  value,
  onChange,
  className,
  variant = "default",
  buttnVarient = "light",
}: CyclePickerProps) {
  // Find current cycle (status === "current")
  const currentCycle = cycles.find((cycle) => cycle.status === "current");

  // value === undefined → use currentCycle as default
  // value === null → explicitly "No cycle" selected
  // value === cycle → use that cycle
  const selectedCycle = value === undefined ? (currentCycle || null) : value;

  const handleSelect = (cycle: iCycleListResponse | null) => {
    onChange(cycle);
  };

  // Variant: icon-only
  if (variant === "icon-only") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Repeat className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px]" align="start">
          <DropdownMenuItem
            onClick={() => handleSelect(null)}
            className="flex items-center gap-2"
          >
            <Check
              className={cn(
                "h-4 w-4",
                selectedCycle === null ? "opacity-100" : "opacity-0",
              )}
            />
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">No cycle</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="max-h-64 overflow-auto">
            {cycles.map((cycle) => (
              <DropdownMenuItem
                key={cycle.id}
                onClick={() => handleSelect(cycle)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCycle?.id === cycle.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{cycle.name}</span>
                  {cycle.status === "current" && (
                    <span className="text-xs text-muted-foreground">
                      Current
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Variant: inline
  if (variant === "inline") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs">
            <Repeat className="h-3 w-3" />
            {selectedCycle?.name || "No cycle"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px]" align="start">
          <DropdownMenuItem
            onClick={() => handleSelect(null)}
            className="flex items-center gap-2"
          >
            <Check
              className={cn(
                "h-4 w-4",
                selectedCycle === null ? "opacity-100" : "opacity-0",
              )}
            />
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">No cycle</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="max-h-64 overflow-auto">
            {cycles.map((cycle) => (
              <DropdownMenuItem
                key={cycle.id}
                onClick={() => handleSelect(cycle)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCycle?.id === cycle.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{cycle.name}</span>
                  {cycle.status === "current" && (
                    <span className="text-xs text-muted-foreground">
                      Current
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Variant: default
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            `h-7.5 w-auto  justify-start gap-2 px-2 text-sm  text-muted-foreground  font-semibold  hover:text-white border  ${buttnVarient === "light" ? "dark:bg-[#2a2c33] dark:hover:bg-[#32333a]" : "dark:bg-transparent"}`,
            className,
          )}
        >
          <div className="flex items-center gap-2">
            {selectedCycle ? (
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {selectedCycle.name}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <PlayCircleIcon />
              <span className="font-semibold">Cycles</span>
              </div>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className=" min-w-[300px] dark:bg-[#1c1d1f] p-0 dark:border-zinc-700"
        align="start"
      >
        <DropdownMenuItem
          onClick={() => handleSelect(null)}
          className=" flex items-center gap-2 mt-1 mx-2 "
        >
          <Check
            className={cn(
              "h-4 w-4",
              selectedCycle === null ? "opacity-100" : "opacity-0",
            )}
          />
          <X className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">No cycle</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="max-h-64 overflow-auto">
          {cycles.map((cycle) => (
            <>
              <DropdownMenuItem
                key={cycle.id}
                onClick={() => handleSelect(cycle)}
                className="mx-2"
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    selectedCycle?.id === cycle.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                <div className="flex items-center gap-7">
                  <span className="text-sm font-medium">{cycle.name}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {cycle.status === "current" && (
                      <span className="text-muted-foreground text-[15px] font-semibold">
                        Current
                      </span>
                    )}
                     {cycle.status === "upcoming" && (
                      <span className="text-muted-foreground text-[15px] font-semibold">
                        Upcoming
                      </span>
                    )}
                     {cycle.status === "completed" && (
                      <span className="text-muted-foreground text-[15px] font-semibold">
                        Previuos
                      </span>
                    )}
                  </div>
                </div>
                <hr className="dark:border-zinc-700" />
                <div className=""></div>
              </DropdownMenuItem>
            </>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
