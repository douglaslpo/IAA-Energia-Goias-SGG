<template>
  <div class="pie-chart">
    <Pie
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
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'vue-chartjs';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface ChartDataset {
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export default defineComponent({
  name: 'PieChart',
  components: { Pie },

  props: {
    data: {
      type: Array as PropType<Record<string, any>[]>,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => [
        '#1976D2',
        '#4CAF50',
        '#FF9800',
        '#F44336',
        '#9C27B0',
        '#00BCD4'
      ]
    }
  },

  setup(props) {
    const chartData = computed<ChartData>(() => {
      const labels = props.data.map(item => item[props.labelKey]);
      const values = props.data.map(item => item[props.valueKey]);

      return {
        labels,
        datasets: [
          {
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
          position: 'right' as const,
          labels: {
            padding: 20,
            boxWidth: 12,
            font: {
              size: 12
            }
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
.pie-chart {
  height: 100%;
  width: 100%;
}
</style> 