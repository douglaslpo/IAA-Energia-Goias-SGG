import { PredictionAnalysisData, ModelPerformance } from '../types/analysis';
import type { PredictionMetrics } from '../types/analysis';

export const mockModelPerformance: ModelPerformance = {
    accuracy: 0.92,
    mape: 5.8,
    rmse: 234.5,
    featureImportance: [
        { name: 'Temperatura', importance: 0.35, description: 'Impacto da temperatura ambiente' },
        { name: 'Histórico', importance: 0.30, description: 'Padrões históricos de consumo' },
        { name: 'Dia da Semana', importance: 0.15, description: 'Variação por dia da semana' },
        { name: 'Sazonalidade', importance: 0.12, description: 'Padrões sazonais' },
        { name: 'Eventos', importance: 0.08, description: 'Eventos especiais e feriados' }
    ],
    trainingInfo: {
        lastUpdate: new Date(),
        dataPoints: 17520,
        convergenceIterations: 150,
        crossValidationScore: 0.89
    }
};

// Se a importação continuar falhando, defina o tipo inline
type LocalPredictionMetrics = {
    timestamp: string;
    actual: number;
    predicted: number;
    confidence: number;
    error: number;
    features: {
        temperature: number;
        humidity: number;
        dayType: string;
        seasonality: number;
    };
};

// Função helper para gerar dados de previsão para os últimos X meses
const generatePredictionData = (months: number): LocalPredictionMetrics[] => {
    const now = new Date();
    const result: LocalPredictionMetrics[] = [];
    
    // Gerar dados diários para X meses
    for (let i = 0; i < months * 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        result.push({
            timestamp: date.toISOString(),
            actual: 900 + Math.random() * 300, // valor entre 900 e 1200
            predicted: 900 + Math.random() * 300,
            error: Math.random() * 0.1, // erro de 0% a 10%
            confidence: 0.85 + Math.random() * 0.1, // 85% a 95% de confiança
            features: {
                temperature: 20 + Math.random() * 10,
                humidity: 50 + Math.random() * 30,
                dayType: ['Útil', 'Final de Semana'][Math.floor(Math.random() * 2)],
                seasonality: Math.random()
            }
        });
    }
    
    return result;
};

export const mockPredictionData: PredictionAnalysisData = {
    metrics: generatePredictionData(12), // Gerar dados para 12 meses
    model: {
        name: 'LightGBM v2.3',
        accuracy: 0.92,
        training: {
            start: '2019-01-01',
            end: '2023-01-01'
        }
    },
    performance: mockModelPerformance,
    alerts: [
        {
            type: 'drift',
            severity: 'medium',
            message: 'Detectada mudança no padrão de consumo',
            timestamp: new Date()
        },
        {
            type: 'anomaly',
            severity: 'high',
            message: 'Consumo anormal detectado',
            timestamp: new Date()
        }
    ]
};

export default { mockModelPerformance, mockPredictionData }; 