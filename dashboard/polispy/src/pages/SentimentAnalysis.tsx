import React from 'react';
import SentimentDistribution from '../components/SentimentDistribution';
import { useData } from '../hooks/useData';

const SentimentAnalysis: React.FC = () => {
  const { data, timeFrame } = useData();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sentiment Distribution</h2>
        <p className="text-gray-600 mb-6">
          Analyze the distribution of positive, neutral, and negative sentiments across political parties.
          This visualization helps identify media bias and coverage patterns.
        </p>
        <SentimentDistribution data={data} timeFrame={timeFrame} />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sentiment Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Top Positive Topics</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Environmental Initiatives</li>
              <li>Healthcare Reform</li>
              <li>Economic Growth</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Areas of Concern</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Budget Deficit</li>
              <li>Immigration Policy</li>
              <li>Infrastructure Projects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;