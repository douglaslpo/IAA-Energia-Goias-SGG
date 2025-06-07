import axios from 'axios';
import { format } from 'date-fns';
import type { EnergyMetrics, PredictionMetrics, DateRange } from '@/types';
import { ref } from 'vue'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8000/api/v1'
});

export const energyService = {
  async getMetrics(region: string, dateRange: DateRange): Promise<EnergyMetrics> {
    const { data } = await api.get('/energy/metrics', {
      params: {
        region,
        start_date: format(dateRange.startDate, 'yyyy-MM-dd'),
        end_date: format(dateRange.endDate, 'yyyy-MM-dd')
      }
    });
    return data;
  },

  async getPredictions(region: string, dateRange: DateRange): Promise<PredictionMetrics[]> {
    const { data } = await api.get('/energy/predictions', {
      params: {
        region,
        start_date: format(dateRange.startDate, 'yyyy-MM-dd'),
        end_date: format(dateRange.endDate, 'yyyy-MM-dd')
      }
    });
    return data;
  }
};

// Tipos
interface ConsumptionData {
  timestamp: string;
  value: number;
  unit: string;
}

interface PredictionData {
  timestamp: string;
  predicted: number;
  lower_bound: number;
  upper_bound: number;
}

// Dados simulados
const mockConsumptionData: ConsumptionData[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(2024, 0, 1, i).toISOString(),
  value: Math.random() * 100 + 50,
  unit: 'kWh'
}))

const mockPredictions: PredictionData[] = Array.from({ length: 12 }, (_, i) => ({
  timestamp: new Date(2024, i, 1).toISOString(),
  predicted: Math.random() * 100 + 50,
  lower_bound: Math.random() * 40 + 30,
  upper_bound: Math.random() * 160 + 70
}))

// Serviço do Laboratório de Dados
export const dataLabService = {
  getConsumptionData: async () => {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockConsumptionData
  },

  getPredictions: async () => {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockPredictions
  },

  getMetrics: async () => {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      total_consumption: 1234.56,
      average_consumption: 51.44,
      peak_consumption: 98.76,
      efficiency_score: 85
    }
  }
}

// Serviço de Modelos
export const modelService = {
  trainModel: async (params: any) => {
    // Simula treinamento do modelo
    await new Promise(resolve => setTimeout(resolve, 3000))
    return {
      model_id: 'model_' + Date.now(),
      accuracy: 0.89,
      training_time: '2m 34s'
    }
  },

  evaluateModel: async (modelId: string) => {
    // Simula avaliação do modelo
    await new Promise(resolve => setTimeout(resolve, 2000))
    return {
      mae: 2.34,
      mse: 8.91,
      rmse: 2.98,
      r2_score: 0.85
    }
  }
}

// Estado compartilhado
export const sharedState = {
  isLoading: ref(false),
  currentModelId: ref<string | null>(null),
  selectedDate: ref<Date | null>(null)
} 