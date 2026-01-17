import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SlackNotifications() {
  const [notifications, setNotifications] = useState({
    projectUpdate: false,
    issueAdded: false,
    issueCompleted: false,
    issueStatusChanged: false,
    comments: false,
    triageQueue: false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const notificationItems = [
    { key: "projectUpdate" as const, label: "New project update is posted" },
    { key: "issueAdded" as const, label: "An issue is added to the team" },
    {
      key: "issueCompleted" as const,
      label: "An issue is marked completed or canceled",
    },
    { key: "issueStatusChanged" as const, label: "An issue changes status" },
    { key: "comments" as const, label: "Comments to issues" },
    {
      key: "triageQueue" as const,
      label: "An issue is added to the triage queue",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Slack notifications
        </h1>
      </div>

      {/* Connect Slack Channel */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground">
              Connect a Slack channel
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Connect a channel to broadcast notifications from this team
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 whitespace-nowrap bg-transparent"
          >
            Connect
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Notifications
        </h2>
        <div className="border border-border rounded-lg bg-card divide-y divide-border">
          {notificationItems.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
            >
              <label className="text-foreground cursor-pointer">{label}</label>
              <button
                onClick={() => toggleNotification(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[key] ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    notifications[key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
