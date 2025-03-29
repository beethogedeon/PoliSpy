import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PartyData } from '../types';

interface PublicationAnalysisProps {
  data: PartyData;
}

const PublicationAnalysis: React.FC<PublicationAnalysisProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Process data for publication analysis
    const publicationData = Object.entries(data).flatMap(([party, entries]) => {
      const publicationCounts = new Map();
      entries.forEach(entry => {
        const count = publicationCounts.get(entry.public) || 0;
        publicationCounts.set(entry.public, count + 1);
      });
      return Array.from(publicationCounts).map(([publication, count]) => ({
        party,
        publication,
        count
      }));
    });

    const publications = Array.from(new Set(publicationData.map(d => d.public)));
    const parties = Array.from(new Set(publicationData.map(d => d.party)));

    const xScale = d3.scaleBand()
      .domain(publications)
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(publicationData, d => d.count) || 0])
      .range([height, 0]);

    const colorScale = d3.scaleOrdinal()
      .domain(parties)
      .range(d3.schemeCategory10);

    // Add bars
    svg.selectAll('g')
      .data(publications)
      .join('g')
        .attr('transform', d => `translate(${xScale(d)},0)`)
      .selectAll('rect')
      .data(d => publicationData.filter(pd => pd.public === d))
      .join('rect')
        .attr('width', xScale.bandwidth() / parties.length)
        .attr('x', (d, i) => (i * xScale.bandwidth()) / parties.length)
        .attr('y', d => yScale(d.count))
        .attr('height', d => height - yScale(d.count))
        .attr('fill', d => colorScale(d.party) as string);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .attr('text-anchor', 'end');

    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add legend
    const legend = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(parties)
      .join('g')
        .attr('transform', (d, i) => `translate(0,${i * 20 - 60})`);

    legend.append('rect')
      .attr('x', width - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', d => colorScale(d.party) as string);

    legend.append('text')
      .attr('x', width - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d);

  }, [data]);

  return (
    <div className="w-full h-[300px] bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Publication Analysis</h2>
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default PublicationAnalysis;