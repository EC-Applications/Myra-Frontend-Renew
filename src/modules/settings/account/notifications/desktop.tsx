"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ExternalLink } from "lucide-react";

export default function DesktopNotifications() {
  const [notifications, setNotifications] = useState({
    assignments: true,
    statusChanges: true,
    commentsAndReplies: true,
    mentions: true,
    reactions: false,
    subscriptions: true,
    documentChanges: true,
    updates: true,
    remindersAndDeadlines: true,
    appsAndIntegrations: true,
    customerRequests: true,
    triage: true,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Desktop</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Applies across all your desktop devices with notifications enabled
          </p>
        </div>

        {/* Installation Card */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Desktop notifications require an installation of MyRa Desktop
            </span>
            <Button variant="outline" size="sm" className="ml-4 bg-transparent">
              Get MyRa Desktop
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* General notifications */}
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4">
            General notifications
          </h2>
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Assignments</div>
                <div className="text-sm text-muted-foreground">
                  Assignments, unassignments, and membership changes
                </div>
              </div>
              <Switch
                checked={notifications.assignments}
                onCheckedChange={() => handleNotificationChange("assignments")}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">
                  Status changes
                </div>
                <div className="text-sm text-muted-foreground">
                  Changes to the status, priority, and blocking relationships of
                  issues
                </div>
              </div>
              <Switch
                checked={notifications.statusChanges}
                onCheckedChange={() =>
                  handleNotificationChange("statusChanges")
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">
                  Comments and replies
                </div>
                <div className="text-sm text-muted-foreground">
                  Comments, replies, and thread resolutions
                </div>
              </div>
              <Switch
                checked={notifications.commentsAndReplies}
                onCheckedChange={() =>
                  handleNotificationChange("commentsAndReplies")
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Mentions</div>
                <div className="text-sm text-muted-foreground">
                  Mentions in comments or content
                </div>
              </div>
              <Switch
                checked={notifications.mentions}
                onCheckedChange={() => handleNotificationChange("mentions")}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Reactions</div>
                <div className="text-sm text-muted-foreground">
                  Emoji reactions to your content
                </div>
              </div>
              <Switch
                checked={notifications.reactions}
                onCheckedChange={() => handleNotificationChange("reactions")}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Subscriptions</div>
                <div className="text-sm text-muted-foreground">
                  Issues, projects, initiatives, teams, and views you're
                  subscribed to
                </div>
              </div>
              <Switch
                checked={notifications.subscriptions}
                onCheckedChange={() =>
                  handleNotificationChange("subscriptions")
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">
                  Document changes
                </div>
                <div className="text-sm text-muted-foreground">
                  Changes to document content, location, and subscriptions
                </div>
              </div>
              <Switch
                checked={notifications.documentChanges}
                onCheckedChange={() =>
                  handleNotificationChange("documentChanges")
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Updates</div>
                <div className="text-sm text-muted-foreground">
                  New project & initiative updates and reminders to post an
                  update
                </div>
              </div>
              <Switch
                checked={notifications.updates}
                onCheckedChange={() => handleNotificationChange("updates")}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">
                  Reminders and deadlines
                </div>
                <div className="text-sm text-muted-foreground">
                  Reminders, due dates, and SLA updates
                </div>
              </div>
              <Switch
                checked={notifications.remindersAndDeadlines}
                onCheckedChange={() =>
                  handleNotificationChange("remindersAndDeadlines")
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">
                  Apps and integrations
                </div>
                <div className="text-sm text-muted-foreground">
                  Requests related to OAuth apps and integrations
                </div>
              </div>
              <Switch
                checked={notifications.appsAndIntegrations}
                onCheckedChange={() =>
                  handleNotificationChange("appsAndIntegrations")
                }
              />
            </div>
          </div>
        </div>

        {/* Feature notifications */}
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4">
            Feature notifications
          </h2>
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">
                  Customer requests
                </div>
                <div className="text-sm text-muted-foreground">
                  Requests from your customers
                </div>
              </div>
              <Switch
                checked={notifications.customerRequests}
                onCheckedChange={() =>
                  handleNotificationChange("customerRequests")
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Triage</div>
                <div className="text-sm text-muted-foreground">
                  Issues added to triage
                </div>
              </div>
              <Switch
                checked={notifications.triage}
                onCheckedChange={() => handleNotificationChange("triage")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
