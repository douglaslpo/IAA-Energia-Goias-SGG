<template>
  <div class="line-chart">
    <Line
      v-if="chartData"
      :data="chartData"
      :options="mergedOptions"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export default defineComponent({
  name: 'LineChart',
  components: { Line },

  props: {
    data: {
      type: Array as PropType<Record<string, any>[]>,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    xKey: {
      type: String,
      default: 'date'
    },
    yKey: {
      type: String,
      default: 'value'
    },
    label: {
      type: String,
      default: 'Dados'
    }
  },

  setup(props) {
    const chartData = computed<ChartData>(() => {
      const labels = props.data.map(item => item[props.xKey]);
      const values = props.data.map(item => item[props.yKey]);

      return {
        labels,
        datasets: [
          {
            label: props.label,
            data: values,
            borderColor: '#1976D2',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            tension: 0.4
          }
        ]
      };
    });

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };

    const mergedOptions = computed(() => ({
      ...defaultOptions,
      ...props.options
    }));

    return {
      chartData,
      mergedOptions
    };
  }
});
</script>

<style lang="scss" scoped>
.line-chart {
  height: 100%;
  width: 100%;
}
</style> 