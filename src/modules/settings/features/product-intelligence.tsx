"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Target, FileText } from "lucide-react";

export function ProductIntelligence() {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">
            Product Intelligence
          </h1>
          <Badge variant="secondary">Technology Preview</Badge>
        </div>
        <p className="text-muted-foreground">
          Streamline your product development with agentic AI assistance for
          routine, manual tasks.{" "}
          <a
            href="#"
            className="text-foreground hover:underline inline-flex items-center gap-1"
          >
            Docs <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>

      {/* Enable Product Intelligence */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between space-x-3">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">
              Enable Product Intelligence
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Available on the Business plan. Access Product Intelligence, and
              all other Business features, for 30 days with a free trial. For
              questions,{" "}
              <a href="#" className="text-foreground hover:underline">
                contact our sales team
              </a>
              .
            </p>
          </div>
          <Button>Start free trial</Button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="space-y-4">
        {/* Triage suggestions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-muted rounded-lg">
              <Target className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Triage suggestions
              </h3>
              <p className="text-muted-foreground">
                Automatically find related issues & duplicates, and infer which
                teams, projects, labels, and assignees they belong to.
              </p>
            </div>
          </div>
        </div>

        {/* Initiative and project updates */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Initiative and project updates
                </h3>
                <p className="text-muted-foreground">
                  Define how updates are generated
                </p>
              </div>
              <Badge
                variant="secondary"
                className="bg-muted text-muted-foreground"
              >
                Available soon
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
