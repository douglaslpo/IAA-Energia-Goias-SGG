<template>
  <div class="prediction-chart">
    <Line
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { format } from 'date-fns'
import type { DateRange, PredictionData, GranularityType } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  data: PredictionData[]
  granularity: GranularityType
  timeRange: DateRange
}>()

const emit = defineEmits<{
  (e: 'update:granularity', value: GranularityType): void
}>()

const chartData = computed(() => ({
  labels: props.data.map(d => format(new Date(d.timestamp), 'dd/MM/yyyy')),
  datasets: [
    {
      label: 'Consumo Real',
      data: props.data.map(d => d.actual),
      borderColor: '#2196F3',
      backgroundColor: '#2196F3',
      pointRadius: 2,
      borderWidth: 2,
      fill: false
    },
    {
      label: 'Previsão',
      data: props.data.map(d => d.predicted),
      borderColor: '#4CAF50',
      backgroundColor: '#4CAF50',
      pointRadius: 2,
      borderWidth: 2,
      fill: false
    },
    {
      label: 'Intervalo de Confiança',
      data: props.data.map(d => d.upper_bound),
      borderColor: 'rgba(76, 175, 80, 0.2)',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      pointRadius: 0,
      borderWidth: 0,
      fill: 1
    },
    {
      label: 'Intervalo de Confiança',
      data: props.data.map(d => d.lower_bound),
      borderColor: 'rgba(76, 175, 80, 0.2)',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      pointRadius: 0,
      borderWidth: 0,
      fill: false
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true
      }
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
          label += new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(context.parsed.y)
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
        callback: (value: number) => {
          return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(value)
        }
      }
    }
  }
}

watch(() => props.granularity, (newValue) => {
  emit('update:granularity', newValue)
})
</script>

<style scoped>
.prediction-chart {
  width: 100%;
  height: 400px;
}
</style> 