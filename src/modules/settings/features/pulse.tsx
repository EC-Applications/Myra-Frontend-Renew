"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function Pulse() {
  const [enablePulse, setEnablePulse] = useState(true);
  const [workspaceSchedule, setWorkspaceSchedule] = useState("Daily");
  const [personalSchedule, setPersonalSchedule] = useState("Never");

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Pulse</h1>
        <p className="text-muted-foreground">
          Pulse centralizes all your project updates into a single feed. Members
          can choose to receive summary notifications daily or weekly.
        </p>
      </div>

      {/* Enable Pulse */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-foreground">Enable Pulse</h3>
            <p className="text-sm text-muted-foreground">
              Workspace-wide feed of updates with optional summary notifications
            </p>
          </div>
          <Switch checked={enablePulse} onCheckedChange={setEnablePulse} />
        </div>
      </div>

      {/* Summary notifications */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">
            Summary notifications
          </h2>
          <p className="text-muted-foreground">
            Pulse summary notifications can be delivered in the mornings based
            on a set schedule
          </p>
        </div>

        <div className="space-y-4">
          {/* Default workspace schedule */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">
                  Default workspace schedule
                </h3>
                <p className="text-sm text-muted-foreground">
                  Applies to all members who haven't set their own preference
                </p>
              </div>
              <Select
                value={workspaceSchedule}
                onValueChange={setWorkspaceSchedule}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Your personal schedule */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">
                  Your personal schedule
                </h3>
                <p className="text-sm text-muted-foreground">
                  Only applies to you, overriding the workspace default
                </p>
              </div>
              <Select
                value={personalSchedule}
                onValueChange={setPersonalSchedule}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
