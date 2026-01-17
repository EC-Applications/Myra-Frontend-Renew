"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Diamond, Github, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router";

const tags = [
  { label: "Backlog", icon: "📋" },
  { label: "No priority", icon: "---" },
  { label: "Lead", icon: "👤" },
  { label: "Members", icon: "👥" },
  { label: "Start", icon: "▶️" },
  { label: "Target", icon: "🎯" },
  { label: "Initiatives", icon: "🚀" },
  { label: "Labels", icon: "🏷️" },
  { label: "Dependencies", icon: "🔗" },
];
export function TemplateForm() {
  const navigate = useNavigate();
  const params = useParams();
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {params?.id && params?.id !== "new" ? "Edit" : "New"} project template
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Name Field */}
          <div className="lg:col-span-3 space-y-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input
              placeholder="Add a descriptive name..."
              className="bg-card border-border mt-2"
            />
          </div>

          {/* Visibility Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Visibility
            </label>
            <Button
              variant="outline"
              className="w-full justify-start bg-card border-border mt-2"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Workspace
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="md:max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0 gap-0">
            <div className="px-6 space-y-6">
              {/* Project Icon and Name */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Github className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Input
                    className="sm:text-lg md:text-2xl font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
                    placeholder="Project name"
                  />

                  <Textarea
                    placeholder="Add a short summary..."
                    className="md:text-lg border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent resize-none"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag.label}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-medium bg-muted/50 border-muted hover:bg-muted"
                  >
                    <span className="mr-1">{tag.icon}</span>
                    {tag.label}
                  </Button>
                ))}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Write a description, a project brief, or collect ideas..."
                  className="min-h-[120px] resize-none border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent text-muted-foreground"
                />
              </div>

              {/* Milestone Section */}
              <Collapsible defaultOpen={false} className="group/collapsible">
                <Card className="py-2 justify-center rounded-sm">
                  <CardHeader className="gap-0 flex flex-wrap justify-between items-center h-auto">
                    <span className="font-medium">Milestones</span>
                    <CollapsibleTrigger>
                      <Plus className="size-4 group-data-[state=open]/collapsible:hidden" />
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Diamond className="h-3 w-3 text-muted-foreground" />
                        <Input
                          placeholder="Milestone name"
                          className="border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
                        />
                      </div>

                      <div className="ml-7">
                        <Input
                          placeholder="Add a description..."
                          className="border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent text-sm text-muted-foreground"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-end">
                      <CollapsibleTrigger>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 mr-2"
                        >
                          Cancel
                        </Button>
                      </CollapsibleTrigger>
                      <Button size="sm" className="h-8">
                        Add milestone
                      </Button>
                    </CardFooter>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="bg-card border-border"
            onClick={() => navigate("../")}
          >
            Cancel
          </Button>
          <Button>{params.id ? "Save" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}
