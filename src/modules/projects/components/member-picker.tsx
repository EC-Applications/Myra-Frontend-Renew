import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Check, Users, X } from "lucide-react";

interface MemberProps {
  members: iMember[];
  value: iMember[];
  onChange: (members: iMember[]) => void;
  className?: string;
  buttunVarient?: "light" | "dark";
}

export const MemberPicker = ({
  members,
  value,
  onChange,
  className,
  buttunVarient = "light",
}: MemberProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const term = search?.toLowerCase() ?? "";

  const filteredMembers = (members || []).filter(
    (m) =>
      (m?.name ?? "").toLowerCase().includes(term) ||
      (m?.email ?? "").toLowerCase().includes(term),
  );

  const handleToggleMember = (member: iMember) => {
    const isSelected = value.some((m) => m.id === member.id);

    if (isSelected) {
      onChange(value.filter((m) => m.id !== member.id));
    } else {
      onChange([...value, member]);
    }
  };

  const handleRemoveMember = (memberId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((m) => m.id !== memberId));
  };

  // Helper function for avatar fallback
  const getAvatarText = (name: string | null | undefined) => {
    if (!name) return "??";
    return name.slice(0, 2).toUpperCase();
  };
  const renderMergedColors = () => (
    <div className="flex items-center -space-x-1.5">
      {value.slice(0, 3).map((member) => (
        <span
          key={member.id}
          className="h-3 w-3 rounded-full border border-zinc-900"
          style={{ backgroundColor: member.avatar }}
        />
      ))}
    </div>
  );
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            `h-7.5 justify-start gap-2 px-2 text-sm text-muted-foreground dark:text-muted-foreground hover:font-semibold font-semibold dark:hover:text-white border dark:hover:bg-[#32333a] ${
              buttunVarient === "light"
                ? "dark:bg-[#2a2c33]"
                : "bg-transparent dark:bg-transparent"
            }`,
            className,
          )}
        >
          {value.length === 0 ? (
            <span className="text-[14px] flex items-center gap-2">
              <Users />
              Members
            </span>
          ) : value.length === 1 ? (
            // Agar sirf 1 member
            <div className="flex items-center gap-1">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={
                    value[0]?.avatar || value[0]?.image || "/placeholder.svg"
                  }
                />
                <AvatarFallback className="text-[10px]">
                  {getAvatarText(value[0].name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-[14px]">
                {value[0].name || value[0].email}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {value.slice(0, 3).map((member) => (
                  <Avatar
                    key={member.id}
                    className="h-5 w-5 border border-zinc-900"
                  >
                    <AvatarImage
                      src={member.avatar || member.image || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-[10px]">
                      {getAvatarText(member.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {value.length > 3 && (
                  <span className="h-5 w-5 flex items-center justify-center text-[10px] rounded-full border border-zinc-900 bg-gray-400 text-white">
                    +{value.length - 3}
                  </span>
                )}
              </div>
              <span className="text-[14px]">Members</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[280px] dark:bg-[#1c1d1f] p-0 dark:border-zinc-700"
      >
        <div className="relative mb-1">
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-[15px] dark:placeholder:text-[#7e7f82] placeholder:font-semibold placeholder:text-muted-foreground/60 border-0 dark:bg-[#1c1d1f] focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-[#5e6ad2]"
            autoFocus
          />
        </div>

        <hr className="dark:border-zinc-700" />

        <div className="p-1 max-h-[300px] overflow-y-auto">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => {
              const isSelected = value.some((m) => m.id === member.id);

              return (
                <DropdownMenuItem
                  key={member.id}
                  className="group  flex h-8 items-center gap-2 rounded-sm px-2 text-[14px] font-semibold dark:hover:bg-[#292b30] "
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                  onClick={() => handleToggleMember(member)}
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
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={
                          member?.avatar || member?.image || "/placeholder.svg"
                        }
                      />
                      <AvatarFallback className="text-[10px] bg-primary/10">
                        {getAvatarText(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <span className="font-medium">
                        {member.name || member.email}
                      </span>
                      {member.is_accept == false ? (
                        <span className="font-medium ">(Invited)</span>
                      ) : (
                        <div className=""></div>
                      )}
                      {/* <span className="text-[11px] text-muted-foreground">
                        {member.email}
                      </span> */}
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No members found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
