import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Check,
  ChevronDown,
  Circle,
  Clock,
  Github,
  Gitlab,
  Plus,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";

interface ProjectStatus {
  id: string;
  name: string;
  description?: string;
  icon: React.ReactNode;
}

interface StatusCategory {
  id: string;
  name: string;
  statuses: ProjectStatus[];
}
export function IssueStatusesAutomation() {
  const [categories] = useState<StatusCategory[]>([
    {
      id: "backlog",
      name: "Backlog",
      statuses: [
        {
          id: "backlog-status",
          name: "Backlog",
          icon: <Settings className="w-4 h-4 text-orange-500" />,
        },
      ],
    },
    {
      id: "planned",
      name: "Planned",
      statuses: [
        {
          id: "planned-status",
          name: "Planned",
          icon: <Circle className="w-4 h-4 text-gray-400" />,
        },
      ],
    },
    {
      id: "in-progress",
      name: "In Progress",
      statuses: [
        {
          id: "in-progress-status",
          name: "In Progress",
          icon: <Clock className="w-4 h-4 text-yellow-500" />,
        },
      ],
    },
    {
      id: "completed",
      name: "Completed",
      statuses: [
        {
          id: "completed-status",
          name: "Completed",
          icon: <Check className="w-4 h-4 text-blue-500" />,
        },
      ],
    },
    {
      id: "canceled",
      name: "Canceled",
      statuses: [
        {
          id: "canceled-status",
          name: "Canceled",
          icon: <X className="w-4 h-4 text-gray-400" />,
        },
      ],
    },
  ]);

  const [editingStatus, setEditingStatus] = useState<string | null>(
    "backlog-status"
  );
  const [newStatusName, setNewStatusName] = useState("");
  const [newStatusDescription, setNewStatusDescription] = useState("");

  const handleSaveStatus = () => {
    setEditingStatus(null);
    setNewStatusName("");
    setNewStatusDescription("");
  };

  const handleCancelEdit = () => {
    setEditingStatus(null);
    setNewStatusName("");
    setNewStatusDescription("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Issue statuses & automations
        </h1>
        <p className="text-muted-foreground">
          Issue statuses define the workflow that issues go through from start
          to completion. Here you can customize these statuses and automate how
          issues progress through them.
        </p>
      </div>

      {/* Status Categories */}

      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-card border border-border rounded-lg"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-sm font-medium text-muted-foreground">
                {category.name}
              </h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4">
              {category.statuses.map((status) => (
                <div key={status.id}>
                  {editingStatus === status.id ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500/20 rounded flex items-center justify-center">
                          {status.icon}
                        </div>
                        <span className="text-sm font-medium">
                          {status.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          <Settings className="w-4 h-4" />
                        </div>
                        <div className="flex-1 flex gap-2">
                          <Input
                            value={newStatusName}
                            onChange={(e) => setNewStatusName(e.target.value)}
                            placeholder="Name"
                            className="bg-background flex-1"
                          />
                          <Input
                            value={newStatusDescription}
                            onChange={(e) =>
                              setNewStatusDescription(e.target.value)
                            }
                            placeholder="Description..."
                            className="bg-background flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSaveStatus}>
                            Create
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        {status.icon}
                      </div>
                      <span className="text-sm font-medium">{status.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Duplicate Issue Status */}
      <div className="space-y-4 pt-4 pb-8">
        <div className="border border-border rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-foreground">
            <h3 className="text-sm font-semibold text-foreground">
              Duplicate issue status
            </h3>
            <p className="text-xs text-muted-foreground">
              Status issues move to when marked as a duplicate
            </p>
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-transparent"
              >
                <span className="w-2 h-2 bg-gray-500 rounded-full mr-2" />
                Duplicate
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Canceled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Pull Request Automations */}
      <div className="space-y-4 pt-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            Pull request automations
          </h3>
          <p className="text-xs text-muted-foreground">
            With Git integrations, you can automate issue workflows when opening
            or merging a pull request
          </p>
        </div>
        <div className="space-y-3 border border-border rounded-lg divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Github className="w-5 h-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">
                GitHub
              </span>
            </div>
            <Button variant="outline" size="sm">
              Connect
              <span className="ml-1">↗</span>
            </Button>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Gitlab className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-foreground">
                GitLab
              </span>
            </div>
            <Button variant="outline" size="sm">
              Connect
              <span className="ml-1">↗</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Auto-close Automations */}
      <div className="space-y-4 pt-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            Auto-close automations
          </h3>
          <p className="text-xs text-muted-foreground">
            Automate closing issues based on status changes to related issues,
            staleness, etc.
          </p>
        </div>

        <div className="space-y-3 border border-border rounded-lg divide-y divide-border">
          {/* Auto-close parent issues */}
          <div className="flex items-start justify-between p-4">
            <div className="space-y-1 flex-1">
              <p className="text-sm font-medium text-foreground">
                Auto-close parent issues
              </p>
              <p className="text-xs text-muted-foreground">
                Automatically close an open parent issue when its last sub-issue
                is closed
              </p>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 mt-1"
              disabled
              defaultChecked={false}
            />
          </div>

          {/* Auto-close sub-issues */}
          <div className="flex items-start justify-between p-4">
            <div className="space-y-1 flex-1">
              <p className="text-sm font-medium text-foreground">
                Auto-close sub-issues
              </p>
              <p className="text-xs text-muted-foreground">
                Automatically close all sub-issues when their parent issue is
                closed
              </p>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 mt-1"
              disabled
              defaultChecked={false}
            />
          </div>

          {/* Auto-close stale issues */}
          <div className="flex items-start justify-between p-4">
            <div className="space-y-1 flex-1">
              <p className="text-sm font-medium text-foreground">
                Auto-close stale issues
              </p>
              <p className="text-xs text-muted-foreground">
                Automatically close issues that haven&apos;t been completed,
                canceled, or updated in...
              </p>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 mt-1"
              defaultChecked={true}
            />
          </div>

          {/* Close after being stale for */}
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-foreground">
              Close after being stale for
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  6 months
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>3 months</DropdownMenuItem>
                <DropdownMenuItem>6 months</DropdownMenuItem>
                <DropdownMenuItem>1 year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* When closing stale issues, set status to */}
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-foreground">
              When closing stale issues, set status to
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-2" />
                  Canceled
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Canceled</DropdownMenuItem>
                <DropdownMenuItem>Done</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Auto-archive */}
      <div className="space-y-4 pt-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            Auto-archive closed issues, cycles, and projects
          </h3>
          <p className="text-xs text-muted-foreground">
            Closed (completed or canceled) issues, cycles, and projects are
            automatically archived after the set time period. Issues in cycles
            or projects will only be archived after the cycle or project has
            been archived. Changes apply within a day.
          </p>
        </div>
        <div className="border border-border rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-foreground">
            Auto-archive closed items after
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                6 months
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>3 months</DropdownMenuItem>
              <DropdownMenuItem>6 months</DropdownMenuItem>
              <DropdownMenuItem>1 year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Re-order issues */}
      <div className="space-y-4 pt-4 pb-8">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            Re-order issues when moved to a new status
          </h3>
          <p className="text-xs text-muted-foreground">
            Define how issues should be ordered as they progress. Unless no
            action is chosen, issues moving to a previous status are always
            placed at the top of that status. This affects manual ordering.
          </p>
        </div>
        <div className="border border-border rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-foreground">
            When progressing status, place issues...
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                First
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>First</DropdownMenuItem>
              <DropdownMenuItem>Last</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
