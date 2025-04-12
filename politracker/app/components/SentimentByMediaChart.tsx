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

interface SentimentByMediaChartProps {
  data: MediaData[];
  selectedMedias: string[];
  title: string;
}

function roundToNearest(num: number, decimals = 1) {
  // Arrondir d'abord avec Math.round
  const rounded = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  // Puis utiliser toFixed pour formater
  return rounded.toFixed(decimals);
}

export default function SentimentByMediaChart({ data, selectedMedias, title }: SentimentByMediaChartProps) {
  const sentimentByPartyAndMedia = data.reduce((acc, curr) => {
    if (!curr.Parti || !curr.sentiment || !curr.Public || !selectedMedias.includes(curr.Public)) return acc;
    
    const key = `${curr.Public}-${curr.Parti}`;
    if (!acc[key]) {
      acc[key] = {
        media: curr.Public,
        party: curr.Parti,
        Positive: 0,
        Negative: 0,
        Neutral: 0,
        total: 0
      };
    }
    
    acc[key][curr.sentiment]++;
    acc[key].total++;
    
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(sentimentByPartyAndMedia).map(item => ({
    name: `${item.media} - ${item.party}`,
    Positive: (item.Positive / item.total * 100).toFixed(1),
    Negative: (item.Negative / item.total * 100).toFixed(1),
    Neutral: (item.Neutral / item.total * 100).toFixed(1),
  }));

  const colors = {
    Positive: "#36A2EB",
    Neutral: "#FFC107",
    Negative: "#FF6384"
  };

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
              labelFormatter={(label) => label}
            />
            <Legend />
            <Bar dataKey="Negative" stackId="a" fill={colors.Negative} name="Negative" />
            <Bar dataKey="Neutral" stackId="a" fill={colors.Neutral} name="Neutral" />
            <Bar dataKey="Positive" stackId="a" fill={colors.Positive} name="Positive" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}