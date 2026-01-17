"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export default function SlackNotifications() {
  const [enableSlack, setEnableSlack] = useState(false);
  const [assignments, setAssignments] = useState(true);
  const [statusChanges, setStatusChanges] = useState(true);
  const [commentsReplies, setCommentsReplies] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [reactions, setReactions] = useState(true);
  const [subscriptions, setSubscriptions] = useState(true);
  const [documentChanges, setDocumentChanges] = useState(true);
  const [updates, setUpdates] = useState(true);
  const [remindersDeadlines, setRemindersDeadlines] = useState(true);
  const [appsIntegrations, setAppsIntegrations] = useState(true);
  const [customerRequests, setCustomerRequests] = useState(true);
  const [triage, setTriage] = useState(true);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-8">Slack</h1>

          {/* Connection Status */}
          <div className="bg-card border border-border rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">
                  Personal Slack account not connected
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Connected accounts
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* General notifications */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-foreground">
              General notifications
            </h2>
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Assignments
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Assignments, unassignments, and membership changes
                  </div>
                </div>
                <Switch
                  checked={assignments}
                  onCheckedChange={setAssignments}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Status changes
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Changes to the status, priority, and blocking relationships
                    of issues
                  </div>
                </div>
                <Switch
                  checked={statusChanges}
                  onCheckedChange={setStatusChanges}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Comments and replies
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Comments, replies, and thread resolutions
                  </div>
                </div>
                <Switch
                  checked={commentsReplies}
                  onCheckedChange={setCommentsReplies}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Mentions
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Mentions in comments or content
                  </div>
                </div>
                <Switch checked={mentions} onCheckedChange={setMentions} />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Reactions
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Emoji reactions to your content
                  </div>
                </div>
                <Switch checked={reactions} onCheckedChange={setReactions} />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Subscriptions
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Issues, projects, initiatives, teams, and views you're
                    subscribed to
                  </div>
                </div>
                <Switch
                  checked={subscriptions}
                  onCheckedChange={setSubscriptions}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Document changes
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Changes to document content, location, and subscriptions
                  </div>
                </div>
                <Switch
                  checked={documentChanges}
                  onCheckedChange={setDocumentChanges}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Updates
                  </div>
                  <div className="text-sm text-muted-foreground">
                    New project & initiative updates and reminders to post an
                    update
                  </div>
                </div>
                <Switch checked={updates} onCheckedChange={setUpdates} />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Reminders and deadlines
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Reminders, due dates, and SLA updates
                  </div>
                </div>
                <Switch
                  checked={remindersDeadlines}
                  onCheckedChange={setRemindersDeadlines}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Apps and integrations
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Requests related to OAuth apps and integrations
                  </div>
                </div>
                <Switch
                  checked={appsIntegrations}
                  onCheckedChange={setAppsIntegrations}
                />
              </div>
            </div>
          </div>

          {/* Feature notifications */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-foreground">
              Feature notifications
            </h2>
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Customer requests
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Requests from your customers
                  </div>
                </div>
                <Switch
                  checked={customerRequests}
                  onCheckedChange={setCustomerRequests}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Triage
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Issues added to triage
                  </div>
                </div>
                <Switch checked={triage} onCheckedChange={setTriage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
