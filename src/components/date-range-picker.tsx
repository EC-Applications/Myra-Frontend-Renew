"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateRangePickerDialogProps {
  start_date: string;
  end_date: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply?: (endDate: string, cycleId: number) => void;
  cycleId: number;
}

export const DateRangePickerDialog: React.FC<DateRangePickerDialogProps> = ({
  open,
  onOpenChange,
  onApply,
  start_date,
  end_date,
  cycleId,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026

  useEffect(() => {
    if (open && start_date && end_date) {
      // Parse and normalize dates (remove time component)
      const parsedStartDate = new Date(start_date);
      const normalizedStart = new Date(
        parsedStartDate.getFullYear(),
        parsedStartDate.getMonth(),
        parsedStartDate.getDate()
      );

      const parsedEndDate = new Date(end_date);
      const normalizedEnd = new Date(
        parsedEndDate.getFullYear(),
        parsedEndDate.getMonth(),
        parsedEndDate.getDate()
      );

      setStartDate(normalizedStart);
      setEndDate(normalizedEnd);
      setCurrentMonth(normalizedStart);
    }
  }, [open, start_date, end_date]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = (date: Date) => {
    const days = [];
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);

 
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  };

  const handleDateClick = (date: Date) => {
    if (startDate) {
      if (date >= startDate) {
        setEndDate(date);
      }
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleApply = () => {
    if (startDate && endDate) {
      // Format end date as YYYY-MM-DD (use local timezone, not UTC)
      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, '0');
      const day = String(endDate.getDate()).padStart(2, '0');
      const formattedEndDate = `${year}-${month}-${day}`;

      onApply?.(formattedEndDate, cycleId);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setStartDate(null);
    setEndDate(null);
    onOpenChange(false);
  };

  const month1 = currentMonth;
  const month2 = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1
  );

  const days1 = generateCalendarDays(month1);
  const days2 = generateCalendarDays(month2);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const Calendar = ({
    month,
    days,
  }: {
    month: Date;
    days: (Date | null)[];
  }) => (
    <div className="flex-1">
      <h3 className="text-xl font-medium text-neutral-200 mb-4">
        {monthNames[month.getMonth()]} {month.getFullYear()}
      </h3>
      <div className="grid grid-cols-7 gap-2 mb-2 ">
        {dayNames.map((day) => (
          <div
            key={day}
            className="w-8 h-8 flex items-center justify-center text-lg text-neutral-400  "
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          // Normalize day for comparison (remove time component)
          const normalizedDay = day
            ? new Date(day.getFullYear(), day.getMonth(), day.getDate())
            : null;

          const isDisabled =
            normalizedDay &&
            startDate &&
            normalizedDay.getTime() < startDate.getTime();
          const isStart =
            normalizedDay &&
            startDate &&
            normalizedDay.getTime() === startDate.getTime();
          const isEnd =
            normalizedDay &&
            endDate &&
            normalizedDay.getTime() === endDate.getTime();

          return (
            <div
              key={`${month.getMonth()}-${idx}`}
              className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-colors  ${
                !day
                  ? "text-neutral-700"
                  : isDisabled
                  ? "text-neutral-600 cursor-not-allowed opacity-50"
                  : isStart
                  ? "border-2 border-blue-500 bg-gray-600 rounded-full text-white font-semibold"
                  : isEnd
                  ? "border-2 border-blue-500 rounded-full text-white font-semibold cursor-pointer"
                  : isDateInRange(day)
                  ? "bg-neutral-600 text-white cursor-pointer"
                  : "text-neutral-300 hover:bg-neutral-700 cursor-pointer"
              }`}
              onClick={() => day && !isDisabled && handleDateClick(day)}
            >
              {day ? day.getDate() : ""}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border-neutral-700 !max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">
            Change cycle and date
          </DialogTitle>
        </DialogHeader>

        {/* Calendar Container */}
        <div className="flex items-start justify-between gap-8 py-6">
          <Calendar month={month1} days={days1} />

          {/* Navigation Arrows */}
          <div className="flex flex-col items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-neutral-700 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-400 hover:text-neutral-200" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-neutral-700 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-neutral-400 hover:text-neutral-200" />
            </button>
          </div>

          <Calendar month={month2} days={days2} />
        </div>

        {/* Footer with Action Buttons */}
        <DialogFooter className="flex gap-3 justify-end border-t border-neutral-700 pt-6">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="bg-neutral-700 border-neutral-600 text-neutral-200 hover:bg-neutral-600 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!startDate || !endDate}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
