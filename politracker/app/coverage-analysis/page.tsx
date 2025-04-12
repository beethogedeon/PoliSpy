import { getMediaData } from '../lib/data';
import CoverageAnalysisClient from './client';

export default async function CoverageAnalysis() {
  const data = await getMediaData();
  return <CoverageAnalysisClient initialData={data} />;
}