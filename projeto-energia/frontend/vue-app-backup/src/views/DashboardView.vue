<template>
  <div class="dashboard">
    <v-row>
      <!-- Card de Consumo Total -->
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-title>Consumo Total</v-card-title>
          <v-card-text>
            <div class="text-h4">{{ formatEnergy(totalConsumption) }} kWh</div>
            <v-chip
              :color="consumptionTrend > 0 ? 'error' : 'success'"
              class="mt-2"
            >
              {{ consumptionTrend > 0 ? '+' : '' }}{{ consumptionTrend }}%
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Card de Economia -->
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-title>Economia</v-card-title>
          <v-card-text>
            <div class="text-h4">R$ {{ formatMoney(savings) }}</div>
            <v-chip color="success" class="mt-2">
              +{{ savingsTrend }}%
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Card de Eficiência -->
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-title>Eficiência</v-card-title>
          <v-card-text>
            <div class="text-h4">{{ efficiency }}%</div>
            <v-progress-linear
              :model-value="efficiency"
              color="success"
              height="10"
              class="mt-2"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Card de Previsão -->
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-title>Previsão Mensal</v-card-title>
          <v-card-text>
            <div class="text-h4">{{ formatEnergy(prediction) }} kWh</div>
            <v-chip
              :color="predictionTrend > 0 ? 'warning' : 'success'"
              class="mt-2"
            >
              {{ predictionTrend > 0 ? '+' : '' }}{{ predictionTrend }}%
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráfico de Consumo -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Consumo de Energia
            <v-spacer></v-spacer>
            <v-select
              v-model="timeRange"
              :items="timeRanges"
              density="compact"
              hide-details
              class="time-range-select"
            ></v-select>
          </v-card-title>
          <v-card-text>
            <ConsumptionChart
              :data="chartData"
              :options="chartOptions"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabela de Detalhes -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Detalhes do Consumo
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
              density="compact"
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="consumptionDetails"
              :search="search"
              density="compact"
            ></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import ConsumptionChart from '@/components/charts/ConsumptionChart.vue'
import { useEnergyStore } from '@/store/energy'
import { formatEnergy, formatMoney } from '@/utils/formatters'

export default defineComponent({
  name: 'DashboardView',
  
  components: {
    ConsumptionChart
  },

  setup() {
    const energyStore = useEnergyStore()
    const search = ref('')
    const timeRange = ref('month')
    
    const timeRanges = [
      { title: 'Última Semana', value: 'week' },
      { title: 'Último Mês', value: 'month' },
      { title: 'Último Ano', value: 'year' }
    ]

    const headers = [
      { title: 'Data', key: 'date' },
      { title: 'Consumo (kWh)', key: 'consumption' },
      { title: 'Custo (R$)', key: 'cost' },
      { title: 'Eficiência', key: 'efficiency' }
    ]

    // Dados simulados
    const totalConsumption = ref(1250)
    const consumptionTrend = ref(-5.2)
    const savings = ref(320.50)
    const savingsTrend = ref(12.3)
    const efficiency = ref(85)
    const prediction = ref(1180)
    const predictionTrend = ref(-2.8)

    const consumptionDetails = ref([
      {
        date: '2024-01-15',
        consumption: 42.5,
        cost: 38.25,
        efficiency: '87%'
      },
      // Adicionar mais dados aqui
    ])

    onMounted(async () => {
      await energyStore.fetchDashboardData()
    })

    return {
      search,
      timeRange,
      timeRanges,
      headers,
      totalConsumption,
      consumptionTrend,
      savings,
      savingsTrend,
      efficiency,
      prediction,
      predictionTrend,
      consumptionDetails,
      formatEnergy,
      formatMoney
    }
  }
})
</script>

<style lang="scss" scoped>
.dashboard {
  .time-range-select {
    max-width: 200px;
  }

  .v-card {
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }
  }
}
</style> 