<template>
  <div class="data-viewer">
    <v-card>
      <v-card-title class="d-flex align-center">
        {{ title }}
        <v-spacer></v-spacer>
        <v-btn-group v-if="showControls">
          <v-btn
            :icon="showFilters ? 'mdi-filter-off' : 'mdi-filter'"
            @click="showFilters = !showFilters"
          ></v-btn>
          <v-btn
            icon="mdi-download"
            @click="downloadData"
          ></v-btn>
        </v-btn-group>
      </v-card-title>

      <!-- Filtros -->
      <v-expand-transition>
        <div v-if="showFilters">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  v-model="selectedColumns"
                  :items="availableColumns"
                  label="Colunas"
                  multiple
                  chips
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  label="Buscar"
                  append-inner-icon="mdi-magnify"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="sortBy"
                  :items="selectedColumns"
                  label="Ordenar por"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-expand-transition>

      <!-- Tabela de Dados -->
      <v-card-text>
        <v-data-table
          v-if="viewType === 'table'"
          :headers="headers"
          :items="filteredData"
          :search="search"
          :sort-by="sortBy"
          :loading="loading"
        >
          <template v-slot:loading>
            <v-skeleton-loader
              type="table-row"
              :loading="loading"
            ></v-skeleton-loader>
          </template>
        </v-data-table>

        <!-- Visualização em Gráfico -->
        <div v-else-if="viewType === 'chart'" class="chart-container">
          <v-select
            v-model="chartType"
            :items="chartTypes"
            label="Tipo de Gráfico"
            class="mb-4"
          ></v-select>
          
          <component
            :is="currentChartComponent"
            :data="filteredData"
            :options="chartOptions"
          ></component>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import { LineChart, BarChart, PieChart } from '@/components/charts';

export default defineComponent({
  name: 'DataViewer',

  components: {
    LineChart,
    BarChart,
    PieChart
  },

  props: {
    title: {
      type: String,
      default: 'Visualização de Dados'
    },
    data: {
      type: Array as PropType<Record<string, any>[]>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    showControls: {
      type: Boolean,
      default: true
    },
    viewType: {
      type: String as PropType<'table' | 'chart'>,
      default: 'table'
    }
  },

  setup(props) {
    const showFilters = ref(false);
    const search = ref('');
    const sortBy = ref('');
    const selectedColumns = ref<string[]>([]);
    const chartType = ref('line');

    const chartTypes = [
      { text: 'Linha', value: 'line' },
      { text: 'Barra', value: 'bar' },
      { text: 'Pizza', value: 'pie' }
    ];

    const availableColumns = computed(() => {
      if (!props.data.length) return [];
      return Object.keys(props.data[0]);
    });

    const headers = computed(() => {
      return selectedColumns.value.map(column => ({
        title: column,
        key: column
      }));
    });

    const filteredData = computed(() => {
      let result = [...props.data];

      if (selectedColumns.value.length) {
        result = result.map(item => {
          const filtered: Record<string, any> = {};
          selectedColumns.value.forEach(column => {
            filtered[column] = item[column];
          });
          return filtered;
        });
      }

      return result;
    });

    const currentChartComponent = computed(() => {
      const components = {
        line: 'LineChart',
        bar: 'BarChart',
        pie: 'PieChart'
      };
      return components[chartType.value as keyof typeof components];
    });

    const chartOptions = computed(() => {
      return {
        responsive: true,
        maintainAspectRatio: false
      };
    });

    const downloadData = () => {
      const csvContent = convertToCSV(filteredData.value);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${props.title.toLowerCase().replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const convertToCSV = (data: Record<string, any>[]) => {
      if (!data.length) return '';
      
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
      ];
      
      return csvRows.join('\n');
    };

    // Inicializar colunas selecionadas
    if (props.data.length) {
      selectedColumns.value = Object.keys(props.data[0]);
    }

    return {
      showFilters,
      search,
      sortBy,
      selectedColumns,
      availableColumns,
      headers,
      filteredData,
      chartType,
      chartTypes,
      currentChartComponent,
      chartOptions,
      downloadData
    };
  }
});
</script>

<style lang="scss" scoped>
.data-viewer {
  .chart-container {
    height: 400px;
    position: relative;
  }

  .v-data-table {
    width: 100%;
    overflow-x: auto;
  }
}
</style> 