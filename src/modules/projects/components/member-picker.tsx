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

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            `h-7.5 justify-start gap-2  text-sm text-muted-foreground dark:text-muted-foreground hover:font-semibold font-semibold dark:hover:text-white border  dark:hover:bg-[#32333a] ${buttunVarient == "light" ? "dark:bg-[#2a2c33]" : "bg-transparent dark:bg-transparent"}`,
            className,
          )}
        >
          {/* <Users className="h-3.5 w-3.5" /> */}
          {value.length === 0 ? (
            <span className="text-[14px]">Members</span>
          ) : (
            <div className="flex items-center gap-1 flex-wrap">
              {value.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-1 rounded py-0.5"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={
                        member?.avatar || member?.image || "/placeholder.svg"
                      }
                    />
                    <AvatarFallback className="text-[10px]">
                      {getAvatarText(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[14px]">
                    {member.name || member.email}
                  </span>
                  {/* <button
                    onClick={(e) => handleRemoveMember(member.id, e)}
                    className="hover:bg-background rounded-full p-0.5"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button> */}
                </div>
              ))}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[280px] dark:bg-[#1c1d1f] p-0 dark:border-zinc-700">
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
                  className="flex items-center justify-between rounded-sm px-2.5 py-1.5 text-[14px]  cursor-pointer dark:hover:bg-[#292b30] "
                  onSelect={() => handleToggleMember(member)}
                >
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
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {member.name || member.email}
                      </span>
                      {/* <span className="text-[11px] text-muted-foreground">
                        {member.email}
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
              No members found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
