import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
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

  exportToXLSX(data: ProcessedDataPoint[], filename: string = 'dados_consumo.xlsx'): void {
    const worksheet = XLSX.utils.json_to_sheet(this.prepareDataForExport(data))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados')
    
    // Gera o arquivo XLSX
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    this.downloadFile(blob, filename)
  }

  exportToJSON(data: ProcessedDataPoint[], filename: string = 'dados_consumo.json'): void {
    const jsonData = JSON.stringify(this.prepareDataForExport(data), null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    this.downloadFile(blob, filename)
  }

  private prepareDataForExport(data: ProcessedDataPoint[]): any[] {
    return data.map(point => ({
      Data: format(new Date(point.timestamp), 'dd/MM/yyyy HH:mm:ss'),
      Valor: point.value,
      Categoria: point.category || '',
      Região: point.region || '',
      Fonte: point.source || '',
      Anomalia: point.anomaly ? 'Sim' : 'Não',
      ...this.flattenMetadata(point.metadata)
    }))
  }

  private flattenMetadata(metadata: Record<string, any> | undefined): Record<string, any> {
    if (!metadata) return {}
    
    const flattened: Record<string, any> = {}
    Object.entries(metadata).forEach(([key, value]) => {
      const formattedKey = key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      flattened[formattedKey] = value
    })
    
    return flattened
  }

  private convertToCSVFormat(data: ProcessedDataPoint[]): string {
    return Papa.unparse(this.prepareDataForExport(data))
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