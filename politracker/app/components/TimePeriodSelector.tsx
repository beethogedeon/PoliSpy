"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type TimePeriod = 'week' | 'month' | 'overall';

interface TimePeriodSelectorProps {
  value: TimePeriod;
  onChange: (value: TimePeriod) => void;
}

export default function TimePeriodSelector({ value, onChange }: TimePeriodSelectorProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Time Period</Label>
        <RadioGroup
          value={value}
          onValueChange={(val) => onChange(val as TimePeriod)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="week" id="week" />
            <Label htmlFor="week">Weekly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="month" id="month" />
            <Label htmlFor="month">Monthly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="overall" id="overall" />
            <Label htmlFor="overall">Overall</Label>
          </div>
        </RadioGroup>
      </div>
    </Card>
  );
}