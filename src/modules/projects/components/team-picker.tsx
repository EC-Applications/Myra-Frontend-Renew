import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import type { iMember, iTeams } from "@/interfaces/teams.interface";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { use, useEffect, useState } from "react";
import { Check, User, Users, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

interface TeamPickerProps {
  teams: iTeams[];
  value: iTeams[];
  onChange: (teams: iTeams[]) => void;
  className?: string;
}

export const TeamPicker = ({
  teams,
  value,
  onChange,
  className,
}: TeamPickerProps) => {
  const { "team-id": teamId } = useParams();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const currentTeam = teams.find((team) => team.id === Number(teamId));
  useEffect(() => {
    if (currentTeam && value.length === 0) {
      onChange([currentTeam]);
    }
  }, [currentTeam, value.length, onChange]);

  const filteredTeams = teams.filter((team) => {
    const searchValue = search.toLowerCase();
    return (team.name ?? "").toLowerCase().includes(searchValue);
  });

  // Separate current team from others
  const otherTeams = filteredTeams.filter(
    (team) => team.id !== currentTeam?.id
  );

  // Toggle team selection
  const handleToggleTeam = (team: iTeams) => {
    const isSelected = value.some((t) => t.id === team.id);

    if (isSelected) {
      onChange(value.filter((t) => t.id !== team.id));
    } else {
      onChange([...value, team]);
    }
  };

  // Remove team from selected
  const handleRemoveTeam = (teamId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((t) => t.id !== teamId));
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-8 justify-start gap-2 px-2 text-sm  dark:text-muted-foreground hover:font-semibold font-semibold hover:text-white border dark:bg-[#2a2c33] dark:hover:bg-[#32333a]",
            className
          )}
        >
          {value.length === 0 ? (
            <span className="text-[13px]">Add teams...</span>
          ) : (
            <div className="flex items-center gap-1 flex-wrap">
              <Users className="h-3.5 w-3.5" />
              {value.slice(0, 2).map((team) => (
                <div
                  key={team.id}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5"
                >
                  {/* <Avatar className="h-4 w-4">
                                        <AvatarFallback className="text-[10px]">
                                            {team.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar> */}
                  <span className="text-[11px]">{team.name}</span>
                  {/* <button
                                        onClick={(e) => handleRemoveTeam(Number(team.id), e)}
                                        className="hover:bg-background rounded-full p-0.5"
                                    >
                                        <X className="h-2.5 w-2.5" />
                                    </button> */}
                </div>
              ))}
              {value.length > 2 && (
                <span className="text-[11px] text-muted-foreground">
                  +{value.length - 2} more
                </span>
              )}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[280px] p-1.5">
        {/* Search */}
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
          {/* Current/Active Team */}
          {currentTeam && (
            <>
              <DropdownMenuItem
                className="flex items-center justify-between rounded-sm px-2 py-1.5 text-[13px] cursor-pointer"
                onSelect={() => handleToggleTeam(currentTeam)}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value.some((t) => t.id === currentTeam.id)}
                    readOnly
                    className="h-4 w-4"
                  />
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[10px] bg-primary/10">
                      {currentTeam.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{currentTeam.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      Current team
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>

              {otherTeams.length > 0 && <div className="my-1 h-px bg-border" />}
            </>
          )}

          {/* Your Teams Header */}
          {otherTeams.length > 0 && (
            <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase">
              Your teams
            </div>
          )}

          {/* Other Teams */}
          {otherTeams.length > 0
            ? otherTeams.map((team) => {
                const isSelected = value.some((t) => t.id === team.id);

                return (
                  <DropdownMenuItem
                    key={team.id}
                    className="flex items-center justify-between rounded-sm px-2 py-1.5 text-[13px] cursor-pointer"
                    onSelect={() => handleToggleTeam(team)}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="h-4 w-4"
                      />
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[10px] bg-primary/10">
                          {team.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{team.name}</span>
                    </div>
                  </DropdownMenuItem>
                );
              })
            : !currentTeam && (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No teams found
                </div>
              )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
