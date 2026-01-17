"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function MobileNotifications() {
  const [enableMobileNotifications, setEnableMobileNotifications] =
    useState(true);
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [selectedDays, setSelectedDays] = useState(["M", "T", "W", "T", "F"]);
  const [fromTime, setFromTime] = useState("08:00 am");
  const [toTime, setToTime] = useState("06:00 pm");

  // General notifications state
  const [generalNotifications, setGeneralNotifications] = useState({
    assignments: true,
    statusChanges: true,
    commentsAndReplies: true,
    mentions: true,
    reactions: true,
    subscriptions: true,
    documentChanges: true,
    updates: true,
    remindersAndDeadlines: true,
    appsAndIntegrations: true,
  });

  // Feature notifications state
  const [featureNotifications, setFeatureNotifications] = useState({
    customerRequests: true,
    triage: true,
  });

  const days = [
    { key: "M", label: "Monday" },
    { key: "T", label: "Tuesday" },
    { key: "W", label: "Wednesday" },
    { key: "T", label: "Thursday" },
    { key: "F", label: "Friday" },
    { key: "S", label: "Saturday" },
    { key: "S", label: "Sunday" },
  ];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Mobile
          </h1>
        </div>

        {/* Enable mobile notifications */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-foreground">
                Enable mobile notifications
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Linear mobile app push notifications
              </p>
            </div>
            <Switch
              checked={enableMobileNotifications}
              onCheckedChange={setEnableMobileNotifications}
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Schedule</h2>

          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  Only deliver notifications during scheduled and in-office
                  hours
                </h3>
              </div>
              <Switch
                checked={scheduleEnabled}
                onCheckedChange={setScheduleEnabled}
              />
            </div>

            {scheduleEnabled && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Days</h4>
                  <div className="flex gap-2">
                    {days.map((day, index) => (
                      <button
                        key={`${day.key}-${index}`}
                        onClick={() => toggleDay(day.key)}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${selectedDays.includes(day.key)
                            ? "bg-blue-600 text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                      >
                        {day.key}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      From
                    </label>
                    <input
                      type="text"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      To
                    </label>
                    <input
                      type="text"
                      value={toTime}
                      onChange={(e) => setToTime(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* General notifications */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            General notifications
          </h2>

          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Assignments</h3>
                <p className="text-sm text-muted-foreground">
                  Assignments, unassignments, and membership changes
                </p>
              </div>
              <Switch
                checked={generalNotifications.assignments}
                onCheckedChange={(checked) =>
                  setGeneralNotifications((prev) => ({
                    ...prev,
                    assignments: checked,
                  }))
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Status changes</h3>
                <p className="text-sm text-muted-foreground">
                  Changes to the status, priority, and blocking relationships of
                  issues
                </p>
              </div>
              <Switch
                checked={generalNotifications.statusChanges}
                onCheckedChange={(checked) =>
                  setGeneralNotifications((prev) => ({
                    ...prev,
                    statusChanges: checked,
                  }))
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">
                  Comments and replies
                </h3>
                <p className="text-sm text-muted-foreground">
                  Comments, replies, and thread resolutions
                </p>
              </div>
              <Switch
                checked={generalNotifications.commentsAndReplies}
                onCheckedChange={(checked) =>
                  setGeneralNotifications((prev) => ({
                    ...prev,
                    commentsAndReplies: checked,
                  }))
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Mentions</h3>
                <p className="text-sm text-muted-foreground">
                  Mentions in comments or content
                </p>
              </div>
              <Switch
                checked={generalNotifications.mentions}
                onCheckedChange={(checked) =>
                  setGeneralNotifications((prev) => ({
                    ...prev,
                    mentions: checked,
                  }))
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Reactions</h3>
                <p className="text-sm text-muted-foreground">
                  Emoji reactions to your content
                </p>
              </div>
              <Switch
                checked={generalNotifications.reactions}
                onCheckedChange={(checked) =>
                  setGeneralNotifications((prev) => ({
                    ...prev,
                    reactions: checked,
                  }))
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Subscriptions</h3>
                <p className="text-sm text-muted-foreground">
                  Issues, projects, initiatives, teams, and views you're
                  subscribed to
                </p>
              </div>
              <Switch
                checked={generalNotifications.subscriptions}
                onCheckedChange={(checked) =>
                  setGeneralNotifications((prev) => ({
                    ...prev,
                    subscriptions: checked,
                  }))
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">
                  Document changes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Changes to document content, location, and subscriptions
                </p>
              </div>
              <Switch
                checked={generalNotifications.documentChanges}
                onCheckedChange={(checked) =>
                  setGeneralNotifications((prev) => ({
                    ...prev,
                    documentChanges: checked,
                  }))
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Updates</h3>
                <p className="text-sm text-muted-foreground">
                  New project & initiative updates and reminders to post an
                  update
                </p>
              </div>
              <Switch
                checked={generalNotifications.updates}
                onCheckedChange={(checked) =>
                  setGeneralNotifications((prev) => ({
                    ...prev,
                    updates: checked,
                  }))
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">
                  Reminders and deadlines
                </h3>
                <p className="text-sm text-muted-foreground">
                  Reminders, due dates, and SLA updates
                </p>
              </div>
              <Switch
                checked={generalNotifications.remindersAndDeadlines}
                onCheckedChange={(checked) =>
                  setGeneralNotifications((prev) => ({
                    ...prev,
                    remindersAndDeadlines: checked,
                  }))
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">
                  Apps and integrations
                </h3>
                <p className="text-sm text-muted-foreground">
                  Requests related to OAuth apps and integrations
                </p>
              </div>
              <Switch
                checked={generalNotifications.appsAndIntegrations}
                onCheckedChange={(checked) =>
                  setGeneralNotifications((prev) => ({
                    ...prev,
                    appsAndIntegrations: checked,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Feature notifications */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Feature notifications
          </h2>

          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">
                  Customer requests
                </h3>
                <p className="text-sm text-muted-foreground">
                  Requests from your customers
                </p>
              </div>
              <Switch
                checked={featureNotifications.customerRequests}
                onCheckedChange={(checked) =>
                  setFeatureNotifications((prev) => ({
                    ...prev,
                    customerRequests: checked,
                  }))
                }
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Triage</h3>
                <p className="text-sm text-muted-foreground">
                  Issues added to triage
                </p>
              </div>
              <Switch
                checked={featureNotifications.triage}
                onCheckedChange={(checked) =>
                  setFeatureNotifications((prev) => ({
                    ...prev,
                    triage: checked,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
