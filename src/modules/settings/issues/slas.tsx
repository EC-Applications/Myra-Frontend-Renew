import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Info } from "lucide-react";

export default function SLAs() {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">SLAs</h1>
        <p className="text-muted-foreground leading-relaxed">
          Service-level agreements (SLAs) automatically apply deadlines to
          issues when they match predefined parameters. While often used to
          define response times to customer issues, they can also be used to
          define internal standards for bug and time-sensitive issue resolution.{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-muted-foreground hover:text-foreground"
          >
            Docs <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </p>
      </div>

      {/* Enable SLAs */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-medium text-foreground">
                Enable SLAs
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs bg-transparent"
              >
                <Info className="mr-1 h-3 w-3" />
                Upgrade
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Workspace-wide access to issue SLA automations and notifications
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      {/* Automation Rules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">
              Automation rules
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Use automation rules to automatically add or remove SLAs based on
              filters.
            </p>
          </div>
          <Button variant="outline">Add rule</Button>
        </div>
      </div>
    </div>
  );
}
