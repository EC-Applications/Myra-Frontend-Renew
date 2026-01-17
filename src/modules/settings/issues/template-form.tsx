"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Copy,
  FolderOpen,
  MoreHorizontal,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

export function TemplateForm() {
  const [templateName, setTemplateName] = useState("");
  const [showSubIssueForm, setShowSubIssueForm] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {params?.id && params?.id !== "new" ? "Edit" : "New"} issue template
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Name Field */}
          <div className="lg:col-span-3 space-y-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
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

        <Card className="rounded-sm">
          <CardContent>
            <div className="flex-1 space-y-6 overflow-y-auto">
              {/* Title Input */}
              <Input
                placeholder="Issue title"
                // value={title}
                // onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium border-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground dark:bg-transparent shadow-none"
              />

              {/* Description Editor */}

              <Textarea
                placeholder="Add description..."
                className="border-0 p-0 text-sm resize-none focus-visible:ring-0 min-h-[60px] max-h-[45vh] overflow-auto dark:bg-transparent shadow-none"
              />

              {/* Property Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent"
                  onClick={() => {
                    /* Handle priority selection */
                  }}
                >
                  <MoreHorizontal className="h-2 w-2" />
                  Priority
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent"
                  onClick={() => {
                    /* Handle assignee selection */
                  }}
                >
                  <User className="h-2 w-2" />
                  Assignee
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent"
                  onClick={() => {
                    /* Handle project selection */
                  }}
                >
                  <FolderOpen className="h-2 w-2" />
                  Project
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent"
                  onClick={() => {
                    setShowSubIssueForm(true);
                  }}
                >
                  <Copy className="h-2 w-2" />
                  Sub-issues
                </Button>
              </div>
            </div>
            {showSubIssueForm && (
              <div className="border border-border rounded-lg py-4 bg-card mt-4">
                <div className="flex items-start gap-3 mb-4 border-b pb-4 px-4">
                  <h4 className="text-sm text-muted-foreground font-medium">
                    Create sub-issue
                  </h4>
                </div>
                <div className="flex items-start gap-3 mb-4 px-4">
                  <div className="w-4 h-4 flex items-center justify-center pt-5">
                    <div className="w-2 h-2 bg-yellow-500 rounded-sm rotate-45"></div>
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Issue title"
                      className="border-0 p-0 text-sm font-medium focus-visible:ring-0 mb-2 dark:bg-transparent"
                    />
                    <Textarea
                      placeholder="Add description..."
                      className="border-0 p-0 text-sm resize-none focus-visible:ring-0 min-h-[60px] dark:bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-3 px-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowSubIssueForm(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button size="sm">Add sub-issue</Button>
                  </div>
                </div>
              </div>
            )}
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
