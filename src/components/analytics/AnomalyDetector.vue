<template>
  <div class="anomaly-detector">
    <Line
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
    />
    <v-list v-if="anomalies.length > 0" class="mt-4">
      <v-list-subheader>Anomalias Detectadas</v-list-subheader>
      <v-list-item
        v-for="anomaly in anomalies"
        :key="anomaly.timestamp"
        :class="{ 'anomaly-item': anomaly.is_anomaly }"
      >
        <template v-slot:prepend>
          <v-icon :color="anomaly.is_anomaly ? 'error' : 'success'">
            {{ anomaly.is_anomaly ? 'mdi-alert-circle' : 'mdi-check-circle' }}
          </v-icon>
        </template>
        <v-list-item-title>
          {{ formatDate(anomaly.timestamp) }}
        </v-list-item-title>
        <v-list-item-subtitle>
          Consumo: {{ formatNumber(anomaly.value) }} kWh
          <v-chip
            v-if="anomaly.is_anomaly"
            color="error"
            size="small"
            class="ml-2"
          >
            Score: {{ formatNumber(anomaly.score) }}
          </v-chip>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-alert
      v-else
      type="info"
      class="mt-4"
    >
      Nenhuma anomalia detectada no período selecionado.
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { format } from 'date-fns'
import type { AnomalyData, GranularityType } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps<{
  data: AnomalyData[]
  granularity: GranularityType
}>()

const anomalies = computed(() => 
  props.data.filter(d => d.is_anomaly)
)

const chartData = computed(() => ({
  labels: props.data.map(d => format(new Date(d.timestamp), 'dd/MM/yyyy')),
  datasets: [
    {
      label: 'Consumo',
      data: props.data.map(d => d.value),
      borderColor: '#2196F3',
      backgroundColor: props.data.map(d => 
        d.is_anomaly ? '#F44336' : '#2196F3'
      ),
      pointRadius: props.data.map(d => 
        d.is_anomaly ? 6 : 3
      ),
      borderWidth: 2,
      fill: false
    },
    {
      label: 'Limite Superior',
      data: props.data.map(d => d.threshold),
      borderColor: 'rgba(244, 67, 54, 0.5)',
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      pointRadius: 0,
      borderWidth: 1,
      borderDash: [5, 5],
      fill: false
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        label: (context: any) => {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          label += formatNumber(context.parsed.y)
          if (props.data[context.dataIndex]?.is_anomaly) {
            label += ' (Anomalia)'
          }
          return label
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number) => formatNumber(value)
      }
    }
  }
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm')
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
</script>

<style scoped>
.anomaly-detector {
  width: 100%;
}

.anomaly-item {
  background-color: rgba(244, 67, 54, 0.1);
}

.v-list {
  max-height: 300px;
  overflow-y: auto;
}
</style> 