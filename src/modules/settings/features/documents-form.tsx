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
import { Building2, Diamond, File, Github, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router";

export function DocumentForm() {
  const navigate = useNavigate();
  const params = useParams();
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {params?.id && params?.id !== "new" ? "Edit" : "New"} document template
        </h1>

        <CardContent className="md:w-full max-w-3xl w-full max-h-[90vh] overflow-y-auto p-0 gap-0">
          <div className="px-6 space-y-6">
            {/* Document Icon and Name */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <File className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  className="sm:text-lg md:text-2xl font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
                  placeholder="Template name"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Textarea
                placeholder="Click here to start writing..."
                className="min-h-[120px] resize-none border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent text-muted-foreground"
              />
            </div>
          </div>
        </CardContent>

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
