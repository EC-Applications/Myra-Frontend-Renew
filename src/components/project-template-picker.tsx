import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { iProjectTemplateResoponse } from "@/interfaces/project-template.interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { IconPicker } from "@/modules/projects/components/icon-picker";
import { detectIconType, parseEmojiFromUnicode } from "./parse-emoji";

interface ProjectTemplatePickerProps {
  templates: iProjectTemplateResoponse[];
  value?: iProjectTemplateResoponse | null;
  onChange: (template: iProjectTemplateResoponse | null) => void;
  className?: string;
}

export const ProjectTemplatePicker = ({
  templates,
  value,
  onChange,
  className,
}: ProjectTemplatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  console.log("template", templates)

  const filteredTemplates = templates.filter((t) =>
    (t.descriptive_name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (template: iProjectTemplateResoponse) => {
    onChange(template);
    setOpen(false);
    setSearch("");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 justify-start gap-2 px-2 text-sm dark:text-muted-foreground hover:font-semibold font-semibold hover:text-white border dark:bg-[#2a2c33] dark:hover:bg-[#32333a]"
        >
          <FileText className="h-3.5 w-3.5" />
          <span className="text-[13px]">
            {value ? value.descriptive_name : "Template"}
          </span>
          <ChevronDown className="ml-auto h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[260px] dark:bg-[#1c1d1f] p-0 dark:border-zinc-700"
      >
        <div className="relative mb-1 ">
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-[15px] dark:placeholder:text-[#7e7f82] placeholder:font-semibold placeholder:text-muted-foreground/60 border-0 dark:bg-[#1c1d1f] focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-[#5e6ad2] py-1"
            autoFocus
          />
        </div>
        <hr className="dark:border-zinc-700" />

        <div className="py-0.5 max-h-[300px] overflow-y-auto px-1">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <DropdownMenuItem
                key={template.id}
                className="flex items-center gap-2 rounded-sm px-2 py-2 text-[13px] cursor-pointer"
                onSelect={() => handleSelect(template)}
              >
                <IconPicker
                  variant="inline"
                  size={15}
                  value={
                    typeof template?.icon === "object"
                      ? {
                          ...template.icon,
                          icon: parseEmojiFromUnicode(template.icon.icon), 
                        }
                      : template?.icon
                        ? {
                            icon: parseEmojiFromUnicode(template.icon),
                            color: "#000000",
                            type: detectIconType(template.icon),
                          }
                        : undefined
                  }
                />
                <div className="flex-1 truncate">
                  <span className="font-medium">
                    {template.descriptive_name}
                  </span>
                </div>
                {value?.id === template.id && (
                  <span className="ml-auto text-primary">&#10003;</span>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No templates found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
