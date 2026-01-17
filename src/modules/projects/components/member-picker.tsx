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
import { Check, Users, X } from "lucide-react";

interface MemberProps {
  members: iMember[];
  value: iMember[];
  onChange: (members: iMember[]) => void;
  className?: string;
}

export const MemberPicker = ({ members, value, onChange, className }: MemberProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const term = search?.toLowerCase() ?? "";

  const filteredMembers = (members || []).filter(
    (m) =>
      (m?.name ?? "").toLowerCase().includes(term) ||
      (m?.email ?? "").toLowerCase().includes(term)
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
            "h-7.5 justify-start gap-2  text-sm text-muted-foreground dark:text-muted-foreground hover:font-semibold font-semibold hover:text-white border dark:bg-[#2a2c33] dark:hover:bg-[#32333a]",
            className
          )}
        >
          <Users className="h-3.5 w-3.5" />
          {value.length === 0 ? (
            <span className="text-[14px]">Members</span>
          ) : (
            <div className="flex items-center gap-1 flex-wrap">
              {value.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5"
                >
                  <Avatar className="h-4 w-4">
                    <AvatarFallback className="text-[10px]">
                      {getAvatarText(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px]">{member.name || member.email}</span>
                  <button
                    onClick={(e) => handleRemoveMember(member.id, e)}
                    className="hover:bg-background rounded-full p-0.5"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[280px] p-1.5">
        <div className="relative mb-1">
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-[13px] placeholder:text-muted-foreground/60"
            autoFocus
          />
        </div>

        <div className="py-0.5 max-h-[300px] overflow-y-auto">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => {
              const isSelected = value.some((m) => m.id === member.id);

              return (
                <DropdownMenuItem
                  key={member.id}
                  className="flex items-center justify-between rounded-sm px-2 py-1.5 text-[13px] cursor-pointer"
                  onSelect={() => handleToggleMember(member)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px] bg-primary/10">
                        {getAvatarText(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{member.name || member.email}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {member.email}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-muted-foreground" />}
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