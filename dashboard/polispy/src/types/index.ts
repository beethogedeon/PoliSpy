export interface PoliticalData {
  date: string;
  sentiment: 'Neutral' | 'Negative' | 'Positive';
  toneScore: number;
  category: string;
  public: string;
}

export interface PartyData {
  [party: string]: PoliticalData[];
}

export type TimeFrame = 'weekly' | 'monthly' | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ProcessedData {
  date: Date;
  toneScore: number;
}

export interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}