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
import { Check, User } from "lucide-react";

interface LeadProps {
  members: iMember[];
  value?: iMember;
  onChange: (member: iMember | undefined) => void;
  className?: string;
   buttonVarient?: "light" | "dark"  ;
}

export const LeadPicker = ({
  members,
  value,
  onChange,
  className,
  buttonVarient="light"
}: LeadProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter((member) => {
    const searchValue = search.toLowerCase();

    return (
      (member.name ?? "").toLowerCase().includes(searchValue) ||
      (member.email ?? "").toLowerCase().includes(searchValue) 
    );
  });

  const handleSelectLead = (member: iMember) => {
    onChange(member);
    setOpen(false);
    setSearch("");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            ` h-7.5 justify-start  text-sm  text-muted-foreground dark:text-muted-foreground hover:font-semibold font-semibold dark:hover:text-white border  dark:hover:bg-[#32333a] ${buttonVarient == "light" ? "dark:bg-[#32333a]" : "dark:bg-transparent"}`,
            className
          )}
        >
          {value ? (
            <div className="flex items-center gap-1 ">
              {/* <Avatar className="h-4 w-4">
                <AvatarFallback className="text-[10px]">
                  {(value?.name ?? "?").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar> */}
               <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={value?.image || value?.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-[10px] bg-primary/10 ">
                        {(value?.name || value?.email)
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
              <span className="text-[14px]">{value.name}</span>
            </div>
          ) : (
            <span className="text-[14px] ">Lead</span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[280px] dark:bg-[#1c1d1f] p-0 dark:border-zinc-700"
      >
        <div className="relative mb-1">
          <Input
            placeholder="Set lead..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-[15px] dark:placeholder:text-[#7e7f82] placeholder:font-semibold placeholder:text-muted-foreground/60 border-0 dark:bg-[#1c1d1f] focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-[#5e6ad2]"
            autoFocus
          />
        </div>
        <hr className="dark:border-zinc-700" />

        <div className="p-1 max-h-[300px] overflow-y-3">
          {/* Clear Selection Option */}
          {/* {value && (
            <DropdownMenuItem
              className="flex items-center justify-between rounded-sm px-2 py-1.5 text-[13px] cursor-pointer text-muted-foreground"
              onSelect={() => {
                onChange(undefined);
                setOpen(false);
              }}
            >
              <span className ="">No lead</span>
            </DropdownMenuItem>
          )} */}

          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => {
              const isSelected = value?.id === member.id;

              return (
                <DropdownMenuItem
                  key={member.id}
                  className="flex items-center justify-between rounded-sm px-2 py-1 text-[15px] cursor-pointer dark:hover:bg-[#292b30] font-semibold"
                  onSelect={() => handleSelectLead(member)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={member.image || member.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-[10px] bg-primary/10 ">
                        {(member.name || member.email)
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-[14px]">
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
