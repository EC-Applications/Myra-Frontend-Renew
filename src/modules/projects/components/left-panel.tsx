"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, ChevronDown, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"

export default function LeftPanel() {
  const [projectUpdate, setProjectUpdate] = useState("")
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set())

  const toggleMilestone = (milestone: string) => {
    const newExpanded = new Set(expandedMilestones)
    if (newExpanded.has(milestone)) {
      newExpanded.delete(milestone)
    } else {
      newExpanded.add(milestone)
    }
    setExpandedMilestones(newExpanded)
  }

  return (
    <div className="px-6 py-6 max-w-3xl">
      {/* Project Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-cyan-600 rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-3xl font-semibold">adwa</h1>
        </div>
        <p className="text-sm text-muted-foreground">Add a short summary...</p>
      </div>

      {/* Properties */}
      <div className="mb-6">
        <h3 className="text-xs font-medium mb-3 text-muted-foreground">Properties</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="gap-1.5 text-xs">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            dawd
          </Badge>
          <Badge variant="outline" className="gap-1.5 text-xs bg-red-500/10 text-red-600 border-red-500/20">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Urgent
          </Badge>
          <div className="flex items-center gap-1.5">
            <Avatar className="w-5 h-5">
              <AvatarFallback className="text-xs bg-purple-500 text-white">R</AvatarFallback>
            </Avatar>
            <span className="text-xs">ruhank170</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5">
            <Calendar className="w-3 h-3" />
            Dec 19
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            Target date
          </Button>
          <Badge variant="outline" className="gap-1.5 text-xs">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            dsw
          </Badge>
        </div>
      </div>

      {/* Labels */}
      <div className="mb-6">
        <h3 className="text-xs font-medium mb-3 text-muted-foreground">Labels</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 text-xs">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            Name
          </Badge>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Blocking */}
      <div className="mb-6">
        <h3 className="text-xs font-medium mb-3 text-muted-foreground">Blocking</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 text-xs">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Testing Project
          </Badge>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Resources */}
      <div className="mb-6">
        <h3 className="text-xs font-medium mb-3 text-muted-foreground">Resources</h3>
        <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
          <Plus className="w-3 h-3 mr-1.5" />
          Add document or link...
        </Button>
      </div>

      {/* Project Update */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-green-600">On track</span>
        </div>
        <textarea
          placeholder="Write a project update..."
          value={projectUpdate}
          onChange={(e) => setProjectUpdate(e.target.value)}
          className="w-full min-h-[80px] p-3 text-base bg-muted/30 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-base"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-xs font-medium mb-3 text-muted-foreground">Description</h3>
        <div className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-muted/30 cursor-pointer">
          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M7 18h10M7 14h10M7 10h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">marketing noots.pdf</p>
            <p className="text-xs text-muted-foreground">102.05 KB</p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h3 className="text-xs font-medium mb-4 text-muted-foreground">Milestones</h3>
        <div className="space-y-3">
          {/* Backend Development */}
          <div>
            <div
              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
              onClick={() => toggleMilestone("Backend Development")}
            >
              <div className="flex items-center gap-3">
                {expandedMilestones.has("Backend Development") ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Backend Development</span>
              </div>
              <span className="text-sm text-muted-foreground">4 issues • 25%</span>
            </div>
            {expandedMilestones.has("Backend Development") && (
              <div className="ml-7 mt-2 mb-2">
                <textarea
                  className="w-full p-3 text-sm bg-transparent border-0 resize-none focus:outline-none text-muted-foreground"
                  placeholder="Add a description..."
                  rows={1}
                />
              </div>
            )}
          </div>

          {/* Frontend Development */}
          <div>
            <div
              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
              onClick={() => toggleMilestone("Frontend Development")}
            >
              <div className="flex items-center gap-3">
                {expandedMilestones.has("Frontend Development") ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Frontend Development</span>
              </div>
              <span className="text-sm text-muted-foreground">14 issues • 41%</span>
            </div>
            {expandedMilestones.has("Frontend Development") && (
              <div className="ml-7 mt-2 mb-2">
                <textarea
                  className="w-full p-3 text-sm bg-transparent border-0 resize-none focus:outline-none text-muted-foreground"
                  placeholder="Add a description..."
                  rows={1}
                />
              </div>
            )}
          </div>

          {/* Website/Landing */}
          <div>
            <div
              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
              onClick={() => toggleMilestone("Website/Landing")}
            >
              <div className="flex items-center gap-3">
                {expandedMilestones.has("Website/Landing") ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <div className="w-2 h-2 border border-muted-foreground rounded-full"></div>
                <span className="font-medium">Website/Landing</span>
              </div>
            </div>
            {expandedMilestones.has("Website/Landing") && (
              <div className="ml-7 mt-2 mb-2">
                <textarea
                  className="w-full p-3 text-sm bg-transparent border-0 resize-none focus:outline-none text-muted-foreground"
                  placeholder="Add a description..."
                  rows={1}
                />
              </div>
            )}
          </div>

          {/* APIs Development */}
          <div>
            <div
              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
              onClick={() => toggleMilestone("APIs Development")}
            >
              <div className="flex items-center gap-3">
                {expandedMilestones.has("APIs Development") ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <div className="w-2 h-2 border border-muted-foreground rounded-full"></div>
                <span className="font-medium">APIs Development</span>
              </div>
            </div>
            {expandedMilestones.has("APIs Development") && (
              <div className="ml-7 mt-2 mb-2">
                <textarea
                  className="w-full p-3 text-sm bg-transparent border-0 resize-none focus:outline-none text-muted-foreground"
                  placeholder="Add a description..."
                  rows={1}
                />
              </div>
            )}
          </div>

          {/* Design Completion */}
          <div>
            <div
              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
              onClick={() => toggleMilestone("Design Completion")}
            >
              <div className="flex items-center gap-3">
                {expandedMilestones.has("Design Completion") ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <div className="w-2 h-2 border border-muted-foreground rounded-full"></div>
                <span className="font-medium">Design Completion</span>
              </div>
            </div>
            {expandedMilestones.has("Design Completion") && (
              <div className="ml-7 mt-2 mb-2">
                <textarea
                  className="w-full p-3 text-sm bg-transparent border-0 resize-none focus:outline-none text-muted-foreground"
                  placeholder="Add a description..."
                  rows={1}
                />
              </div>
            )}
          </div>

          {/* Mobile */}
          <div>
            <div
              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
              onClick={() => toggleMilestone("Mobile")}
            >
              <div className="flex items-center gap-3">
                {expandedMilestones.has("Mobile") ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <div className="w-2 h-2 border border-muted-foreground rounded-full"></div>
                <span className="font-medium">Mobile</span>
              </div>
            </div>
            {expandedMilestones.has("Mobile") && (
              <div className="ml-7 mt-2 mb-2">
                <textarea
                  className="w-full p-3 text-sm bg-transparent border-0 resize-none focus:outline-none text-muted-foreground"
                  placeholder="Add a description..."
                  rows={1}
                />
              </div>
            )}
          </div>

          {/* Milestone name */}
          <div
            className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer"
            onClick={() => toggleMilestone("Milestone name")}
          >
            <div className="flex items-center gap-2">
              {expandedMilestones.has("Milestone name") ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium">Milestone name</span>
            </div>
          </div>
          {expandedMilestones.has("Milestone name") && (
            <div className="ml-8 mb-2">
              <textarea
                className="w-full p-2 text-sm bg-transparent border-0 resize-none focus:outline-none text-muted-foreground placeholder:text-muted-foreground"
                placeholder="Add a description..."
                rows={1}
              />
            </div>
          )}

          <Button variant="ghost" className="justify-start gap-2 text-xs h-8 text-muted-foreground w-full">
            <Plus className="w-3 h-3" />
            Milestone
          </Button>
        </div>
      </div>
    </div>
  )
}
