"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function ImportExport() {
  const [previousImportsExpanded, setPreviousImportsExpanded] = useState(true);

  const importServices = [
    { name: "Asana", icon: "⚪" },
    { name: "Shortcut", icon: "🔗" },
    { name: "GitHub", icon: "🐙" },
    { name: "Jira", icon: "🔷" },
  ];

  return (
    <div className="min-h-screen text-foreground p-8">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">Import / Export</h1>
        </div>

        <Card>
          <CardContent>
            {/* Import assistant */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-2">Import assistant</h2>
                <p className="text-muted-foreground text-sm">
                  If you use another service to track issues, this tool will
                  create a copy of them in Linear.{" "}
                  <a
                    href="#"
                    className="text-foreground underline hover:no-underline"
                  >
                    Docs ↗
                  </a>
                </p>
              </div>

              {/* Import services grid */}
              <div className="grid grid-cols-2 gap-3">
                {importServices.map((service) => (
                  <button
                    key={service.name}
                    className="flex items-center justify-between p-4 bg-card border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{service.icon}</span>
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>

              {/* Linear to Linear import */}
              <button className="flex items-center justify-between w-full p-4 bg-card border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">🔗</span>
                    <span className="text-lg">➡️</span>
                    <span className="text-lg">🔗</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Linear to Linear import</div>
                    <div className="text-sm text-muted-foreground">
                      Import data from an existing Linear workspace
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Previous imports */}
              <div className="space-y-3">
                <button
                  onClick={() =>
                    setPreviousImportsExpanded(!previousImportsExpanded)
                  }
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  {previousImportsExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  Previous imports
                </button>

                {previousImportsExpanded && (
                  <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Sep 3, 2025
                      </span>
                      <span className="text-sm">
                        Import from linear.app/mars15
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-green-400">
                        Ready to configure
                      </span>
                      <button className="p-1 hover:bg-muted rounded">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CLI Importer */}
            <div className="space-y-4 mt-4">
              <h2 className="text-lg font-medium">CLI Importer</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If you prefer using the command line or want to make custom
                modifications, use our open source importer which imports issues
                into Linear from CSV files. It supports Asana (CSV), Jira (CSV),
                GitHub (API), Pivotal Tracker (CSV), Shortcut (CSV), Trello
                (JSON).
              </p>
              <a
                href="#"
                className="inline-flex items-center text-sm text-foreground underline hover:no-underline"
              >
                Go to Linear CLI Importer ↗
              </a>
            </div>
          </CardContent>
        </Card>
        {/* Export */}
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-lg font-medium">Export</h2>
            <p className="text-muted-foreground text-sm">
              You can export your issue data in CSV format. Once the export is
              available, we'll email you the download link.
            </p>
            <Button>Export CSV</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
