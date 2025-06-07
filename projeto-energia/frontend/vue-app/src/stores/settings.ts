import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import {
  Perfil,
  AlterarSenha,
  Preferencias,
  AlertaConfig,
  UnidadeEnergia,
  Idioma
} from '@/types'

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<'light' | 'dark'>('light')
  const language = ref<'pt-BR' | 'en-US' | 'es-ES'>('pt-BR')
  const energyUnit = ref<'kWh' | 'MWh' | 'J'>('kWh')

  const loading = ref(false)
  const error = ref<string | null>(null)

  const perfil = ref<Perfil>({
    nome: 'João Silva',
    email: 'joao.silva@empresa.com',
    cargo: 'Gerente de Energia'
  })

  const preferencias = ref<Preferencias>({
    tema: theme.value === 'dark',
    notificacoes: true,
    idioma: Idioma.PT_BR,
    unidadeEnergia: UnidadeEnergia.KWH
  })

  const alertasConfig = ref<AlertaConfig[]>([
    {
      id: 1,
      titulo: 'Consumo Elevado',
      descricao: 'Notificar quando o consumo ultrapassar a média',
      ativo: true
    },
    {
      id: 2,
      titulo: 'Manutenção Preventiva',
      descricao: 'Alertar sobre necessidade de manutenção',
      ativo: true
    },
    {
      id: 3,
      titulo: 'Relatórios Semanais',
      descricao: 'Enviar relatório semanal por e-mail',
      ativo: false
    }
  ])

  const atualizarPerfil = async (novoPerfil: Perfil) => {
    loading.value = true
    error.value = null

    try {
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000))
      perfil.value = novoPerfil
    } catch (err: any) {
      error.value = 'Erro ao atualizar perfil'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const alterarSenha = async (dados: AlterarSenha) => {
    loading.value = true
    error.value = null

    try {
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Sucesso
    } catch (err: any) {
      error.value = 'Erro ao alterar senha'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const alterarTema = (isDark: boolean) => {
    theme.value = isDark ? 'dark' : 'light'
    preferencias.value.tema = isDark
    salvarPreferencias()
  }

  const alterarNotificacoes = (ativar: boolean) => {
    preferencias.value.notificacoes = ativar
    salvarPreferencias()
  }

  const alterarIdioma = (novoIdioma: 'pt-BR' | 'en-US' | 'es-ES') => {
    language.value = novoIdioma
    preferencias.value.idioma = Idioma.PT_BR
    salvarPreferencias()
  }

  const alterarUnidadeEnergia = (novaUnidade: 'kWh' | 'MWh' | 'J') => {
    energyUnit.value = novaUnidade
    preferencias.value.unidadeEnergia = UnidadeEnergia.KWH
    salvarPreferencias()
  }

  const alterarAlerta = async (alerta: AlertaConfig) => {
    loading.value = true
    error.value = null

    try {
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000))
      const index = alertasConfig.value.findIndex(a => a.id === alerta.id)
      if (index !== -1) {
        alertasConfig.value[index] = alerta
      }
    } catch (err: any) {
      error.value = 'Erro ao atualizar alerta'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const salvarPreferencias = async () => {
    loading.value = true
    error.value = null

    try {
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000))
      localStorage.setItem('preferencias', JSON.stringify(preferencias.value))
    } catch (err: any) {
      error.value = 'Erro ao salvar preferências'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const carregarPreferencias = () => {
    const storedPrefs = localStorage.getItem('preferencias')
    if (storedPrefs) {
      preferencias.value = JSON.parse(storedPrefs)
      theme.value = preferencias.value.tema ? 'dark' : 'light'
    }
  }

  return {
    loading,
    error,
    perfil,
    preferencias,
    alertasConfig,
    atualizarPerfil,
    alterarSenha,
    alterarTema,
    alterarNotificacoes,
    alterarIdioma,
    alterarUnidadeEnergia,
    alterarAlerta,
    carregarPreferencias,
    theme,
    language,
    energyUnit
  }
}) 