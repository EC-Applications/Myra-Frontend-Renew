"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function EmailNotifications() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [delayLowPriority, setDelayLowPriority] = useState(true);
  const [immediateUrgent, setImmediateUrgent] = useState(true);

  // General notifications state
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

  // Feature notifications state
  const [customerRequests, setCustomerRequests] = useState(true);
  const [triage, setTriage] = useState(true);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Email</h1>
        </div>

        {/* Enable email notifications */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">
                Enable email notifications
              </h3>
              <p className="text-sm text-muted-foreground">
                Email notifications to techwolf38698@gmail.com
              </p>
            </div>
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
          </div>
        </div>

        {/* Delivery preferences */}
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4">
            Delivery preferences
          </h2>
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Delay low priority emails outside of work hours until the
                    next work day
                  </h3>
                </div>
                <Switch
                  checked={delayLowPriority}
                  onCheckedChange={setDelayLowPriority}
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Immediately notify if an issue assigned to you is marked
                    urgent or breaches SLA
                  </h3>
                </div>
                <Switch
                  checked={immediateUrgent}
                  onCheckedChange={setImmediateUrgent}
                />
              </div>
            </div>
          </div>
        </div>

        {/* General notifications */}
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4">
            General notifications
          </h2>
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Assignments</h3>
                  <p className="text-sm text-muted-foreground">
                    Assignments, unassignments, and membership changes
                  </p>
                </div>
                <Switch
                  checked={assignments}
                  onCheckedChange={setAssignments}
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Status changes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Changes to the status, priority, and blocking relationships
                    of issues
                  </p>
                </div>
                <Switch
                  checked={statusChanges}
                  onCheckedChange={setStatusChanges}
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Comments and replies
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Comments, replies, and thread resolutions
                  </p>
                </div>
                <Switch
                  checked={commentsReplies}
                  onCheckedChange={setCommentsReplies}
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Mentions</h3>
                  <p className="text-sm text-muted-foreground">
                    Mentions in comments or content
                  </p>
                </div>
                <Switch checked={mentions} onCheckedChange={setMentions} />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Reactions</h3>
                  <p className="text-sm text-muted-foreground">
                    Emoji reactions to your content
                  </p>
                </div>
                <Switch checked={reactions} onCheckedChange={setReactions} />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Subscriptions</h3>
                  <p className="text-sm text-muted-foreground">
                    Issues, projects, initiatives, teams, and views you're
                    subscribed to
                  </p>
                </div>
                <Switch
                  checked={subscriptions}
                  onCheckedChange={setSubscriptions}
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Document changes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Changes to document content, location, and subscriptions
                  </p>
                </div>
                <Switch
                  checked={documentChanges}
                  onCheckedChange={setDocumentChanges}
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    New project & initiative updates and reminders to post an
                    update
                  </p>
                </div>
                <Switch checked={updates} onCheckedChange={setUpdates} />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Reminders and deadlines
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Reminders, due dates, and SLA updates
                  </p>
                </div>
                <Switch
                  checked={remindersDeadlines}
                  onCheckedChange={setRemindersDeadlines}
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Apps and integrations
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Requests related to OAuth apps and integrations
                  </p>
                </div>
                <Switch
                  checked={appsIntegrations}
                  onCheckedChange={setAppsIntegrations}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature notifications */}
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4">
            Feature notifications
          </h2>
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Customer requests
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Requests from your customers
                  </p>
                </div>
                <Switch
                  checked={customerRequests}
                  onCheckedChange={setCustomerRequests}
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Triage</h3>
                  <p className="text-sm text-muted-foreground">
                    Issues added to triage
                  </p>
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
