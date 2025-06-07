<template>
  <div class="analysis">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">Análises</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            Análise Comparativa
            <v-spacer />
            <v-select
              v-model="periodoSelecionado"
              :items="periodos"
              density="compact"
              hide-details
              class="w-25"
            />
          </v-card-title>
          <v-card-text>
            <ConsumptionChart :data="dadosConsumo" :periodo="periodoSelecionado" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Análise por Horário</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="horario in horarios"
                :key="horario.periodo"
                :title="horario.periodo"
                :subtitle="`${formatNumber(horario.consumo)} kWh - ${formatNumber(horario.percentual)}%`"
              >
                <template v-slot:prepend>
                  <v-icon :color="horario.cor">{{ horario.icone }}</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Análise de Eficiência</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="indicador in indicadores"
                :key="indicador.nome"
                :title="indicador.nome"
                :subtitle="indicador.descricao"
              >
                <template v-slot:append>
                  <v-progress-linear
                    :model-value="indicador.valor"
                    :color="indicador.cor"
                    height="20"
                  >
                    <template v-slot:default="{ value }">
                      <strong>{{ Math.ceil(value) }}%</strong>
                    </template>
                  </v-progress-linear>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Recomendações de Otimização</v-card-title>
          <v-card-text>
            <v-timeline density="compact" align="start">
              <v-timeline-item
                v-for="recomendacao in recomendacoes"
                :key="recomendacao.id"
                :dot-color="recomendacao.cor"
                size="small"
              >
                <template v-slot:opposite>
                  {{ recomendacao.impacto }}% de economia
                </template>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-subtitle-1">{{ recomendacao.titulo }}</div>
                    <div class="text-body-2">{{ recomendacao.descricao }}</div>
                  </div>
                  <v-chip
                    :color="recomendacao.cor"
                    size="small"
                  >
                    {{ recomendacao.prioridade }}
                  </v-chip>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConsumptionChart from '@/components/ConsumptionChart.vue'

const periodos = ['Diário', 'Semanal', 'Mensal', 'Anual']
const periodoSelecionado = ref('Mensal')

const dadosConsumo = ref([
  { data: '2024-01', valor: 15420 },
  { data: '2024-02', valor: 14850 },
  { data: '2024-03', valor: 16200 }
])

const horarios = ref([
  {
    periodo: 'Horário de Pico (18h-21h)',
    consumo: 4500,
    percentual: 35,
    icone: 'mdi-clock-alert',
    cor: 'error'
  },
  {
    periodo: 'Horário Comercial (8h-18h)',
    consumo: 6800,
    percentual: 52,
    icone: 'mdi-clock',
    cor: 'primary'
  },
  {
    periodo: 'Madrugada (22h-7h)',
    consumo: 1700,
    percentual: 13,
    icone: 'mdi-clock-outline',
    cor: 'success'
  }
])

const indicadores = ref([
  {
    nome: 'Eficiência Geral',
    descricao: 'Índice de eficiência energética global',
    valor: 85,
    cor: 'success'
  },
  {
    nome: 'Uso de Capacidade',
    descricao: 'Aproveitamento da capacidade instalada',
    valor: 92,
    cor: 'primary'
  },
  {
    nome: 'Perdas',
    descricao: 'Percentual de perdas no sistema',
    valor: 8,
    cor: 'error'
  }
])

const recomendacoes = ref([
  {
    id: 1,
    titulo: 'Otimização do Horário de Pico',
    descricao: 'Redistribuir cargas para horários fora de pico',
    impacto: 15,
    prioridade: 'Alta',
    cor: 'error'
  },
  {
    id: 2,
    titulo: 'Manutenção Preventiva',
    descricao: 'Implementar programa de manutenção regular',
    impacto: 10,
    prioridade: 'Média',
    cor: 'warning'
  },
  {
    id: 3,
    titulo: 'Automação de Sistemas',
    descricao: 'Instalar sensores e controles automáticos',
    impacto: 20,
    prioridade: 'Alta',
    cor: 'primary'
  }
])

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR').format(value)
}
</script>

<style lang="scss" scoped>
.analysis {
  padding: var(--spacing-md);

  .v-card {
    border-radius: var(--border-radius-md);
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .text-h3 {
    color: var(--primary);
    font-weight: 500;
  }

  .v-timeline-item {
    margin-bottom: var(--spacing-md);
  }
}
</style> 