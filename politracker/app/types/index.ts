export interface MediaData {
  Year: string;
  Public: string;
  Dates: number;
  Week: string;
  Monthly: string;
  category: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  tone_score: number;
  Parti: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type TimePeriod = 'week' | 'month' | 'overall';