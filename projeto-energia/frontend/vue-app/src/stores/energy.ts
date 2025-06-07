import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  ConsumoData,
  SetorConsumo,
  HorarioConsumo,
  Meta,
  Indicador,
  Recomendacao,
  Alerta
} from '@/types'

export const useEnergyStore = defineStore('energy', () => {
  const consumoTotal = ref(0)
  const custoMensal = ref(0)
  const economia = ref(0)
  const eficiencia = ref(0)

  const dadosConsumo = ref<ConsumoData[]>([])
  const setores = ref<SetorConsumo[]>([])
  const horarios = ref<HorarioConsumo[]>([])
  const metas = ref<Meta[]>([])
  const indicadores = ref<Indicador[]>([])
  const recomendacoes = ref<Recomendacao[]>([])
  const alertas = ref<Alerta[]>([])

  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDashboardData = async () => {
    loading.value = true
    error.value = null

    try {
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Dados mockados
      consumoTotal.value = 15420
      custoMensal.value = 7850.45
      economia.value = 12.5
      eficiencia.value = 85

      dadosConsumo.value = [
        { data: '2024-01', valor: 15420 },
        { data: '2024-02', valor: 14850 },
        { data: '2024-03', valor: 16200 }
      ]

      setores.value = [
        {
          nome: 'Produção',
          consumo: 8500,
          percentual: 55.1,
          variacao: 15,
          icone: 'mdi-factory',
          cor: 'primary'
        },
        {
          nome: 'Administrativo',
          consumo: 2300,
          percentual: 14.9,
          variacao: -8,
          icone: 'mdi-office-building',
          cor: 'secondary'
        },
        {
          nome: 'Iluminação',
          consumo: 1850,
          percentual: 12,
          variacao: -12,
          icone: 'mdi-lightbulb',
          cor: 'warning'
        },
        {
          nome: 'Climatização',
          consumo: 2770,
          percentual: 18,
          variacao: 5,
          icone: 'mdi-air-conditioner',
          cor: 'info'
        }
      ]

      horarios.value = [
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
      ]

      metas.value = [
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
      ]

      indicadores.value = [
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
      ]

      recomendacoes.value = [
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
      ]

      alertas.value = [
        {
          id: 1,
          titulo: 'Consumo Elevado',
          descricao: 'O setor de produção apresentou um aumento significativo',
          tipo: 'warning',
          mensagem: 'O setor de produção apresentou um aumento de 15% no consumo em relação ao mês anterior.'
        },
        {
          id: 2,
          titulo: 'Meta Atingida',
          descricao: 'Meta de economia de energia atingida',
          tipo: 'success',
          mensagem: 'A meta de economia de energia foi atingida no setor administrativo.'
        },
        {
          id: 3,
          titulo: 'Manutenção Preventiva',
          descricao: 'Recomendação de manutenção',
          tipo: 'info',
          mensagem: 'Recomenda-se a realização de manutenção preventiva nos equipamentos de climatização.'
        }
      ]
    } catch (err: any) {
      error.value = 'Erro ao carregar dados do dashboard'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    consumoTotal,
    custoMensal,
    economia,
    eficiencia,
    dadosConsumo,
    setores,
    horarios,
    metas,
    indicadores,
    recomendacoes,
    alertas,
    loading,
    error,
    fetchDashboardData
  }
}) 