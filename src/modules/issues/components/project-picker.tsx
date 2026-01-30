import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import type { iMember } from "@/interfaces/teams.interface";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Check,
  Circle,
  CircleMinusIcon,
  FolderKanban,
  Users,
  X,
} from "lucide-react";
import type { iProject } from "@/interfaces/project.interface";
import { Icon } from "@radix-ui/react-select";
import { IconPicker } from "@/modules/projects/components/icon-picker";
import {
  detectIconType,
  parseEmojiFromUnicode,
} from "@/components/parse-emoji";

interface SingleProjectProps {
  projects: iProject[];
  value?: iProject | null;
  onChange: (project: iProject | null) => void;
  className?: string;
  buttonVarient?: "light" | "dark";
}

export const ProjectPicker = ({
  projects,
  value,
  onChange,
  className,
  buttonVarient = "light",
}: SingleProjectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const term = search?.toLowerCase() ?? "";

  // console.log("PROJECT", projects);

  const filteredProjects = (projects || []).filter((p) =>
    (p?.name ?? "").toLowerCase().includes(term),
  );

  const handleSelectProject = (project: iProject) => {
    onChange(project);
    setOpen(false);
  };

  const handleRemoveProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const getAvatarText = (name: string | null | undefined) => {
    if (!name) return "??";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            `h-7.5 justify-start gap-2 px-1  text-sm font-semibold text-muted-foreground hover:text-white border dark:bg-[#2a2c33] dark:hover:bg-[#32333a] ${
              buttonVarient == "light"
                ? "dark:bg-[#2a2c33]"
                : "dark:bg-transparent"
            }`,
            className,
          )}
        >
          {!value ? (
            <div className="flex items-center  space-x-2">
              <FolderKanban className="h-3.5 w-3.5" />
              <span className="text-[14px]">Project</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <IconPicker
                  variant="inline"
                  size={15}
                  value={
                    typeof value?.icon === "object"
                      ? {
                          ...value.icon,
                          icon: parseEmojiFromUnicode(value.icon.icon), // ← Parse nested icon
                        }
                      : value?.icon
                        ? {
                            icon: parseEmojiFromUnicode(value.icon),
                            color: "#000000",
                            type: detectIconType(value.icon),
                          }
                        : undefined
                  }
                />
                <span className="text-[14px]">{value.name}</span>
                {/* <button
                  onClick={handleRemoveProject}
                  className="hover:bg-background rounded-full p-0.5"
                >
                  <X className="h-2.5 w-2.5" />
                </button> */}
              </div>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[280px] p-0 dark:bg-[#1c1d1f] "
      >
        <div className="relative mb-1">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-[15px] dark:placeholder:text-[#7e7f82] placeholder:font-semibold placeholder:text-muted-foreground/60 border-0 dark:bg-[#1c1d1f] focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-[#5e6ad2]"
            autoFocus
          />
        </div>
        <hr className="dark:border-zinc-700" />

        <div className="py-0.5 px-2 max-h-[300px] overflow-y-auto">
          <DropdownMenuItem
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] cursor-pointer font-semibold"
            onClick={handleRemoveProject}
          >
            <CircleMinusIcon />
            No Project
          </DropdownMenuItem>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              const isSelected = value?.id === project.id;

              return (
                <DropdownMenuItem
                  key={project.id}
                  className="flex items-center justify-between rounded-sm py-1 px-2  text-[13px] cursor-pointer dark:hover:bg-[#292b30]"
                  onSelect={() => handleSelectProject(project)}
                >
                  <div className="flex items-center gap-1">
                    <IconPicker
                      variant="inline"
                      size={15}
                      value={
                        typeof project?.icon === "object"
                          ? {
                              ...project.icon,
                              icon: parseEmojiFromUnicode(project.icon.icon), // ← Parse nested icon
                            }
                          : project?.icon
                            ? {
                                icon: parseEmojiFromUnicode(project.icon),
                                color: "#000000",
                                type: detectIconType(project.icon),
                              }
                            : undefined
                      }
                    />

                    <div className="flex flex-col">
                      <span className="font-medium">{project.name}</span>
                      {/* <span className="text-[11px] text-muted-foreground">
                        {project.short_summary || 'No description'}
                      </span> */}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </DropdownMenuItem>
              );
            })
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No projects found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
