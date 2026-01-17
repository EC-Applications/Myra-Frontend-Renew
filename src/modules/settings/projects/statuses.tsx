"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Settings, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type {
  iProjectStatusUpdatePayload,
  ProjectCreatePayload,
  ProjectStatusPayload,
  ProjectSubStatus,
} from "@/interfaces/project.interface";
import { toast } from "sonner";
import {
  projectStatusCateogryUri,
  projectStatusCreateUri,
  projectStatusDelete,
  projectStatusUpdate,
} from "@/services/project.service";
import { projectCatetory } from "@/store/slices/status.slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useUser } from "@/hooks/use-user";

export default function Statuses() {
  const dispatch = useDispatch();
  const response = useSelector((state: any) => state.status);
  const categories = response?.status ?? [];
  const { currentWorkspace } = useUser();

  const [editingStatus, setEditingStatus] = useState<number | null>(null);
  const [editingSubStatus, setEditingSubStatus] = useState<number | null>(null);
  const [newStatusName, setNewStatusName] = useState("");
  const [newStatusDescription, setNewStatusDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create new status
  const handleSaveStatus = async () => {
    if (!newStatusName.trim() || editingStatus === null) {
      toast.error("Status name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: ProjectStatusPayload = {
        workspace_id: currentWorkspace?.id as number,
        status_id: editingStatus,
        name: newStatusName,
        description: newStatusDescription,
      };

      await projectStatusCreateUri(payload);
      toast.success("Status created successfully");

      // Refresh data
      const updatedData = await projectStatusCateogryUri(currentWorkspace?.id as number);
      dispatch(projectCatetory(updatedData.data));

      setNewStatusName("");
      setNewStatusDescription("");
      setEditingStatus(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to create status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (
      !newStatusName.trim() ||
      editingStatus === null ||
      editingSubStatus === null
    ) {
      toast.error("Status name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: iProjectStatusUpdatePayload = {
        workspace_id: currentWorkspace?.id,
        name: newStatusName,
        status_id: editingSubStatus,
      };

      await projectStatusUpdate(editingStatus, payload);
      toast.success("Status updated successfully");

      // Refresh data
      const updatedData = await projectStatusCateogryUri(currentWorkspace?.id as number);
      dispatch(projectCatetory(updatedData.data));

      setNewStatusName("");
      setNewStatusDescription("");
      setEditingStatus(null);
      setEditingSubStatus(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete status
  const handleDeleteStatus = async (sub_status_id: number) => {
    try {
      await projectStatusDelete(sub_status_id);
      toast.success("Status deleted successfully");

      // Refresh data
      const updatedData = await projectStatusCateogryUri(currentWorkspace?.id as number);
      dispatch(projectCatetory(updatedData.data));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete status");
    }
  };

  // Start editing a status
  const handleStartEdit = (categoryId: number, status: ProjectSubStatus) => {
    setEditingStatus(categoryId);
    setEditingSubStatus(status.id);
    setNewStatusName(status.name as string);
    setNewStatusDescription((status.description || "") as string);
  };

  const handleCancelEdit = () => {
    setEditingStatus(null);
    setEditingSubStatus(null);
    setNewStatusName("");
    setNewStatusDescription("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold pt-[80px]">Project statuses</h1>
        <p className="text-muted-foreground">
          Project statuses define the workflow that projects go through from
          start to completion
        </p>
      </div>

      <div className="space-y-4 pt-8">
        {categories.map((category: any) => (
          <div
            key={category.id}
            className="bg-card border border-border rounded-lg"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-sm font-medium text-muted-foreground">
                {category.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => {
                  setEditingStatus(category.id);
                  setEditingSubStatus(null);
                  setNewStatusName("");
                  setNewStatusDescription("");
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4">
              {/* Existing Sub Statuses */}
              {category.sub_statuses?.map((status: ProjectSubStatus) => (
                <div key={status.id} className="space-y-4">
                  {/* Show edit form if this status is being edited */}
                  {editingStatus === category.id &&
                  editingSubStatus === status.id ? (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-8 h-8 rounded flex items-center justify-center">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={newStatusName}
                          onChange={(e) => setNewStatusName(e.target.value)}
                          placeholder="Name"
                          className="bg-background flex-1"
                          disabled={isSubmitting}
                        />
                        <Input
                          value={newStatusDescription}
                          onChange={(e) =>
                            setNewStatusDescription(e.target.value)
                          }
                          placeholder="Description..."
                          className="bg-background flex-1"
                          disabled={isSubmitting}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleUpdateStatus}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Updating..." : "Update"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 mt-2 group">
                      <div className="flex items-center gap-3">
                        <img src={status.icon} alt="" />
                        {/* <div className="w-8 h-8 rounded flex items-center justify-center"></div> */}
                        <span className="text-sm font-medium">
                          {status.name}
                        </span>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-[180px] rounded-xl border  p-1 shadow-md "
                        >
                          {/* Edit */}
                          <DropdownMenuItem
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer focus:bg-gray-600"
                            onClick={() => handleStartEdit(category.id, status)}
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                            <span>Edit</span>
                          </DropdownMenuItem>

                          {/* Delete */}
                          <DropdownMenuItem
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer focus:bg-red-50 text-red-600"
                            onClick={() => handleDeleteStatus(status.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              ))}

              {/* Add New Status Form - only show if not editing existing status */}
              {editingStatus === category.id && editingSubStatus === null && (
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={newStatusName}
                      onChange={(e) => setNewStatusName(e.target.value)}
                      placeholder="Name"
                      className="bg-background flex-1"
                      disabled={isSubmitting}
                    />
                    <Input
                      value={newStatusDescription}
                      onChange={(e) => setNewStatusDescription(e.target.value)}
                      placeholder="Description..."
                      className="bg-background flex-1"
                      disabled={isSubmitting}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveStatus}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
