import {
  detectIconType,
  parseEmojiFromUnicode,
} from "@/components/parse-emoji";
import { IconPicker } from "@/modules/projects/components/icon-picker";
import { useSelector } from "react-redux";
import { Link } from "react-router";

interface ProjectKanbanProps {
  projectName: string | null;
}

export const ProjecComponentKanban = ({ projectName }: ProjectKanbanProps) => {
  const projects = useSelector((state: any) => state.project.projects);

  const findProject = projects?.find((p: any) => p.name == projectName);

  // Return null if project not found
  if (!findProject) {
    return null;
  }

  return (
    <Link
      to={`/projects/detail/${findProject.id}`}
      onClick={(e) => e.stopPropagation()}
      className="flex border py-1 px-1 gap-1 items-center rounded min-h-[25px]"
    >
      <IconPicker
        size={12}
        variant="inline"
        value={
          typeof findProject.icon === "object"
            ? {
                ...findProject.icon,
                icon: parseEmojiFromUnicode(findProject.icon.icon),
              }
            : findProject.icon
              ? {
                  icon: parseEmojiFromUnicode(findProject.icon),
                  color: "#000000",
                  type: detectIconType(findProject.icon),
                }
              : undefined
        }
      />
      <div className="font-semibold">
        <span className="text-xs">{findProject.name}</span>
      </div>
    </Link>
  );
};
