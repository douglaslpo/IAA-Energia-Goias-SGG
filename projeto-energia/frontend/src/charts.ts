export type GranularityType = '1W' | '1M' | '3M' | '12M';

export interface TimeRange {
    startDate: Date;
    endDate: Date;
}

export interface ChartDataPoint {
    timestamp: string;
    consumption: number;
    predicted?: number;
    confidenceLow?: number;
    confidenceHigh?: number;
} 