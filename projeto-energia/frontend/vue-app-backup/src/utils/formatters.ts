/**
 * Formata um valor de energia em kWh
 * @param value Valor em kWh
 * @returns String formatada
 */
export const formatEnergy = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })
}

/**
 * Formata um valor monetário em Reais
 * @param value Valor em Reais
 * @returns String formatada
 */
export const formatMoney = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

/**
 * Formata uma data para o formato brasileiro
 * @param date Data em string ou objeto Date
 * @returns String formatada
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('pt-BR')
}

/**
 * Formata uma porcentagem
 * @param value Valor decimal (ex: 0.85 para 85%)
 * @returns String formatada
 */
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`
} 