export interface ConsumptionData {
    total: number;
    residential: number;
    commercial: number;
    industrial: number;
}

export interface WeatherData {
    timestamp: string;
    temperatura: number;
    umidade: number;
    consumption: number;
    humidity?: number;
    precipitation?: number;
    cloudCover?: number;
    windSpeed?: number;
}

export interface DemographicData {
    population: number;
    householdDensity: number;
    averageIncome: number;
    industrialZones: number;
    commercialZones: number;
    residentialZones: number;
}

export interface ConsumptionPatterns {
    dailyPeak: number;
    weeklyPeak: number;
    seasonalPeak: number;
}

export interface Correlations {
    weatherImpact: number;
    demographicImpact: number;
    seasonalityScore: number;
}

export interface EnergyAnalysis {
    timestamp: string;
    consumption: number | null;
    predicted: number | null;
    confidenceLow: number | null;
    confidenceHigh: number | null;
    residencial: number;
    comercial: number;
    industrial: number;
    weather?: WeatherData;
    demographic?: DemographicData;
    patterns?: ConsumptionPatterns;
    correlations?: Correlations;
}

export interface StatisticalInsight {
    type: string;
    description: string;
    impact: number;
    confidence: number;
    recommendations?: string[];
}

export interface PredictionMetrics {
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
}

export interface ModelPerformance {
    accuracy: number;
    mape: number;
    rmse: number;
    featureImportance: {
        name: string;
        importance: number;
        description: string;
    }[];
    trainingInfo: {
        lastUpdate: Date;
        dataPoints: number;
        convergenceIterations: number;
        crossValidationScore: number;
    };
}

export interface PredictionAnalysisData {
    metrics: PredictionMetrics[];
    model: {
        name: string;
        accuracy: number;
        training: {
            start: string;
            end: string;
        }
    };
    performance?: ModelPerformance;
    alerts?: any[];
} 