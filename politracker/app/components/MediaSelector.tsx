"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface MediaSelectorProps {
  medias: string[];
  selectedMedias: string[];
  onChange: (medias: string[]) => void;
}

export default function MediaSelector({ medias, selectedMedias, onChange }: MediaSelectorProps) {
  const toggleMedia = (media: string) => {
    const newSelection = selectedMedias.includes(media)
      ? selectedMedias.filter(m => m !== media)
      : [...selectedMedias, media];
    onChange(newSelection);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Select Media Outlets</Label>
          <div className="grid grid-cols-1 gap-3 mt-4">
            {medias.map((media) => (
              <div key={media} className="flex items-center space-x-2">
                <Checkbox
                  id={media}
                  checked={selectedMedias.includes(media)}
                  onCheckedChange={() => toggleMedia(media)}
                />
                <Label htmlFor={media} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {media}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}