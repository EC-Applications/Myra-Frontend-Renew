"use client";

import { useState } from "react";
import {
  Menu,
  Grid3x3,
  AlignLeft,
  Columns,
  Rows,
  ArrowUpDown,
  ChevronDown,
  Settings,
  ArrowRightLeft,
  ListOrdered,
} from "lucide-react";
import { Button } from "./ui/button";
// import { Dropdown } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";

export type ViewType = "list" | "board";

export interface DisplayState {
  view: ViewType;
  grouping: string | null;
  subGrouping: string | null;
  ordering: string | null;
  orderByRecency: boolean;
  showSubIssues: boolean;
  showEmptyGroups: boolean;
  showEmptyColumns: boolean;
  showEmptyRows: boolean;
  displayProperties: {
    id: boolean;
    status: boolean;
    assignee: boolean;
    priority: boolean;
    dueDate: boolean;
    project: boolean;
    milestone: boolean;
    cycle: boolean;
    labels: boolean;
    links: boolean;
    timeInStatus: boolean;
    created: boolean;
    updated: boolean;
    pullRequests: boolean;
  };
}

interface DisplayDropdownProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  displayState: DisplayState;
  onDisplayStateChange: (state: DisplayState) => void;
}

const groupingOptions = [
  "No grouping",
  "Status",
  "Assignee",
  "Project",
  "Priority",
  "Cycle",
  "Label",
  "Parent issue",
];

const subGroupingOptions = [
  "No grouping",
  "Status",
  "Assignee",
  "Project",
  "Priority",
  "Cycle",
  "Label",
  "Parent issue",
];

const orderOptions = [
  "Manual",
  "Title",
  "Status",
  "Priority",
  "Assigne",
  "Estimate",
  "Update",
  "Created",
  "Due Date",
  "Link count",
  "Time in status",
];

export function DisplayDropdown({
  view,
  onViewChange,
  displayState,
  onDisplayStateChange,
}: DisplayDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const state = displayState; // Declare the state variable
  const [value, setValue] = useState("Assignee");
  const [open, setOpen] = useState(false);

  const [subGroupOpen, setsubGroupOpen] = useState(false);
  const [subGroupvalue, setSubGroupValue] = useState("Status");

  const [orderOpen, setOrderOpen] = useState(false);
  const [ordering, setOrdering] = useState("Title");

  const handleViewChange = (newView: ViewType) => {
    onViewChange(newView);
  };

  const handlePropertyToggle = (
    property: keyof DisplayState["displayProperties"],
  ) => {
    onDisplayStateChange({
      ...displayState,
      displayProperties: {
        ...displayState.displayProperties,
        [property]: !displayState.displayProperties[property],
      },
    });
  };

  const handleToggle = (key: keyof DisplayState) => {
    onDisplayStateChange({
      ...displayState,
      [key]: !displayState[key],
    });
  };

  const handleReset = () => {
    onDisplayStateChange({
      view: "list",
      grouping: null,
      subGrouping: null,
      ordering: null,
      orderByRecency: false,
      showSubIssues: true,
      showEmptyGroups: false,
      showEmptyColumns: false,
      showEmptyRows: false,
      displayProperties: {
        id: true,
        status: true,
        assignee: true,
        priority: true,
        dueDate: true,
        project: true,
        milestone: true,
        cycle: true,
        labels: true,
        links: true,
        timeInStatus: true,
        created: true,
        updated: true,
        pullRequests: true,
      },
    });
    onViewChange("list");
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        variant="noBorder"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 p-1 dark:bg-transparent hover:bg-slate-800 text-white rounded-lg  transition-colors"
      >
        <Settings size={18} />
        <span>Display</span>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full pt-2 w-[350px] dark:bg-[#1c1d1f] border dark:border-zinc-700 rounded-lg shadow-2xl z-50  space-y-4 max-h-[600px] overflow-y-auto">
          {/* View Tabs */}

          <div className="flex gap-2 dark:border-zinc-800 px-6 py-1">
            <div className="flex  flex-1 p-0.5 h-14   rounded dark:bg-[#181818]">
              <button
                onClick={() => handleViewChange("list")}
                className={`flex-1 h-13 flex flex-col items-center py-2 rounded transition-colors ${
                  view === "list"
                    ? "dark:bg-[#27292f] dark:text-white border dark:border-zinc-700"
                    : "bg-transparent dark:hover:text-white text-muted-foreground hover:text-white"
                }`}
              >
                <Menu size={20} />
                <span className="text-sm font-medium">List</span>
              </button>
              <button
                onClick={() => handleViewChange("board")}
                className={`flex-1 h-14 flex flex-col items-center py-2 rounded transition-colors ${
                  view === "board"
                    ? "dark:bg-[#27292f] dark:text-white border dark:border-zinc-700"
                    : "bg-transparent dark:hover:text-white text-muted-foreground hover:text-white"
                }`}
              >
                <Grid3x3 size={20} />
                <span className="text-sm font-medium">Board</span>
              </button>
            </div>
          </div>

          {/* View-Specific Options */}
          <div className="space-y-3 px-6">
            {view === "list" ? (
              <>
                {/* List View Options */}
                <div className="flex items-center gap-2 text-muted-foreground hover:text-white cursor-pointer group">
                  <AlignLeft size={18} className="text-muted-foreground" />
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm font-medium">Grouping</span>
                    <DropdownMenu open={open} onOpenChange={setOpen}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`flex items-center justify-between gap-2 h-7 min-w-[160px] px-3 pt-0.5 rounded border dark:bg-[#27292f] text-sm font-semibold text-white hover:bg-[#292b30] transition-colors focus:outline-none ${open ? "border-[#5e6ad2]" : "border-zinc-700"}`}
                        >
                          <span className="truncate">{value}</span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="start"
                        className="w-[160px] p-0 border border-zinc-700 bg-[#1c1d1f]"
                      >
                        {groupingOptions.map((opt) => {
                          const isSelected = value === opt;
                          return (
                            <DropdownMenuItem
                              key={opt}
                              onClick={() => setValue(opt)}
                              className={`cursor-pointer rounded-none px-3 py-1 text-sm font-semibold focus:bg-[#292b30] ${isSelected ? "bg-blue-400/30 text-white " : "text-white"}
              `}
                            >
                              {opt}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground hover:text-white cursor-pointer group">
                  <Columns size={18} className="text-muted-foreground" />
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm font-medium">Sub-grouping</span>
                    <DropdownMenu
                      open={subGroupOpen}
                      onOpenChange={setsubGroupOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`flex items-center justify-between gap-2 h-7 min-w-[160px] px-3 pt-0.5 rounded border  dark:bg-[#27292f] text-sm font-semibold text-white hover:bg-[#292b30] transition-colors focus:outline-none ${subGroupOpen ? "border-[#5e6ad2]" : "border-zinc-700"}`}
                        >
                          <span className="truncate">{subGroupvalue}</span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="start"
                        className="w-[160px] p-0 border border-zinc-700 bg-[#1c1d1f]"
                      >
                        {subGroupingOptions.map((opt) => {
                          const isSelected = subGroupvalue === opt;
                          return (
                            <DropdownMenuItem
                              key={opt}
                              onClick={() => setSubGroupValue(opt)}
                              className={`cursor-pointer rounded-none px-3 py-1 text-sm font-semibold focus:bg-[#292b30] ${isSelected ? "bg-blue-400/30 text-white " : "text-white"}
              `}
                            >
                              {opt}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-white cursor-pointer group">
                  <ArrowUpDown size={18} className="text-muted-foreground" />

                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm font-medium">Ordering</span>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-2">
                      <DropdownMenu
                        open={orderOpen}
                        onOpenChange={setOrderOpen}
                      >
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`flex items-center justify-between gap-2 h-7 min-w-[125px] px-3 pt-0.5 rounded border dark:bg-[#27292f] text-sm font-semibold text-white hover:bg-[#292b30] transition-colors focus:outline-none ${
                              orderOpen ? "border-[#5e6ad2]" : "border-zinc-700"
                            }`}
                          >
                            <span className="truncate">{ordering}</span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="start"
                          className="w-[160px] p-0 border border-zinc-700 bg-[#1c1d1f]"
                        >
                          {orderOptions.map((opt) => {
                            const isSelected = ordering === opt;
                            return (
                              <DropdownMenuItem
                                key={opt}
                                onClick={() => setOrdering(opt)}
                                className={`cursor-pointer rounded-none px-3 py-1 text-sm font-semibold focus:bg-[#292b30] ${
                                  isSelected
                                    ? "bg-blue-400/30 text-white"
                                    : "text-white"
                                }`}
                              >
                                {opt}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* ICON BUTTON RIGHT SIDE */}
                      <button className="h-7 w-7 flex items-center justify-center rounded border border-zinc-700 hover:bg-[#292b30] transition dark:bg-[#27292f]">
                        <ListOrdered className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Board View Options */}
                <div className="flex items-center gap-2 text-muted-foreground hover:text-white cursor-pointer group">
                  <Columns size={18} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Columns</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-white cursor-pointer group">
                  <Rows size={18} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Rows</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-white cursor-pointer group">
                  <ArrowUpDown size={18} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Ordering</span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between px-6 py-1">
            <span className="text-sm font-semibold text-muted-foreground">
              Order completed by recency
            </span>
            <Toggle
              checked={displayState.orderByRecency}
              onChange={() => handleToggle("orderByRecency")}
            />
          </div>

          {/* Common Options */}
          <div className="space-y-3 border-t dark:border-zinc-700 pt-3">
            <div className="flex items-center justify-between px-6">
              <span className="text-sm font-semibold text-muted-foreground">
                Show sub-issues
              </span>
              <Toggle
                checked={displayState.showSubIssues}
                onChange={() => handleToggle("showSubIssues")}
              />
            </div>
          </div>

          {/* View-Specific Settings */}
          <div className="space-y-3 border-t dark:border-zinc-700 pt-2 px-6">
            <h3 className="text-sm font-semibold text-muted-foreground">
              {view === "list" ? "List options" : "Board options"}
            </h3>

            {view === "list" ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Show empty groups
                </span>
                <Toggle
                  checked={displayState.showEmptyGroups}
                  onChange={() => handleToggle("showEmptyGroups")}
                />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Show empty columns
                  </span>
                  <Toggle
                    checked={displayState.showEmptyColumns}
                    onChange={() => handleToggle("showEmptyColumns")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Show empty rows
                  </span>
                  <Toggle
                    checked={displayState.showEmptyRows}
                    onChange={() => handleToggle("showEmptyRows")}
                  />
                </div>
              </>
            )}
          </div>

          {/* Display Properties */}
          <div className="space-y-2  border-zinc-700 pt-0.5 px-6">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Display properties
            </h3>

            <div className="flex flex-wrap gap-1.5 place-items-start">
              {[
                { key: "id" as const, label: "ID" },
                { key: "status" as const, label: "Status" },
                { key: "assignee" as const, label: "Assignee" },
                { key: "priority" as const, label: "Priority" },
                { key: "dueDate" as const, label: "Due date" },
                { key: "project" as const, label: "Project" },
                { key: "milestone" as const, label: "Milestone" },
                { key: "cycle" as const, label: "Cycle" },
                { key: "labels" as const, label: "Labels" },
                { key: "links" as const, label: "Links" },
                { key: "timeInStatus" as const, label: "Time in status" },
                { key: "created" as const, label: "Created" },
                { key: "updated" as const, label: "Updated" },
                { key: "pullRequests" as const, label: "Pull requests" },
              ].map((property) => (
                <PropertyCheckbox
                  key={property.key}
                  label={property.label}
                  checked={displayState.displayProperties[property.key]}
                  onChange={() => handlePropertyToggle(property.key)}
                />
              ))}
            </div>
          </div>

          {/* Reset Buttons */}
          <div className="flex items-center justify-end gap-2 border-t dark:border-zinc-700 p-1.5">
            <Button
              variant="noBorder"
              onClick={handleReset}
              className="px-1 py-0.5 bg-transparent  text-muted-foregroundz hover:text-white  text-sm font-medium transition-colors k"
            >
              Reset
            </Button>

            <Button variant="noBorder" className="px-3 py-2 bg-transparent dark:text-[#5e6ad2] hover:text-muted-foreground  rounded-lg text-sm font-medium ">
              Set default for everyone
            </Button>
          </div>

          {/* Debug Info - Current State */}
          {/* <div className="border-t border-slate-700 pt-4 text-xs text-slate-500 max-h-32 overflow-y-auto">
            <p className="font-mono">View: {view}</p>
            <p className="font-mono">
              Visible properties:{" "}
              {
                Object.values(displayState.displayProperties).filter(Boolean)
                  .length
              }
              /14
            </p>
          </div> */}
        </div>
      )}
    </div>
  );
}

/* Toggle Component */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-4 w-6 items-center rounded-full transition-colors ${
        checked ? "dark:bg-[#5e6ad2]" : "bg-[#717274]"
      }`}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-3" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* Property Checkbox Component */
function PropertyCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`
        inline-flex items-center justify-center
        h-6 px-3
        rounded-md
        text-[13px] font-semibold
        whitespace-nowrap
        transition-colors
       
        ${
          checked
            ? "bg-[#27292f] text-white border-zinc-700  border"
            : "bg-transparent text-muted-foreground  hover:text-white"
        }
      `}
    >
      {label}
    </button>
  );
}
