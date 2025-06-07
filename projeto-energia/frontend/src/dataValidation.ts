import { PredictionMetrics } from '../types/analysis';

export const validatePredictionMetrics = (data: PredictionMetrics[]): boolean => {
    return data.every(metric => (
        typeof metric.timestamp === 'string' &&
        typeof metric.actual === 'number' &&
        typeof metric.predicted === 'number' &&
        typeof metric.confidence === 'number' &&
        typeof metric.error === 'number' &&
        metric.features &&
        typeof metric.features.temperature === 'number' &&
        typeof metric.features.humidity === 'number' &&
        typeof metric.features.dayType === 'string' &&
        typeof metric.features.seasonality === 'number'
    ));
};

export const sanitizePredictionData = (data: any[]): PredictionMetrics[] => {
    return data.map(item => ({
        timestamp: new Date(item.timestamp).toISOString(),
        actual: Number(item.actual),
        predicted: Number(item.predicted),
        confidence: Number(item.confidence),
        error: Number(item.error),
        features: {
            temperature: Number(item.features.temperature),
            humidity: Number(item.features.humidity),
            dayType: String(item.features.dayType),
            seasonality: Number(item.features.seasonality)
        }
    }));
};

export default { validatePredictionMetrics, sanitizePredictionData }; 