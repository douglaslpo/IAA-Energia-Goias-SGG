<template>
  <div class="dashboard">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">Dashboard</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="8">
        <v-card>
          <v-card-title>Consumo por Período</v-card-title>
          <v-card-text>
            <ConsumptionChart :data="dadosConsumo" :periodo="periodoSelecionado" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card>
          <v-card-title>Metas</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="meta in metas"
                :key="meta.id"
                :title="meta.titulo"
                :subtitle="`${meta.progresso}% concluído`"
              >
                <template v-slot:append>
                  <v-progress-circular
                    :model-value="meta.progresso"
                    :color="meta.cor"
                    size="24"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Consumo por Setor</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="setor in setores"
                :key="setor.nome"
                :title="setor.nome"
                :subtitle="`${formatNumber(setor.consumo)} kWh`"
              >
                <template v-slot:prepend>
                  <v-icon :color="setor.cor">{{ setor.icone }}</v-icon>
                </template>
                <template v-slot:append>
                  <v-chip
                    :color="setor.variacao > 0 ? 'error' : 'success'"
                    size="small"
                  >
                    {{ setor.variacao > 0 ? '+' : '' }}{{ setor.variacao }}%
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Recomendações</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="recomendacao in recomendacoes"
                :key="recomendacao.id"
                :title="recomendacao.titulo"
                :subtitle="recomendacao.descricao"
                :prepend-icon="recomendacao.icone"
                :color="recomendacao.cor"
              />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConsumptionChart from '@/components/ConsumptionChart.vue'

const periodoSelecionado = ref('Mensal')

const dadosConsumo = ref([
  { data: '2024-01', valor: 15420 },
  { data: '2024-02', valor: 14850 },
  { data: '2024-03', valor: 16200 }
])

const metas = ref([
  {
    id: 1,
    titulo: 'Redução de 10% no consumo',
    progresso: 75,
    cor: 'primary'
  },
  {
    id: 2,
    titulo: 'Eficiência energética',
    progresso: 90,
    cor: 'success'
  },
  {
    id: 3,
    titulo: 'Uso de energia renovável',
    progresso: 45,
    cor: 'warning'
  }
])

const setores = ref([
  {
    nome: 'Produção',
    consumo: 8500,
    variacao: 15,
    icone: 'mdi-factory',
    cor: 'primary'
  },
  {
    nome: 'Administrativo',
    consumo: 2300,
    variacao: -8,
    icone: 'mdi-office-building',
    cor: 'secondary'
  },
  {
    nome: 'Iluminação',
    consumo: 1850,
    variacao: -12,
    icone: 'mdi-lightbulb',
    cor: 'warning'
  },
  {
    nome: 'Climatização',
    consumo: 2770,
    variacao: 5,
    icone: 'mdi-air-conditioner',
    cor: 'info'
  }
])

const recomendacoes = ref([
  {
    id: 1,
    titulo: 'Otimização do Sistema de Climatização',
    descricao: 'Ajuste a temperatura dos ambientes para reduzir o consumo.',
    icone: 'mdi-air-conditioner',
    cor: 'info'
  },
  {
    id: 2,
    titulo: 'Manutenção Preventiva',
    descricao: 'Agende a manutenção dos equipamentos da produção.',
    icone: 'mdi-wrench',
    cor: 'warning'
  },
  {
    id: 3,
    titulo: 'Iluminação Inteligente',
    descricao: 'Implemente sensores de presença nas áreas administrativas.',
    icone: 'mdi-lightbulb-on',
    cor: 'success'
  }
])

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR').format(value)
}
</script>

<style lang="scss" scoped>
.dashboard {
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
}
</style> 