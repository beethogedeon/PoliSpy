import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PartyData, TimeFrame, DateRange } from '../types';

interface TimeSeriesChartProps {
  data: PartyData;
  timeFrame: TimeFrame;
  dateRange?: DateRange;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, timeFrame, dateRange }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Chart dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Process data
    const processedData = Object.entries(data).map(([party, entries]) => {
      return {
        party,
        values: entries.map(entry => ({
          date: new Date(entry.date),
          toneScore: entry.toneScore
        }))
      };
    });

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(processedData.flatMap(d => d.values.map(v => v.date))) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([height, 0]);

    // Line generator
    const line = d3.line<{ date: Date; toneScore: number }>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.toneScore));

    // Add lines
    processedData.forEach((partyData, i) => {
      svg.append('path')
        .datum(partyData.values)
        .attr('fill', 'none')
        .attr('stroke', d3.schemeCategory10[i])
        .attr('stroke-width', 2)
        .attr('d', line);
    });

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .call(d3.axisLeft(yScale));

  }, [data, timeFrame, dateRange]);

  return (
    <div className="w-full h-[500px] bg-white rounded-lg shadow-lg p-4">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default TimeSeriesChart;