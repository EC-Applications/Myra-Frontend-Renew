// components/modals/edit-milestone-modal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Diamond } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import type { iMilestone } from "@/interfaces/milestone.interface";


interface EditMilestoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone: iMilestone;
  onSave: (milestone: iMilestone) => void;
}

export function EditMilestoneModal({
  open,
  onOpenChange,
  milestone,
  onSave,
}: EditMilestoneModalProps) {
  const [name, setName] = useState(milestone.name);
  const [description, setDescription] = useState(milestone.description);
  const [dueDate, setDueDate] = useState<Date | undefined>(milestone.dueDate);

  useEffect(() => {
    setName(milestone.name);
    setDescription(milestone.description);
    setDueDate(milestone.dueDate);
  }, [milestone]);

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name,
      description,
      dueDate,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-normal text-muted-foreground">
            Edit milestone
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name and Date */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Diamond className="h-4 w-4 text-muted-foreground" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Milestone name"
                className="border-0 px-0 shadow-none focus-visible:ring-0 font-medium"
              />
            </div>
            <DatePicker value={dueDate} onChange={setDueDate} />
          </div>

          {/* Description */}
          <div className="ml-7">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              className="border-0 px-0 shadow-none focus-visible:ring-0 text-sm text-muted-foreground min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save milestone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}