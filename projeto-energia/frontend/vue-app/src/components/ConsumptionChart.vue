<template>
  <div class="consumption-chart">
    <Line
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { ChartData, ChartOptions } from 'chart.js'
import { ConsumoData } from '@/types'

const props = defineProps<{
  data: ConsumoData[]
  periodo: string
}>()

const chartData = computed<ChartData>(() => ({
  labels: props.data.map(item => item.data),
  datasets: [
    {
      label: 'Consumo (kWh)',
      data: props.data.map(item => item.valor),
      borderColor: '#1976D2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }
  ]
}))

const chartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: (context: any) => {
          const value = context.raw
          return `${value.toLocaleString('pt-BR')} kWh`
        }
      }
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'x'
      },
      pan: {
        enabled: true,
        mode: 'x'
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
        callback: (value: any) => {
          return value.toLocaleString('pt-BR')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.consumption-chart {
  width: 100%;
  height: 400px;
  margin: var(--spacing-md) 0;
}
</style> 