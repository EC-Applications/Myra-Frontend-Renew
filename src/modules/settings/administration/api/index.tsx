"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Plus } from "lucide-react";
import { Link } from "react-router";

export function Api() {
  const [enableMemberApiKeys, setEnableMemberApiKeys] = useState(true);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* API Section */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">API</h1>
        <p className="text-muted-foreground leading-relaxed">
          Linear's GraphQL API provides a programmable interface to your data.
          Use our API to build public or private apps, workflows, and
          integrations for Linear.{" "}
          <a href="#" className="text-foreground underline hover:no-underline">
            Join our Slack
          </a>{" "}
          for help and questions.{" "}
          <a
            href="#"
            className="text-foreground underline hover:no-underline inline-flex items-center gap-1"
          >
            API Docs <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>

      {/* OAuth Applications */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-foreground">
            OAuth Applications
          </h2>
          <p className="text-muted-foreground">
            Manage your organization's OAuth applications.{" "}
            <a
              href="#"
              className="text-foreground underline hover:no-underline inline-flex items-center gap-1"
            >
              Docs <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-between">
          <span className="text-muted-foreground">No OAuth applications</span>
          <Link to={"./applications/new"}>
            <Button
              variant="outline"
              className="gap-2 bg-transparent cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              New OAuth application
            </Button>
          </Link>
        </div>
      </div>

      {/* Webhooks */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-foreground">Webhooks</h2>
          <p className="text-muted-foreground">
            Webhooks allow you to receive HTTP requests when an entity is
            created, updated, or deleted.{" "}
            <a
              href="#"
              className="text-foreground underline hover:no-underline inline-flex items-center gap-1"
            >
              Docs <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-between">
          <span className="text-muted-foreground">No webhooks</span>
          <Link to={"./webhooks/new"}>
            <Button variant="outline" className="gap-2 bg-transparent cursor-pointer">
              <Plus className="h-4 w-4" />
              New webhook
            </Button>
          </Link>
        </div>
      </div>

      {/* Member API Keys */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-foreground">
            Member API keys
          </h2>
          <p className="text-muted-foreground">
            Members of your workspace can create API keys to interact with the
            Linear API on their behalf. View your personal API keys from your{" "}
            <a
              href="#"
              className="text-foreground underline hover:no-underline"
            >
              security & access settings
            </a>
            .
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">
                Enable member API keys
              </h3>
            </div>
            <Switch
              checked={enableMemberApiKeys}
              onCheckedChange={setEnableMemberApiKeys}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <span className="text-muted-foreground">
            No API keys have been created yet
          </span>
        </div>
      </div>
    </div>
  );
}
