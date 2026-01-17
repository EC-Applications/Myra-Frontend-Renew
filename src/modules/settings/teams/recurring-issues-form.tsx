"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  FolderOpen,
  MoreHorizontal,
  User,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export function RecurringIssuesForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [firstDue, setFirstDue] = useState("11/07/2025");
  const [repeatInterval, setRepeatInterval] = useState("1");
  const [repeatUnit, setRepeatUnit] = useState("week");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">
            New recurring issue
          </h1>
          <p className="text-sm text-muted-foreground">
            Create the first instance of your recurring issue below, including
            the schedule and initial due date. New instances will be created
            after each due date passes.{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Docs ↗
            </a>
          </p>
        </div>

        <Card className="rounded-sm">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Issue title"
                className="text-base font-medium border-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground bg-transparent shadow-none"
              />

              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description..."
                className="border-0 p-0 text-sm resize-none focus-visible:ring-0 min-h-[80px] bg-transparent shadow-none"
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent border-border"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  Backlog
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent border-border"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  Priority
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent border-border"
                >
                  <User className="h-4 w-4" />
                  Assignee
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent border-border"
                >
                  <FolderOpen className="h-4 w-4" />
                  Project
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent border-border"
                >
                  <Copy className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent border-border"
                >
                  <Copy className="h-4 w-4" />
                  Sub-issues
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-foreground font-medium">
              First due
            </label>
            <Input
              type="text"
              value={firstDue}
              onChange={(e) => setFirstDue(e.target.value)}
              className="w-32 text-sm border-border bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground font-medium">
              repeats every
            </span>
            <Input
              type="text"
              value={repeatInterval}
              onChange={(e) => setRepeatInterval(e.target.value)}
              className="w-12 text-sm border-border bg-background text-center"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm border-border bg-background gap-2"
                >
                  {repeatUnit}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setRepeatUnit("day")}>
                  day
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRepeatUnit("week")}>
                  week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRepeatUnit("month")}>
                  month
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRepeatUnit("year")}>
                  year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" className="border-border bg-background">
              Cancel
            </Button>
            <Button>Create</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
