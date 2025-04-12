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

interface SentimentChartProps {
  data: MediaData[];
  title: string;
}

function roundToNearest(num:number, decimals = 1) {
  // Arrondir d'abord avec Math.round
  const rounded = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  // Puis utiliser toFixed pour formater
  return rounded.toFixed(decimals);
}

export default function SentimentChart({ data, title }: SentimentChartProps) {
  // Process data to get sentiment percentages by party
  const sentimentByParty = data.reduce((acc, curr) => {
    if (!curr.Parti || !curr.sentiment) return acc;
    
    if (!acc[curr.Parti]) {
      acc[curr.Parti] = {
        party: curr.Parti,
        Positive: 0,
        Negative: 0,
        Neutral: 0,
        total: 0
      };
    }
    
    acc[curr.Parti][curr.sentiment]++;
    acc[curr.Parti].total++;
    
    return acc;
  }, {} as Record<string, any>);

  // Convert to percentages
  const chartData = Object.values(sentimentByParty).map(party => ({
    party: party.party,
    Positive: roundToNearest((party.Positive / party.total) * 100),
    Neutral: roundToNearest((party.Neutral / party.total) * 100),
    Negative: roundToNearest((party.Negative / party.total) * 100),
  }));

  const colors = {
    Positive: "#36A2EB",
    Neutral: "#FFC107",
    Negative: "#FF6384"
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <YAxis type="category" dataKey="party" width={60} />
            <Tooltip 
              formatter={(value: any) => [`${Number(value).toFixed(1)}%`]}
              labelFormatter={(label) => `Party: ${label}`}
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