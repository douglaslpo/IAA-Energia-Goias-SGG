import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dataLabService } from '@/api/services'

export const useEnergyStore = defineStore('energy', () => {
  // Estado
  const consumptionData = ref([])
  const predictions = ref([])
  const metrics = ref({
    total_consumption: 0,
    average_consumption: 0,
    peak_consumption: 0,
    efficiency_score: 0
  })
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const totalConsumption = computed(() => metrics.value.total_consumption)
  const averageConsumption = computed(() => metrics.value.average_consumption)
  const peakConsumption = computed(() => metrics.value.peak_consumption)
  const efficiencyScore = computed(() => metrics.value.efficiency_score)

  // Ações
  async function fetchConsumptionData() {
    try {
      isLoading.value = true
      consumptionData.value = await dataLabService.getConsumptionData()
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPredictions() {
    try {
      isLoading.value = true
      predictions.value = await dataLabService.getPredictions()
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMetrics() {
    try {
      isLoading.value = true
      metrics.value = await dataLabService.getMetrics()
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAllData() {
    await Promise.all([
      fetchConsumptionData(),
      fetchPredictions(),
      fetchMetrics()
    ])
  }

  return {
    // Estado
    consumptionData,
    predictions,
    metrics,
    isLoading,
    error,

    // Getters
    totalConsumption,
    averageConsumption,
    peakConsumption,
    efficiencyScore,

    // Ações
    fetchConsumptionData,
    fetchPredictions,
    fetchMetrics,
    fetchAllData
  }
}) 