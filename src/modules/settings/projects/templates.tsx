"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import { useUser } from "@/hooks/use-user";
import { useGetProjectTemplateHook } from "@/hooks/use-get-project-template";
import { IconPicker } from "@/modules/projects/components/icon-picker";
import { detectIconType, parseEmojiFromUnicode } from "@/components/parse-emoji";

export function Templates() {
  const { currentWorkspace } = useUser();
  const { data: templates = [] } = useGetProjectTemplateHook(
    Number(currentWorkspace?.id),
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Project templates
        </h1>
        <p className="text-muted-foreground">
          These templates are available when creating projects for any team in
          the workspace. To create templates that only apply to specific teams,
          add them as team templates.{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-muted-foreground hover:text-foreground"
          >
            Docs <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </p>
      </div>

      {/* Templates Section */}
      <Card className="bg-card border border-border pt-3 pb-0 rounded-lg">
        <div className="p-0">
          <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
            <h3 className="text-sm font-medium text-foreground">
              {templates.length} project template
              {templates.length !== 1 ? "s" : ""}
            </h3>
            <Link to="./new">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="p-0">
            {templates.map((template) => (
              <Link
                to={`./${template.id}/edit`}
                key={template.id}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-muted/30"
              >
                <IconPicker
                  value={
                    typeof template?.icon === "object"
                      ? {
                          ...template.icon,
                          icon: parseEmojiFromUnicode(template.icon.icon),
                        }
                      : template?.icon
                        ? {
                            icon: parseEmojiFromUnicode(template.icon),
                            color: "#000000",
                            type: detectIconType(template.icon),
                          }
                        : undefined
                  }
                 
                  variant="inline"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">
                    {template.descriptive_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {template.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
