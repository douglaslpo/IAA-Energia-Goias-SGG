import api from './api'
import type {
  AnalysisConfig,
  Dataset,
  Model,
  PredictionMetrics,
  AnalysisResult,
  ProcessedDataPoint,
  DatasetMetrics,
  DataAnalysisResult
} from '@/types'

export class DataAnalysisService {
  private static instance: DataAnalysisService

  private constructor() {}

  static getInstance(): DataAnalysisService {
    if (!DataAnalysisService.instance) {
      DataAnalysisService.instance = new DataAnalysisService()
    }
    return DataAnalysisService.instance
  }

  async getDatasets(): Promise<Dataset[]> {
    try {
      const response = await api.get<Dataset[]>('/analysis/datasets')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar datasets')
    }
  }

  async getDatasetById(id: string): Promise<Dataset> {
    try {
      const response = await api.get<Dataset>(`/analysis/datasets/${id}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar dataset')
    }
  }

  async analyzeDataset(datasetId: string, config: AnalysisConfig): Promise<DataAnalysisResult> {
    try {
      const response = await api.post<DataAnalysisResult>(`/analysis/datasets/${datasetId}/analyze`, config)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao analisar dataset')
    }
  }

  async trainModel(datasetId: string, config: AnalysisConfig): Promise<Model> {
    try {
      const response = await api.post<Model>(`/analysis/models/train`, {
        datasetId,
        ...config
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao treinar modelo')
    }
  }

  async getModel(modelId: string): Promise<Model> {
    try {
      const response = await api.get<Model>(`/analysis/models/${modelId}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar modelo')
    }
  }

  async predict(modelId: string, data: Record<string, any>): Promise<PredictionMetrics> {
    try {
      const response = await api.post<PredictionMetrics>(`/analysis/models/${modelId}/predict`, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer predição')
    }
  }

  async deleteModel(modelId: string): Promise<void> {
    try {
      await api.delete(`/analysis/models/${modelId}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao excluir modelo')
    }
  }

  async exportAnalysis(analysisId: string, format: 'pdf' | 'xlsx'): Promise<Blob> {
    try {
      const response = await api.get(`/analysis/export/${analysisId}`, {
        params: { format },
        responseType: 'blob'
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao exportar análise')
    }
  }

  calculateMetrics(data: ProcessedDataPoint[]): DatasetMetrics {
    const values = data.map(point => point.value)
    const n = values.length

    const average = values.reduce((a, b) => a + b, 0) / n
    const variance = values.reduce((a, b) => a + Math.pow(b - average, 2), 0) / n
    const standardDeviation = Math.sqrt(variance)

    const sortedValues = [...values].sort((a, b) => a - b)
    const min = sortedValues[0]
    const max = sortedValues[n - 1]
    const median = n % 2 === 0
      ? (sortedValues[n/2 - 1] + sortedValues[n/2]) / 2
      : sortedValues[Math.floor(n/2)]
    const q1 = sortedValues[Math.floor(n/4)]
    const q3 = sortedValues[Math.floor(3*n/4)]

    return {
      average,
      standardDeviation,
      min,
      max,
      median,
      q1,
      q3
    }
  }

  detectAnomalies(data: ProcessedDataPoint[], metrics: DatasetMetrics): ProcessedDataPoint[] {
    const threshold = 3 * metrics.standardDeviation
    return data.map(point => ({
      ...point,
      anomaly: Math.abs(point.value - metrics.average) > threshold
    }))
  }

  async analyzeTimeSeries(data: ProcessedDataPoint[]): Promise<DataAnalysisResult> {
    const metrics = this.calculateMetrics(data)
    const anomalies = this.detectAnomalies(data, metrics)

    return {
      dataset: 'time-series',
      metrics,
      anomalies,
      predictions: [],
      recommendations: [
        'Identificados pontos de anomalia que podem indicar consumo irregular',
        'Recomenda-se investigar os períodos com valores atípicos',
        'Considerar ajustes nos limites de controle do processo'
      ]
    }
  }
}

export const dataAnalysisService = DataAnalysisService.getInstance() 