import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Status {
  id: number;
  name: string;
  sub_statuses?: any[];
  icon?: string;
  
}

interface ProjectStatusProps {
  statuses: Status[];
  value: Status | undefined;
  onChange: (status: Status) => void;
  className?: string;
  buttonVarient?: "light" | "dark"  ;
}

export const ProjectFormStatus = ({
  statuses,
  value,
  onChange,
  className,
  buttonVarient= "light" 
}: ProjectStatusProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = statuses.filter((status) =>
    status.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            ` h-7.5  justify-start  text-sm  text-muted-foreground dark:text-muted-foreground hover:font-semibold font-semibold dark:hover:text-white border  dark:hover:bg-[#32333a] ${buttonVarient == "light" ? "dark:bg-[#2a2c33]" : "dark:bg-transparent"}`,
            className
          )}
        >
          {value ? (
            <>
              {/* icon placeholder */}
              {/* <span className="h-3 w-3 rounded-full bg-muted-foreground/40" /> */}
              <img src={value.icon} alt="" className="h-4 w-4" />
              <span className="text-[14px]">{value.name}</span>
            </>
          ) : (
            <span className="text-[13px]">Status..</span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[300px] p-0 dark:bg-[#1c1d1f] "
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
                  className="flex h-8 items-center justify-between rounded-sm px-2 text-[15px]dark:hover:bg-[#292b30] font-semibold"
                  onSelect={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {/* <span className="h-3 w-3 rounded-full bg-muted-foreground/40" /> */}
                    <img src={option.icon} alt="" className="h-4 w-4" />
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
