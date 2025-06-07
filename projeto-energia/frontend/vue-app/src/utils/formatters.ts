/**
 * Formata um valor de energia para exibição
 * @param value Valor em kWh
 * @param decimals Número de casas decimais
 * @returns String formatada
 */
export function formatEnergy(value: number, decimals: number = 2): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(decimals)} MWh`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(decimals)} kWh`
  } else {
    return `${value.toFixed(decimals)} Wh`
  }
}

/**
 * Formata um valor monetário para exibição
 * @param value Valor em reais
 * @param currency Moeda (padrão: BRL)
 * @returns String formatada
 */
export function formatMoney(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(value)
}

/**
 * Formata uma data para exibição
 * @param date Data a ser formatada
 * @param format Formato desejado (padrão: dd/MM/yyyy)
 * @returns String formatada
 */
export function formatDate(date: Date | string, format: string = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR').format(d)
}

/**
 * Formata um número para exibição
 * @param value Número a ser formatado
 * @param decimals Número de casas decimais
 * @returns String formatada
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

/**
 * Formata uma porcentagem para exibição
 * @param value Valor em decimal (0-1)
 * @param decimals Número de casas decimais
 * @returns String formatada
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
} 