"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Monitor } from "lucide-react";
import { useState } from "react";

export default function SecurityAccess() {
  const [sessions] = useState([
    {
      id: 1,
      device: "Opera on Windows",
      location: "Karachi, PK",
      lastSeen: "Current session",
      isCurrent: true,
      icon: Globe,
    },
    {
      id: 2,
      device: "Opera on Windows",
      location: "Karachi, PK",
      lastSeen: "Last seen 2 days ago",
      isCurrent: false,
      icon: Globe,
    },
    {
      id: 3,
      device: "Chrome on Windows",
      location: "Karachi, PK",
      lastSeen: "Last seen 27 days ago",
      isCurrent: false,
      icon: Globe,
    },
    {
      id: 4,
      device: "Linear Desktop on Windows",
      location: "Karachi, PK",
      lastSeen: "Last seen about 1 month ago",
      isCurrent: false,
      icon: Monitor,
    },
  ]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-8">
            Security & access
          </h1>
        </div>

        {/* Sessions Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-2">
              Sessions
            </h2>
            <p className="text-sm text-muted-foreground">
              Devices logged into your account
            </p>
          </div>

          <Card className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">
                    {sessions[0].device}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-green-500">Current session</span>
                    <span className="text-muted-foreground">
                      • {sessions[0].location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">3 other sessions</h3>
              <Button variant="outline" size="sm">
                Revoke all
              </Button>
            </div>

            <div className="space-y-4">
              {sessions.slice(1).map((session) => {
                const IconComponent = session.icon;
                return (
                  <div key={session.id} className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">
                        {session.device}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.location} • {session.lastSeen}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Passkeys Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-2">
              Passkeys
            </h2>
            <p className="text-sm text-muted-foreground">
              Passkeys are a secure way to sign in to your Linear account
            </p>
          </div>

          <Card className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                No passkeys registered
              </span>
              <Button variant="outline" size="sm">
                New passkey
              </Button>
            </div>
          </Card>
        </div>

        {/* Personal API Keys Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-2">
              Personal API keys
            </h2>
            <p className="text-sm text-muted-foreground">
              Use Linear's GraphQL API to build your own integrations
            </p>
          </div>

          <Card className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">No API keys created</span>
              <Button variant="outline" size="sm">
                New API key
              </Button>
            </div>
          </Card>
        </div>

        {/* Authorized Applications Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-2">
              Authorized applications
            </h2>
            <p className="text-sm text-muted-foreground">
              OAuth applications you've approved
            </p>
          </div>

          <Card className="bg-card border border-border rounded-lg p-4">
            <span className="text-muted-foreground">
              No applications have been authorized to connect with your account.
            </span>
          </Card>
        </div>
      </div>
    </div>
  );
}
