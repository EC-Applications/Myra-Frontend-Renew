"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Filter,
  ChevronRight,
  Settings,
  BarChart3,
  Folder,
  Users,
  User,
  Heart,
  AlertCircle,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { iPojectStatus } from "@/interfaces/project.interface";

interface FilterCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  options?: FilterOption[];
}

interface FilterOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: string;
  type?: "checkbox" | "radio";
  isChecked?: boolean;
}

const getFilterCategories = (
  statusData: iPojectStatus[],
  priorityData: any[],
  teamsData: any[],
  membersData: any[]
): FilterCategory[] => [
  {
    id: "status",
    label: "Status",
    icon: <Settings className="w-4 h-4" />,
    options: statusData.map((statusItem) => ({
      id: statusItem.id.toString(),
      label: statusItem.name,
      icon: statusItem.icon ? (
        <img
          src={statusItem.icon}
          alt={statusItem.name}
          className="w-4 h-4 object-contain"
        />
      ) : (
        <AlertCircle className="w-4 h-4" />
      ),
    })),
  },
  {
    id: "priority",
    label: "Priority",
    icon: <BarChart3 className="w-4 h-4" />,
    options: priorityData.map((priorityItem) => ({
      id: priorityItem.id.toString(),
      label: priorityItem.status,
      icon: priorityItem.icon ? (
        <img
          src={priorityItem.icon}
          alt={priorityItem.status}
          className="w-4 h-4 object-contain"
        />
      ) : (
        <BarChart3 className="w-4 h-4" />
      ),
      type: "radio" as const,
    })),
  },
  // {
  //   id: "labels",
  //   label: "Labels",
  //   icon: <Folder className="w-4 h-4" />,
  //   options: [
  //     { id: "bug", label: "Bug", type: "checkbox" },
  //     { id: "feature", label: "Feature", type: "checkbox" },
  //     { id: "enhancement", label: "Enhancement", type: "checkbox" },
  //     { id: "documentation", label: "Documentation", type: "checkbox" },
  //   ],
  // },
  {
    id: "teams",
    label: "Teams",
    icon: <Users className="w-4 h-4" />,
    options: teamsData.map((team) => ({
      id: team.id.toString(),
      label: team.name,
      icon: team.icon?.icon ? (
        <span className="w-4 h-4 flex items-center justify-center">
          {team.icon.type === "icon" ? "📁" : team.icon.icon}
        </span>
      ) : (
        <Users className="w-4 h-4" />
      ),
      type: "checkbox" as const,
    })),
  },
  {
    id: "members",
    label: "Members",
    icon: <User className="w-4 h-4" />,
    options: membersData.map((member) => ({
      id: member.id.toString(),
      label: member.name || member.email,
      type: "checkbox" as const,
    })),
  },
];

function CategorySubmenu({
  category,
  searchQuery,
  selectedFilters,
  onToggleFilter,
  onClose,
}: {
  category: FilterCategory;
  searchQuery: string;
  selectedFilters: ProjectFilters;
  onToggleFilter: (categoryId: string, optionId: string) => void;
  onClose: () => void;
}) {
  const isSelected = (optionId: string) => {
    const categoryKey = category.id as keyof ProjectFilters;
    const selected = selectedFilters[categoryKey] as any[];

    if (category.id === "labels") {
      return selected.includes(optionId);
    }
    return selected.includes(parseInt(optionId));
  };

  const handleOptionClick = (optionId: string) => {
    onToggleFilter(category.id, optionId);
    // Auto-close submenu after selection (Linear-style UX)
    setTimeout(() => {
      onClose();
    }, 150); // Small delay for visual feedback
  };

  return (
    <div className="w-80 p-0">
      {/* Submenu Search */}
      <div className="p-3 border-b border-zinc-800">
        <Input
          type="text"
          placeholder="Filter..."
          value={searchQuery}
          onChange={(e) => e.preventDefault()}
          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 h-9 text-sm"
        />
      </div>

      {/* Options */}
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {category.options?.map((option) => {
          const checked = isSelected(option.id);

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm text-left transition-all duration-150 border-b border-zinc-800/50 last:border-b-0 ${
                checked
                  ? " hover:bg-gray-500/20 rounded "
                  : "hover:bg-zinc-800/50"
              }`}
            >
              {/* Icon/Checkbox/Radio */}
              <div className="flex-shrink-0">
                {option.type === "checkbox" ? (
                  <Checkbox
                    checked={checked}
                    className="border-zinc-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    onCheckedChange={() => {}}
                  />
                ) : option.type === "radio" ? (
                  <input
                    type="radio"
                    checked={checked}
                    onChange={() => {}}
                    className="w-4 h-4 border-zinc-600 accent-blue-500"
                  />
                ) : option.icon ? (
                  <span className="w-4 h-4 flex items-center justify-center">
                    {option.icon}
                  </span>
                ) : null}
              </div>

              {/* Label & Count */}
              <div className="flex-1 flex items-center justify-between">
                <span
                  className={`font-normal ${
                    checked ? "text-blue-400" : "text-white"
                  }`}
                >
                  {option.label}
                </span>
                {checked ? (
                  <div className="">
                    <Check className="h-4 w-4" />
                  </div>
                ) : (
                  <div className=""></div>
                )}
                {option.count && (
                  <span className="text-zinc-500 text-xs">{option.count}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterCategoryButton({
  category,
  searchQuery,
  selectedFilters,
  onToggleFilter,
}: {
  category: FilterCategory;
  searchQuery: string;
  selectedFilters: ProjectFilters;
  onToggleFilter: (categoryId: string, optionId: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "w-full px-4 py-2.5 flex items-center gap-3 text-sm text-left transition-colors border-b border-zinc-800/50 last:border-b-0 text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
          )}
        >
          <span className="text-zinc-400 flex-shrink-0">{category.icon}</span>
          <span className="flex-1 font-normal">{category.label}</span>
          {category.options && (
            <ChevronRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
          )}
        </button>
      </PopoverTrigger>
      {category.options && (
        <PopoverContent
          side="right"
          align="start"
          className="p-0 bg-zinc-900 border-zinc-800 w-80 animate-in fade-in-0 zoom-in-95 slide-in-from-left-2 duration-200"
        >
          <CategorySubmenu
            category={category}
            searchQuery={searchQuery}
            selectedFilters={selectedFilters}
            onToggleFilter={onToggleFilter}
            onClose={() => setOpen(false)}
          />
        </PopoverContent>
      )}
    </Popover>
  );
}

interface FilterDropdownProps {
  onFilterChange?: (filters: ProjectFilters) => void;
}

export interface ProjectFilters {
  status: number[];
  priority: number[];
  teams: number[];
  members: number[];
  labels: string[];
}

export function FilterDropdown({ onFilterChange }: FilterDropdownProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<ProjectFilters>({
    status: [],
    priority: [],
    teams: [],
    members: [],
    labels: [],
  });

  const prioirty = useSelector((state: RootState) => state.priority);
  const teams = useSelector((state: RootState) => state.teams);
  const workspaceMember = useSelector((state: any) => state.workspace);
  const members = Array.isArray(workspaceMember) ? workspaceMember : [];

  const statusFromRedux = useSelector((state: RootState) => state.status);

  // Handle if status is nested object {status: Array} or direct array
  const status = (statusFromRedux as any)?.status || statusFromRedux;

  // Get dynamic categories with status data
  const statusArray = Array.isArray(status) ? status : [];

  // Extract priority array from nested object (same as status)
  const priorityFromRedux = (prioirty as any)?.priority || prioirty;
  const priorityArray = Array.isArray(priorityFromRedux)
    ? priorityFromRedux
    : [];

  // Teams and members are already arrays
  const teamsArray = Array.isArray(teams) ? teams : [];
  const membersArray = Array.isArray(members) ? members : [];

  const FILTER_CATEGORIES = getFilterCategories(
    statusArray,
    priorityArray,
    teamsArray,
    membersArray
  );

  // Toggle filter selection
  const toggleFilter = (categoryId: string, optionId: string) => {
    setSelectedFilters((prev) => {
      const category = categoryId as keyof ProjectFilters;
      const currentValues = prev[category] as any[];
      const numericId = parseInt(optionId);

      let newValues;
      if (category === "priority") {
        // Radio behavior for priority - only one selection
        newValues = currentValues.includes(numericId) ? [] : [numericId];
      } else if (category === "labels") {
        // String IDs for labels
        const stringId = optionId;
        newValues = currentValues.includes(stringId)
          ? currentValues.filter((id) => id !== stringId)
          : [...currentValues, stringId];
      } else {
        // Checkbox behavior - multiple selections
        newValues = currentValues.includes(numericId)
          ? currentValues.filter((id) => id !== numericId)
          : [...currentValues, numericId];
      }

      const updated = { ...prev, [category]: newValues };

      // Notify parent component
      if (onFilterChange) {
        onFilterChange(updated);
      }

      return updated;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters: ProjectFilters = {
      status: [],
      priority: [],
      teams: [],
      members: [],
      labels: [],
    };
    setSelectedFilters(emptyFilters);
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

  // Count active filters
  const activeFilterCount = Object.values(selectedFilters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const filteredCategories = FILTER_CATEGORIES.filter((cat) =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-[#e8e8e8] dark:hover:bg-zinc-900 transition-colors dark:text-zinc-300 relative">
          <Filter className="w-4 h-4" />
          Filter
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="p-0 bg-zinc-900 border-zinc-800 w-80"
      >
        {/* Header */}
        {/* <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
          <Filter className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-medium text-white">Filter</span>
        </div> */}

        {/* Search Input */}
        <div className="px-4 py-2 border-b border-zinc-800">
          <div className="relative">
            <Input
              type="text"
              placeholder="Filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className=" bg-zinc-800 border-zinc-700  placeholder:text-zinc-500 pr-8 h-9 text-sm"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-medium">
              F
            </span>
          </div>
        </div>

        {/* Categories List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCategories.map((category) => (
            <FilterCategoryButton
              key={category.id}
              category={category}
              searchQuery={searchQuery}
              selectedFilters={selectedFilters}
              onToggleFilter={toggleFilter}
            />
          ))}

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2.5 text-sm text-left transition-colors hover:bg-zinc-800/50 border-t border-zinc-800  cursor-pointer "
            >
              Clear all filters ({activeFilterCount})
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
