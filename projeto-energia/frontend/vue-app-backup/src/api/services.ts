import axios from 'axios';
import { format } from 'date-fns';
import type { EnergyMetrics, PredictionMetrics, DateRange } from '@/types';

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

export const dataLabService = {
  async getDatasetInfo(datasetId: string) {
    const { data } = await api.get(`/data-lab/datasets/${datasetId}`);
    return data;
  },

  async runAnalysis(datasetId: string, config: any) {
    const { data } = await api.post(`/data-lab/analysis/${datasetId}`, config);
    return data;
  }
};

export const modelService = {
  async getModels() {
    const { data } = await api.get('/models');
    return data;
  },

  async createModel(modelConfig: any) {
    const { data } = await api.post('/models', modelConfig);
    return data;
  },

  async updateModel(modelId: string, modelConfig: any) {
    const { data } = await api.put(`/models/${modelId}`, modelConfig);
    return data;
  }
}; 