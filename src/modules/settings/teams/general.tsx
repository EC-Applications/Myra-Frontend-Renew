"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function General() {
  const [timezone, setTimezone] = useState("GMT+5:00 - Pakistan Standard Time");
  const [issueEstimation, setIssueEstimation] = useState("Not in use");
  const [enableEmailCreation, setEnableEmailCreation] = useState(false);
  const [enableDetailedHistory, setEnableDetailedHistory] = useState(false);

  return (
    <div className="min-h-screen text-foreground p-6">
      {/* Main Content */}
      <div className="w-full max-w-3xl mx-auto ">
        <h1 className="text-2xl font-semibold mb-8">General</h1>

        {/* Timezone Section */}
        <div className="mb-12">
          <h2 className="text-lg font-medium mb-3">Timezone</h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            The timezone should be set as the location where most of your team
            members reside. All other times referenced by the team will be
            relative to this timezone setting. For example, if the team uses
            cycles, each cycle will start at midnight in the specified timezone.
          </p>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Timezone</span>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="w-80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GMT+5:00 - Pakistan Standard Time">
                      GMT+5:00 - Pakistan Standard Time
                    </SelectItem>
                    <SelectItem value="GMT+0:00 - Greenwich Mean Time">
                      GMT+0:00 - Greenwich Mean Time
                    </SelectItem>
                    <SelectItem value="GMT-5:00 - Eastern Standard Time">
                      GMT-5:00 - Eastern Standard Time
                    </SelectItem>
                    <SelectItem value="GMT-8:00 - Pacific Standard Time">
                      GMT-8:00 - Pacific Standard Time
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estimates Section */}
        <div className="mb-12">
          <h2 className="text-lg font-medium mb-3">Estimates</h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Estimates are a great way of communicating the complexity of each
            issue or to calculate whether a cycle has more room left. Below you
            can choose how your team estimates issue complexity.
          </p>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Issue estimation</span>
                <Select
                  value={issueEstimation}
                  onValueChange={setIssueEstimation}
                >
                  <SelectTrigger className="w-80 ">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not in use">Not in use</SelectItem>
                    <SelectItem value="Linear scale">Linear scale</SelectItem>
                    <SelectItem value="Fibonacci">Fibonacci</SelectItem>
                    <SelectItem value="T-shirt sizes">T-shirt sizes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create issues by email Section */}
        <div className="mb-12">
          <h2 className="text-lg font-medium mb-3">Create issues by email</h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Use a team-specific email address to create and collaborate on
            issues via email
          </p>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Enable issue creation by email
                </span>
                <Switch
                  checked={enableEmailCreation}
                  onCheckedChange={setEnableEmailCreation}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Other Section */}
        <div className="mb-12">
          <h2 className="text-lg font-medium mb-3">Other</h2>
          <Card>
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium mb-2">
                    Enable detailed issue history
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Each change to an issue receives and persists a distinct
                    history entry, creating a more detailed history for auditing
                    purposes.
                  </p>
                </div>
                <Switch
                  checked={enableDetailedHistory}
                  onCheckedChange={setEnableDetailedHistory}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
