import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/hooks/use-user";
import type { iResponse } from "@/interfaces/common.interface";
import Invite from "@/modules/members/components/invite";
import { getTeams, removeMemberFromTeamUri } from "@/services/team.service";
import { removeMemberFromTeam, setTeams } from "@/store/slices/team.slice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "sonner";

export default function Members() {
  const dispatch = useDispatch();
  const { currentWorkspace } = useUser();
  const teamsData = useSelector((state: any) => state.teams) || [];
  const { id } = useParams();

  const teamId = Number(id);

  const [loading, setLoading] = useState(false);
  const [memberId, setMemberId] = useState<number | null>(null);

  const fetchTeamsMembers = useCallback(() => {
    if (!currentWorkspace?.name || !currentWorkspace?.id) return;

    setLoading(true); // start loader
    getTeams(currentWorkspace.name, currentWorkspace.id)
      .then((res) => {
        dispatch(setTeams(res.data));
      })
      .catch((er: iResponse<null>) => {
        console.warn(er);
        toast.error(er.message);
      })
      .finally(() => setLoading(false)); // stop loader
  }, [currentWorkspace?.id, currentWorkspace?.name, dispatch]);

  useEffect(() => {
    fetchTeamsMembers();
  }, [fetchTeamsMembers]);

  const filterTeamData = teamsData.find((t: any) => t.id === teamId);

  const handleDeleteApiCall = async () => {
    if (!memberId || !filterTeamData) return;

    const teamId = filterTeamData.id;
    const memberIdToRemove = memberId;

    toast.loading("Removing member...", { id: 'remove-member' });

    try {
      const res = await removeMemberFromTeamUri(
        currentWorkspace!.name,
        teamId,
        memberIdToRemove
      );

      dispatch(removeMemberFromTeam({ teamId, memberId: memberIdToRemove }));
      toast.success(res.message, { id: 'remove-member' });
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove member", { id: 'remove-member' });
      fetchTeamsMembers();
    }
  };

  // **Conditional Rendering**
  if (loading) {
    return (
      <div className="min-h-screen p-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid grid-cols-12 gap-4 p-4 border-b animate-pulse"
          >
            <div className="col-span-5 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
            <div className="col-span-4 flex items-center">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
            </div>
            <div className="col-span-3 flex items-center justify-between">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!filterTeamData) {
    return <div className="min-h-screen p-6">Team not found</div>;
  }

  // **Normal Render after data loaded**
  return (
    <div className="min-h-screen p-6">
      <div className="px-3">
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-8">Team members</h1>

        {/* Search and Filter */}
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search by name or email" className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-20 ">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 px-4">
            <Invite
              refresh={() => fetchTeamsMembers()}
              teamId={filterTeamData.id}
              teamName={filterTeamData.name}
            />
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-3 border-b text-sm text-muted-foreground font-medium">
        <div className="col-span-5">Name ↓</div>
        <div className="col-span-4">Email</div>
        <div className="col-span-3">Role</div>
        <span></span>
      </div>

      {/* Members List */}
      {filterTeamData.members?.map((m: any) => (
        <div
          key={m.id}
          className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-muted/50 transition-colors"
        >
          {/* Avatar */}
          <div className="col-span-5 flex items-center gap-3">
            <Avatar className="w-8 h-8">
              {m.image ? (
                <img src={m.image} alt={m.name} />
              ) : (
                <AvatarFallback className="bg-green-600 text-foreground text-sm font-medium">
                  {m.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div>
              <div className="font-medium text-foreground">{m.name}</div>
              <div className="text-sm text-muted-foreground">{filterTeamData.prefix}</div>
            </div>
          </div>

          {/* Email */}
          <div className="col-span-4 flex items-center text-muted-foreground/50">{m.email}</div>

          {/* Role */}
          <div className="col-span-3 flex items-center justify-between text-muted-foreground/50">
            <span>{m.pivot.role || "Member"}</span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-muted transition">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] rounded-xl p-1 min-w-[180px] border"
              >
                <DropdownMenuItem
                  className="px-3 py-2 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2a2a2a] focus:bg-gray-100 dark:focus:bg-[#2a2a2a] cursor-pointer transition-colors"
                  onClick={() => {
                    setMemberId(m.id);
                    handleDeleteApiCall();
                  }}
                >
                  {m.pivot.role === "lead" ? "Leave Team" : "Remove from team"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
