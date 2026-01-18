import { formatDateToMonthDay } from "@/components/date-converter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/hooks/use-user";

import { cn } from "@/lib/utils";
import {
  deleteProjectUri,
  fetchProjectUri,
  updateProjectUri,
} from "@/services/project.service";
import { removeProject, setProject } from "@/store/slices/project.slice";
import { MoreHorizontal, type LucideProps } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { ProjectDatePicker } from "./date-picker";
import { baseUrl } from "@/constants";

interface props {
  projects: any;
}

const ProjectList: FC<props> = ({ projects }) => {
  const projectsList = Array.isArray(projects)
    ? projects
    : projects?.projects || [];

  const { id } = useParams();
  const { currentWorkspace } = useUser();
  const [projectid, setProjectId] = useState<number>();
  const dispatch = useDispatch();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // useEffect mein load karo
  useEffect(() => {
    if (projects && projects.length > 0) {
      const project = projects[0];

      if (project.start_date) {
        setStartDate(new Date(project.start_date));
      }
      if (project.target_date) {
        setEndDate(new Date(project.target_date));
      }
    }
  }, [projects]);

  // Update handler
  const handleUpdateStartDate = async (newDate: Date | null) => {
    setStartDate(newDate); // Pehle state update

    if (!newDate) return;

    try {
      await updateProjectUri(Number(id), {
        target_date: newDate.toISOString().split("T")[0],
        workspace_id: currentWorkspace?.id,
      });
      toast.success("Start date updated");
    } catch (error) {
      toast.error("Failed to update date");
    }
  };
  const handleDelete = async (projectId: number) => {
    setDeletingId(projectId);
    console.log("projectId in deeklete", projectId);
    const toastId = toast.loading("Deleting project...");

    try {
      const response = await deleteProjectUri(projectId);

      fetchProjectUri(currentWorkspace!.slug).then((res) => {
        dispatch(setProject(res.data));
        console.log("project data", res.data);
      });
      toast.success(response.data.message || "Project deleted", {
        id: toastId,
      });
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete project", {
        id: toastId,
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Table */}
      <div className="border">
        <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b text-sm font-medium text-muted-foreground">
          <div className="col-span-4">Name</div>
          {/* <div className="col-span-2">Health</div> */}
          <div className="col-span-2">Priority</div>
          <div className="col-span-2  ">Lead</div>
          <div className="col-span-2">Target date</div>
          {/* <div className="col-span-2">Status</div> */}
          <div className="col-span-1"></div>
        </div>

        {projectsList.map((project: any) => {
          const IconComponent = project.icon;
          return (
            <div
              key={project.id}
              className="grid grid-cols-12 gap-4 p-4  last:border-b-0 hover:bg-muted/50 transition-colors"
            >
              {/* Name */}
              <div className="col-span-4 flex items-center space-x-3">
                <div className={`p-1 ${project.icon}`}>
                  {/* <IconComponent className="w-4 h-4" /> */}
                </div>
                <div>
                  <Link
                    to={"/projects/detail/" + project.id}
                    className="font-medium"
                  >
                    <div >{project.name || "daw"}</div>
                  </Link>
                  {project.description && (
                    <div className="text-sm text-muted-foreground flex items-center">
                      {project.description}
                      {project.progress > 0 && (
                        <span className="ml-2">• {project.progress}%</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Health */}
              {/* <div className="col-span-2 flex items-center">
                <Badge
                  variant="secondary"
                  className={`bg-gray-500  text-white text-xs`}
                >
                  No updates
                </Badge>
              </div> */}

              {/* Priority */}
              <div className="col-span-2 flex items-center ">
                {project.priority ? (
                  <>
                    {project.priority.icon && (
                      <img
                        src={project.priority.icon}
                        alt={project.priority.name}
                        className="h-5 w-5 filter invert ml-4"
                      />
                    )}
                    {/* <span className="text-sm">{project.priority.name}</span> */}
                  </>
                ) : (
                  <Badge variant="secondary" className={`  text-white text-xs`}>
                    No priority
                  </Badge>
                )}
              </div>

              {/* Lead */}
              <div className="col-span-2 flex items-center">
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={project.lead?.avatar || "/placeholder.svg"}
                  />

                  <AvatarFallback className="text-xs">
                    {project.lead?.name.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Target date */}
              <div className="col-span-2 flex items-center text-sm">
                {/* <ProjectDatePicker
                  label="Start date"
                  value={startDate}
                  onChange={() => {}} */}
                {/* /> */}
                {formatDateToMonthDay(project.target_date)}
              </div>

              {/* Status */}
              {/* <div className="col-span-1 flex items-center space-x-2">
                <div className="flex-1">
                  <Progress value={25} className="h-2" />
                </div>
                <span className="text-sm text-muted-foreground min-w-[3ch]">
                  {25}%
                </span>
              </div> */}

              <div className="col-span-2 flex items-center justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-muted transition">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDelete(project.id)}>
                      Delete project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProjectList;
