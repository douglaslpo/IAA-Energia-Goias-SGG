import { subDays, addDays, addHours, format } from 'date-fns';
import { EnergyAnalysis, WeatherData, StatisticalInsight } from '../types/analysis';
import { GranularityType } from '../types/granularity';

// Função para gerar dados de energia simulados
export function generateMockEnergyData(startDate: Date, endDate: Date, granularity: GranularityType): EnergyAnalysis[] {
    const result: EnergyAnalysis[] = [];
    let currentDate = new Date(startDate);
    
    // Determinar o intervalo entre pontos com base na granularidade
    let interval: number;
    switch (granularity) {
        case '1w': interval = 3; break;  // 3 horas
        case '1m': interval = 12; break; // 12 horas
        case '3m': interval = 24; break; // 1 dia
        case '6m': interval = 48; break; // 2 dias
        case '1y': interval = 168; break; // 7 dias
        default: interval = 24;
    }
    
    while (currentDate <= endDate) {
        // Base consumption with some randomization
        const baseConsumption = 20 + Math.random() * 15;
        
        // Add daily/seasonal patterns
        const hour = currentDate.getHours();
        const dayFactor = (hour >= 8 && hour <= 22) ? 1.5 : 0.8; // Mais consumo durante o dia
        
        // Tipos de consumo (simulados)
        const residencial = baseConsumption * dayFactor * 0.4;
        const comercial = baseConsumption * dayFactor * 0.3;
        const industrial = baseConsumption * dayFactor * 0.3;
        
        // Dados reais até hoje, previsão para o futuro
        const isPrevisao = currentDate > new Date();
        const consumption = baseConsumption * dayFactor;
        const predicted = isPrevisao ? consumption + (Math.random() * 4 - 2) : null;
        
        // Intervalos de confiança
        const confidenceFactor = 0.1 + (isPrevisao ? (currentDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24 * 30) * 0.15 : 0);
        
        result.push({
            timestamp: currentDate.toISOString(),
            consumption: isPrevisao ? null : consumption,
            predicted: predicted,
            confidenceLow: isPrevisao ? predicted! * (1 - confidenceFactor) : null,
            confidenceHigh: isPrevisao ? predicted! * (1 + confidenceFactor) : null,
            residencial,
            comercial,
            industrial
        });
        
        currentDate = addHours(currentDate, interval);
    }
    
    return result;
}

// Função para gerar dados climáticos simulados
export function generateMockWeatherData(startDate: Date, endDate: Date): WeatherData[] {
    const result: WeatherData[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        // Temperatura média com variação sazonal suave
        const dayOfYear = currentDate.getDate() + currentDate.getMonth() * 30;
        const baseTemp = 22 + 8 * Math.sin((dayOfYear / 365) * 2 * Math.PI);
        const temperatura = baseTemp + (Math.random() * 6 - 3);
        
        // Umidade correlacionada negativamente com temperatura
        const umidade = Math.max(30, Math.min(90, 100 - temperatura + (Math.random() * 20 - 10)));
        
        // Consumo proporcional à temperatura (mais alto em dias mais quentes)
        const consumption = 15 + temperatura * 0.8 + (Math.random() * 5 - 2.5);
        
        result.push({
            timestamp: currentDate.toISOString(),
            temperatura,
            umidade,
            consumption
        });
        
        currentDate = addDays(currentDate, 1);
    }
    
    return result;
}

// Função para gerar insights estatísticos simulados
export function generateMockInsights(): StatisticalInsight[] {
    return [
        {
            type: "Anomalia detectada",
            description: "Consumo 27% maior que o esperado no período noturno dos últimos 3 dias.",
            impact: 0.8,
            confidence: 0.92
        },
        {
            type: "Oportunidade de economia",
            description: "Redução de 15% no consumo é possível otimizando sistemas de refrigeração.",
            impact: 0.6,
            confidence: 0.85
        },
        {
            type: "Tendência sazonal",
            description: "Aumento de consumo previsto nas próximas 2 semanas devido a temperaturas mais altas.",
            impact: 0.4,
            confidence: 0.78
        }
    ];
} 