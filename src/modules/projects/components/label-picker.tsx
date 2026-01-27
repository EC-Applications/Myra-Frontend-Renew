import { useState } from "react";
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Label {
  id: number;
  name: string;
  color: string;
  description?: string;
}

interface ProjectFormLabelsProps {
  labels: Label[];
  value: Label[];
  onChange: (labels: Label[]) => void;
  className?: string;
  buttonVarient?: "light" | "dark";
}

export const ProjectFormLabels = ({
  labels,
  value,
  onChange,
  className,
  buttonVarient = "light",
}: ProjectFormLabelsProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  console.log("Labels", labels);
  const filteredLabels = labels.filter((label) =>
    label.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleLabel = (label: Label) => {
    const exists = value.find((l) => l.id === label.id);

    if (exists) {
      onChange(value.filter((l) => l.id !== label.id));
    } else {
      onChange([...value, label]);
    }
  };

  const renderMergedColors = () => (
    <div className="flex items-center -space-x-1.5">
      {value.slice(0, 3).map((label) => (
        <span
          key={label.id}
          className="h-3 w-3 rounded-full border border-zinc-900"
          style={{ backgroundColor: label.color }}
        />
      ))}
    </div>
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            `h-7.5 justify-start gap-2 px-2 text-sm font-semibold
     text-muted-foreground dark:hover:text-white dark:hover:bg-[#32333a]
     ${buttonVarient === "light" ? "dark:bg-[#2a2c33]" : "dark:bg-transparent"}`,
            className,
          )}
        >
          {/* No labels */}
          {!value.length && (
            <div className="flex items-center gap-1.5">
              <Tag />
              <span className="text-[14px]">Labels</span>
            </div>
          )}

          {/* Single label */}
          {value.length === 1 && (
            <div className="flex items-center gap-2 truncate">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: value[0].color }}
              />
              <span className="max-w-[100px] truncate">{value[0].name}</span>
            </div>
          )}

          {/* Multiple labels */}
          {value.length > 1 && (
            <div className="flex items-center gap-2">
              {renderMergedColors()}
              <span className="text-[14px]">Labels</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[280px] dark:bg-[#1c1d1f] p-0 dark:border-zinc-700"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          setSearch("");
        }}
      >
        {/* Search */}
        <div className="mb-1">
          <Input
            placeholder="Search labels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-[15px] dark:placeholder:text-[#7e7f82] placeholder:font-semibold placeholder:text-muted-foreground/60 border-0 dark:bg-[#1c1d1f] focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-[#5e6ad2] py-1"
            autoFocus
          />
        </div>

        <hr className="dark:border-zinc-700" />

        {/* List */}
        <div className="py-1 px-1 overflow-y-3">
          {filteredLabels.length ? (
            filteredLabels.map((label) => {
              const isSelected = value.some((l) => l.id === label.id);

              return (
                <DropdownMenuItem
                  key={label.id}
                  className="group  flex h-8 items-center gap-2 rounded-sm px-2 text-[14px] font-semibold dark:hover:bg-[#292b30] "
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                  onClick={() => toggleLabel(label)}
                >
                  {/* Checkbox */}
                  <div
                    className={`h-4 w-4 rounded border flex items-center justify-center
          transition-colors
          ${
            isSelected
              ? "bg-indigo-500 border-indigo-500 opacity-100"
              : "bg-transparent border-zinc-700 opacity-0 group-hover:opacity-100"
          }
        `}
                  >
                    {isSelected && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Label content */}
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    <span>{label.name}</span>
                  </div>
                </DropdownMenuItem>
              );
            })
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No labels found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
