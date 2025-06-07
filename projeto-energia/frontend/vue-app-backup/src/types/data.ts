export type DataTransformationType = 'date' | 'number' | 'string' | 'boolean';

export interface DataSourceValidationRange {
  min?: number;
  max?: number;
}

export interface DataSourceValidations {
  required: string[];
  range?: Record<string, DataSourceValidationRange>;
}

export interface DataSourceConfig {
  id: string;
  name: string;
  description: string;
  filename: string;
  columns: Record<string, string[]>;
  transformations: Record<string, DataTransformationType>;
  validations: DataSourceValidations;
}

export interface ProcessedDataPoint {
  date: Date;
  value: number;
  metadata: Record<string, any>;
  source: string;
}

export interface DatasetMetrics {
  total: number;
  average: number;
  min: number;
  max: number;
  standardDeviation: number;
  lastUpdate: Date;
}

export interface AnalysisResult {
  dataset: string;
  metrics: DatasetMetrics;
  predictions?: ProcessedDataPoint[];
  anomalies?: ProcessedDataPoint[];
  correlations?: Record<string, number>;
}

export interface DataProcessingOptions {
  aggregation?: 'day' | 'week' | 'month' | 'year';
  filters?: Record<string, any>;
  transformations?: Array<{
    type: 'normalize' | 'scale' | 'smooth';
    params?: Record<string, any>;
  }>;
}

export interface ValidationError {
  field: string;
  type: 'required' | 'range' | 'format';
  message: string;
  value?: any;
}

export interface ProcessingResult {
  success: boolean;
  data?: ProcessedDataPoint[];
  errors?: ValidationError[];
  metrics?: DatasetMetrics;
} 