import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import type { iTeams } from "@/interfaces/teams.interface";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ChevronDown, Users } from "lucide-react";

interface SingleTeamPickerProps {
  teams: iTeams[];
  value: iTeams | null;
  onChange: (team: iTeams | null) => void;
  className?: string;
  variant?: "full" | "cover" | "inline";
}

export const SingleTeamPicker = ({
  teams,
  value,
  onChange,
  className,
  variant = "full",
}: SingleTeamPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredTeams = teams.filter((team) => {
    const searchValue = search.toLowerCase();
    return (team.name ?? "").toLowerCase().includes(searchValue);
  });

  const handleSelectTeam = (team: iTeams) => {
    onChange(team);
    setOpen(false);
  };

  // Full variant - complete button with label
  if (variant === "full") {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-8 justify-start gap-2 px-2 text-sm dark:text-muted-foreground hover:font-semibold font-semibold hover:text-white border dark:bg-[#2a2c33] dark:hover:bg-[#32333a]",
              className
            )}
          >
            {value ? (
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5" />
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="text-[10px] bg-primary/10">
                    {value.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[11px]">{value.name}</span>
              </div>
            ) : (
              <span className="text-[13px]">Select team...</span>
            )}
            <ChevronDown className="ml-auto h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-[280px] p-1.5">
          <div className="relative mb-1">
            <Input
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-[13px] placeholder:text-muted-foreground/60"
              autoFocus
            />
          </div>

          <div className="py-0.5 max-h-[300px] overflow-y-auto">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <DropdownMenuItem
                  key={team.id}
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] cursor-pointer"
                  onSelect={() => handleSelectTeam(team)}
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[10px] bg-primary/10">
                      {team.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{team.name}</span>
                  {value?.id === team.id && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-4 text-center text-sm text-muted-foreground">
                No teams found
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Cover variant - minimal button with avatar only
  if (variant === "cover") {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 w-7 rounded-full p-0 hover:bg-accent",
              className
            )}
          >
            {value ? (
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px] bg-primary/10">
                  {value.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px]">
                  <Users className="h-3.5 w-3.5" />
                </AvatarFallback>
              </Avatar>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-[280px] p-1.5">
          <div className="relative mb-1">
            <Input
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-[13px] placeholder:text-muted-foreground/60"
              autoFocus
            />
          </div>

          <div className="py-0.5 max-h-[300px] overflow-y-auto">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <DropdownMenuItem
                  key={team.id}
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] cursor-pointer"
                  onSelect={() => handleSelectTeam(team)}
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[10px] bg-primary/10">
                      {team.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{team.name}</span>
                  {value?.id === team.id && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-4 text-center text-sm text-muted-foreground">
                No teams found
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Inline variant - compact text with name only
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-auto p-0 hover:underline font-normal text-sm",
            className
          )}
        >
          {value ? (
            <span className="text-[13px]">{value.name}</span>
          ) : (
            <span className="text-[13px] text-muted-foreground">
              Select team
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[280px] p-1.5">
        <div className="relative mb-1">
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-[13px] placeholder:text-muted-foreground/60"
            autoFocus
          />
        </div>

        <div className="py-0.5 max-h-[300px] overflow-y-auto">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] cursor-pointer"
                onSelect={() => handleSelectTeam(team)}
              >
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[10px] bg-primary/10">
                    {team.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{team.name}</span>
                {value?.id === team.id && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No teams found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
