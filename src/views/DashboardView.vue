<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Dashboard de Consumo Energético</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="d-flex align-center">
            Previsão de Consumo
            <v-spacer></v-spacer>
            <v-select
              v-model="selectedGranularity"
              :items="granularityOptions"
              label="Granularidade"
              density="compact"
              class="w-25"
            ></v-select>
          </v-card-title>
          <v-card-text>
            <prediction-chart
              :data="metrics.predictions"
              :granularity="selectedGranularity"
              :time-range="timeRange"
              @update:granularity="handleGranularityChange"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Detecção de Anomalias</v-card-title>
          <v-card-text>
            <anomaly-detector
              :data="metrics.anomalies"
              :granularity="selectedGranularity"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Métricas de Consumo</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Consumo Total</v-list-item-title>
                <v-list-item-subtitle>{{ formatNumber(metrics.total_consumption) }} kWh</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Consumo Médio</v-list-item-title>
                <v-list-item-subtitle>{{ formatNumber(metrics.average_consumption) }} kWh</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Pico de Consumo</v-list-item-title>
                <v-list-item-subtitle>{{ formatNumber(metrics.peak_consumption) }} kWh</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Score de Eficiência</v-list-item-title>
                <v-list-item-subtitle>
                  <v-progress-linear
                    :model-value="metrics.efficiency_score * 100"
                    :color="efficiencyColor"
                    height="20"
                  >
                    <template v-slot:default="{ value }">
                      <strong>{{ Math.ceil(value) }}%</strong>
                    </template>
                  </v-progress-linear>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Recomendações de Eficiência</v-card-title>
          <v-card-text>
            <efficiency-recommendations :data="metrics.recommendations" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import type { DateRange, EnergyMetrics, GranularityType } from '@/types'
import PredictionChart from '@/components/charts/PredictionChart.vue'
import AnomalyDetector from '@/components/analytics/AnomalyDetector.vue'
import EfficiencyRecommendations from '@/components/recommendations/EfficiencyRecommendations.vue'

const selectedGranularity = ref<GranularityType>('1d')
const granularityOptions = [
  { title: 'Diário', value: '1d' },
  { title: 'Semanal', value: '1w' },
  { title: 'Mensal', value: '1m' },
  { title: 'Trimestral', value: '3m' },
  { title: 'Semestral', value: '6m' },
  { title: 'Anual', value: '1y' }
]

const timeRange = ref<DateRange>({
  startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  endDate: new Date()
})

const metrics = ref<EnergyMetrics>({
  total_consumption: 0,
  average_consumption: 0,
  peak_consumption: 0,
  efficiency_score: 0,
  predictions: [],
  anomalies: [],
  recommendations: []
})

const efficiencyColor = computed(() => {
  const score = metrics.value.efficiency_score
  if (score >= 0.8) return 'success'
  if (score >= 0.6) return 'warning'
  return 'error'
})

const handleGranularityChange = (newGranularity: GranularityType) => {
  selectedGranularity.value = newGranularity
  // Aqui você pode adicionar lógica para atualizar os dados com a nova granularidade
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
</script>

<style scoped>
.v-card {
  height: 100%;
}

.v-list-item {
  padding: 16px;
}

.v-progress-linear {
  border-radius: 4px;
}
</style> 