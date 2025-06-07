import { EnergyMetrics, Anomaly, Recommendation } from '../types';
import { PredictionMetrics } from '../types/analysis';
import { addDays, addHours, subDays } from 'date-fns';

const generateMockPredictions = (): PredictionMetrics[] => {
    return Array.from({ length: 30 }).map((_, i) => ({
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        actual: 1000 + Math.random() * 200,
        predicted: 1000 + Math.random() * 200,
        confidence: 0.8 + Math.random() * 0.15,
        error: Math.random() * 0.1,
        features: {
            temperature: 25 + Math.random() * 10,
            humidity: 60 + Math.random() * 20,
            dayType: ['Útil', 'Fim de Semana'][Math.floor(Math.random() * 2)],
            seasonality: Math.random()
        }
    }));
};

const generateMockData = (): EnergyMetrics => {
    const now = new Date();
    
    // Gerar dados de consumo normal com algumas variações
    const predictions = Array.from({ length: 30 }).map((_, index) => ({
        timestamp: addDays(now, index),
        value: Math.random() * 1000 + 500 + (index % 7 === 5 ? 200 : 0), // Pico aos sábados
        confidence: Math.random() * 20 + 80
    }));

    // Gerar anomalias para vários períodos de tempo
    const anomalies = [
        // Anomalias recentes (última semana)
        {
            timestamp: subDays(now, 2),
            severity: 'high' as const,
            description: 'Consumo anormal detectado: Pico de energia 45% acima do esperado. Possível falha no sistema de refrigeração principal.',
            impact: {
                energyWaste: '18%',
                estimatedCost: 2500,
                criticalTime: 24
            }
        },
        {
            timestamp: subDays(now, 5),
            severity: 'medium' as const,
            description: 'Padrão de consumo irregular durante horário não-comercial.',
            impact: {
                energyWaste: '8%',
                estimatedCost: 900,
                criticalTime: 12
            }
        },
        
        // Anomalias do último mês
        {
            timestamp: subDays(now, 15),
            severity: 'medium' as const,
            description: 'Vazamento de energia identificado no setor B.',
            impact: {
                energyWaste: '12%',
                estimatedCost: 1200,
                criticalTime: 12
            }
        },
        {
            timestamp: subDays(now, 25),
            severity: 'low' as const,
            description: 'Flutuação de energia acima do normal.',
            impact: {
                energyWaste: '5%',
                estimatedCost: 600,
                criticalTime: 6
            }
        },
        
        // Anomalias dos últimos 3 meses
        {
            timestamp: subDays(now, 45),
            severity: 'high' as const,
            description: 'Múltiplos equipamentos operando fora da eficiência ideal.',
            impact: {
                energyWaste: '20%',
                estimatedCost: 3000,
                criticalTime: 48
            }
        },
        {
            timestamp: subDays(now, 75),
            severity: 'medium' as const,
            description: 'Consumo noturno acima do padrão histórico.',
            impact: {
                energyWaste: '10%',
                estimatedCost: 1500,
                criticalTime: 18
            }
        },
        
        // Anomalias dos últimos 6 meses e 1 ano
        {
            timestamp: subDays(now, 120),
            severity: 'high' as const,
            description: 'Pico de consumo inexplicável.',
            impact: {
                energyWaste: '25%',
                estimatedCost: 3500,
                criticalTime: 36
            }
        },
        {
            timestamp: subDays(now, 250),
            severity: 'high' as const,
            description: 'Falha grave no sistema de distribuição.',
            impact: {
                energyWaste: '30%',
                estimatedCost: 4500,
                criticalTime: 72
            }
        }
    ];

    // Recomendações mais específicas
    const recommendations = [
        {
            id: '1',
            title: 'Manutenção do Sistema de Refrigeração',
            description: 'Realizar inspeção completa e manutenção do sistema de refrigeração principal. Identificados padrões de consumo irregular.',
            potentialSavings: 15,
            priority: 'high',
            implementation: {
                cost: 5000,
                time: '3 dias',
                roi: '2 meses'
            }
        },
        {
            id: '2',
            title: 'Correção de Vazamento - Setor B',
            description: 'Identificar e reparar pontos de vazamento de energia no setor B. Recomenda-se inspeção termográfica.',
            potentialSavings: 12,
            priority: 'medium',
            implementation: {
                cost: 2800,
                time: '2 dias',
                roi: '3 meses'
            }
        },
        {
            id: '3',
            title: 'Programa de Manutenção Preventiva',
            description: 'Implementar cronograma de manutenção preventiva para equipamentos críticos. Foco em eficiência energética.',
            potentialSavings: 25,
            priority: 'high',
            implementation: {
                cost: 8000,
                time: '1 semana',
                roi: '4 meses'
            }
        }
    ];

    return {
        predictions: generateMockPredictions(),
        anomalies,
        recommendations
    };
};

export const mockData = generateMockData(); 