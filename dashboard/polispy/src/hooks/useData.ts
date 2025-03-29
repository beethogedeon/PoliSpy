import { useState, useEffect } from 'react';
import { PartyData, TimeFrame, DateRange } from '../types';
import politicalData from '../data/political-data.json';

export const useData = () => {
  const [data, setData] = useState<PartyData>({});
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date('2024-12-01'),
    end: new Date('2025-03-24'),
  });

  useEffect(() => {
    // Filter data based on timeFrame and dateRange
    const filteredData = Object.entries(politicalData).reduce((acc, [party, entries]) => {
      acc[party] = entries
        .filter((entry: { date: string | number | Date; }) => {
          const entryDate = new Date(entry.date);
          return entryDate >= dateRange.start && entryDate <= dateRange.end;
        })
        .map((entry: { sentiment: string; }) => ({
          ...entry,
          sentiment: entry.sentiment as 'Positive' | 'Neutral' | 'Negative',
        }));
      return acc;
    }, {} as PartyData);

    setData(filteredData);
  }, [timeFrame, dateRange]);

  return {
    data,
    timeFrame,
    setTimeFrame,
    dateRange,
    setDateRange,
  };
};

export default useData;