export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface EnergyMetrics {
  totalConsumption: number;
  consumptionTrend: number;
  savings: number;
  savingsTrend: number;
  efficiency: number;
  prediction: number;
  predictionTrend: number;
}

export interface PredictionMetrics {
  date: string;
  actualValue: number;
  predictedValue: number;
  confidence: number;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  lastUpdated: Date;
  columns: string[];
  rowCount: number;
}

export interface AnalysisConfig {
  type: 'regression' | 'classification' | 'clustering';
  parameters: Record<string, any>;
  targetColumn?: string;
  features: string[];
}

export interface Model {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  parameters: Record<string, any>;
  metrics: Record<string, number>;
  status: 'training' | 'ready' | 'failed';
}

export type GranularityType = '1d' | '1w' | '1m' | '3m' | '6m' | '1y'; 