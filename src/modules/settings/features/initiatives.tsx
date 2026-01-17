"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Info } from "lucide-react";
import { useState } from "react";

export function Initiatives() {
  const [enableInitiatives, setEnableInitiatives] = useState(true);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-white">Initiatives</h1>
        <p className="text-muted-foreground leading-relaxed">
          Initiatives group multiple projects that contribute toward the same
          strategic effort. Use initiatives to plan and coordinate larger
          streams of work and monitor their progress at scale.{" "}
          <a
            href="#"
            className="text-white hover:text-gray-300 inline-flex items-center gap-1"
          >
            Docs <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>

      {/* Enable Initiatives */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-white">
              Enable Initiatives
            </h3>
            <p className="text-sm text-muted-foreground">
              Visible to all non-guest workspace members
            </p>
          </div>
          <Switch
            checked={enableInitiatives}
            onCheckedChange={setEnableInitiatives}
          />
        </div>
      </div>

      {/* Initiative updates */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white">Initiative updates</h2>
          <p className="text-muted-foreground leading-relaxed">
            Short status reports about the progress and health of your
            initiative. Updates are ideally written regularly by the owner of
            the initiative. Subscribers receive these updates directly in their
            inbox. You can also configure a Slack channel where all initiative
            updates are posted.
          </p>
        </div>

        {/* Update schedule */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Update schedule</h3>
          <p className="text-muted-foreground">
            Configure how often updates are expected on initiatives. Initiative
            owners will receive reminders to post updates.
          </p>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white">No expectation for updates</span>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Slack notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">
            Slack notifications
          </h3>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523c0-1.393 1.127-2.52 2.52-2.52h2.52v2.52c0 1.396-1.127 2.523-2.52 2.523zm0-6.73c-1.393 0-2.52-1.127-2.52-2.52s1.127-2.52 2.52-2.52 2.52 1.127 2.52 2.52v2.52H5.042z" />
                    <path d="M12.042 5.165c0-1.393 1.127-2.52 2.523-2.52s2.52 1.127 2.52 2.52-1.127 2.52-2.52 2.52h-2.523V5.165zm6.73 0c0-1.393 1.127-2.52 2.52-2.52s2.52 1.127 2.52 2.52-1.127 2.52-2.52 2.52-2.52-1.127-2.52-2.52z" />
                    <path d="M18.772 12.042a2.528 2.528 0 0 1 2.52-2.523c1.393 0 2.52 1.127 2.52 2.523a2.528 2.528 0 0 1-2.52 2.52h-2.52v-2.52zm-6.73 0c0-1.393 1.127-2.523 2.52-2.523s2.523 1.13 2.523 2.523-1.13 2.52-2.523 2.52-2.52-1.127-2.52-2.52z" />
                    <path d="M12.042 18.772a2.528 2.528 0 0 1-2.52 2.52c-1.393 0-2.52-1.127-2.52-2.52s1.127-2.52 2.52-2.52h2.52v2.52zm0-6.73c0 1.393-1.127 2.52-2.52 2.52s-2.52-1.127-2.52-2.52 1.127-2.523 2.52-2.523 2.52 1.13 2.52 2.523z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <div className="text-white font-medium">
                    Send initiative updates to a Slack channel
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Connect a channel to send all initiative updates to
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
