import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Plus, Users } from "lucide-react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useUser } from "@/hooks/use-user";
import { IconPicker } from "../projects/components/icon-picker";
import {
  detectIconType,
  parseEmojiFromUnicode,
} from "@/components/parse-emoji";

const Teams = () => {
  const teamsData = useSelector((state: any) => state.teams) || [];
  const { currentWorkspace } = useUser();
  // console.log("Worspace Id", currentWorkspace!.id);
  console.log("TEAMS DATA IN TEAMS", teamsData);
  return (
    <>
      <div className="p-6 space-y-6 ">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">Teams</h1>
            <Badge variant="secondary" className="bg-muted ">
              {teamsData.length}
            </Badge>
          </div>
          <Link to="./new">
            <Button className="cursor-pointer " variant="custom">
              <Plus className="w-4 h-4" />
              Add team
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="space-y-4">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-semibold text-muted-foreground border-b border-border">
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Membership</div>
            <div className="col-span-3">Members</div>
            <div className="col-span-2">Cycle</div>
            {/* <div className="col-span-2">Active projects</div> */}
          </div>

          {/* Team Rows */}
          {teamsData.map((team: any) => (
            <div
              key={team.id}
              className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {/* Name */}
              <div className="col-span-3 flex items-center gap-3">
                {/* <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Users className="w-3 h-3 text-white" />
                </div> */}
                <IconPicker
                  variant="inline"
                  size={20}
                  value={
                    typeof team?.icon === "object"
                      ? {
                          ...team.icon,
                          icon: parseEmojiFromUnicode(team.icon.icon), // ← Parse nested icon
                        }
                      : team?.icon
                        ? {
                            icon: parseEmojiFromUnicode(team.icon),
                            color: "#000000",
                            type: detectIconType(team.icon),
                          }
                        : undefined
                  }
                />
                <div className="flex items-center gap-2">
                  <Link
                    to={`./${team.id}/issues`}
                    className="font-medium text-foreground"
                  >
                    {team.name}
                  </Link>
                  <span className="text-muted-foreground text-xs font-medium">
                    {team.tag}
                  </span>
                </div>
              </div>

              {/* Membership */}
              <div className="col-span-2 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-foreground">
                  {team.membership}
                </span>
              </div>

              {/* Members */}
              <div className="col-span-3 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {team.members.map((member: any, index: any) => (
                    <Avatar
                      key={member.id}
                      className="w-6 h-6 border-2 border-background"
                    >
                      <AvatarImage src={member.avatar || member.image || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs bg-[#5e6ad2] text-white">
                        {String.fromCharCode(65 + index)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  {team.memberCount}
                </span>
              </div>

              {/* Cycle */}
              <div className="col-span-2 flex items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 dark:bg-[#5e6ad2] bg-muted-foreground rounded-full"></div>
                  <span className="text-sm text-foreground font-semibold">
                     {team.cyclesPeriod === true ? "Enable" : "Disable"}
                  </span>
                </div>
              </div>

              {/* Active Projects */}
              {/* <div className="col-span-2 flex items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  <span className="text-sm text-foreground">
                    {team.activeProjects}
                  </span>
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Teams;
