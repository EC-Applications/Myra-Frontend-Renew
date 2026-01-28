"use client";

import { formatDateToMonthDay } from "@/components/date-converter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
  type DragEndEvent,
} from "@/components/ui/kanban";
import type { iStatus } from "@/interfaces/issues";
import type { iProject } from "@/interfaces/project.interface";
import { updateProjectUri } from "@/services/project.service";
import type { RootState } from "@/store/store";
import { toast } from "sonner";
import {
  BarChart3,
  Calendar,
  Filter,
  LayoutGrid,
  Link,
  MoreHorizontal,
  Plus,
  Star,
  Users,
  type LucideProps,
} from "lucide-react";
import { useEffect, useRef, useState, type FC } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useUser } from "@/hooks/use-user";
import type { DragStartEvent } from "@dnd-kit/core";
import { IconPicker } from "./icon-picker";
import { NewProject } from "./new-project";
import { useUpdateProjectHook } from "@/hooks/use-update-project";

interface props {
  projectsData: any;
}

const ProjectKanban: FC<props> = ({ projectsData }) => {
  const { "team-id": id } = useParams();
  const { currentWorkspace } = useUser();
  const navigate = useNavigate();
  const status = useSelector((state: RootState) => state.status);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defStatus, setDefaultStatus] = useState<number>();
  const [isDragging, setIsDragging] = useState(false);
  const useUpdateProject = useUpdateProjectHook();

  const columnsStatus = ((status as any)?.status ?? [])
    .filter((s: any) => s && s.id && s.name)
    .map((s: any) => ({
      id: String(s.id),
      name: s.name,
      color: s.color || "#gray",
    }));

  // console.log("kanban", projectsData);

  const [projects, setProjects] = useState(
    projectsData.map((project: any) => ({
      id: project.id.toString(),
      name: project.name,
      column: project.status_id
        ? String(project.status_id)
        : String((status as any)?.status?.[0]?.id || "1"),
      icon: (
        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-semibold">
          {project.name.charAt(0)}
        </div>
      ),
      date: project.target_date || null,
      milestone: project.short_summary || project.description || null,
      progress: 0,
      status: "no-updates",
      priority: project.priority || "low",
      avatar: null,
      description: project.description || undefined,
      teams: project.teams,
    })),
  );

  // Update projects when projectsData prop changes (when filters are applied)
  useEffect(() => {
    setProjects(
      projectsData.map((project: any) => ({
        id: project.id.toString(),
        name: project.name,
        column: project.status_id
          ? String(project.status_id)
          : String((status as any)?.status?.[0]?.id || "1"),
        icon: (
          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-semibold">
            {project.name.charAt(0)}
          </div>
        ),
        date: project.target_date || null,
        milestone: project.short_summary || project.description || null,
        progress: 0,
        status: "no-updates",
        priority: project.priority || "low",
        avatar: null,
        description: project.description || undefined,
        teams: project.teams,
      })),
    );
  }, [projectsData, status]);

  const draggedProjectRef = useRef<{
    id: string;
    originalColumn: string;
  } | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    console.log("drag start");
    setIsDragging(true);
    const project = projects.find((p: any) => p.id === event.active.id);
    if (project) {
      draggedProjectRef.current = {
        id: String(project.id),
        originalColumn: project.column,
      };
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    console.log("drag end");
    const { active, over } = event;

    if (!over || !draggedProjectRef.current) {
      draggedProjectRef.current = null;
      setIsDragging(false);
      return;
    }

    const { originalColumn } = draggedProjectRef.current;
    const targetColumnId = getTargetColumnId(over.id);

    if (!targetColumnId || originalColumn === targetColumnId) {
      draggedProjectRef.current = null;
      setIsDragging(false);
      return;
    }

    const activeProject = projects.find((p: any) => p.id === active.id);

    if (!activeProject) {
      draggedProjectRef.current = null;
      return;
    }

    await updateProjectStatus(activeProject, targetColumnId, originalColumn);
    draggedProjectRef.current = null;
  };

  const getTargetColumnId = (overId: string | number): string | null => {
    const directColumn = columnsStatus.find(
      (c: any) => c.id === String(overId),
    );

    if (directColumn) {
      return directColumn.id;
    }

    const overProject = projects.find((p: any) => p.id === String(overId));
    return overProject?.column || null;
  };

  const updateProjectStatus = async (
    project: any,
    newColumnId: string,
    oldColumnId: string,
  ) => {
    try {
      // await updatePr  ojectUri(Number(project.id), {
      //   status_id: Number(newColumnId),
      //   workspace_id: currentWorkspace?.id,
      //   team_id: project.teams?.map((t: any) => t.id) ?? [],
      // });
      useUpdateProject.mutate({
        projectId: Number(project.id),
        body: {
          status_id: Number(newColumnId),
          workspace_id: currentWorkspace?.id,
          team_id: project.teams?.map((t: any) => t.id) ?? [],
        },
      });

      // toast.success("Status updated");
    } catch (error) {
      console.error("Failed to update project status:", error);

      setProjects((prev: any[]) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, column: oldColumnId } : p,
        ),
      );

      toast.error("Failed to update status");
    } finally {
      setIsDragging(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      "at-risk": (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 text-xs"
        >
          ⚠ At risk
        </Badge>
      ),
      "off-track": (
        <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
          ⚠ Off track
        </Badge>
      ),
      "on-track": (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 text-xs"
        >
          ✓ On track
        </Badge>
      ),
      "no-updates": (
        <Badge
          variant="secondary"
          className="bg-gray-100 text-gray-600 text-xs"
        >
          No updates
        </Badge>
      ),
    };
    return badges[status as keyof typeof badges] || null;
  };

  const getPriorityIndicator = (priority: string) => {
    const colors = {
      high: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-green-500",
    };
    const color = colors[priority as keyof typeof colors];
    return color ? (
      <div className={`w-2 h-2 ${color} rounded-full`}></div>
    ) : null;
  };

  const getColumnColor = (columnId: string) => {
    const colors: Record<string, string> = {
      backlog: "bg-orange-500",
      planned: "bg-gray-500",
      "in-progress": "bg-yellow-500",
      completed: "bg-green-500",
    };
    return colors[columnId] || "bg-gray-500";
  };

  return (
    <>
      <KanbanProvider
        columns={columnsStatus}
        data={projects}
        onDataChange={setProjects}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="max-w-0"
      >
        {(column) => (
          <KanbanBoard key={column.id} id={column.id}>
            <KanbanHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {/* <div className={`w-2 h-2 rounded-full ${getColumnColor(column.id)}`} /> */}
                  <img src={column.icon} alt="" />
                  <h3 className="font-medium">{column.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {projects.filter((p: any) => p.column === column.id).length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDefaultStatus(Number(column.id));
                      setIsModalOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </KanbanHeader>

            <KanbanCards id={column.id}>
              {(project: any) => (
                <KanbanCard
                  key={project.id}
                  {...project}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (!isDragging) {
                      navigate(`/projects/detail/${project.id}`);
                    }
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <IconPicker
                          variant="inline"
                          value={project.icon.icon}
                          // onChange={() => {}}
                        />
                        <h4 className="font-medium text-sm">{project.name}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        {getPriorityIndicator(project.priority)}
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        {project.avatar && (
                          <Avatar className="w-5 h-5">
                            <AvatarImage
                              src={project.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="text-xs">
                              U
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>

                    {project.date && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDateToMonthDay(project.date)}
                      </div>
                    )}

                    {project.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
      <NewProject
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        defStatus={defStatus}
      />
    </>
  );
};

export default ProjectKanban;
