import { getMediaData } from '../lib/data';
import SentimentAnalysisClient from './client';

export default async function SentimentAnalysis() {
  const data = await getMediaData();
  return <SentimentAnalysisClient initialData={data} />;
}