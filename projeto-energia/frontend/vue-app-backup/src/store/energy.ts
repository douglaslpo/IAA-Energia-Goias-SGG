import { defineStore } from 'pinia'
import axios from 'axios'

interface EnergyData {
  totalConsumption: number
  consumptionTrend: number
  savings: number
  savingsTrend: number
  efficiency: number
  prediction: number
  predictionTrend: number
  consumptionHistory: {
    date: string
    consumption: number
    cost: number
    efficiency: string
  }[]
}

export const useEnergyStore = defineStore('energy', {
  state: () => ({
    dashboardData: null as EnergyData | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchDashboardData() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get<EnergyData>('/api/v1/dashboard')
        this.dashboardData = response.data
      } catch (error) {
        this.error = 'Erro ao carregar dados do dashboard'
        console.error('Erro:', error)
        
        // Dados simulados para desenvolvimento
        this.dashboardData = {
          totalConsumption: 1250,
          consumptionTrend: -5.2,
          savings: 320.50,
          savingsTrend: 12.3,
          efficiency: 85,
          prediction: 1180,
          predictionTrend: -2.8,
          consumptionHistory: [
            {
              date: '2024-01-15',
              consumption: 42.5,
              cost: 38.25,
              efficiency: '87%'
            },
            {
              date: '2024-01-16',
              consumption: 39.8,
              cost: 35.82,
              efficiency: '89%'
            }
          ]
        }
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    getError: (state) => state.error,
    getDashboardData: (state) => state.dashboardData
  }
}) 