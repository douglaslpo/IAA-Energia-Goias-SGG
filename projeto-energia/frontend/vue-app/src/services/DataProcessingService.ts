import Papa from 'papaparse';
import { format } from 'date-fns';
import type { ProcessedDataPoint } from '@/types'

interface CSVRow {
  data: string
  consumo: string
  [key: string]: string
}

export interface ProcessedData {
  date: string;
  value: number;
  category?: string;
  region?: string;
}

export class DataProcessingService {
  private static instance: DataProcessingService

  private constructor() {}

  static getInstance(): DataProcessingService {
    if (!DataProcessingService.instance) {
      DataProcessingService.instance = new DataProcessingService()
    }
    return DataProcessingService.instance
  }

  async processCSV(file: File): Promise<ProcessedDataPoint[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<CSVRow>) => {
          const processedData = results.data.map(row => ({
            timestamp: format(new Date(row.data), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
            value: this.normalizeValue(row.consumo),
            anomaly: false
          }))
          resolve(processedData)
        },
        error: (error: Error) => {
          reject(error)
        }
      })
    })
  }

  private static isValidRow(row: any): boolean {
    return row &&
      typeof row === 'object' &&
      Object.keys(row).length > 0 &&
      !Object.values(row).every(value => value === null || value === '');
  }

  private static transformRow(row: any): ProcessedData {
    // Adaptar conforme a estrutura dos seus arquivos CSV
    const dateField = this.findDateField(row);
    const valueField = this.findValueField(row);
    const categoryField = this.findCategoryField(row);
    const regionField = this.findRegionField(row);

    return {
      date: dateField ? format(new Date(row[dateField]), 'yyyy-MM-dd') : '',
      value: valueField ? Number(row[valueField]) : 0,
      category: categoryField ? String(row[categoryField]) : undefined,
      region: regionField ? String(row[regionField]) : undefined
    };
  }

  private static findDateField(row: any): string | null {
    const possibleDateFields = ['data', 'date', 'DATA', 'DATE', 'Data'];
    return this.findField(row, possibleDateFields);
  }

  private static findValueField(row: any): string | null {
    const possibleValueFields = [
      'consumo',
      'valor',
      'value',
      'CONSUMO',
      'VALOR',
      'Consumo',
      'Valor'
    ];
    return this.findField(row, possibleValueFields);
  }

  private static findCategoryField(row: any): string | null {
    const possibleCategoryFields = [
      'categoria',
      'category',
      'tipo',
      'type',
      'CATEGORIA',
      'TIPO'
    ];
    return this.findField(row, possibleCategoryFields);
  }

  private static findRegionField(row: any): string | null {
    const possibleRegionFields = [
      'regiao',
      'region',
      'REGIAO',
      'REGION',
      'Regiao',
      'Region'
    ];
    return this.findField(row, possibleRegionFields);
  }

  private static findField(row: any, possibleFields: string[]): string | null {
    const fields = Object.keys(row);
    return possibleFields.find(field => fields.includes(field)) || null;
  }

  static aggregateData(data: ProcessedData[], groupBy: 'day' | 'month' | 'year'): ProcessedData[] {
    const grouped = new Map<string, number>();

    data.forEach(item => {
      const date = new Date(item.date);
      let key: string;

      switch (groupBy) {
        case 'day':
          key = format(date, 'yyyy-MM-dd');
          break;
        case 'month':
          key = format(date, 'yyyy-MM');
          break;
        case 'year':
          key = format(date, 'yyyy');
          break;
      }

      const currentValue = grouped.get(key) || 0;
      grouped.set(key, currentValue + item.value);
    });

    return Array.from(grouped.entries()).map(([date, value]) => ({
      date,
      value
    }));
  }

  static calculateStatistics(data: ProcessedData[]) {
    const values = data.map(item => item.value);
    
    return {
      total: values.reduce((sum, value) => sum + value, 0),
      average: values.reduce((sum, value) => sum + value, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values)
    };
  }

  processTimeSeriesData(rawData: any[]): ProcessedDataPoint[] {
    return rawData.map(point => ({
      timestamp: new Date(point.timestamp).toISOString(),
      value: this.normalizeValue(point.value),
      anomaly: false
    }))
  }

  aggregateByPeriod(
    data: ProcessedDataPoint[],
    period: 'hour' | 'day' | 'week' | 'month'
  ): ProcessedDataPoint[] {
    const aggregated: { [key: string]: number[] } = {}

    data.forEach(point => {
      const date = new Date(point.timestamp)
      let key: string

      switch (period) {
        case 'hour':
          key = date.toISOString().slice(0, 13)
          break
        case 'day':
          key = date.toISOString().slice(0, 10)
          break
        case 'week':
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = weekStart.toISOString().slice(0, 10)
          break
        case 'month':
          key = date.toISOString().slice(0, 7)
          break
      }

      if (!aggregated[key]) {
        aggregated[key] = []
      }
      aggregated[key].push(point.value)
    })

    return Object.entries(aggregated).map(([timestamp, values]) => ({
      timestamp,
      value: this.calculateAverage(values),
      anomaly: false
    }))
  }

  smoothData(
    data: ProcessedDataPoint[],
    windowSize: number = 3
  ): ProcessedDataPoint[] {
    const smoothed: ProcessedDataPoint[] = []
    const halfWindow = Math.floor(windowSize / 2)

    for (let i = 0; i < data.length; i++) {
      const window = data
        .slice(Math.max(0, i - halfWindow), Math.min(data.length, i + halfWindow + 1))
        .map(point => point.value)

      smoothed.push({
        ...data[i],
        value: this.calculateAverage(window)
      })
    }

    return smoothed
  }

  interpolateMissingValues(data: ProcessedDataPoint[]): ProcessedDataPoint[] {
    const result: ProcessedDataPoint[] = []

    for (let i = 0; i < data.length; i++) {
      if (i === 0 || i === data.length - 1 || !this.isNullOrUndefined(data[i].value)) {
        result.push(data[i])
        continue
      }

      let prevValue = this.findPreviousValue(data, i)
      let nextValue = this.findNextValue(data, i)

      if (prevValue !== null && nextValue !== null) {
        result.push({
          ...data[i],
          value: (prevValue + nextValue) / 2
        })
      } else {
        result.push(data[i])
      }
    }

    return result
  }

  private normalizeValue(value: any): number {
    if (typeof value === 'number') return value
    if (typeof value === 'string') return parseFloat(value) || 0
    return 0
  }

  private calculateAverage(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  private isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined || isNaN(value)
  }

  private findPreviousValue(data: ProcessedDataPoint[], currentIndex: number): number | null {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!this.isNullOrUndefined(data[i].value)) {
        return data[i].value
      }
    }
    return null
  }

  private findNextValue(data: ProcessedDataPoint[], currentIndex: number): number | null {
    for (let i = currentIndex + 1; i < data.length; i++) {
      if (!this.isNullOrUndefined(data[i].value)) {
        return data[i].value
      }
    }
    return null
  }
}

export const dataProcessingService = DataProcessingService.getInstance() 