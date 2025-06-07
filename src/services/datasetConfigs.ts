import type { DatasetConfig } from '@/types';

export type DatasetType = 'epe' | 'aneel' | 'meteo' | 'censo';

export const DEFAULT_DATASET_CONFIGS: Record<DatasetType, DatasetConfig> = {
  epe: {
    name: 'Dados EPE',
    description: 'Dados de consumo energético da EPE',
    source: 'EPE',
    format: 'csv',
    columns: {
      timestamp: 'data',
      value: 'consumo',
      category: 'classe',
      region: 'regiao'
    }
  },
  aneel: {
    name: 'Dados ANEEL',
    description: 'Dados de consumo energético da ANEEL',
    source: 'ANEEL',
    format: 'csv',
    columns: {
      timestamp: 'data',
      value: 'consumo',
      category: 'tipo_consumidor',
      region: 'estado'
    }
  },
  meteo: {
    name: 'Dados Meteorológicos',
    description: 'Dados meteorológicos por região',
    source: 'INMET',
    format: 'csv',
    columns: {
      timestamp: 'data',
      value: 'temperatura',
      category: 'tipo_medicao',
      region: 'estacao'
    }
  },
  censo: {
    name: 'Dados do Censo',
    description: 'Dados demográficos do IBGE',
    source: 'IBGE',
    format: 'xlsx',
    columns: {
      timestamp: 'ano',
      value: 'populacao',
      category: 'faixa_etaria',
      region: 'municipio'
    }
  }
};


