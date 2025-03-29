import React from 'react';
import TimeSeriesChart from '../components/TimeSeriesChart';
import { useData } from '../hooks/useData';

const TrendsOverview: React.FC = () => {
  const { data, timeFrame } = useData();

  return (
    <div className="space-y-8 p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tone Score Trends</h2>
      <p className="text-gray-600 mb-6">
        Track the evolution of tone scores across different political parties over time.
        Higher scores indicate more positive coverage, while lower scores represent negative coverage.
      </p>
      <TimeSeriesChart data={data} timeFrame={timeFrame} />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900">Trending Topics</h3>
        <p className="text-blue-700 mt-2">Economy and Healthcare dominate recent discussions</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-green-900">Most Positive Coverage</h3>
        <p className="text-green-700 mt-2">GPC leads in environmental policy discussions</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
        <h3 className="font-semibold text-purple-900">Media Balance</h3>
        <p className="text-purple-700 mt-2">Even distribution across major publications</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default TrendsOverview;