"use client";

import { MediaData } from "@/app/types";
import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CategoryCoverageChartProps {
  data: MediaData[];
  selectedCategories: string[];
  title: string;
}

function roundToNearest(num: number, decimals = 0) {
  // Arrondir d'abord avec Math.round
  const rounded = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  // Puis utiliser toFixed pour formater
  return rounded.toFixed(decimals);
}

export default function CategoryCoverageChart({ data, selectedCategories, title }: CategoryCoverageChartProps) {
  const partyColors = {
    'LIBERAL': '#C00000',
    'NDP': '#FF6600',
    'BQ': '#0F9ED5',
    'GREEN': '#00B050',
    'CONSERVATIVE': '#0171C0',
  };

  const coverageByCategory = data.reduce((acc, curr) => {
    if (!curr.Parti || !curr.category || !selectedCategories.includes(curr.category)) return acc;
    
    if (!acc[curr.category]) {
      acc[curr.category] = {
        category: curr.category,
        LIBERAL: 0,
        CONSERVATIVE: 0,
        NDP: 0,
        GREEN: 0,
        BQ: 0,
        total: 0
      };
    }
    
    acc[curr.category][curr.Parti]++;
    acc[curr.category].total++;
    
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(coverageByCategory)
    .sort((a, b) => b.total - a.total)
    .map(item => ({
      name: item.category,
      LIBERAL: roundToNearest(item.LIBERAL / item.total * 100,1),
      CONSERVATIVE: roundToNearest(item.CONSERVATIVE / item.total * 100,1),
      NDP: roundToNearest(item.NDP / item.total * 100,1),
      GREEN: roundToNearest(item.GREEN / item.total * 100,1),
      BQ: roundToNearest(item.BQ / item.total * 100,1),
    }));

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${roundToNearest(value)}%`} />
            <YAxis type="category" dataKey="name" width={120} />
            <Tooltip 
              formatter={(value: any) => [`${Number(roundToNearest(value))}%`]}
              labelFormatter={(label) => `Category: ${label}`}
            />
            <Legend />
            <Bar dataKey="CONSERVATIVE" stackId="a" fill={partyColors.CONSERVATIVE} name="Conservative" />
            <Bar dataKey="LIBERAL" stackId="a" fill={partyColors.LIBERAL} name="Liberal" />
            <Bar dataKey="NDP" stackId="a" fill={partyColors.NDP} name="NDP" />
            <Bar dataKey="GREEN" stackId="a" fill={partyColors.GREEN} name="Green" />
            <Bar dataKey="BQ" stackId="a" fill={partyColors.BQ} name="BQ" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}