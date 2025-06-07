import api from './api'
import type {
  ConsumoData,
  SetorConsumo,
  HorarioConsumo,
  Meta,
  Indicador,
  Recomendacao,
  DateRange
} from '@/types'

class EnergyService {
  private static instance: EnergyService

  private constructor() {}

  static getInstance(): EnergyService {
    if (!EnergyService.instance) {
      EnergyService.instance = new EnergyService()
    }
    return EnergyService.instance
  }

  async getConsumoGeral(periodo: DateRange): Promise<ConsumoData[]> {
    try {
      const response = await api.get<ConsumoData[]>('/energia/consumo', {
        params: {
          startDate: periodo.startDate.toISOString(),
          endDate: periodo.endDate.toISOString()
        }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar consumo geral')
    }
  }

  async getConsumoPorSetor(): Promise<SetorConsumo[]> {
    try {
      const response = await api.get<SetorConsumo[]>('/energia/consumo/setores')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar consumo por setor')
    }
  }

  async getConsumoPorHorario(): Promise<HorarioConsumo[]> {
    try {
      const response = await api.get<HorarioConsumo[]>('/energia/consumo/horarios')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar consumo por horário')
    }
  }

  async getMetas(): Promise<Meta[]> {
    try {
      const response = await api.get<Meta[]>('/energia/metas')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar metas')
    }
  }

  async getIndicadores(): Promise<Indicador[]> {
    try {
      const response = await api.get<Indicador[]>('/energia/indicadores')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar indicadores')
    }
  }

  async getRecomendacoes(): Promise<Recomendacao[]> {
    try {
      const response = await api.get<Recomendacao[]>('/energia/recomendacoes')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar recomendações')
    }
  }

  async atualizarMeta(id: number, progresso: number): Promise<Meta> {
    try {
      const response = await api.put<Meta>(`/energia/metas/${id}`, { progresso })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar meta')
    }
  }

  async exportarDados(periodo: DateRange, formato: 'csv' | 'xlsx'): Promise<Blob> {
    try {
      const response = await api.get('/energia/exportar', {
        params: {
          startDate: periodo.startDate.toISOString(),
          endDate: periodo.endDate.toISOString(),
          formato
        },
        responseType: 'blob'
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao exportar dados')
    }
  }
}

export const energyService = EnergyService.getInstance() 