import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/hooks/use-user";
import type { iResponse } from "@/interfaces/common.interface";
import type { iWorkspaceMember } from "@/interfaces/workspace.interface";
import {
  getMembers,
  removeWorkspaceMemeber,
} from "@/services/workspace.service";
import { Separator } from "@radix-ui/react-separator";
import { ChevronDown, MoreHorizontal, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { toast } from "sonner";
import Invite from "./components/invite";
import { useDispatch, useSelector } from "react-redux";
import {
  removeWorkspaceMember,
  setWorkspaceMember,
} from "@/store/slices/workspace.slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RootState } from "@/store/store";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";

function UserTableSkeleton() {
  return (
    <TableBody>
      {Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={index} className="hover:bg-foreground/5">
          <TableCell className="py-3 pl-12">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full bg-foreground/15" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-32 bg-foreground/15" />
                <Skeleton className="h-2 w-24 bg-foreground/15" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-3 w-20 bg-foreground/15" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3 w-12 bg-foreground/15" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3 w-16 bg-foreground/15 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

const UserTable: FC<{ members: iWorkspaceMember[] }> = ({ members }) => {
  const [memeberId, setMemberId] = useState<number | undefined>();
  // console.log("This is memebr id", memeberId);
  const { currentUser, currentWorkspace } = useUser();
  const dispatch = useDispatch();

  const handleDelete = async (memberId: number) => {
    if (currentUser?.id === memberId) {
      return toast.message("Current user cannot be removed");
    }

    try {
      const response = await removeWorkspaceMemeber(
        currentWorkspace?.id,
        memberId
      );
      dispatch(removeWorkspaceMember(memberId));
      toast.success(response.message);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {members.length > 0 ? (
        <TableBody>
          {members.map((user, i) => (
            <TableRow key={i} className="hover:bg-foreground/5">
              <TableCell className="py-2 pl-12">
                <div className="flex items-center gap-3">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.image} />
                    <AvatarFallback className="bg-gray-600 text-foreground text-sm font-medium uppercase">
                      {(user.name || user.email.split("@")[0])
                        .split(" ")
                        .map((x) => x.split("")[0])
                        .slice(
                          0,
                          (user.name || user.email.split("@")[0]).split(" ").length
                        )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-foreground text-sm font-medium">
                      {user.name || user.email}
                    </span>
                    {user.name && user.name !== user.email ? (
                      <span className="text-muted-foreground text-xs">
                        {user.email}
                      </span>
                    ) : null}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm capitalize">
                {user.role}{" "}
                {!user.is_accept ? (
                  <span className="text-muted-foreground/50">(Invited)</span>
                ) : null}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {user.joined_at}
              </TableCell>

              <TableCell>
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
                        handleDelete(user.id);
                      }}
                    >
                      Remove From Workspace
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>

              {/* <TableCell>
            {user.teams.length > 0 ? (
              <div className="flex gap-1">
                {user.teams.map((team, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gray-700 text-white hover:bg-gray-600 text-xs px-2 py-1"
                  >
                    {team}
                  </Badge>
                ))}
              </div>
            ) : null}
          </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No members found. Invite your team to collaborate!
        </div>
      )}
    </>
  );
};

const Members = () => {
  const { currentWorkspace } = useUser();
  // const [members, setMembers] = useState<iWorkspaceMember[]>([]);
  const members = useSelector((state: RootState) => state.workspace);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const dispatch = useDispatch();

  const fetchMembers = useCallback(() => {
    setLoading(true);
    getMembers(currentWorkspace!.slug, currentWorkspace!.id)
      .then(
        (res) => {
          // setMembers(res.data);
          // console.log("worksapace", res.data);
          dispatch(setWorkspaceMember(res.data));
        },
        (er: iResponse<null>) => {
          console.warn(er);
          toast.error(er.message);
        }
      )
      .finally(() => setLoading(false));
  }, [currentWorkspace, dispatch]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = useMemo(() => {
    return members.filter((m: iWorkspaceMember) => {
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!m.name?.toLowerCase().includes(q) && !m.email?.toLowerCase().includes(q)) {
          return false;
        }
      }
      // Role filter
      if (roleFilter === "invited") return !m.is_accept;
      if (roleFilter !== "all") return m.role?.toLowerCase() === roleFilter && m.is_accept;
      return true;
    });
  }, [members, search, roleFilter]);

  return (
    <div className="min-h-screen border dark:border-zinc-800 dark:bg-[#1c1d1f]">
      <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {/* <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>Building Your Application</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" /> */}
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  Members
                  {members.length ? (
                    <Badge
                      className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums ms-2"
                      variant="outline"
                    >
                      {members.length}
                    </Badge>
                  ) : null}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2 px-4">
          <Invite refresh={() => fetchMembers()} />
        </div>
      </header>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-7" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="h-7 px-3 rounded border dark:border-zinc-700 text-sm font-medium text-muted-foreground hover:text-foreground dark:bg-[#1c1d1f] dark:hover:bg-[#2a2c33] transition-colors outline-none flex items-center capitalize">
            {roleFilter === "all" ? "All" : roleFilter} <ChevronDown className="h-3 w-3 ms-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="dark:bg-[#1c1d1f] dark:border-zinc-700 rounded p-1 min-w-[150px]">
            {["all", "owner", "admin", "member", "invited"].map((role) => (
              <DropdownMenuItem
                key={role}
                className="px-3 py-1.5 rounded-md text-sm cursor-pointer capitalize"
                onClick={() => setRoleFilter(role)}
              >
                {role}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-accent-foreground font-normal pl-12">
                <div className="flex items-center gap-1 font-semibold">
                  Name
                  <ChevronDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-accent-foreground  font-semibold">
                Status
              </TableHead>
              <TableHead className="text-accent-foreground  font-semibold">
                Joined
              </TableHead>
              {/* <TableHead className="text-accent-foreground font-normal">
                Teams
              </TableHead> */}
            </TableRow>
          </TableHeader>
          {loading ? <UserTableSkeleton /> : <UserTable members={filteredMembers} />}
        </Table>
      </div>
    </div>
  );
};

export default Members;
