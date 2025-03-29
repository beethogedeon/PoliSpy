import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TrendsOverview from './pages/TrendsOverview';
import SentimentAnalysis from './pages/SentimentAnalysis';
import MediaCoverage from './pages/MediaCoverage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TrendsOverview />} />
          <Route path="sentiment" element={<SentimentAnalysis />} />
          <Route path="media" element={<MediaCoverage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;