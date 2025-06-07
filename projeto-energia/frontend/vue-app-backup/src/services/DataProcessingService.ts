import Papa from 'papaparse';
import { format } from 'date-fns';

export interface ProcessedData {
  date: string;
  value: number;
  category?: string;
  region?: string;
}

export class DataProcessingService {
  static async processCSV(file: File): Promise<ProcessedData[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const processedData = results.data
            .filter(row => this.isValidRow(row))
            .map(row => this.transformRow(row));
          resolve(processedData);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
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
} 