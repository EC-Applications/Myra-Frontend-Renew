"use client";

import type React from "react";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parse,
  startOfQuarter,
  getQuarter,
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type SelectionMode = "Day" | "Month" | "Quarter" | "Half-year" | "Year";
type DatePickerVariant = "full" | "compact" | "inline";

interface ProjectDatePickerProps {
  label?: string;
  value: Date | undefined;
  onChange: (date: Date | null)  => void;
  className?: string;
  variant?: DatePickerVariant;
  disabled?: boolean;
  buttonVarient?: "light" | "dark";
}

export const ProjectDatePicker = ({
  label = "Start date",
  value,
  onChange,
  className,
  variant = "full",
  disabled = false,
  buttonVarient = "light",
}: ProjectDatePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(value ?? new Date());
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("Day");
  const [inputValue, setInputValue] = useState(
    value ? format(value, "MM/dd/yyyy") : "",
  );
  const [open, setOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    try {
      const formats = ["MM/dd/yyyy", "dd/MM/yyyy", "MMMM yyyy", "MMM yyyy"];
      for (const formatStr of formats) {
        try {
          const parsed = normalizeDate(
            parse(e.target.value, formatStr, new Date()),
          );
          if (!isNaN(parsed.getTime())) {
            onChange(parsed);
            setCurrentMonth(parsed);
            break;
          }
        } catch {
          console.warn("Something went wrong");
        }
      }
    } catch {
      console.warn("Something went wrong");
    }
  };

  const normalizeDate = (date: Date) =>
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12, // noon
    );

  const renderCalendar = () => {
    switch (selectionMode) {
      case "Day":
        return renderDayView();
      case "Month":
        return renderMonthView();
      case "Quarter":
        return renderQuarterView();
      case "Half-year":
        return renderHalfYearView();
      case "Year":
        return renderYearView();
      default:
        return renderDayView();
    }
  };

  const renderDayView = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;

    // Weekday headers
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected = value && isSameDay(day, value);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());

        days.push(
          <button
            key={day.toString()}
            type="button"
            onClick={() => {
              const safeDate = normalizeDate(cloneDay);
              if (value && isSameDay(value, safeDate)) {
                onChange(null); // ya null (jo tum use kar rahe ho)
                setInputValue("");
              } else {
                onChange(safeDate);
                setInputValue(format(safeDate, "MM/dd/yyyy"));
              }

              setOpen(false);
            }}
            className={cn(
              "h-9 w-9 text-sm font-normal transition-colors rounded-md",
              !isCurrentMonth && "text-muted-foreground/40",
              isCurrentMonth && "text-foreground hover:bg-accent",
              isSelected &&
                "bg-primary text-primary-foreground hover:bg-primary",
              isToday &&
                !isSelected &&
                "dark:bg-[#5e6ad2]  bg-accent/50 font-medium",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            {format(day, dateFormat)}
          </button>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="flex justify-between gap-1">
          {days}
        </div>,
      );
      days = [];
    }

    return (
      <div className="space-y-1">
        <div className="flex justify-between mb-2">
          {weekDays.map((weekDay) => (
            <div
              key={weekDay}
              className="h-9 w-9 text-xs font-medium text-muted-foreground flex items-center justify-center"
            >
              {weekDay}
            </div>
          ))}
        </div>
        {rows}
      </div>
    );
  };

  const renderMonthView = () => {
    const months = [];
    const year = currentMonth.getFullYear();

    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(year, i, 1);
      const isSelected =
        value && value.getMonth() === i && value.getFullYear() === year;

      months.push(
        <button
          key={i}
          type="button"
          onClick={() => {
            const newDate = normalizeDate(new Date(year, i, 1));
            onChange(newDate);
            setInputValue(format(newDate, "MMMM yyyy"));
            setOpen(false);
          }}
          className={cn(
            "h-16 px-4 text-sm font-medium transition-colors rounded-md",
            "text-foreground hover:bg-accent",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          {format(monthDate, "MMM")}
        </button>,
      );
    }

    return <div className="grid grid-cols-3 gap-2">{months}</div>;
  };

  const renderQuarterView = () => {
    const quarters = [];
    const year = currentMonth.getFullYear();

    for (let i = 1; i <= 4; i++) {
      const quarterDate = new Date(year, (i - 1) * 3, 1);
      const isSelected =
        value && getQuarter(value) === i && value.getFullYear() === year;

      quarters.push(
        <button
          key={i}
          type="button"
          onClick={() => {
            const newDate = startOfQuarter(quarterDate);
            onChange(newDate);
            setInputValue(`Q${i} ${year}`);
            setOpen(false);
          }}
          className={cn(
            "h-20 px-4 text-sm font-medium transition-colors rounded-md",
            "text-foreground hover:bg-accent ",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          Q{i}
        </button>,
      );
    }

    return <div className="grid grid-cols-2 gap-2">{quarters}</div>;
  };

  const renderHalfYearView = () => {
    const halves = [];
    const year = currentMonth.getFullYear();

    for (let i = 1; i <= 2; i++) {
      const halfDate = new Date(year, (i - 1) * 6, 1);
      const isSelected =
        value &&
        ((i === 1 && value.getMonth() < 6) ||
          (i === 2 && value.getMonth() >= 6)) &&
        value.getFullYear() === year;

      halves.push(
        <button
          key={i}
          type="button"
          onClick={() => {
            const newDate = new Date(year, (i - 1) * 6, 1);
            onChange(newDate);
            setInputValue(`H${i} ${year}`);
            setOpen(false);
          }}
          className={cn(
            "h-24 px-4 text-sm font-medium transition-colors rounded-md",
            "text-foreground hover:bg-accent",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          H{i}
          <div className="text-xs text-muted-foreground mt-1">
            {i === 1 ? "Jan - Jun" : "Jul - Dec"}
          </div>
        </button>,
      );
    }

    return <div className="grid grid-cols-2 gap-2">{halves}</div>;
  };

  const renderYearView = () => {
    const years = [];
    const currentYear = currentMonth.getFullYear();
    const startYear = currentYear - 4;

    for (let i = 0; i < 9; i++) {
      const year = startYear + i;
      const isSelected = value && value.getFullYear() === year;

      years.push(
        <button
          key={year}
          type="button"
          onClick={() => {
            const newDate = new Date(year, 0, 1);
            onChange(newDate);
            setInputValue(year.toString());
            setOpen(false);
          }}
          className={cn(
            "h-16 px-4 text-sm font-medium transition-colors rounded-md",
            "text-foreground hover:bg-accent",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          {year}
        </button>,
      );
    }

    return <div className="grid grid-cols-3 gap-2">{years}</div>;
  };

  const modes: SelectionMode[] = [
    "Day",
    "Month",
    "Quarter",
    "Half-year",
    "Year",
  ];

  const handlePrevious = () => {
    if (selectionMode === "Year") {
      setCurrentMonth(subMonths(currentMonth, 108)); // 9 years
    } else if (
      selectionMode === "Month" ||
      selectionMode === "Quarter" ||
      selectionMode === "Half-year"
    ) {
      setCurrentMonth(subMonths(currentMonth, 12)); // 1 year
    } else {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  const handleNext = () => {
    if (selectionMode === "Year") {
      setCurrentMonth(addMonths(currentMonth, 108)); // 9 years
    } else if (
      selectionMode === "Month" ||
      selectionMode === "Quarter" ||
      selectionMode === "Half-year"
    ) {
      setCurrentMonth(addMonths(currentMonth, 12)); // 1 year
    } else {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const getCurrentPeriod = () => {
    const year = currentMonth.getFullYear();
    if (selectionMode === "Day") {
      return format(currentMonth, "MMMM yyyy");
    } else if (selectionMode === "Year") {
      return `${year - 4} - ${year + 4}`;
    } else {
      return year.toString();
    }
  };

  // Render different UI based on variant
  const renderTrigger = () => {
    if (variant === "inline") {
      // Inline variant (just date text + icon, no button border)
      return (
        <button
          disabled={disabled}
          className={cn(
            "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
        >
          <CalendarIcon className="w-3 h-3" />
          {value ? format(value, "MMM d") : "No date"}
        </button>
      );
    }

    if (variant === "compact") {
      // Compact variant (icon + short date)
      return (
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-8 w-auto justify-start gap-1.5 px-2 text-sm font-normal text-muted-foreground hover:text-foreground border",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          <span className="text-xs">
            {value ? format(value, "MMM d, yy") : label}
          </span>
        </Button>
      );
    }

    // Full variant (default - full date with label)
    return (
      <Button
        variant="outline"
        disabled={disabled}
        className={cn(
          `h-7.5  ${buttonVarient == "light" ? "dark:bg-[#2a2c33]" : "dark:bg-transparent"} justify-start text-sm  text-muted-foreground dark:hover:text-white dark:hover:bg-[#32333a] font-semibold`,
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <CalendarIcon className="h-3 w-3" />

        {value ? format(value, "PPP") : label}
      </Button>
    );
  };

  return (
    <div className={className}>
      {/* Label */}
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild disabled={disabled}>
          {renderTrigger()}
        </PopoverTrigger>
        <PopoverContent
          className="w-100 p-0 max-h-[400px] overflow-auto dark:bg-[#1c1d1f]"
          align="start"
        >
          <div className="p-4 space-y-4">
            {/* Input */}
            <Input
              type="text"
              placeholder="Try: May 2026, Q4, 20/05/2026"
              value={inputValue}
              onChange={handleInputChange}
              className="h-11 text-sm dark:caret-[#5e6ad2] dark:border-[#5e6ad2]  "
            />

            {/* Selection Mode Tabs */}
            <div className="flex gap-2 border-b pb-3">
              {modes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSelectionMode(mode)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium  rounded-md transition-colors",
                    selectionMode === mode
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <Button
                size="icon"
                variant="ghost"
                onClick={handlePrevious}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm font-medium">{getCurrentPeriod()}</span>

              <Button
                size="icon"
                variant="ghost"
                onClick={handleNext}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            {renderCalendar()}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
