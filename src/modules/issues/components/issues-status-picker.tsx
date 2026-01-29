import { useState } from "react";
import { Check, Icon, PiIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { iIssueStatus } from "@/interfaces/issues-status.interface";

type StatusPickerVariant = "full" | "icon-only" | "compact";

interface IssuesStatusPickerProps {
  statuses: iIssueStatus[];
  value: iIssueStatus | null;
  onChange: (status: iIssueStatus) => void;
  className?: string;
  variant?: StatusPickerVariant;
  disabled?: boolean;
  buttonVarient?: "light" | "dark";
}

export const IssuesStatusPicker = ({
  statuses,
  value,
  onChange,
  className,
  variant = "full",
  disabled = false,
  buttonVarient = "light",
}: IssuesStatusPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  // console.log("STATUS TEAM", statuses);
  const filteredOptions = statuses.filter((status) =>
    status.name.toLowerCase().includes(search.toLowerCase())
  );

  // Render different UI based on variant
  const renderTrigger = () => {
    if (variant === "icon-only") {
      // Icon-only variant (for lists/tables - just icon)
      return (
        <button
          disabled={disabled}
          className={cn(
            "transition-opacity hover:opacity-80",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          {value ? (
            <img src={value.icon} alt="" className="h-4 w-4" />
          ) : (
            <div className="h-4 w-4 rounded border border-dashed" />
          )}
        </button>
      );
    }

    if (variant === "compact") {
      // Compact variant (icon + name, smaller size)
      return (
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-8 w-auto justify-start gap-1.5 px-2 text-sm font-normal text-muted-foreground hover:text-foreground border",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          {value ? (
            <>
              <img src={value.icon} alt="" className="h-3.5 w-3.5" />
              <span className="text-xs">{value.name}</span>
            </>
          ) : (
            <span className="text-xs">Select status...</span>
          )}
        </Button>
      );
    }

    // Full variant (default - full width with border)
    return (
      <Button
        variant="outline"
        disabled={disabled}
        className={cn(
          `h-7.5 w-auto gap-2 px-2 text-sm font-semibold  dark:text-muted-foreground dark:hover:text-white   ${buttonVarient == "light"  ? "dark:bg-[#32333a]" : "dark:bg-transparent"} `,
          disabled && "opacity-50 cursor-not-allowed ",
          className
        )}
      >
        {value ? (
          <>
            <img src={value.icon} alt="" className="h-3 w-3" />
            <span className="text-[14px]">{value.name}</span>
          </>
        ) : (
          <span className="text-[14px]">Status...</span>
        )}
      </Button>
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {renderTrigger()}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[300px] p-0 dark:bg-[#1c1d1f]"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          setSearch("");
        }}
      >
        {/* Search */}
        <div className="relative mb-1">
          <Input
            placeholder="Change status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-[15px] dark:placeholder:text-[#7e7f82] placeholder:font-semibold placeholder:text-muted-foreground/60 border-0  dark:bg-[#1c1d1f] focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-[#5e6ad2]"
            autoFocus
          />

          {/* Keyboard hint */}
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="h-5 rounded border px-1.5 text-[10px]">P</kbd>
            <span className="text-[11px] text-muted-foreground/60">then</span>
            <kbd className="h-5 rounded border px-1.5 text-[10px]">S</kbd>
          </div>
        </div>
        <hr className="dark:border-zinc-700" />
        {/* Options */}
        <div className="px-1.5 py-1 space-y-0.5">
          {filteredOptions.length ? (
            filteredOptions.map((option) => {
              const isSelected = value?.id === option.id;

              return (
                <DropdownMenuItem
                  key={option.id}
                  className="flex h-8 items-center justify-between rounded-sm px-2 text-[13px] dark:hover:bg-[#292b30] border-0 font-semibold"
                  onSelect={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img src={option.icon} alt="" className="h-3 w-3" />
                    <span>{option.name}</span>
                  </div>

                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </DropdownMenuItem>
              );
            })
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No status found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
