"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
// import { useProjectDetail } from "@/hooks/use-project-detail";
import { Copy, FileText, PanelRightIcon } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useParams } from "react-router";
import ProjectProperties from "./components/project-properties";
import { useProjectDetail } from "@/hooks/use-project-detail";

export default function DetailWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();

  const { data: project } = useProjectDetail(Number(id));

  return (
  <div className="min-h-screen dark:bg-[#17181b] border">
      {/* Header */}

      <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border dark:border-zinc-800 rounded ">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-foreground text-[14px] font-semibold">
            Projects ›
          </h1>
          <div className="flex items-center space-x-1 ">
            <NavLink to={`/projects/detail/${id}`}>
              {({ isActive }) => (
                <div
                  className={`dark:hover:bg-muted p-1 rounded text-[14px] font-semibold  ${
                    isActive ? "" : " text-muted-foreground "
                  }`}
                >
                  {project?.name}
                </div>
              )}
            </NavLink>
            <NavLink to={`/projects/detail/${id}`} end>
              {({ isActive }) => (
                <Button
                  variant={isActive ? "outline" : "ghost"}
                  size="sm"
                  className={`text-[14px] font-semibold${
                    isActive ? "" : " text-muted-foreground"
                  }`}
                >
                  <FileText />
                  Overview
                </Button>
              )}
            </NavLink>
            <NavLink to={`/projects/detail/${id}/issues`} end>
              {({ isActive }) => (
                <Button
                  variant={"outline"}
                  size="sm"
                  className={` text-[14px] font-semibold${
                    isActive ? "" : " text-muted-foreground"
                  }`}
                >
                  <Copy className="rotate-180" />
                  Issues
                </Button>
              )}
            </NavLink>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4">
          <Button
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <PanelRightIcon />
            <span className="sr-only">Toggle Properties</span>
          </Button>
        </div>
      </header>
      <div className="flex">
        <div className="flex-1">
          <Outlet />
        </div>
        {sidebarOpen ? <ProjectProperties /> : null}
      </div>
    </div>
  );
}
