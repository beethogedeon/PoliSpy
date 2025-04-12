import { MediaData } from '../types';

const data: MediaData[] = require('../../public/data/canada_political_media_data.json');

export async function getMediaData(): Promise<MediaData[]> {
  return data.filter((item: MediaData) => 
    item.Parti && 
    item.Public && 
    item.sentiment && 
    item.category
  );
}