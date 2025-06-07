import { DataSourceConfig } from '@/types/data';

export const dataSources: DataSourceConfig[] = [
  {
    id: 'epe',
    name: 'Empresa de Pesquisa Energética',
    description: 'Dados de consumo energético nacional',
    filename: 'dados_epe.csv',
    columns: {
      date: ['data', 'DATA', 'Date'],
      consumption: ['consumo', 'CONSUMO', 'Consumption'],
      region: ['regiao', 'REGIAO', 'Region'],
      sector: ['setor', 'SETOR', 'Sector']
    },
    transformations: {
      date: 'date',
      consumption: 'number',
      region: 'string',
      sector: 'string'
    },
    validations: {
      required: ['date', 'consumption'],
      range: {
        consumption: { min: 0 }
      }
    }
  },
  {
    id: 'eneel',
    name: 'ANEEL',
    description: 'Dados regulatórios e tarifários',
    filename: 'dados_eneel.csv',
    columns: {
      date: ['data', 'DATA', 'Date'],
      tariff: ['tarifa', 'TARIFA', 'Tariff'],
      region: ['regiao', 'REGIAO', 'Region'],
      category: ['categoria', 'CATEGORIA', 'Category']
    },
    transformations: {
      date: 'date',
      tariff: 'number',
      region: 'string',
      category: 'string'
    },
    validations: {
      required: ['date', 'tariff', 'region'],
      range: {
        tariff: { min: 0 }
      }
    }
  },
  {
    id: 'meteorological',
    name: 'Dados Meteorológicos',
    description: 'Condições climáticas de Goiás',
    filename: 'dados_meteorologicos_go.csv',
    columns: {
      date: ['data', 'DATA', 'Date'],
      temperature: ['temperatura', 'TEMPERATURA', 'Temperature'],
      humidity: ['umidade', 'UMIDADE', 'Humidity'],
      precipitation: ['precipitacao', 'PRECIPITACAO', 'Precipitation']
    },
    transformations: {
      date: 'date',
      temperature: 'number',
      humidity: 'number',
      precipitation: 'number'
    },
    validations: {
      required: ['date', 'temperature', 'humidity'],
      range: {
        temperature: { min: -10, max: 50 },
        humidity: { min: 0, max: 100 }
      }
    }
  }
]; 