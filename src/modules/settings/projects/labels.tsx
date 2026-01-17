import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Plus,
  X,
  Check,
  Pencil,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type {
  iGroupPayload,
  iLabel,
  iLabelPayLoad,
} from "@/interfaces/label.interface";
import {
  createLableUri,
  delelteLabelUri,
  getLabelListUri,
  updateLabelUri,
} from "@/services/general.service";
import { setLabel } from "@/store/slices/label.slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { formatDateToMonthDay } from "@/components/date-converter";
import { useUser } from "@/hooks/use-user";

const COLOR_OPTIONS = [
  { name: "Red", value: "bg-red-500", hex: "#EF4444" },
  { name: "Orange", value: "bg-orange-500", hex: "#F97316" },
  { name: "Yellow", value: "bg-yellow-500", hex: "#EAB308" },
  { name: "Green", value: "bg-green-500", hex: "#22C55E" },
  { name: "Blue", value: "bg-blue-500", hex: "#3B82F6" },
  { name: "Purple", value: "bg-purple-500", hex: "#A855F7" },
  { name: "Pink", value: "bg-pink-500", hex: "#EC4899" },
  { name: "Gray", value: "bg-gray-500", hex: "#6B7280" },
];

export function Labels() {
  const dispatch = useDispatch();
  const response = useSelector((state: any) => state.label);
  const labels = Array.isArray(response) ? response : response?.labels || [];
  const workspace = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingLabel, setEditingLabel] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescriptionId, setEditingDescriptionId] = useState<
    number | null
  >(null);
  const [editingDescription, setEditingDescription] = useState("");
  // Create Label States (Inline Form)
  const [isCreating, setIsCreating] = useState(false);
  const [group, setGroup] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelDescription, setNewLabelDescription] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("bg-blue-500");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingColor, setEditingColor] = useState("");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  const handleCreateLabel = async (isGroup: boolean) => {
    if (isGroup ? !newGroupName : !newLabelName.trim()) {
      toast.error(
        ` ${isGroup ? "Group name is required" : "Label name is required"} `
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedColorHex = COLOR_OPTIONS.find(
        (c) => c.value === newLabelColor
      )?.hex;

      const payload: iLabelPayLoad = {
        name: newLabelName,
        description: newLabelDescription,
        color: selectedColorHex,
      };

      const groupayload: iLabelPayLoad = {
        name: newLabelName,
        description: newLabelDescription,
        color: selectedColorHex,
        label_group_description: newGroupDescription,
        label_group_name: newGroupName,
      };

      await createLableUri(isGroup ? groupayload : payload);
      toast.success("Label created successfully");

      // Refresh labels
      const updatedLabels = await getLabelListUri(
        Number(workspace.currentWorkspace?.id)
      );
      dispatch(setLabel(updatedLabels.data));

      // Reset form
      setNewLabelName("");
      setNewLabelDescription("");
      setNewLabelColor("bg-blue-500");
      setIsCreating(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create label");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGroupCreate = async () => {
    if (!newGroupName.trim()) {
      toast.error("Group name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedColorHex = COLOR_OPTIONS.find(
        (c) => c.value === newLabelColor
      )?.hex;

      const groupayload: iLabelPayLoad = {
        label_group_description: newGroupDescription,
        color: selectedColorHex,
        label_group_name: newGroupName,
      };

      await createLableUri(groupayload);
      toast.success("Group created successfully");

      const updatedLabels = await getLabelListUri(
        Number(workspace.currentWorkspace?.id)
      );
      dispatch(setLabel(updatedLabels.data));

      setNewGroupName("");
      setNewGroupDescription("");

      setNewLabelColor("bg-blue-500");
      setIsCreating(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create label");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelCreate = () => {
    setNewLabelName("");
    setNewLabelDescription("");
    setNewLabelColor("bg-blue-500");
    setIsCreating(false);
    setGroup(false);
  };

  const handleEditStart = (label: iLabel) => {
    setEditingLabel(label.id);
    setEditingName(label.name as string);
    setEditingDescription(label.description as string);
    setEditingColor(label.color as string);

    // Dropdown close hone ke baad focus
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);
  };

  const handleEditSave = async () => {
    if (!editingLabel || !editingName.trim()) {
      toast.error("Label name is required");
      return;
    }

    const loadingToast = toast.loading("Updating label...");

    try {
      const payload: iLabelPayLoad = {
        name: editingName,
        description: editingDescription,
        color: editingColor,
        // label_group_id: 0,
      };

      await updateLabelUri(editingLabel, payload);

      toast.dismiss(loadingToast);
      toast.success("Label updated successfully");

      const updatedLabels = await getLabelListUri(
        Number(workspace.currentWorkspace?.id)
      );
      dispatch(setLabel(updatedLabels.data));

      setEditingLabel(null);
      setEditingName("");
      setEditingDescription("");
      setEditingColor("");
      setEditingDescriptionId(null);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Failed to update label");
    }
  };

  const handleDescriptionEditStart = (label: iLabel) => {
    setEditingLabel(label.id);
    setEditingName(label.name as string);
    setEditingDescriptionId(label.id);
    setEditingDescription(label.description as string);
    setEditingColor(label.color as string);

    setTimeout(() => {
      descriptionInputRef.current?.focus();
    }, 0);
  };

  const handleEditCancel = () => {
    setEditingLabel(null);
    setEditingName("");
  };

  const handleDeleteLabel = async (labelId: number) => {
    const loadingToast = toast.loading("Deleting label...");

    try {
      await delelteLabelUri(labelId);

      toast.dismiss(loadingToast);
      toast.success("Label deleted successfully");

      const updatedLabels = await getLabelListUri(
        Number(workspace.currentWorkspace?.id)
      );
      dispatch(setLabel(updatedLabels.data));
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Failed to delete label");
    }
  };

  const filteredLabels = Array.isArray(labels)
    ? labels.filter((label) =>
        label.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="w-full mx-auto p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Project labels
        </h1>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGroup(true)}
            disabled={group}
          >
            New group
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreating(true)}
            disabled={isCreating}
          >
            <Plus className="h-4 w-4 mr-2" />
            New label
          </Button>
        </div>
      </div>

      {/* Labels Table */}
      <div>
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-sm text-muted-foreground">
          <div className="col-span-3">Name ↓</div>
          <div className="col-span-4">Description</div>
          <div className="col-span-2">Projects</div>
          <div className="col-span-2">Last applied</div>
          <div className="col-span-1">Created</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border">
          {/* Inline Create Form */}
          {(isCreating || group) && (
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted/20 border-b border-border">
              {/* Name + Color Picker */}
              <div className="col-span-3 flex items-center gap-3">
                {!group && (
                  <div className="relative">
                    {/* Selected color dot */}
                    <div
                      className={`w-3 h-3 rounded-full ${newLabelColor} cursor-pointer`}
                      onClick={() => setIsColorPickerOpen((prev) => !prev)}
                    />

                    {/* Color picker */}
                    {isColorPickerOpen && (
                      <div className="absolute top-6 left-0 bg-popover border border-border rounded-lg p-2 shadow-lg z-50">
                        <div className="flex gap-1">
                          {COLOR_OPTIONS.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => {
                                setNewLabelColor(color.value);
                                setIsColorPickerOpen(false);
                              }}
                              className={`w-6 h-6 rounded-full hover:scale-110 transition-transform
                ${
                  newLabelColor === color.value
                    ? "ring-2 ring-primary ring-offset-1"
                    : ""
                }
              `}
                              title={color.name}
                              style={{ backgroundColor: color.hex }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Input
                  placeholder={group ? "Group name" : "Label name"}
                  value={group ? newGroupName : newLabelName}
                  onChange={(e) =>
                    group
                      ? setNewGroupName(e.target.value)
                      : setNewLabelName(e.target.value)
                  }
                  className="h-8 text-sm bg-background"
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>

              {/* Description */}
              <div className="col-span-4 flex items-center">
                <Input
                  placeholder={
                    group ? "Group description" : "Label description"
                  }
                  value={group ? newGroupDescription : newLabelDescription}
                  onChange={(e) =>
                    group
                      ? setNewGroupDescription(e.target.value)
                      : setNewLabelDescription(e.target.value)
                  }
                  className="h-8 text-sm bg-background"
                  disabled={isSubmitting}
                />
              </div>

              <div className="col-span-2"></div>
              <div className="col-span-2"></div>

              {/* Actions */}
              <div className="col-span-1 flex items-center gap-1 justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelCreate}
                  className="h-8 w-8 p-0"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    group ? handleGroupCreate() : handleCreateLabel(group)
                  }
                  className="h-8 w-8 p-0"
                  disabled={isSubmitting}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
              </div>
            </div>
          )}

          {/* Existing Labels */}
          {filteredLabels.map((label) => (
            <div
              key={label.id}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/50 transition-colors group"
            >
              <div className="col-span-3 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${label.color}`} />
                {editingLabel === label.id ? (
                  <Input
                    ref={nameInputRef}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleEditSave();
                      }

                      if (e.key === "Escape") {
                        setEditingLabel(null);
                        setEditingName("");
                        setEditingDescription("");
                        setEditingColor("");
                      }
                    }}
                    className="h-8 text-sm flex-1"
                  />
                ) : (
                  <div
                    className="text-foreground cursor-text text-sm flex-1 px-2 py-1 rounded-md border border-transparent hover:border-border transition-all"
                    onClick={() => handleEditStart(label)}
                  >
                    {label.name}
                  </div>
                )}
              </div>

              <div className="col-span-4 flex items-center">
                <div className="col-span-4 flex items-center">
                  {editingDescriptionId === label.id ? (
                    <Input
                      ref={descriptionInputRef}
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleEditSave();
                        }

                        if (e.key === "Escape") {
                          setEditingDescriptionId(null);
                          setEditingDescription("");
                        }
                      }}
                      onBlur={() => {
                        setEditingDescriptionId(null);
                        setEditingDescription("");
                      }}
                      className="h-8 text-sm flex-1"
                      autoFocus={false}
                    />
                  ) : (
                    <div
                      className="
        text-sm text-muted-foreground
        flex-1 px-2 py-1
        rounded-md
        border border-transparent
        hover:border-border
        transition-all
        cursor-text
      "
                      onClick={() => handleDescriptionEditStart(label)}
                    >
                      {label.description || ""}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2 flex items-center">
                <span className="text-sm text-muted-foreground">
                  {/* Projects count */}
                </span>
              </div>

              <div className="col-span-2 flex items-center">
                <span className="text-sm text-muted-foreground">
                  {/* Last applied date */}
                </span>
              </div>

              <div className="col-span-1 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {formatDateToMonthDay(label.created_at)}
                </span>

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
                    className="w-[180px] rounded-xl border bg-card p-1 shadow-md"
                  >
                    {/* Edit */}
                    <DropdownMenuItem
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer focus:bg-gray-600"
                      onClick={() => handleEditStart(label)}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                      <span>Edit</span>
                    </DropdownMenuItem>

                    {/* Delete */}
                    <DropdownMenuItem
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer focus:bg-gray-600 "
                      onClick={() => handleDeleteLabel(label.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
