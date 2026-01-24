import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { iMember } from "@/interfaces/teams.interface";
import { cn } from "@/lib/utils";
import { Check, CircleUserRound, User, X } from "lucide-react";
import { useState } from "react";

type MemberPickerVariant = "full" | "avatar-only" | "compact";

interface SingleMemberProps {
  members: iMember[];
  value?: iMember;
  onChange: (member: iMember | undefined) => void;
  className?: string;
  variant?: MemberPickerVariant;
  disabled?: boolean;
  buttonVarient?: "light" | "dark";
}

export const SingleMemberPicker = ({
  members,
  value,
  onChange,
  className,
  variant = "full",
  disabled = false,
  buttonVarient = "light",
}: SingleMemberProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const term = search?.toLowerCase() ?? "";

  const filteredMembers = (members || []).filter(
    (m) =>
      (m?.name ?? "").toLowerCase().includes(term) ||
      (m?.email ?? "").toLowerCase().includes(term)
  );

  const handleSelectMember = (member: iMember) => {
    onChange(member);
    setOpen(false);
  };

  const handleRemoveMember = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  // Helper function for avatar fallback
  const getAvatarText = (name: string | null | undefined) => {
    if (!name) return "??";
    return name.slice(0, 2).toUpperCase();
  };

  // Render different UI based on variant
  const renderTrigger = () => {
    if (variant === "avatar-only") {
      // Avatar-only variant (for lists/tables - just avatar)
      return (
        <button
          disabled={disabled}
          className={cn(
            "transition-opacity hover:opacity-80",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <Avatar className="w-6 h-6">
            <AvatarImage src={value?.image || value?.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">
              {value ? getAvatarText(value.name) : "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      );
    }

    if (variant === "compact") {
      // Compact variant (small avatar + name)
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
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px]">
                  {getAvatarText(value.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{value.name || value.email}</span>
            </div>
          ) : (
            <>
              <User className="h-3.5 w-3.5" />
              <span className="text-xs">Unassigned</span>
            </>
          )}
        </Button>
      );
    }

    // Full variant (default - with remove button and full info)
    return (
      <Button
        variant="outline"
        disabled={disabled}
        className={cn(
          `h-7.5 justify-start gap-1 text-sm font-normal text-muted-foreground dark:hover:text-white border  dark:hover:bg-[#32333a] ${
            buttonVarient == "light" ? "dark:bg-[#32333a]" : "dark:bg-transparent"
          } `,
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {!value ? (
          <span className="text-[14px] font-semibold">Assignee</span>
        ) : (
          <div className="flex items-center ">
            <div className="flex items-center gap-1 rounded  py-0.5">
              <Avatar className="h-5 w-5 p-0">
                <AvatarImage src={value?.image || value?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-[10px] bg-primary/10 ">
                        {(value?.name || value?.email)
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
              </Avatar>
              <span className="text-[13px] font-semibold">{value.name || value.email}</span>
              {/* <button
                                onClick={handleRemoveMember}
                                className="hover:bg-background rounded-full p-0.5"
                            >
                            </button> */}
            </div>
          </div>
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
        className="w-[280px] p-0 dark:bg-[#1c1d1f] "
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
        <hr />

        <div className="py-1 max-h-[300px] overflow-y-auto px-2 ">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => {
              const isSelected = value?.id === member.id;

              return (
                <DropdownMenuItem
                  key={member.id}
                  className="flex items-center justify-between rounded-sm px-2 py-1.5 text-[13px] cursor-pointer dark:hover:bg-[#292b30]"
                  onSelect={() => handleSelectMember(member)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      
                <AvatarImage src={member?.image || member?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-[10px] bg-primary/10">
                        {getAvatarText(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {member.name || member.email}
                      </span>
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
