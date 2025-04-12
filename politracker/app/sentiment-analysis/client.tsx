"use client";

import { useState } from "react";
import { MediaData, DateRange, TimePeriod } from "../types";
import SentimentChart from "../components/SentimentChart";
import SentimentByMediaChart from "../components/SentimentByMediaChart";
import DateRangeSelector from "../components/DateRangeSelector";
import MediaSelector from "../components/MediaSelector";
import CategorySelector from "../components/CategorySelector";
import TimePeriodSelector from "../components/TimePeriodSelector";
import { Card } from "@/components/ui/card";

interface SentimentAnalysisClientProps {
  initialData: MediaData[];
}

export default function SentimentAnalysisClient({ initialData }: SentimentAnalysisClientProps) {
  const [data] = useState<MediaData[]>(initialData);
  const [filteredData, setFilteredData] = useState<MediaData[]>(initialData);
  const [allMedias] = useState<string[]>(
    Array.from(new Set(initialData.map(item => item.Public))).sort()
  );
  const [selectedMedias, setSelectedMedias] = useState<string[]>(
    Array.from(new Set(initialData.map(item => item.Public))).sort().slice(0, 5)
  );
  const [allCategories] = useState<string[]>(
    Array.from(new Set(initialData.map(item => item.category))).sort()
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Array.from(new Set(initialData.map(item => item.category))).sort().slice(0, 5)
  );
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('overall');
  const campaignStartDate = new Date("2015-03-23");

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

  if (filteredData.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">No Data Available</h2>
          <p className="text-muted-foreground">
            No data matches the current filter criteria. Try adjusting the date range or other filters.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Sentiment Analysis</h1>
        
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
            
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-2">Debug Information</h3>
              <div className="text-xs text-muted-foreground">
                <p>Total records: {data.length}</p>
                <p>Filtered records: {filteredData.length}</p>
                <p>Aggregated records: {processedData.length}</p>
                <p>Time period: {timePeriod}</p>
                <p>Selected media outlets: {selectedMedias.length}</p>
                <p>Selected categories: {selectedCategories.length}</p>
              </div>
            </Card>
          </div>
          
          <div className="order-1 lg:order-2 lg:col-span-3 space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Analysis Overview</h2>
              <p className="text-muted-foreground">
                This analysis shows the sentiment distribution across different political parties and media outlets. 
                The data reveals how different media sources cover political parties and the overall tone of their coverage.
                Use the time period selector to view data aggregated by week, month, or overall.
              </p>
            </Card>
            
            <SentimentChart 
              data={processedData}
              title={`Overall Sentiment Distribution by Party (${timePeriod})`}
            />
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Sentiment Trends</h2>
              <p className="text-muted-foreground">
                The chart above shows the distribution of positive, negative, and neutral sentiments for each political party.
                This helps identify potential media bias and differences in coverage tone across parties.
              </p>
            </Card>
            
            <SentimentByMediaChart
              data={processedData}
              selectedMedias={selectedMedias}
              title={`Sentiment Distribution by Party and Media (${timePeriod})`}
            />
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Media Outlet Analysis</h2>
              <p className="text-muted-foreground">
                This breakdown shows how different media outlets cover each political party, revealing potential variations
                in editorial stance and coverage patterns across different news sources.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}