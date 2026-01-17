import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function Connections() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Connected accounts
          </h1>
          <p className="text-muted-foreground">
            You can connect your Linear account with other apps and services
          </p>
        </div>

        {/* Slack Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">Slack</h2>
            <p className="text-sm text-muted-foreground">
              Connect Slack with Linear for real-time updates, issue creation,
              and seamless progress sharing
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#4A154B] rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    Slack account
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Link your Slack account and receive personal notifications
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 bg-transparent"
              >
                Connect
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* GitHub Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">GitHub</h2>
            <p className="text-sm text-muted-foreground">
              Connect GitHub to Linear to link issues with commits, PRs, and
              branches for a smoother workflow
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-foreground">
                Workspace not connected to GitHub
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 bg-transparent"
              >
                Workspace settings
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Google Calendar Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">
              Google Calendar
            </h2>
            <p className="text-sm text-muted-foreground">
              Sync Linear with Google Calendar to automate your out of office
              status
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#4285F4] rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    Google Calendar
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Display your out of office status in Linear
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 bg-transparent"
              >
                Connect
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Notion Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">Notion</h2>
            <p className="text-sm text-muted-foreground">
              Connect to preview Linear issues, views and projects in Notion
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#000000] rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    Connect personal account
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Connect your Notion account to use the integration
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 bg-transparent"
              >
                Connect
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
