import { PredictionMetrics } from './analysis';

export interface DateRange {
    startDate: Date;
    endDate: Date;
}

export interface Prediction {
    timestamp: Date;
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
}

export interface Anomaly {
    timestamp: Date;
    severity: 'low' | 'medium' | 'high';
    description: string;
}

export interface Recommendation {
    id: string;
    title: string;
    description: string;
    potentialSavings: number;
}

export interface EnergyMetrics {
    predictions: PredictionMetrics[];
    anomalies: any[];
    recommendations: any[];
} 