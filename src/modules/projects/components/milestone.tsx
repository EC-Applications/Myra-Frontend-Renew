"use client";

import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { iProject } from "@/interfaces/project.interface";
import {
  deleteMilestoneUri,
  fetchMilestoneByProjectId,
  milesoneCreateUri,
  mileStoneUpdateUri,
  projectDetailFetchUri,
  updateProjectUri,
} from "@/services/project.service";
import {
  addMilestone,
  removeMilestone,
  updateMilestone,
} from "@/store/slices/milestone.slice";
import { nanoid } from "@reduxjs/toolkit";
import { format } from "date-fns";
import { Diamond, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "sonner";

interface iMilestone {
  id?: number;
  name: string;
  description: string;
  dueDate?: Date | string;
}

interface MilestoneSectionProps {
  project?: iProject;
  initialMilestones?: any[];
  workspaceId?: number;
  mode?: "create" | "update";
}

export default function MilestoneSection({
  project,
  initialMilestones = [],
  workspaceId,
  mode = "create",
}: MilestoneSectionProps) {
  const dispatch = useDispatch();
  const { id } = useParams();

  console.log("PROJECT ID", id);

  const reduxMilestones = useSelector((state: any) => state.milestone);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editId, setEditId] = useState<number>();
  const [milestones, setMilestones] = useState<iMilestone[]>([]);

  const [deleteMilestoneId, setdeleteMilestoneId] = useState<iMilestone>();

  const [milestoneName, setMilestoneName] = useState("");
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState<Date | undefined>();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === "update" && initialMilestones.length > 0) {
      // API data ko format karo
      const formatted = initialMilestones.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description || "",
        dueDate: m.target_date || undefined,
      }));
      setMilestones(formatted);
    } else if (mode === "create") {
      setMilestones(reduxMilestones || []);
    }
  }, [mode, initialMilestones, reduxMilestones]);

  const handleAddMilestone = async () => {
    if (!milestoneName.trim()) {
      toast.error("Milestone name is required");
      return;
    }
    const newMilestone: iMilestone = {
      id: undefined,
      name: milestoneName,
      description: milestoneDescription,
      dueDate: dueDate,
    };

    if (mode === "create") {
      // Create mode - Redux mein add karo
      dispatch(addMilestone(newMilestone as any));
      setMilestoneName("");
      setMilestoneDescription("");
      setDueDate(undefined);
      setIsAddingNew(false);
      toast.success("Milestone added");
      return;
    }

    // Update mode - API call
    if (!project || !workspaceId) {
      toast.error("Missing project information");
      return;
    }

    setSaving(true);

    // Optimistic update
    const updatedMilestones = [...milestones, newMilestone];
    setMilestones(updatedMilestones);

    try {
      const payload = {
        project_id: Number(id),
        name: milestoneName,
        description: milestoneDescription,
        target_date: dueDate ? dueDate.toISOString().split("T")[0] : "",
      };

      await milesoneCreateUri(payload);
      setMilestoneName("");
      setMilestoneDescription("");
      const res = await projectDetailFetchUri(Number(id));
      console.log("AFTER CRETA MILESTONE", res.data);

      setMilestones(res.data.milestones || []);

      setMilestoneName("");
      setMilestoneDescription("");
      setDueDate(undefined);
      setIsAddingNew(false);
      toast.success("Milestone added");
    } catch (error: any) {
      // Revert on error
      setMilestones(milestones);
      toast.error(error?.response?.data?.message || "Failed to add milestone");
      console.error("Add milestone error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (index: number, milestone: iMilestone) => {
    setEditId(milestone?.id);
    setEditingIndex(index);
    setEditName(milestone.name);
    setEditDescription(milestone.description || "");
    setEditDueDate(milestone.dueDate ? new Date(milestone.dueDate) : undefined);
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null || !editName.trim()) {
      toast.error("Milestone name is required");
      return;
    }

    if (!project || !workspaceId) {
      toast.error("Missing project information");
      return;
    }

    setSaving(true);
    const milestone = milestones[editingIndex];
    const originalMilestone = { ...milestone };

    const updatedMilestone = {
      ...milestone,
      name: editName,
      description: editDescription,
      dueDate: editDueDate,
    };
    const updatedMilestones = milestones.map((m, idx) =>
      idx === editingIndex ? updatedMilestone : m,
    );

    setMilestones(updatedMilestones);

    try {
      await mileStoneUpdateUri(milestone?.id, {
        project_id: project.id,
        name: editName,
        description: editDescription || "",
        target_date: editDueDate ? editDueDate.toISOString().split("T")[0] : "",
      });

      setEditingIndex(null);
      toast.success("Milestone updated");
    } catch (error) {
      // Revert
      setMilestones((prev) =>
        prev.map((m, idx) => (idx === editingIndex ? originalMilestone : m)),
      );
      toast.error("Failed to update milestone");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleRemove = async (index: number) => {
    const milestone = milestones[index];

    console.log("Deleting milestone", milestone.id);

    if (mode === "create") {
      dispatch(removeMilestone(index));
      toast.success("Milestone removed");
      return;
    }
    if (!milestone.id) {
      toast.error("Milestone ID not found");
      return;
    }

    const originalMilestones = [...milestones];
    setMilestones((prev) => prev.filter((_, idx) => idx !== index));

    try {
      await deleteMilestoneUri(milestone.id);
      toast.success("Milestone removed");
    } catch (error: any) {
      setMilestones(originalMilestones);
      toast.error(
        error?.response?.data?.message || "Failed to delete milestone",
      );
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="mb-5">
      <div className={`space-y-3  border dark:bg-card rounded-lg`}>
        <div className={`flex items-center justify-between p-2 ${isAddingNew ? "border-b" : "border-b-0"}`}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium  text-white">
              {isAddingNew ? "Create Milestones" : "Milestones"}
            </span>
            {milestones.length > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-muted-foreground bg-muted rounded dark:text-white" >
                {milestones.length}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="h-7 text-sm font-normal text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {milestones.length > 0 && (
          <div className="space-y-1.5">
            {milestones.map((m: iMilestone, index: number) => (
              <div
                key={m.id || index}
                className=" rounded-lg bg-card overflow-hidden"
              >
                {editingIndex === index ? (
                  <div className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Diamond className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Milestone name"
                          className="border-0 px-0 h-auto shadow-none focus-visible:ring-0 font-semibold text-base dark:bg-transparent dark:placeholder:text-[#626366]"
                        />
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <DatePicker
                        placeholder=""
                          value={editDueDate}
                          onChange={setEditDueDate}
                        />
                      </div>
                    </div>

                    <div className="ml-8 mb-4">
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Add a description..."
                        className="border-0 px-0 shadow-none focus-visible:ring-0 text-sm text-muted-foreground min-h-[60px] resize-none dark:bg-transparent font-semibold"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-sm font-semibold cursor-pointer"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="custom"
                        className="h-8 text-sm font-medium cursor-pointer"
                        onClick={handleSaveEdit}
                      >
                        Save milestone
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors cursor-pointer group"
                    onClick={() => handleEditClick(index, m)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Diamond className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-sm truncate">
                        {m.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {m.dueDate && (
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(m.dueDate), "MMM dd")}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();

                          handleRemove(index);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isAddingNew && (
          <div className="rounded-lg overflow-hidden">
            <div className="px-2 py-1">
              {/* <h3 className="text-sm font-medium mb-4">Create milestone</h3> */}

              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Diamond className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                  <Input
                    placeholder="Milestone name"
                    value={milestoneName}
                    onChange={(e) => setMilestoneName(e.target.value)}
                    className="border-0 px-0 h-auto shadow-none focus-visible:ring-0 text-base dark:bg-transparent dark:placeholder:text-[#626366] font-semibold"
                    autoFocus
                  />
                </div>
                <DatePicker value={dueDate} onChange={setDueDate} placeholder=""/>
              </div>

              <div className="ml-8 mb-4">
                <Textarea
                  placeholder="Add a description..."
                  value={milestoneDescription}
                  onChange={(e) => setMilestoneDescription(e.target.value)}
                  className="border-0 px-0 shadow-none focus-visible:ring-0 text-sm text-muted-foreground min-h-[60px] resize-none dark:bg-transparent dark:placeholder:text-[#626366] font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 pb-2 ">
                <Button
                  size="sm"
                  variant="customDark"
                  className="h-7.5 text-sm font-semibold "
                  onClick={() => setIsAddingNew(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="custom"
                  className="h-8 text-sm font-medium"
                  onClick={handleAddMilestone}
                >
                  Add milestone
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isAddingNew ? <div className="py-2"></div> : <div className=""></div>}
    </div>
  );
}
