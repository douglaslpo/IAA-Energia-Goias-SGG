export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface EnergyMetrics {
  total_consumption: number;
  average_consumption: number;
  peak_consumption: number;
  efficiency_score: number;
}

export interface PredictionMetrics {
  timestamp: string;
  predicted: number;
  lower_bound: number;
  upper_bound: number;
}

export interface ValidationError {
  field: string;
  type: string;
  message: string;
  value: any;
}

export interface AnalysisResult {
  dataset: string;
  metrics: {
    average: number;
    standardDeviation: number;
    [key: string]: number;
  };
  predictions?: PredictionMetrics[];
  recommendations?: string[];
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  lastUpdated: Date;
  columns: string[];
  rowCount: number;
}

export interface AnalysisConfig {
  type: 'regression' | 'classification' | 'clustering';
  parameters: Record<string, any>;
  targetColumn?: string;
  features: string[];
}

export interface Model {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  parameters: Record<string, any>;
  metrics: Record<string, number>;
  status: 'training' | 'ready' | 'failed';
}

export type GranularityType = '1d' | '1w' | '1m' | '3m' | '6m' | '1y';

// Interfaces de Autenticação
export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Interfaces de Consumo
export interface ConsumoData {
  data: string
  valor: number
}

export interface SetorConsumo {
  nome: string
  consumo: number
  percentual: number
  variacao?: number
  icone: string
  cor: string
}

export interface HorarioConsumo {
  periodo: string
  consumo: number
  percentual: number
  icone: string
  cor: string
}

export interface Meta {
  id: number
  titulo: string
  progresso: number
  cor: string
}

export interface Indicador {
  nome: string
  descricao: string
  valor: number
  cor: string
}

export interface Recomendacao {
  id: number
  titulo: string
  descricao: string
  impacto: number
  prioridade: string
  cor: string
}

export interface Alerta {
  id: number
  titulo: string
  descricao: string
  tipo: 'info' | 'success' | 'warning' | 'error'
  mensagem?: string
}

// Interfaces de Configurações
export interface Perfil {
  nome: string
  email: string
  cargo: string
}

export interface AlterarSenha {
  atual: string
  nova: string
  confirmacao: string
}

export interface Preferencias {
  tema: boolean
  notificacoes: boolean
  idioma: string
  unidadeEnergia: string
}

export interface AlertaConfig {
  id: number
  titulo: string
  descricao: string
  ativo: boolean
}

// Tipos de Resposta da API
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// Enums
export enum UnidadeEnergia {
  KWH = 'kWh',
  MWH = 'MWh',
  JOULES = 'J'
}

export enum Idioma {
  PT_BR = 'pt-BR',
  EN_US = 'en-US',
  ES_ES = 'es-ES'
}

export enum TipoAlerta {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export enum Prioridade {
  BAIXA = 'Baixa',
  MEDIA = 'Média',
  ALTA = 'Alta'
}

// Interfaces de Tema
export interface ThemeConfig {
  dark: boolean
  colors: {
    primary: string
    secondary: string
    accent: string
    error: string
    info: string
    success: string
    warning: string
    background: string
    surface: string
  }
}

export type ThemeType = 'light' | 'dark'

// Tipos de Análise de Dados
export interface ProcessedDataPoint {
  timestamp: string
  value: number
  anomaly?: boolean
}

export interface DatasetMetrics {
  average: number
  standardDeviation: number
  min: number
  max: number
  median: number
  q1: number
  q3: number
  [key: string]: number
}

export interface DataAnalysisResult extends AnalysisResult {
  anomalies: ProcessedDataPoint[]
  metrics: DatasetMetrics
} 