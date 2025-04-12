"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CategorySelectorProps {
  categories: string[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export default function CategorySelector({ categories, selectedCategories, onChange }: CategorySelectorProps) {
  const toggleCategory = (category: string) => {
    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onChange(newSelection);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Select Categories</Label>
          <div className="grid grid-cols-1 gap-3 mt-4">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <Label htmlFor={category} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}