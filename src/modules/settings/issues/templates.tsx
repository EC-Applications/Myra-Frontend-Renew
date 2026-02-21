"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  ExternalLink,
  Cross,
  X,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface IssueTemplate {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
}

export function Templates() {
  const [open, setOpen] = useState(false);
  const [templates] = useState<IssueTemplate[]>([
    {
      id: "1",
      name: "Test",
      createdBy: "Tech Wolf",
      createdAt: "33 minutes ago",
    },
  ]);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Issue templates
        </h1>
        <p className="text-muted-foreground">
          These templates are available when creating issues for any team in the
          workspace. To create templates that only apply to specific teams, add
          them as team templates.{" "}
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
              {templates.length} issue template
              {templates.length !== 1 ? "s" : ""}
            </h3>

            {/* <Link to="./new"> */}
            <Button
              onClick={() => setOpen(!open)}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <Plus className="h-4 w-4" />
            </Button>
            {/* </Link> */}
          </div>

          <div className="p-0">
            {templates.map((template) => (
              <Link
                to={`./${template.id}/edit`}
                key={template.id}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-muted/30"
              >
                <div className="w-4 h-4 rounded-full border border-muted-foreground/50 bg-background" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">
                    {template.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created by {template.createdBy} {template.createdAt}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Card>

      <Dialog open={open} modal>
        <DialogContent
          className="
      p-0 
      min-w-[660px] 
      max-w-none
      bg-[#1c1d1f] 
      border border-[#2a2b2e] 
      rounded-xl 
      shadow-2xl
      backdrop-blur-xl
    "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2b2e]">
            <h2 className="text-[18px] font-semibold text-white">
              What kind of template would you like to create?
            </h2>

            <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
              <X className="h-4 w-4 text-zinc-400" />
            </Button>
          </div>

          {/* Body */}
          <div className="flex relative px-5 py-1  ">
            {/* LEFT CARD */}
            <div className="w-1/2 p-6 group transition-colors duration-200 hover:bg-[#efb515] rounded-bl-xl rounded-tl-xl dark:bg-[#27292f]">
              <Link to="./new">
                <h3 className="text-white font-semibold text-[16px] mb-1">
                  Standard issue
                </h3>
                <p className="text-zinc-400 text-[14px] mb-5">
                  For team members creating issues within Linear
                </p>

                {/* Preview Box */}
                <div className="bg-[#18181b] border border-[#2a2b2e] rounded-lg p-4 space-y-5">
                  <div className="text-zinc-300 font-medium">Issue title</div>
                  <div className="text-zinc-500 text-sm">
                    Add description...
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs text-zinc-400 ">
                    <div className="flex items-center gap-1.5 px-1 py-1 bg-[#27272a] rounded border border-zinc-700">
                      <img
                        src="/images/status/backlog-status.png"
                        alt=""
                        className="w-4 h-4"
                      />
                      <div className="text-sm font-semibold">Backlog</div>
                    </div>
                    <div className="flex items-center gap-2  rounded p-1">
                      <div>—</div>
                      <div className="text-sm font-semibold">Prioirty</div>
                    </div>
                    <MoreHorizontal />
                  </div>
                </div>
              </Link>
            </div>

            {/* Divider */}
            <div className="w-[1px] dark:bg-[#18181b] " />

            {/* RIGHT CARD */}
            <div className="w-1/2 p-6 cursor-pointer group transition-colors duration-200 hover:bg-[#232428] rounded-br-xl dark:bg-[#27292f] rounded-tr-xl">
              <h3 className="text-white font-semibold text-[16px] mb-1">
                Asks form
              </h3>
              <p className="text-zinc-400 text-[14px] mb-5">
                For capturing Asks and external structured requests
              </p>

              {/* Static Preview Form */}
              <div className="bg-[#18181b] border border-[#2a2b2e] rounded-lg p-4 space-y-4">
                <div>
                  <div className="text-zinc-400 text-xs mb-1">Device</div>
                  <div className="h-9 rounded-md border border-[#2a2b2e] bg-[#111113] px-3 flex items-center text-sm text-zinc-500">
                    Enter text
                  </div>
                </div>

                <div>
                  <div className="text-zinc-400 text-xs mb-1">Department</div>
                  <div className="h-9 rounded-md border border-[#2a2b2e] bg-[#111113] px-3 flex items-center justify-between text-sm text-zinc-500">
                    Select an option
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
