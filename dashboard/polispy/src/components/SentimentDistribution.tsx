import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PartyData, TimeFrame } from '../types';

interface SentimentDistributionProps {
  data: PartyData;
  timeFrame: TimeFrame;
}

const SentimentDistribution: React.FC<SentimentDistributionProps> = ({ data, timeFrame }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Process data for sentiment distribution
    const sentimentCounts = Object.entries(data).map(([party, entries]) => {
      const counts = {
        Positive: 0,
        Neutral: 0,
        Negative: 0
      };
      entries.forEach(entry => {
        counts[entry.sentiment]++;
      });
      return { party, ...counts };
    });

    const stack = d3.stack()
      .keys(['Positive', 'Neutral', 'Negative'])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const series = stack(sentimentCounts.map(({ party, ...counts }) => counts));

    const xScale = d3.scaleBand()
      .domain(sentimentCounts.map(d => d.party))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1])) || 0])
      .range([height, 0]);

    const colorScale = d3.scaleOrdinal()
      .domain(['Positive', 'Neutral', 'Negative'])
      .range(['#4CAF50', '#9E9E9E', '#F44336']);

    svg.append('g')
      .selectAll('g')
      .data(series)
      .join('g')
        .attr('fill', d => colorScale(d.key) as string)
      .selectAll('rect')
      .data(d => d)
      .join('rect')
        .attr('x', d => xScale(d.data.party) || 0)
        .attr('y', d => yScale(d[1]))
        .attr('height', d => yScale(d[0]) - yScale(d[1]))
        .attr('width', xScale.bandwidth());

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add legend
    const legend = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(['Positive', 'Neutral', 'Negative'])
      .join('g')
        .attr('transform', (d, i) => `translate(0,${i * 20 - 60})`);

    legend.append('rect')
      .attr('x', width - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', d => colorScale(d) as string);

    legend.append('text')
      .attr('x', width - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d);

  }, [data, timeFrame]);

  return (
    <div className="w-full h-[500px] bg-white rounded-lg shadow-lg p-4">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default SentimentDistribution;