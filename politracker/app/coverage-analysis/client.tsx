"use client";

import { useState } from "react";
import { MediaData, DateRange, TimePeriod } from "../types";
import DateRangeSelector from "../components/DateRangeSelector";
import MediaSelector from "../components/MediaSelector";
import CategorySelector from "../components/CategorySelector";
import TimePeriodSelector from "../components/TimePeriodSelector";
import CoverageChart from "../components/CoverageChart";
import CategoryCoverageChart from "../components/CategoryCoverageChart";
import { Card } from "@/components/ui/card";
//import BokehChart from "../components/BokehCharts";

//import InteractivePoliticalPartyCoverageChart from '../components/InteractivePoliticalPartyCoverageChart';


interface CoverageAnalysisClientProps {
  initialData: MediaData[];
}

export default function CoverageAnalysisClient({ initialData }: CoverageAnalysisClientProps) {
  const [data] = useState<MediaData[]>(initialData);
  const [filteredData, setFilteredData] = useState<MediaData[]>(initialData);
  const [allMedias] = useState<string[]>(
    Array.from(new Set(initialData.map(item => item.Public))).sort()
  );
  const [selectedMedias, setSelectedMedias] = useState<string[]>(
    Array.from(new Set(initialData.map(item => item.Public))).sort().slice(0, 8)
  );
  const [allCategories] = useState<string[]>(
    Array.from(new Set(initialData.map(item => item.category))).sort()
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Array.from(new Set(initialData.map(item => item.category))).sort().slice(0, 8)
  );
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('overall');
  const campaignStartDate = new Date("2025-03-23");

  const handleDateRangeChange = (range: DateRange) => {
    const filtered = data.filter(item => {
      const itemDate = new Date(item.Dates);
      return itemDate >= range.start && itemDate <= range.end;
    });
    setFilteredData(filtered);
  };

  const aggregateDataByPeriod = (data: MediaData[]): MediaData[] => {
    if (timePeriod === 'overall') return data;

    const groupedData = data.reduce((acc, item) => {
      const key = timePeriod === 'week' ? item.Week : item.Monthly;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, MediaData[]>);

    return Object.values(groupedData).map(group => {
      const firstItem = group[0];
      return {
        ...firstItem,
        tone_score: group.reduce((sum, item) => sum + item.tone_score, 0) / group.length
      };
    });
  };

  const processedData = aggregateDataByPeriod(filteredData);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Coverage Analysis</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="order-2 lg:order-1 space-y-6">
            <TimePeriodSelector
              value={timePeriod}
              onChange={setTimePeriod}
            />
            <DateRangeSelector 
              onChange={handleDateRangeChange}
              campaignStartDate={campaignStartDate}
            />
            <MediaSelector
              medias={allMedias}
              selectedMedias={selectedMedias}
              onChange={setSelectedMedias}
            />
            <CategorySelector
              categories={allCategories}
              selectedCategories={selectedCategories}
              onChange={setSelectedCategories}
            />
          </div>
          
          <div className="order-1 lg:order-2 lg:col-span-3 space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Coverage Overview</h2>
              <p className="text-muted-foreground">
                This analysis examines the distribution of media coverage across different political parties and topics.
                Use the filters on the left to explore specific time periods, media outlets, and categories.
                Data can be viewed aggregated by week, month, or overall using the time period selector.
              </p>
            </Card>

            <CoverageChart 
              data={processedData}
              selectedMedias={selectedMedias}
              title={`Media Coverage by Political Party (${timePeriod})`}
            />
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Media Coverage Patterns</h2>
              <p className="text-muted-foreground">
                The chart above shows how different media outlets allocate coverage across political parties.
                This helps identify potential coverage bias and media attention patterns.
              </p>
            </Card>
            
            <CategoryCoverageChart
              data={processedData}
              selectedCategories={selectedCategories}
              title={`Coverage by Category and Political Party (${timePeriod})`}
            />
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Topical Analysis</h2>
              <p className="text-muted-foreground">
                This breakdown reveals how different political topics receive varying levels of coverage across parties,
                helping identify which issues dominate the political discourse in different media outlets.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}