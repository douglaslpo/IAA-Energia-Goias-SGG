import { EnergyAnalysis, StatisticalInsight, WeatherData } from '../types/analysis';
import { addDays, addHours } from 'date-fns';

const generateMockAnalysisData = (): EnergyAnalysis[] => {
    const startDate = new Date();
    return Array.from({ length: 180 }).map((_, index) => {
        const date = addDays(startDate, -index);
        const isPrevisao = date > new Date();
        const baseConsumption = 1000 + Math.random() * 500;
        const predicted = isPrevisao ? baseConsumption + (Math.random() * 200 - 100) : null;
        
        return {
            timestamp: date.toISOString(),
            consumption: isPrevisao ? null : baseConsumption,
            predicted: predicted,
            confidenceLow: isPrevisao ? predicted! * 0.9 : null,
            confidenceHigh: isPrevisao ? predicted! * 1.1 : null,
            residencial: baseConsumption * 0.4,
            comercial: baseConsumption * 0.3,
            industrial: baseConsumption * 0.3,
            weather: {
                timestamp: date.toISOString(),
                temperatura: 25 + Math.random() * 10,
                umidade: 50 + Math.random() * 30,
                consumption: baseConsumption * 0.8,
                humidity: 50 + Math.random() * 30,
                precipitation: Math.random() * 10,
                cloudCover: Math.random() * 100,
                windSpeed: 5 + Math.random() * 20
            },
            demographic: {
                population: 1000000 + Math.random() * 500000,
                householdDensity: 2.5 + Math.random(),
                averageIncome: 3000 + Math.random() * 2000,
                industrialZones: 10 + Math.round(Math.random() * 5),
                commercialZones: 50 + Math.round(Math.random() * 20),
                residentialZones: 100 + Math.round(Math.random() * 50)
            },
            patterns: {
                dailyPeak: baseConsumption * 1.2,
                weeklyPeak: baseConsumption * 1.3,
                seasonalPeak: baseConsumption * 1.5
            },
            correlations: {
                weatherImpact: 0.7 + Math.random() * 0.3,
                demographicImpact: 0.5 + Math.random() * 0.3,
                seasonalityScore: 0.6 + Math.random() * 0.4
            }
        };
    });
};

const generateWeatherData = (): WeatherData[] => {
    const startDate = new Date();
    return Array.from({ length: 100 }).map((_, index) => {
        const date = addDays(startDate, -index);
        return {
            timestamp: date.toISOString(),
            temperatura: 20 + Math.random() * 15,
            umidade: 50 + Math.random() * 30,
            consumption: 800 + Math.random() * 400,
            humidity: 50 + Math.random() * 30,
            precipitation: Math.random() * 10,
            cloudCover: Math.random() * 100,
            windSpeed: 5 + Math.random() * 15
        };
    });
};

const generateMockInsights = (): StatisticalInsight[] => [
    {
        type: 'pattern',
        description: 'Pico de consumo detectado entre 14h e 16h nos dias úteis',
        confidence: 0.95,
        impact: 0.8,
        recommendations: [
            'Considerar ajustes no horário de operação',
            'Implementar sistema de gestão de demanda'
        ]
    },
    {
        type: 'correlation',
        description: 'Forte correlação entre temperatura e consumo residencial',
        confidence: 0.88,
        impact: 0.6,
        recommendations: [
            'Otimizar sistemas de climatização',
            'Implementar isolamento térmico'
        ]
    },
    {
        type: 'anomaly',
        description: 'Consumo industrial 30% acima do esperado',
        confidence: 0.92,
        impact: 0.75,
        recommendations: [
            'Investigar equipamentos industriais',
            'Verificar vazamentos no sistema'
        ]
    }
];

export const mockAnalysisData = {
    analysis: generateMockAnalysisData(),
    insights: generateMockInsights(),
    weather: generateWeatherData()
}; 