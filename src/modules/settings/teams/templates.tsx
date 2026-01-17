import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export function Templates() {
  const [issueTeamTemplate, setIssueTeamTemplate] = useState("None");
  const [issueNonTeamTemplate, setIssueNonTeamTemplate] = useState("None");
  const [projectTemplate, setProjectTemplate] = useState("None");
  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-foreground mb-4">
        Team templates
      </h1>

      {/* Description */}
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Any templates created here will be available when creating issues,
        projects, and documents within this team. To create templates that apply
        to all teams, do so in the workspace{" "}
        <span className="font-semibold text-foreground">issue</span>,{" "}
        <span className="font-semibold text-foreground">project</span>, or{" "}
        <span className="font-semibold text-foreground">document</span>{" "}
        templates sections.{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Docs ↗
        </a>
      </p>

      {/* Issue Templates Section */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Issue templates
        </h2>

        <div className="border border-border rounded-lg bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-sm text-muted-foreground">
              1 issue template
            </span>
            <Link to="./issues/new">
              <Button variant="ghost" size="icon">
                <Plus />
              </Button>
            </Link>
          </div>

          <div className="p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-muted text-muted-foreground">
              <span className="text-xs">⚙</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Test</p>
              <p className="text-sm text-muted-foreground">
                Created by Abdur Rehman 4 minutes ago
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Default Issue Template Section */}
      <div className="mb-12">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Default issue template
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Used to pre-select a template when creating an issue for this team.
        </p>

        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between">
              <label className="text-foreground font-medium">
                Issues created by team members
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded text-foreground text-sm hover:bg-accent transition-colors">
                    {issueTeamTemplate}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setIssueTeamTemplate("None")}
                  >
                    None
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIssueTeamTemplate("Test")}
                  >
                    Test
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between">
              <label className="text-foreground font-medium">
                Issues created by non-team members
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded text-foreground text-sm hover:bg-accent transition-colors">
                    {issueNonTeamTemplate}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setIssueNonTeamTemplate("None")}
                  >
                    None
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIssueNonTeamTemplate("Test")}
                  >
                    Test
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Project Templates Section */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Project templates
        </h2>

        <div className="border border-border rounded-lg bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-sm text-muted-foreground">
              1 project template
            </span>
            <Link to="./projects/new">
              <Button variant="ghost" size="icon">
                <Plus />
              </Button>
            </Link>
          </div>

          <div className="p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-muted text-muted-foreground">
              <span className="text-xs">⚙</span>
            </div>
            <div>
              <p className="font-medium text-foreground">hgfd</p>
              <p className="text-sm text-muted-foreground">
                Created by Abdur Rehman 1 minute ago
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Default Project Template Section */}
      <div className="mb-12">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Default project template
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Used to pre-select a template when creating a project for this team.
        </p>

        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between">
            <label className="text-foreground font-medium">
              Projects created
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded text-foreground text-sm hover:bg-accent transition-colors">
                  {projectTemplate}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setProjectTemplate("None")}>
                  None
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setProjectTemplate("hgfd")}>
                  hgfd
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Document Templates Section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Document templates
        </h2>

        <div className="border border-border rounded-lg bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">No document templates</span>
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-accent rounded transition-colors">
              <Link to="./documents/new">
                <Button variant="ghost" size="sm">
                  <Plus /> New template
                </Button>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
