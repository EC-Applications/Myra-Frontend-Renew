import { useState } from "react";
import { useSelector } from "react-redux";
import { Check, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PriorityVariant = "full" | "icon-only" | "compact";

interface PriorityPickerProps {
  value?: number;
  onChange?: (priority: number) => void;
  className?: string;
  variant?: PriorityVariant;
  showLabel?: boolean;
  disabled?: boolean;
  buttonVarient?: "light" | "dark"  ;
}

export function PriorityPicker({
  value,
  onChange,
  className,
  variant = "full",
  showLabel = true,
  disabled = false,
  buttonVarient = "light" , 
}: PriorityPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const priorityData = useSelector((state: any) => state.priority);

  console.log("Prioriy data", priorityData);

  console.log("PRI DATA", priorityData);

  const priorities = priorityData?.priority || [];

  const selectedPriority = priorities.find((p: any) => p.id === value);

  const filteredOptions = priorities.filter((option: any) =>
    option.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (priorityId: number) => {
    onChange?.(priorityId);
    setOpen(false);
    setSearch("");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            `h-[30px] w-auto justify-start gap-2 px-2 text-sm font-semibold text-muted-foreground dark:hover:text-white ${buttonVarient == 'light'? "dark:bg-[#2a2c33]" : "dark:bg-transparent"} dark:hover:bg-[#32333a] `,
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          {variant === "icon-only" && selectedPriority ? (
            // Icon-only variant (for detail/update views)
            <img
              src={selectedPriority.icon}
              alt={selectedPriority.description}
              className="h-4 w-4 object-contain filter invert"
            />
          ) : variant === "compact" && selectedPriority ? (
            // Compact variant (icon + shortened label)
            <>
              <img
                src={selectedPriority.icon}
                alt={selectedPriority.description}
                className="h-4 w-4 object-contain filter invert"
              />
              {showLabel && (
                <span className="text-[14px]">{selectedPriority.status}</span>
              )}
            </>
          ) : selectedPriority ? (
            // Full variant (default - icon + full label)
            <>
              <img
                src={selectedPriority.icon}
                alt={selectedPriority.description}
                className="h-4 w-4 object-contain filter invert"
              />
              {showLabel && (
                <span className="text-[14px]">
                  {selectedPriority.description}
                </span>
              )}
            </>
          ) : (
            // No selection placeholder
            <div className="flex items-center gap-1">
              <MoreHorizontal />
              <span className="text-[14px]">Priority</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[300px] p-0 dark:bg-[#1c1d1f]"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          setSearch("");
        }}
      >
        <div className="relative mb-1">
          <Input
            placeholder="Change priority..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-[15px] dark:placeholder:text-[#7e7f82] placeholder:font-semibold placeholder:text-muted-foreground/60 border-0  dark:bg-[#1c1d1f] focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-[#5e6ad2]"
            autoFocus
          />
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
              P
            </kbd>
            <span className="text-muted-foreground/60 text-[11px]">then</span>
            <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
              P
            </kbd>
          </div>
        </div>
        <hr className="dark:border-zinc-700" />
        <div className="px-1.5 py-1 space-y-0.5">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option: any) => {
              const isSelected = value === option.id;

              return (
                <DropdownMenuItem
                  key={option.id}
                  className="group relative flex h-8 cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-[15px] transition-colors dark:hover:bg-[#292b30] border-0 font-semibold "
                  onSelect={() => handleSelect(option.id)}
                >
                  <div className="flex items-center gap-2 ">
                    <img
                      src={option.icon}
                      alt={option.description}
                      className="h-3.5 w-3.5 object-contain filter invert"
                    />
                    <span>{option.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <Check className="size-3.5 text-muted-foreground " />
                    )}
                    <span className="text-muted-foreground/50 text-xs uppercase">
                      {option.status}
                    </span>
                  </div>
                </DropdownMenuItem>
              );
            })
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No priorities found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
