import Papa from 'papaparse'
import { format } from 'date-fns'
import type { ProcessedDataPoint } from '@/types'

export interface RawEnergyData {
  data: string
  consumo: number
  classe: string
  regiao: string
  [key: string]: any
}

class DataImportService {
  private static instance: DataImportService

  private constructor() {}

  static getInstance(): DataImportService {
    if (!DataImportService.instance) {
      DataImportService.instance = new DataImportService()
    }
    return DataImportService.instance
  }

  async importEPEData(file: File): Promise<ProcessedDataPoint[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const processedData = this.processEPEData(results.data as RawEnergyData[])
          resolve(processedData)
        },
        error: (error: Error) => {
          reject(error)
        }
      })
    })
  }

  async importANEELData(file: File): Promise<ProcessedDataPoint[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const processedData = this.processANEELData(results.data as RawEnergyData[])
          resolve(processedData)
        },
        error: (error: Error) => {
          reject(error)
        }
      })
    })
  }

  private processEPEData(data: RawEnergyData[]): ProcessedDataPoint[] {
    return data.map(row => ({
      timestamp: format(new Date(row.data), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
      value: this.normalizeValue(row.consumo),
      category: row.classe,
      region: row.regiao,
      source: 'EPE',
      anomaly: false
    }))
  }

  private processANEELData(data: RawEnergyData[]): ProcessedDataPoint[] {
    return data.map(row => ({
      timestamp: format(new Date(row.data), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
      value: this.normalizeValue(row.consumo),
      category: row.classe,
      region: row.regiao,
      source: 'ANEEL',
      anomaly: false
    }))
  }

  private normalizeValue(value: any): number {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      // Remove qualquer espaçamento
      let cleanValue = value.trim()
      // Converte vírgula em ponto para tratar formatos brasileiros/europeus
      cleanValue = cleanValue.replace(/,/g, '.')
      // Remove todos os pontos exceto o último (caso existam separadores de milhar)
      const parts = cleanValue.split('.')
      if (parts.length > 2) {
        cleanValue = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1]
      }
      return parseFloat(cleanValue) || 0
    }
    return 0
  }

  async processMeteorologicalData(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data)
        },
        error: (error: Error) => {
          reject(error)
        }
      })
    })
  }

  async processCensusData(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data)
        },
        error: (error: Error) => {
          reject(error)
        }
      })
    })
  }
}

export const dataImportService = DataImportService.getInstance();
