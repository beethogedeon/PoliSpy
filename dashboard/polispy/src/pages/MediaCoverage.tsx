import React from 'react';
import PublicationAnalysis from '../components/PublicationAnalysis';
import { useData } from '../hooks/useData';

const MediaCoverage: React.FC = () => {
  const { data } = useData();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Coverage Analysis</h2>
        <p className="text-gray-600 mb-6">
          Examine how different media outlets cover political parties and their initiatives.
          This analysis reveals potential media bias and coverage patterns.
        </p>
        <PublicationAnalysis data={data} />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Publication Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Coverage Distribution</h3>
            <p className="text-gray-600">
              Analysis of article volume and sentiment across different publications,
              highlighting potential biases and focus areas.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Topic Focus</h3>
            <p className="text-gray-600">
              Breakdown of the main topics covered by each publication,
              showing their editorial priorities and areas of expertise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCoverage;