import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import type { DocumentItem, iProject } from "@/interfaces/project.interface";
import type { iMember } from "@/interfaces/teams.interface";
import { projectDetailFetchUri } from "@/services/project.service";
import { updateProject } from "@/store/slices/project.slice";
import type { RootState } from "@/store/store";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  Diamond,
  Edit3,
  MoreHorizontal,
  Plus,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "sonner";
import { ProjectFormStatus } from "./status-picker";
import { PriorityPicker } from "./priority-picker";
import { LeadPicker } from "./lead-picker";
import { ProjectDatePicker } from "./date-picker";
import { ProjectFormLabels, type Label } from "./label-picker";
import type { iMilestone } from "@/interfaces/milestone.interface";
// import { useProjectDetail } from "@/hooks/use-project-detail";
import { useUpdateProjectHook } from "@/hooks/use-update-project";
import { useProjectDetail } from "@/hooks/use-project-detail";
import { MemberPicker } from "./member-picker";
import Activity from "@/modules/issues/components/issues-activity";
import { useActivityHook } from "@/hooks/use-activity-hook";

const ProjectProperties = () => {
  const { id } = useParams();
  const { data: project } = useProjectDetail(Number(id));
  const workpsace = useUser();
  const priorityData = useSelector((state: any) => state.priority);
  const status = useSelector((state: any) => state.status);
  const statusList = useMemo(() => status?.status ?? [], [status]);
  const workspaceMember = useSelector((state: any) => state.workspace);
  const members = useMemo(
    () => (Array.isArray(workspaceMember) ? workspaceMember : []),
    [workspaceMember],
  );

  const [selectedMembers, setSelectedMembers] = useState<iMember[]>([]);
  const labelState = useSelector((state: any) => state.label);
  const labels = labelState?.labels ?? [];
  const projectData = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch();
  // const [project, setProject] = useState<iProject>();

  // States
  const [priority, setPriority] = useState<number | undefined>();
  const [selectedStatus, setSelectedStatus] = useState(statusList?.[0] ?? null);
  const [selectedLead, setSelectedLead] = useState<iMember | undefined>();
  const [showActivity, setShowActivity] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const updateProjectMutation = useUpdateProjectHook();

  const { data: activityData } = useActivityHook(
    workpsace.currentWorkspace?.slug ?? "",
    "project",
    Number(id),
  );

  // useEffect(() => {
  //   setLoading(true);
  //   try {
  //     projectDetailFetchUri(Number(id)).then((res) => {
  //       console.log("PROJECT DETAIL DATA", res.data);
  //       // setProject(res.data);
  //     });
  //   } catch (e) {
  //     setLoading(false);
  //     console.log(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [id]);

  // useEffect(() => {
  //   console.log(project);
  //   if (project && !isDataLoaded) {
  //     // Priority
  //     if (project.priority_id) {
  //       setPriority(project.priority_id);
  //     }

  //     if (project.status_id && statusList.length > 0) {
  //       const statusObj = statusList.find(
  //         (s: any) => s.id === project.status_id
  //       );
  //       if (statusObj) {
  //         setSelectedStatus(statusObj);
  //       }
  //     }

  //     if (project.lead_id && project.lead) {
  //       setSelectedLead(project.lead);
  //     }

  //     if (project.labels && project.labels.length > 0) {
  //       setSelectedLabels(project.labels);
  //     }

  //     if (project.start_date) {
  //       const date =
  //         typeof project.start_date === "string"
  //           ? new Date(project.start_date)
  //           : project.start_date;
  //       setStartDate(date);
  //     }

  //     if (project.target_date) {
  //       const date =
  //         typeof project.target_date === "string"
  //           ? new Date(project.target_date)
  //           : project.target_date;
  //       setEndDate(date);
  //     }

  //     if (project.documents && Array.isArray(project.documents)) {
  //       setDocuments(project.documents);
  //     }

  //     if (project.milestones && Array.isArray(project.milestones)) {
  //       setMilestones(project.milestones);
  //     }

  //     setIsDataLoaded(true);
  //   }
  // }, [
  //   project,
  //   priorityData.priority,
  //   statusList,
  //   members,
  //   project?.labels,
  //   isDataLoaded,
  // ]);

  const handleUpdateStatus = useCallback(
    (newStatus: any) => {
      if (!project) return;

      setSaving(true);

      updateProjectMutation.mutate(
        {
          projectId: Number(id),
          body: {
            status_id: newStatus.id,
            workspace_id: workpsace.currentWorkspace?.id,
            team_id: project.teams?.map((x) => x.id as number) || [],
          },
          // Full object for instant UI update
          optimisticData: {
            status: newStatus,
            status_id: newStatus.id,
          },
        },
        {
          onSettled: () => {
            setSaving(false);
          },
        },
      );
    },
    [project, id, workpsace.currentWorkspace?.id, updateProjectMutation],
  );

  const handleUpdatePriority = async (newPriority: number) => {
    setPriority(newPriority);

    if (!project) return;

    setSaving(true);

    const priorityObj = priorityData.priority?.find(
      (p: any) => p.id === newPriority,
    );

    if (!priorityObj) {
      toast.error("Priority not found");
      setSaving(false);
      return;
    }

    dispatch(
      updateProject({
        projectId: Number(id),
        data: { priority: priorityObj.id },
      }),
    );

    updateProjectMutation.mutate(
      {
        projectId: Number(id),
        body: {
          priority_id: priorityObj.id.toString(),
          workspace_id: workpsace.currentWorkspace?.id,
          team_id: project.teams?.map((x) => x.id as number) || [],
        },
      },
      {
        onSettled: () => {
          setSaving(false);
        },
      },
    );
  };

  const handleUpdateLead = useCallback(
    (newLead: iMember | undefined) => {
      if (!project || !newLead) return;

      setSaving(true);

      updateProjectMutation.mutate(
        {
          projectId: Number(id),
          body: {
            lead_id: newLead.id,
            workspace_id: workpsace.currentWorkspace?.id,
            team_id: project.teams?.map((x) => x.id as number) || [],
          },
          // Full object for instant UI update
          optimisticData: {
            lead: newLead,
            lead_id: newLead.id,
          },
        },
        {
          onSettled: () => {
            setSaving(false);
          },
        },
      );
    },
    [project, id, workpsace.currentWorkspace?.id, updateProjectMutation],
  );

  const handleUpdateStartDate = useCallback(
    (newDate: Date | null) => {
      if (!project || !newDate) return;

      setSaving(true);

      updateProjectMutation.mutate(
        {
          projectId: Number(id),
          body: {
            start_date: newDate.toISOString().split("T")[0],
            workspace_id: workpsace.currentWorkspace?.id,
            team_id: project.teams?.map((x) => x.id as number) || [],
          },
        },
        {
          onSettled: () => {
            setSaving(false);
          },
        },
      );
    },
    [project, id, workpsace.currentWorkspace?.id, updateProjectMutation],
  );

  const handleUpdateEndDate = useCallback(
    (newDate: Date | null) => {
      if (!project || !newDate) return;

      setSaving(true);

      updateProjectMutation.mutate(
        {
          projectId: Number(id),
          body: {
            target_date: newDate.toISOString().split("T")[0],
            workspace_id: workpsace.currentWorkspace?.id,
            team_id: project.teams?.map((x) => x.id as number) || [],
          },
        },
        {
          onSettled: () => {
            setSaving(false);
          },
        },
      );
    },
    [project, id, workpsace.currentWorkspace?.id, updateProjectMutation],
  );

  const handleUpdateLabel = useCallback(
    (newLabels: Label[]) => {
      if (!project) return;

      setSaving(true);

      updateProjectMutation.mutate(
        {
          projectId: Number(id),
          body: {
            workspace_id: workpsace.currentWorkspace?.id,
            labels_id:
              newLabels.length > 0
                ? newLabels.map((x) => x.id as number)
                : null,
            team_id: project.teams?.map((x) => x.id as number) || [],
          },
          optimisticData: {
            labels: newLabels, // ← Yeh instantly UI update karega
          },
        },
        {
          onSettled: () => {
            setSaving(false);
          },
        },
      );
    },
    [project, id, workpsace.currentWorkspace?.id, updateProjectMutation],
  );

  const handleMemberUpdate = async (members: iMember[]) => {
    if (!project) return;

    const previousMembers = selectedMembers;
    // /(members);
    setSelectedMembers(members);
    setSaving(true);

    // dispatch(
    //   updateProject({
    //     projectId: Number(id),
    //     data: { labels: labels.map((x) => x.id) },
    //   })
    // );

    updateProjectMutation.mutate(
      {
        projectId: Number(id),
        body: {
          workspace_id: workpsace.currentWorkspace?.id,
          members_id: members.map((x) => x.id as number) as any,
          team_id: project.teams?.map((x) => x.id as number) || [],
        },
      },
      {
        onError: () => {
          setSelectedMembers(members);
          dispatch(
            updateProject({
              projectId: Number(id),
              data: { members: previousMembers },
            }),
          );
        },
        onSettled: () => {
          setSaving(false);
        },
      },
    );
  };

  return (
    <div className="w-96 border-l border-border h-[calc(100vh_-_80px)] overflow-auto">
      <div className="p-4">
        {/* Properties */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Properties</h3>
            {/* <Plus className="w-4 h-4" /> */}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-muted-foreground ">
                Status
              </span>
              <ProjectFormStatus
                statuses={statusList}
                value={project?.status}
                onChange={handleUpdateStatus}
                className="border-0"
                buttonVarient="dark"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-muted-foreground">
                Priority
              </span>
              <PriorityPicker
                value={Number(project?.priority?.id)}
                onChange={handleUpdatePriority}
                className="border-0 "
                buttonVarient="dark"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-muted-foreground">
                Lead
              </span>
              <div className="flex items-center gap-2">
                <LeadPicker
                  members={members}
                  value={project?.lead}
                  onChange={handleUpdateLead}
                  className="border-0 "
                  buttonVarient="dark"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-muted-foreground">
                Members
              </span>
              <div className="flex items-center gap-2">
                <MemberPicker
                  members={members}
                  value={project?.members ?? []}
                  onChange={handleMemberUpdate}
                  buttunVarient="dark"
                  className="border-0"
                  // className="w-full"
                />
              </div>
            </div>
            {/* <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Members</span>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <Avatar className="w-5 h-5 border border-background">
                    <AvatarFallback className="text-xs bg-red-500 text-white">
                      A
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="w-5 h-5 border border-background">
                    <AvatarFallback className="text-xs bg-blue-500 text-white">
                      B
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="w-5 h-5 border border-background">
                    <AvatarFallback className="text-xs bg-green-500 text-white">
                      C
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-sm text-muted-foreground">9 members</span>
              </div>
            </div> */}

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-muted-foreground">
                Start date
              </span>
              <ProjectDatePicker
                label="Start date"
                value={
                  project?.start_date ? new Date(project.start_date) : undefined
                }
                onChange={handleUpdateStartDate}
                className="border-0"
                buttonVarient="dark"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-muted-foreground">
                Target date
              </span>
              <ProjectDatePicker
                label="End date"
                value={
                  project?.target_date
                    ? new Date(project.target_date)
                    : undefined
                }
                onChange={handleUpdateEndDate}
                className="border-0 "
                buttonVarient="dark"
              />
            </div>

            {/* <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Teams</span>
              <Badge variant="outline">Engineering</Badge>
            </div> */}

            {/* <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Initiatives</span>
              <span className="text-sm text-muted-foreground">
                No initiative
              </span>
            </div> */}

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-muted-foreground">
                Labels
              </span>
              <ProjectFormLabels
                labels={labels}
                value={project?.labels || []}
                onChange={handleUpdateLabel}
                className="rounded-full"
                buttonVarient="dark"
              />
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold">Milestones</h3>
            {/* <Plus className="w-4 h-4" /> */}
          </div>

          <div className="space-y-2">
            {project?.milestones?.map((m: iMilestone) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
              >
                <div className="flex items-center gap-2">
                  <Diamond className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">{m.name}</span>
                </div>
                {/* <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    25% of 4
                  </span>
                  <MoreHorizontal className="w-3 h-3" />
                </div> */}
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        {/* <div className="mb-6"> */}
        {/* <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Progress</h3>
            <ChevronDown className="w-4 h-4" />
          </div>

          <div className="flex justify-between mb-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Scope</div>
              <div className="text-lg font-semibold">20</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Completed
              </div>
              <div className="text-lg font-semibold">7 • 35%</div>
            </div>
          </div> */}

        {/* <div className="flex border-b border-border mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="border-b-2 border-blue-500 rounded-none"
            >
              Assignees
            </Button> */}
        {/* <Button variant="ghost" size="sm" className="rounded-none">
              Labels
            </Button>
            <Button variant="ghost" size="sm" className="rounded-none">
              Cycles
            </Button> */}
        {/* </div> */}

        {/* <div className="space-y-3">
            {members.map((x) => (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-blue-500 text-white">
                      {x.name?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{x.name}</span>
                </div> */}
        {/* <span className="text-sm font-medium">12</span> */}
        {/* </div>
            ))}
          </div> */}

        {/* </div> */}

        {/* Activity */}
        {/* <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Activity</h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              See all
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Edit3 className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">ahmedsaif</span> changed name to
                  Myra Next JS • Jul 22
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">ahmedsaif</span> posted an
                  update • Jul 7
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">ahmedsaif</span> set target date
                  to Aug 31 • Jul 7
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">ahmedsaif</span> added milestone
                  Mobile • Jul 7
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">ahmedsaif</span> added members
                  ahmedsaif, maria and 8 others • Jul 7
                </p>
              </div>
            </div>
          </div>
        </div> */}

        <div className="">
          <button
            type="button"
            onClick={() => setShowActivity(!showActivity)}
            className={`flex items-center gap-1 font-semibold text-[14px] mb-2 dark:hover:text-white text-muted-foreground ${showActivity ? "dark:text-white" : "text-muted-foreground"}`}
          >
            <span
              className={`text-[16px] font-semibold dark:hover:text-white ${showActivity ? "dark:text-white" : "text-muted-foreground"}`}
            >
              Activity
            </span>
            {showActivity ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {showActivity && <Activity activityData={activityData?.data ?? []} />}
        </div>
      </div>
    </div>
  );
};

export default ProjectProperties;
