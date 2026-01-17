"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

export default function IssueLabels() {
  const [searchQuery, setSearchQuery] = useState("");
  const [marsExpanded, setMarsExpanded] = useState(false);
  const [inheritedExpanded, setInheritedExpanded] = useState(true);

  const inheritedLabels = [
    { name: "Bug", color: "bg-red-500", lastApplied: "Jul 22" },
    { name: "Feature", color: "bg-purple-500", lastApplied: "Jul 22" },
    { name: "Improvement", color: "bg-blue-500", lastApplied: "Jul 22" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <span>Settings</span>
        <span>/</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-xs font-medium text-white">
            M
          </div>
          <span>MARS</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Team issue labels
        </h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground bg-transparent"
          >
            New group
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            New label
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Filter by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-4 px-4 py-2 border-b border-border">
        <div className="flex items-center gap-1 font-medium">
          Name
          <ChevronDown className="w-3 h-3" />
        </div>
        <div className="font-medium">Last applied</div>
        <div className="font-medium">Created</div>
      </div>

      {/* MARS Section */}
      <div className="mb-4">
        <button
          onClick={() => setMarsExpanded(!marsExpanded)}
          className="flex items-center gap-2 w-full p-3 bg-card border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {marsExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-xs font-medium text-white">
            M
          </div>
          <span className="font-medium text-foreground">MARS</span>
          <span className="text-muted-foreground">0</span>
        </button>
        {!marsExpanded && (
          <div className="mt-2 p-4 text-muted-foreground text-sm bg-muted/30 rounded-lg">
            This team doesn't have any issue labels yet
          </div>
        )}
      </div>

      {/* Inherited from workspace Section */}
      <div>
        <button
          onClick={() => setInheritedExpanded(!inheritedExpanded)}
          className="flex items-center gap-2 w-full p-3 bg-card border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors mb-2"
        >
          {inheritedExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-muted-foreground font-medium">
            Inherited from workspace
          </span>
          <span className="text-muted-foreground">3</span>
        </button>

        {inheritedExpanded && (
          <div className="space-y-1 bg-card border border-border rounded-lg p-2">
            {inheritedLabels.map((label, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 p-3 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${label.color}`} />
                  <span className="text-foreground">{label.name}</span>
                </div>
                <div className="text-muted-foreground">{label.lastApplied}</div>
                <div className="text-muted-foreground">{label.lastApplied}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
