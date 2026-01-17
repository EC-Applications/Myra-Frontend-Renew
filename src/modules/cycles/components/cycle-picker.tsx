import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { iCycleListResponse } from "@/interfaces/cycle.interface";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, PlayCircleIcon, Repeat } from "lucide-react";
import { useState } from "react";

interface CyclePickerProps {
  cycles: iCycleListResponse[];
  value?: iCycleListResponse | null;
  onChange: (cycle: iCycleListResponse) => void;
  variant?: "default" | "icon-only" | "inline";
}

export function CyclePicker({
  cycles,
  value,
  onChange,
  variant = "default",
}: CyclePickerProps) {
  const [open, setOpen] = useState(false);

  // Find current cycle (status === "current")
  const currentCycle = cycles.find((cycle) => cycle.status === "current");

  // Use current cycle as default if no value provided
  const selectedCycle = value || currentCycle || null;

  const handleSelect = (cycle: iCycleListResponse) => {
    onChange(cycle);
    setOpen(false);
  };

  // Variant: icon-only
  if (variant === "icon-only") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search cycle..." />
            <CommandEmpty>No cycle found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {cycles.map((cycle) => (
                <CommandItem
                  key={cycle.id}
                  value={cycle.name}
                  onSelect={() => handleSelect(cycle)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCycle?.id === cycle.id
                        ? "opacity-100"
                        : "opacity-0"
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
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  // Variant: inline
  if (variant === "inline") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs"
          >
            <Repeat className="h-3 w-3" />
            {selectedCycle?.name || "Select cycle"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search cycle..." />
            <CommandEmpty>No cycle found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {cycles.map((cycle) => (
                <CommandItem
                  key={cycle.id}
                  value={cycle.name}
                  onSelect={() => handleSelect(cycle)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCycle?.id === cycle.id
                        ? "opacity-100"
                        : "opacity-0"
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
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  // Variant: default
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-7.5 w-auto justify-start gap-2 px-2 text-sm  text-muted-foreground  font-semibold  hover:text-white border dark:bg-[#2a2c33] dark:hover:bg-[#32333a]"
        >
          <div className="flex items-center gap-2">
          
            {selectedCycle ? (
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{selectedCycle.name}</span>
                {/* {selectedCycle.status === "current" && (
                  <span className="text-xs text-muted-foreground">Current</span>
                )} */}
              </div>
              </div>
            ) : (
              <PlayCircleIcon/>
            )}
          </div>
          {/* <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search cycle..." />
          <CommandEmpty>No cycle found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {cycles.map((cycle) => (
              <CommandItem
                key={cycle.id}
                value={cycle.name}
                onSelect={() => handleSelect(cycle)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCycle?.id === cycle.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{cycle.name}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {cycle.status === "current" && (
                      <span className="text-green-600">Current</span>
                    )}
                    <span>
                      {new Date(cycle.start_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      →{" "}
                      {new Date(cycle.end_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
