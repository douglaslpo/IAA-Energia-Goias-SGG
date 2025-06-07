// Interfaces para Processamento de Dados
export interface ProcessedDataPoint {
  timestamp: string
  value: number
  category?: string
  region?: string
  source?: string
  anomaly: boolean
  metadata?: Record<string, any>
}

export interface DatasetConfig {
  name: string
  description: string
  source: string
  format: 'csv' | 'xlsx' | 'json'
  columns: {
    timestamp: string
    value: string
    category?: string
    region?: string
    [key: string]: string | undefined
  }
}

export interface ImportResult {
  success: boolean
  data?: ProcessedDataPoint[]
  error?: string
  metadata?: {
    totalRows: number
    processedRows: number
    skippedRows: number
    warnings: string[]
  }
}

// Tipos de Granularidade
export type GranularityType = '1d' | '1w' | '1m' | '3m' | '6m' | '1y'

// Interfaces de Data
export interface DateRange {
  startDate: Date
  endDate: Date
}

// Interfaces de Métricas
export interface EnergyMetrics {
  total_consumption: number
  average_consumption: number
  peak_consumption: number
  efficiency_score: number
  predictions: PredictionData[]
  anomalies: AnomalyData[]
  recommendations: Recommendation[]
}

export interface PredictionData {
  timestamp: string
  actual: number
  predicted: number
  lower_bound: number
  upper_bound: number
}

export interface AnomalyData {
  timestamp: string
  value: number
  is_anomaly: boolean
  score: number
  threshold: number
}

export interface Recommendation {
  id: number
  title: string
  description: string
  impact: number
  difficulty: 'low' | 'medium' | 'high'
  category: string
  savings_potential: number
}

// Interfaces para Dados Brutos
export interface RawEnergyData {
  data: string
  consumo: number
  classe: string
  regiao: string
  [key: string]: any
}

export interface RawMeteorologicalData {
  data: string
  temperatura: number
  umidade: number
  precipitacao: number
  estacao: string
  [key: string]: any
}

export interface RawCensusData {
  ano: string
  populacao: number
  faixa_etaria: string
  municipio: string
  [key: string]: any
} 