"use client";

import { DateRange } from "@/app/types";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface DateRangeSelectorProps {
  onChange: (range: DateRange) => void;
  campaignStartDate?: Date;
}

export default function DateRangeSelector({ onChange, campaignStartDate }: DateRangeSelectorProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(2024, 12, 1),
    end: new Date(2025, 4, 30)
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const newRange = {
      start: dateRange.start,
      end: dateRange.end
    };

    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      newRange.start = date;
      newRange.end = date;
    } else {
      if (date < dateRange.start) {
        newRange.start = date;
      } else {
        newRange.end = date;
      }
    }

    setDateRange(newRange);
    onChange(newRange);
  };

  const handlePresetClick = (days: number) => {
    if (!campaignStartDate) return;
    
    const newRange = {
      start: new Date(campaignStartDate.getTime() - (days * 24 * 60 * 60 * 1000)),
      end: campaignStartDate
    };
    
    setDateRange(newRange);
    onChange(newRange);
  };

  const handlePresetAfterClick = (days: number) => {
    if (!campaignStartDate) return;
    
    const newRange = {
      start: new Date(campaignStartDate.getTime() + (days * 24 * 60 * 60 * 1000)),
      end: campaignStartDate
    };
    
    setDateRange(newRange);
    onChange(newRange);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <Label>Select Date Range</Label>
          <div className="flex gap-4 mt-2">
            {campaignStartDate && (
              <>
                <button
                  onClick={() => handlePresetClick(100)}
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  100 Days Before Campaign
                </button>
                <button
                  onClick={() => handlePresetAfterClick(7)}
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Week After Campaign
                </button>
              </>
            )}
          </div>
        </div>
        <Calendar
          mode="range"
          selected={{
            from: dateRange.start,
            to: dateRange.end
          }}
          onSelect={(range) => {
            if (!range?.from || !range?.to) return;
            handleDateSelect(range.from);
            handleDateSelect(range.to);
          }}
          className="rounded-md border"
        />
      </div>
    </Card>
  );
}