import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import type { ProcessedDataPoint, DatasetConfig } from '@/types';
import { DEFAULT_DATASET_CONFIGS, type DatasetType } from './datasetConfigs';

export interface RawDataRow {
  [key: string]: any
}

class DataProcessingService {
  private static instance: DataProcessingService;
  private datasetConfigs: Map<DatasetType, DatasetConfig>;

  private constructor() {
    this.datasetConfigs = new Map(Object.entries(DEFAULT_DATASET_CONFIGS) as [DatasetType, DatasetConfig][]);
  }

  static getInstance(): DataProcessingService {
    if (!DataProcessingService.instance) {
      DataProcessingService.instance = new DataProcessingService()
    }
    return DataProcessingService.instance
  }


  async processFile(file: File, datasetType: DatasetType): Promise<ProcessedDataPoint[]> {
    const config = this.datasetConfigs.get(datasetType)
    if (!config) {
      throw new Error(`Tipo de dataset não configurado: ${datasetType}`)
    }

    let rawData: RawDataRow[]
    
    if (config.format === 'csv') {
      rawData = await this.parseCSV(file)
    } else if (config.format === 'xlsx') {
      rawData = await this.parseXLSX(file)
    } else {
      throw new Error(`Formato não suportado: ${config.format}`)
    }

    return this.processData(rawData, config)
  }

  private async parseCSV(file: File): Promise<RawDataRow[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as RawDataRow[])
        },
        error: (error: Error) => {
          reject(error)
        }
      })
    })
  }

  private async parseXLSX(file: File): Promise<RawDataRow[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet)
          resolve(jsonData as RawDataRow[])
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Erro ao ler arquivo XLSX'))
      reader.readAsBinaryString(file)
    })
  }

  private processData(data: RawDataRow[], config: DatasetConfig): ProcessedDataPoint[] {
    return data.map(row => this.transformRow(row, config))
  }

  private transformRow(row: RawDataRow, config: DatasetConfig): ProcessedDataPoint {
    const timestamp = this.extractTimestamp(row[config.columns.timestamp])
    const value = this.normalizeValue(row[config.columns.value])
    
    return {
      timestamp,
      value,
      category: row[config.columns.category],
      region: row[config.columns.region],
      source: config.source,
      anomaly: false,
      metadata: this.extractMetadata(row, config)
    }
  }

  private extractTimestamp(value: any): string {
    if (!value) return ''
    
    try {
      const date = new Date(value)
      return format(date, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx')
    } catch {
      // Tenta outros formatos comuns de data
      const patterns = [
        'dd/MM/yyyy',
        'yyyy-MM-dd',
        'MM/dd/yyyy'
      ]
      
      for (const pattern of patterns) {
        try {
          const date = new Date(value)
          return format(date, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx')
        } catch {
          continue
        }
      }
      
      return value.toString()
    }
  }

  private normalizeValue(value: any): number {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      // Remove caracteres não numéricos exceto ponto e vírgula
      const cleanValue = value.replace(/[^\d.,]/g, '')
      // Substitui vírgula por ponto
      const normalizedValue = cleanValue.replace(',', '.')
      return parseFloat(normalizedValue) || 0
    }
    return 0
  }

  private extractMetadata(row: RawDataRow, config: DatasetConfig): Record<string, any> {
    const metadata: Record<string, any> = {}
    
    // Extrai campos adicionais que não são mapeados nas colunas principais
    Object.entries(row).forEach(([key, value]) => {
      const isMainColumn = Object.values(config.columns).includes(key)
      if (!isMainColumn) {
        metadata[key] = value
      }
    })
    
    return metadata
  }
}

export const dataProcessingService = DataProcessingService.getInstance();
