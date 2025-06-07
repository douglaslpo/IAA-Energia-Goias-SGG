<template>
  <div class="consumption-chart">
    <Line
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
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
  ChartOptions
} from 'chart.js'

// Registra os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface ConsumptionData {
  timestamp: string;
  value: number;
  unit: string;
}

export default defineComponent({
  name: 'ConsumptionChart',
  components: { Line },
  props: {
    data: {
      type: Array as PropType<ConsumptionData[]>,
      required: true
    },
    title: {
      type: String,
      default: 'Consumo de Energia'
    }
  },
  setup(props) {
    const chartData = computed(() => ({
      labels: props.data.map(item => {
        const date = new Date(item.timestamp)
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }),
      datasets: [
        {
          label: 'Consumo (kWh)',
          data: props.data.map(item => item.value),
          borderColor: '#1976D2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    }))

    const chartOptions: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const
        },
        title: {
          display: true,
          text: props.title
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Consumo (kWh)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Hora'
          }
        }
      }
    }

    return {
      chartData,
      chartOptions
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.consumption-chart {
  @include card;
  width: 100%;
  height: 400px;

  @include respond-to(xs) {
    height: 300px;
  }
}
</style> 