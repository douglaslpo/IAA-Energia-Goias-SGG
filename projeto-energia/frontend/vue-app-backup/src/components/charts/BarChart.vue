<template>
  <div class="bar-chart">
    <Bar
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
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export default defineComponent({
  name: 'BarChart',
  components: { Bar },

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
      default: 'category'
    },
    yKey: {
      type: String,
      default: 'value'
    },
    label: {
      type: String,
      default: 'Dados'
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => ['#1976D2', '#4CAF50', '#FF9800', '#F44336']
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
            backgroundColor: props.colors,
            borderColor: props.colors.map(color => color.replace('1)', '0.6)')),
            borderWidth: 1
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
.bar-chart {
  height: 100%;
  width: 100%;
}
</style> 