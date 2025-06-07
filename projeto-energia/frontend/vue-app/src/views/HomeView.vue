<template>
  <div class="home">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">Bem-vindo ao Sistema de Análise de Consumo Energético</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6" lg="3">
        <v-card class="mb-4">
          <v-card-item>
            <v-card-title>Consumo Total</v-card-title>
            <div class="text-h4 mt-2">
              {{ formatNumber(consumoTotal) }} kWh
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-card class="mb-4">
          <v-card-item>
            <v-card-title>Custo Mensal</v-card-title>
            <div class="text-h4 mt-2">
              {{ formatCurrency(custoMensal) }}
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-card class="mb-4">
          <v-card-item>
            <v-card-title>Economia</v-card-title>
            <div class="text-h4 mt-2 text-success">
              {{ formatNumber(economia) }}%
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-card class="mb-4">
          <v-card-item>
            <v-card-title>Eficiência</v-card-title>
            <div class="text-h4 mt-2">
              {{ formatNumber(eficiencia) }}%
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="8">
        <v-card>
          <v-card-title class="d-flex align-center">
            Consumo por Período
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

      <v-col cols="12" lg="4">
        <v-card>
          <v-card-title>Distribuição por Setor</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="setor in setores"
                :key="setor.nome"
                :title="setor.nome"
                :subtitle="`${formatNumber(setor.consumo)} kWh - ${formatNumber(setor.percentual)}%`"
              >
                <template v-slot:prepend>
                  <v-icon :color="setor.cor">{{ setor.icone }}</v-icon>
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
          <v-card-title>Alertas e Recomendações</v-card-title>
          <v-card-text>
            <v-alert
              v-for="alerta in alertas"
              :key="alerta.id"
              :type="alerta.tipo"
              :title="alerta.titulo"
              class="mb-2"
            >
              {{ alerta.mensagem }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConsumptionChart from '@/components/ConsumptionChart.vue'

// Dados mockados
const consumoTotal = ref(15420)
const custoMensal = ref(7850.45)
const economia = ref(12.5)
const eficiencia = ref(85)

const periodos = ['Diário', 'Semanal', 'Mensal', 'Anual']
const periodoSelecionado = ref('Mensal')

const dadosConsumo = ref([
  { data: '2024-01', valor: 15420 },
  { data: '2024-02', valor: 14850 },
  { data: '2024-03', valor: 16200 },
  // ... mais dados
])

const setores = ref([
  {
    nome: 'Produção',
    consumo: 8500,
    percentual: 55.1,
    icone: 'mdi-factory',
    cor: 'primary'
  },
  {
    nome: 'Administrativo',
    consumo: 2300,
    percentual: 14.9,
    icone: 'mdi-office-building',
    cor: 'secondary'
  },
  {
    nome: 'Iluminação',
    consumo: 1850,
    percentual: 12,
    icone: 'mdi-lightbulb',
    cor: 'warning'
  },
  {
    nome: 'Climatização',
    consumo: 2770,
    percentual: 18,
    icone: 'mdi-air-conditioner',
    cor: 'info'
  }
])

const alertas = ref([
  {
    id: 1,
    tipo: 'warning',
    titulo: 'Consumo Elevado',
    mensagem: 'O setor de produção apresentou um aumento de 15% no consumo em relação ao mês anterior.'
  },
  {
    id: 2,
    tipo: 'success',
    titulo: 'Meta Atingida',
    mensagem: 'A meta de economia de energia foi atingida no setor administrativo.'
  },
  {
    id: 3,
    tipo: 'info',
    titulo: 'Manutenção Preventiva',
    mensagem: 'Recomenda-se a realização de manutenção preventiva nos equipamentos de climatização.'
  }
])

// Funções de formatação
const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR').format(value)
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>

<style lang="scss" scoped>
.home {
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

  .text-h4 {
    font-weight: 500;
  }
}
</style> 