import Papa from 'papaparse'
import type { ProcessedDataPoint } from '@/types'

class ExportService {
  private static instance: ExportService

  private constructor() {}

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService()
    }
    return ExportService.instance
  }

  exportToCSV(data: ProcessedDataPoint[], filename: string = 'dados_consumo.csv'): void {
    const csvData = this.convertToCSVFormat(data)
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    this.downloadFile(blob, filename)
  }

  exportToJSON(data: ProcessedDataPoint[], filename: string = 'dados_consumo.json'): void {
    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    this.downloadFile(blob, filename)
  }

  private convertToCSVFormat(data: ProcessedDataPoint[]): string {
    return Papa.unparse(data.map(point => ({
      Data: point.timestamp,
      Consumo: point.value,
      Anomalia: point.anomaly ? 'Sim' : 'Não'
    })))
  }

  private downloadFile(blob: Blob, filename: string): void {
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }
}

export const exportService = ExportService.getInstance() 