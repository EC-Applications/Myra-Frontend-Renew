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
import { useEffect, useState } from "react";
import { Users, X } from "lucide-react";
import { useParams } from "react-router";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface SingleTeamPickerProps {
  teams: iTeams[];
  value: iTeams | null;
  onChange: (team: iTeams | null) => void;
  className?: string;
}

export const SingleTeamPicker = ({
  teams,
  value,
  onChange,
  className,
}: SingleTeamPickerProps) => {
  const { "team-id": teamId } = useParams();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const teamset = useSelector((state: RootState) => state.useTeamId);

  const currentTeam = teams.find(t => [Number(teamId), Number(teamset)].includes(Number(t.id)));

  // default select current team
  useEffect(() => {
    if (currentTeam && !value) {
      onChange(currentTeam);
    }
  }, [currentTeam, value, onChange]);

  const filteredTeams = teams.filter(team =>
    (team.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectTeam = (team: iTeams) => {
    onChange(team);
    setOpen(false);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  useEffect(() => {
    if (teams.length == 1) onChange(teams[0]);
  }, [teams, onChange]);

  return (
    <DropdownMenu open={open && teams.length > 1} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-7.5 justify-start gap-2 px-2 text-sm  font-semibold text-muted-foreground hover:text-white border dark:bg-[#2a2c33] dark:hover:bg-[#32333a]",
            className
          )}
        >
       

          {!value ? (
            <span className="text-[13px]">Select team...</span>
          ) : (
            <div className="flex items-center gap-1  rounded px-1.5 py-0.5">
              {/* <Avatar className="h-4 w-4">
                <AvatarFallback className="text-[10px]">
                  {value.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar> */}
              <span className="text-[14px] font-semibold">{value.name}</span>
              {/* <button
                onClick={clearSelection}
                className="hover:bg-background rounded-full p-0.5"
              >
                <X className="h-2.5 w-2.5" />
              </button> */}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[260px] p-0 dark:bg-[#1c1d1f]">
        <Input
          placeholder="Search teams..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-8 text-[15px] dark:placeholder:text-[#7e7f82] placeholder:font-semibold  placeholder:text-muted-foreground/60 border-0  dark:bg-[#1c1d1f] focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-[#5e6ad2]"
          autoFocus
        />
<hr className="dark:border-zinc-700" />
        <div className="max-h-[280px] px-1 py-1 overflow-y-auto ">
          {filteredTeams.map(team => (
            <DropdownMenuItem
              key={team.id}
              className="group relative flex h-8 cursor-pointer items-center rounded-sm px-2 py-1.5 text-[13px] transition-colors dark:hover:bg-[#292b30] border-0 font-semibold pointer"
              onSelect={() => handleSelectTeam(team)}
            >
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px] bg-primary/10">
                  {team.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <span className="font-medium">{team.name}</span>
                {team.id === currentTeam?.id && (
                  <span className="text-[11px] text-muted-foreground">
                    Current team
                  </span>
                )}
              </div>
            </DropdownMenuItem>
          ))}

          {filteredTeams.length === 0 && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No teams found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
