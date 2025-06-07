import { ProcessedDataPoint, DatasetMetrics, AnalysisResult } from '@/types/data';

export class DataAnalysisService {
  /**
   * Calcula métricas básicas do conjunto de dados
   * @param data Array de pontos de dados processados
   * @returns Métricas calculadas
   */
  static calculateMetrics(data: ProcessedDataPoint[]): DatasetMetrics {
    const values = data.map(point => point.value);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    
    // Cálculo do desvio padrão
    const squaredDiffs = values.map(val => Math.pow(val - average, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    const standardDeviation = Math.sqrt(avgSquaredDiff);

    return {
      total,
      average,
      min: Math.min(...values),
      max: Math.max(...values),
      standardDeviation,
      lastUpdate: new Date(Math.max(...data.map(point => point.date.getTime())))
    };
  }

  /**
   * Detecta anomalias usando o método do desvio padrão
   * @param data Array de pontos de dados processados
   * @param threshold Número de desvios padrão para considerar anomalia
   * @returns Pontos considerados anômalos
   */
  static detectAnomalies(data: ProcessedDataPoint[], threshold = 2): ProcessedDataPoint[] {
    const metrics = this.calculateMetrics(data);
    const upperBound = metrics.average + (threshold * metrics.standardDeviation);
    const lowerBound = metrics.average - (threshold * metrics.standardDeviation);

    return data.filter(point => 
      point.value > upperBound || point.value < lowerBound
    );
  }

  /**
   * Calcula correlações entre diferentes conjuntos de dados
   * @param datasets Objeto com múltiplos conjuntos de dados
   * @returns Matriz de correlação
   */
  static calculateCorrelations(datasets: Record<string, ProcessedDataPoint[]>): Record<string, Record<string, number>> {
    const correlations: Record<string, Record<string, number>> = {};
    const datasetNames = Object.keys(datasets);

    for (const dataset1 of datasetNames) {
      correlations[dataset1] = {};
      
      for (const dataset2 of datasetNames) {
        if (dataset1 === dataset2) {
          correlations[dataset1][dataset2] = 1;
          continue;
        }

        const correlation = this.calculatePearsonCorrelation(
          datasets[dataset1].map(p => p.value),
          datasets[dataset2].map(p => p.value)
        );
        correlations[dataset1][dataset2] = correlation;
      }
    }

    return correlations;
  }

  /**
   * Realiza análise completa de um conjunto de dados
   * @param data Array de pontos de dados processados
   * @param options Opções de análise
   * @returns Resultado da análise
   */
  static analyzeDataset(
    data: ProcessedDataPoint[],
    options: {
      detectAnomalies?: boolean;
      anomalyThreshold?: number;
      calculatePredictions?: boolean;
      predictionHorizon?: number;
    } = {}
  ): AnalysisResult {
    const result: AnalysisResult = {
      dataset: data[0]?.source || 'unknown',
      metrics: this.calculateMetrics(data)
    };

    if (options.detectAnomalies) {
      result.anomalies = this.detectAnomalies(data, options.anomalyThreshold);
    }

    if (options.calculatePredictions) {
      // Implementar previsões quando necessário
      // result.predictions = this.calculatePredictions(data, options.predictionHorizon);
    }

    return result;
  }

  private static calculatePearsonCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n < 2) return 0;

    const xMean = x.reduce((sum, val) => sum + val, 0) / n;
    const yMean = y.reduce((sum, val) => sum + val, 0) / n;

    let numerator = 0;
    let xVariance = 0;
    let yVariance = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = x[i] - xMean;
      const yDiff = y[i] - yMean;
      numerator += xDiff * yDiff;
      xVariance += xDiff * xDiff;
      yVariance += yDiff * yDiff;
    }

    if (xVariance === 0 || yVariance === 0) return 0;
    return numerator / Math.sqrt(xVariance * yVariance);
  }
} 