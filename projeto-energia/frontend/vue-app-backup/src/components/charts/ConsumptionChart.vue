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
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    tension: number
  }[]
}

export default defineComponent({
  name: 'ConsumptionChart',
  components: { Line },
  
  props: {
    data: {
      type: Object as PropType<ChartData>,
      required: true
    }
  },

  setup(props) {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const
        },
        title: {
          display: true,
          text: 'Consumo de Energia ao Longo do Tempo'
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
            text: 'Data'
          }
        }
      }
    }

    return {
      chartOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.consumption-chart {
  height: 400px;
  width: 100%;
}
</style> 