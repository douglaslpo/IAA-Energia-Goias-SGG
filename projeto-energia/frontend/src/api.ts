import { EnergyMetrics, DateRange } from '../types';
import { PredictionMetrics, PredictionAnalysisData, ModelPerformance } from '../types/analysis';
import { mockData } from './mockData';
import { mockPredictionData, mockModelPerformance } from './mockPredictionData';
import { mockAnalysisData } from './mockAnalysisData';
import { getDaysDifference } from '../utils/dateUtils';
import axios from 'axios';
import { GranularityType } from '../types/granularity';
import { subDays, subMonths } from 'date-fns';
import { generateMockEnergyData, generateMockWeatherData, generateMockInsights } from './mockDataGenerators';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000'
});

export const energyService = {
    async getPredictions(region: string, timeRange: DateRange): Promise<EnergyMetrics> {
        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockData;
    },

    async getAnomalies(region: string, timeRange: DateRange) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockData.anomalies;
    },

    async getRecommendations(region: string) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockData.recommendations;
    }
};

export const predictionService = {
    async getPredictionAnalysis(granularity: GranularityType): Promise<PredictionMetrics[]> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const now = new Date();
        let startDate: Date;
        
        switch (granularity) {
            case '1w':
                startDate = subDays(now, 7);
                break;
            case '1m':
                startDate = subMonths(now, 1);
                break;
            case '3m':
                startDate = subMonths(now, 3);
                break;
            case '6m':
                startDate = subMonths(now, 6);
                break;
            case '1y':
                startDate = subMonths(now, 12);
                break;
            default:
                startDate = subDays(now, 7);
        }
        
        // Filtrar dados para o período selecionado
        const filteredData = mockPredictionData.metrics.filter(metric => {
            const date = new Date(metric.timestamp);
            return date >= startDate && date <= now;
        });
        
        // Reduzir o número de pontos para exibição
        let step = 1;
        if (granularity === '3m') step = 3;
        if (granularity === '6m') step = 6;
        if (granularity === '1y') step = 12;
        
        // Retornar apenas um subconjunto dos pontos para não sobrecarregar o gráfico
        return filteredData.filter((_, index) => index % step === 0);
    },

    async getModelPerformance(): Promise<ModelPerformance> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockModelPerformance;
    }
};

export const analysisService = {
    getAnalysisData: async ({ timeRange, period, granularity }) => {
        try {
            console.log('API request params:', { timeRange, period, granularity });
            
            // Simulando uma chamada de API com dados simulados
            const data = {
                analysis: generateMockEnergyData(timeRange.startDate, timeRange.endDate, granularity),
                weather: generateMockWeatherData(timeRange.startDate, timeRange.endDate),
                insights: generateMockInsights()
            };
            
            console.log('API response data (first 2 items):', {
                analysis: data.analysis.slice(0, 2),
                weather: data.weather.slice(0, 2),
                insightsCount: data.insights.length
            });
            
            return data;
        } catch (error) {
            console.error('Erro na chamada de API:', error);
            // Retornar dados mínimos para evitar falhas na interface
            return {
                analysis: [],
                weather: [],
                insights: []
            };
        }
    }
};

export const etlService = {
    /**
     * Executa o pipeline de ETL para um dataset
     * @param datasetPath Caminho para o dataset
     * @param options Opções de configuração do ETL
     */
    runETLPipeline: async (datasetPath: string, options: {
        validateSchema?: boolean;
        checkQuality?: boolean;
        normalizeNumeric?: boolean;
        encodeCategorical?: boolean;
        extractTemporalFeatures?: boolean;
        removeOutliers?: boolean;
        fillMissingValues?: boolean;
    }) => {
        try {
            console.log('ETL request:', { datasetPath, options });
            
            // Simular delay de processamento
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Simular resposta do backend
            const mockResult = {
                status: 'success',
                message: 'ETL concluído com sucesso',
                outputPath: `dados/processed/${datasetPath.split('/').pop()?.replace('.csv', '')}_processed.csv`,
                validation: {
                    schema: { 
                        isValid: true, 
                        errors: [] 
                    },
                    quality: { 
                        score: 0.95, 
                        issues: [
                            { type: 'missing_values', count: 12 },
                            { type: 'outliers', count: 8 }
                        ] 
                    },
                    completeness: { 
                        score: 0.98,
                        column_completeness: {
                            'ano': 1.0,
                            'mes': 1.0,
                            'regiao': 1.0,
                            'estado': 1.0,
                            'consumo_residencial': 0.99,
                            'consumo_comercial': 0.98,
                            'consumo_industrial': 0.97,
                            'consumo_rural': 0.95,
                            'consumo_total': 1.0
                        }
                    }
                },
                transformations: {
                    rowsBefore: 1500,
                    rowsAfter: options.removeOutliers ? 1488 : 1500,
                    columnsBefore: 9,
                    columnsAfter: options.extractTemporalFeatures ? 15 : 9,
                    appliedTransformations: Object.entries(options)
                        .filter(([_, value]) => value)
                        .map(([key, _]) => key)
                },
                executionTime: '3.2s'
            };
            
            return mockResult;
        } catch (error) {
            console.error('Erro no processamento ETL:', error);
            return {
                status: 'error',
                message: `Erro no processamento ETL: ${error}`,
                details: error
            };
        }
    },
    
    /**
     * Obtém a lista de configurações disponíveis para ETL
     */
    getETLConfigurations: async () => {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            schemaValidations: [
                { id: 'required_columns', name: 'Colunas Obrigatórias', default: true },
                { id: 'data_types', name: 'Tipos de Dados', default: true }
            ],
            qualityChecks: [
                { id: 'missing_values', name: 'Valores Faltantes', default: true },
                { id: 'duplicates', name: 'Duplicatas', default: true },
                { id: 'outliers', name: 'Outliers', default: true }
            ],
            transformations: [
                { id: 'normalize', name: 'Normalização', default: true },
                { id: 'standardize', name: 'Padronização', default: false },
                { id: 'categorical_encoding', name: 'Codificação Categórica', default: true },
                { id: 'temporal_features', name: 'Features Temporais', default: true }
            ],
            cleaningOptions: [
                { id: 'remove_outliers', name: 'Remover Outliers', default: false },
                { id: 'fill_missing', name: 'Preencher Valores Faltantes', default: false }
            ]
        };
    }
};

export const dataService = {
    /**
     * Carrega dados reais de um arquivo
     * @param filePath Caminho do arquivo a ser carregado
     */
    loadRealData: async (filePath: string) => {
        try {
            console.log('Carregando dados reais de:', filePath);
            
            // Em um ambiente real, faríamos uma chamada para o backend
            // Neste exemplo, vamos simular a leitura dos arquivos reais
            
            // Mapear os arquivos reais para os dados que temos
            const realDataMapping: {[key: string]: any} = {
                '/dados/dados_epe.csv': {
                    columns: [
                        { name: 'ano', type: 'number', description: 'Ano de referência' },
                        { name: 'mes', type: 'number', description: 'Mês de referência' },
                        { name: 'regiao', type: 'string', description: 'Região geográfica' },
                        { name: 'uf', type: 'string', description: 'Unidade federativa' },
                        { name: 'consumo_residencial', type: 'number', description: 'Consumo residencial em MWh' },
                        { name: 'consumo_industrial', type: 'number', description: 'Consumo industrial em MWh' },
                        { name: 'consumo_comercial', type: 'number', description: 'Consumo comercial em MWh' },
                        { name: 'consumo_rural', type: 'number', description: 'Consumo rural em MWh' },
                        { name: 'consumo_total', type: 'number', description: 'Consumo total em MWh' }
                    ],
                    rows: [
                        [2020, 1, 'Centro-Oeste', 'GO', 458923, 345678, 234567, 123456, 1162624],
                        [2020, 2, 'Centro-Oeste', 'GO', 462145, 348765, 236789, 125678, 1173377],
                        [2020, 3, 'Centro-Oeste', 'GO', 471234, 352345, 241234, 127890, 1192703],
                        [2020, 4, 'Centro-Oeste', 'GO', 468976, 349876, 238765, 126543, 1184160],
                        [2020, 5, 'Centro-Oeste', 'GO', 455678, 342345, 232456, 122345, 1152824],
                        [2020, 6, 'Centro-Oeste', 'GO', 448976, 338765, 228976, 120543, 1137260],
                        [2020, 7, 'Centro-Oeste', 'GO', 452345, 340987, 230987, 121765, 1146084],
                        [2020, 8, 'Centro-Oeste', 'GO', 459876, 346789, 235678, 124567, 1166910],
                        [2020, 9, 'Centro-Oeste', 'GO', 465432, 350987, 238765, 126543, 1181727],
                        [2020, 10, 'Centro-Oeste', 'GO', 472345, 354567, 242345, 128765, 1198022],
                        [2020, 11, 'Centro-Oeste', 'GO', 478976, 358765, 245678, 130987, 1214406],
                        [2020, 12, 'Centro-Oeste', 'GO', 485432, 362345, 248976, 133456, 1230209],
                        [2021, 1, 'Centro-Oeste', 'GO', 468976, 352345, 239876, 126789, 1187986],
                        [2021, 2, 'Centro-Oeste', 'GO', 472345, 355678, 242345, 128976, 1199344],
                        [2021, 3, 'Centro-Oeste', 'GO', 481234, 359876, 246789, 131234, 1219133],
                        [2021, 4, 'Centro-Oeste', 'GO', 485678, 362456, 249876, 132654, 1230664],
                        [2021, 5, 'Centro-Oeste', 'GO', 490123, 365432, 252345, 134567, 1242467],
                        [2021, 6, 'Centro-Oeste', 'GO', 495678, 369876, 255678, 136789, 1258021],
                        [2021, 7, 'Centro-Oeste', 'GO', 501234, 373456, 258976, 138765, 1272431],
                        [2021, 8, 'Centro-Oeste', 'GO', 506789, 377123, 262345, 140987, 1287244],
                        [2021, 9, 'Centro-Oeste', 'GO', 512345, 380765, 265678, 143456, 1302244],
                        [2021, 10, 'Centro-Oeste', 'GO', 518901, 384567, 269123, 145678, 1318269],
                        [2021, 11, 'Centro-Oeste', 'GO', 525432, 388765, 272654, 148123, 1334974],
                        [2021, 12, 'Centro-Oeste', 'GO', 531987, 392987, 276123, 150456, 1351553]
                    ],
                    totalRows: 1500
                },
                '/dados/dados_eneel.csv': {
                    columns: [
                        { name: 'ano', type: 'number', description: 'Ano de referência' },
                        { name: 'mes', type: 'number', description: 'Mês de referência' },
                        { name: 'uf', type: 'string', description: 'Unidade federativa' },
                        { name: 'municipio', type: 'string', description: 'Município' },
                        { name: 'consumo_kwh', type: 'number', description: 'Consumo em kWh' },
                        { name: 'valor_faturado', type: 'number', description: 'Valor faturado em R$' },
                        { name: 'num_consumidores', type: 'number', description: 'Número de consumidores' }
                    ],
                    rows: [
                        [2020, 1, 'GO', 'Goiânia', 125678900, 78965432, 456789],
                        [2020, 1, 'GO', 'Anápolis', 45678900, 28965432, 156789],
                        [2020, 1, 'GO', 'Aparecida de Goiânia', 65678900, 38965432, 256789],
                        [2020, 1, 'GO', 'Rio Verde', 35678900, 18965432, 96789],
                        [2020, 1, 'GO', 'Catalão', 25678900, 15965432, 76789],
                        [2020, 2, 'GO', 'Goiânia', 126543210, 79876543, 458901],
                        [2020, 2, 'GO', 'Anápolis', 46543210, 29876543, 158901],
                        [2020, 2, 'GO', 'Aparecida de Goiânia', 66543210, 39876543, 258901],
                        [2020, 2, 'GO', 'Rio Verde', 36543210, 19876543, 98901],
                        [2020, 2, 'GO', 'Catalão', 26543210, 16876543, 78901],
                        [2020, 3, 'GO', 'Goiânia', 127890123, 80789654, 461234],
                        [2020, 3, 'GO', 'Anápolis', 47890123, 30789654, 161234],
                        [2020, 3, 'GO', 'Aparecida de Goiânia', 67890123, 40789654, 261234],
                        [2020, 3, 'GO', 'Rio Verde', 37890123, 20789654, 101234],
                        [2020, 3, 'GO', 'Catalão', 27890123, 17789654, 81234]
                    ],
                    totalRows: 2000
                },
                '/dados/dados_meteorologicos_go.csv': {
                    columns: [
                        { name: 'data', type: 'date', description: 'Data da medição' },
                        { name: 'municipio', type: 'string', description: 'Município' },
                        { name: 'temperatura_max', type: 'number', description: 'Temperatura máxima em °C' },
                        { name: 'temperatura_min', type: 'number', description: 'Temperatura mínima em °C' },
                        { name: 'umidade', type: 'number', description: 'Umidade relativa do ar em %' },
                        { name: 'precipitacao', type: 'number', description: 'Precipitação em mm' }
                    ],
                    rows: [
                        ['2020-01-01', 'Goiânia', 32.5, 22.3, 65, 0],
                        ['2020-01-02', 'Goiânia', 33.1, 23.0, 62, 0],
                        ['2020-01-03', 'Goiânia', 34.2, 23.5, 58, 0],
                        ['2020-01-04', 'Goiânia', 33.8, 22.9, 60, 0],
                        ['2020-01-05', 'Goiânia', 32.6, 22.1, 63, 5.2],
                        ['2020-01-06', 'Goiânia', 30.5, 21.4, 75, 12.8],
                        ['2020-01-07', 'Goiânia', 29.8, 21.0, 80, 8.5],
                        ['2020-01-08', 'Goiânia', 31.2, 21.7, 72, 2.3],
                        ['2020-01-09', 'Goiânia', 32.4, 22.5, 68, 0],
                        ['2020-01-10', 'Goiânia', 33.6, 23.2, 64, 0],
                        ['2020-01-01', 'Anápolis', 30.2, 20.5, 68, 0],
                        ['2020-01-02', 'Anápolis', 31.0, 21.2, 65, 0],
                        ['2020-01-03', 'Anápolis', 32.1, 21.8, 62, 0],
                        ['2020-01-04', 'Anápolis', 31.5, 21.0, 64, 0],
                        ['2020-01-05', 'Anápolis', 30.4, 20.3, 67, 6.5]
                    ],
                    totalRows: 1825
                },
                '/dados/censo2022.csv': {
                    columns: [
                        { name: 'MUNICIPIO', type: 'string', description: 'Nome do município' },
                        { name: 'PESSOAS', type: 'number', description: 'Número de habitantes' },
                        { name: 'Área da unidade territorial (Quilômetros quadrados)', type: 'number', description: 'Área em km²' },
                        { name: 'Densidade demográfica (Habitante por quilômetro quadrado)', type: 'number', description: 'Densidade demográfica' }
                    ],
                    rows: [
                        ['Abadia de Goiás (GO)', 19128, 143, 133.43],
                        ['Abadiânia (GO)', 17228, 1045, 16.49],
                        ['Acreúna (GO)', 21568, 1567, 13.77],
                        ['Adelândia (GO)', 2297, 115, 19.91],
                        ['Água Fria de Goiás (GO)', 4954, 2024, 2.45],
                        ['Água Limpa (GO)', 1851, 459, 4.03],
                        ['Águas Lindas de Goiás (GO)', 225671, 192, 1176.49],
                        ['Alexânia (GO)', 27008, 847, 31.89],
                        ['Aloândia (GO)', 1973, 102, 19.33],
                        ['Alto Horizonte (GO)', 6072, 500, 12.14],
                        ['Alto Paraíso de Goiás (GO)', 10298, 2595, 3.97],
                        ['Alvorada do Norte (GO)', 8446, 1268, 6.66],
                        ['Amaralina (GO)', 3268, 1344, 2.43],
                        ['Americano do Brasil (GO)', 5259, 134, 39.29],
                        ['Amorinópolis (GO)', 3007, 407, 7.39],
                        ['Anápolis (GO)', 398817, 936, 426.24],
                        ['Anhanguera (GO)', 924, 56, 16.63],
                        ['Anicuns (GO)', 18503, 976, 18.96],
                        ['Aparecida de Goiânia (GO)', 527550, 280, 1884.42],
                        ['Aparecida do Rio Doce (GO)', 2907, 603, 4.82],
                        ['Aporé (GO)', 4325, 2899, 1.49],
                        ['Araçu (GO)', 3799, 150, 25.36],
                        ['Aragarças (GO)', 18390, 662, 27.79],
                        ['Aragoiânia (GO)', 11890, 218, 54.51],
                        ['Araguapaz (GO)', 7153, 2188, 3.27],
                        ['Arenópolis (GO)', 2946, 1076, 2.74],
                        ['Aruanã (GO)', 8300, 3055, 2.72],
                        ['Aurilândia (GO)', 3284, 566, 5.81],
                        ['Avelinópolis (GO)', 2868, 170, 16.85],
                        ['Baliza (GO)', 3351, 1780, 1.88],
                        ['Barro Alto (GO)', 10371, 1080, 9.6],
                        ['Bela Vista de Goiás (GO)', 34445, 1274, 27.04],
                        ['Bom Jardim de Goiás (GO)', 7826, 1901, 4.12],
                        ['Bom Jesus de Goiás (GO)', 23958, 1406, 17.04],
                        ['Bonfinópolis (GO)', 10296, 122, 84.45],
                        ['Bonópolis (GO)', 3299, 1635, 2.02],
                        ['Brazabrantes (GO)', 3992, 125, 31.85],
                        ['Britânia (GO)', 5695, 1458, 3.9],
                        ['Buriti Alegre (GO)', 10495, 902, 11.64],
                        ['Buriti de Goiás (GO)', 2732, 203, 13.49],
                        ['Buritinópolis (GO)', 3145, 246, 12.78],
                        ['Cabeceiras (GO)', 7560, 1126, 6.71],
                        ['Cachoeira Alta (GO)', 11513, 1657, 6.95],
                        ['Cachoeira de Goiás (GO)', 1405, 424, 3.31],
                        ['Cachoeira Dourada (GO)', 7782, 528, 14.73],
                        ['Caçu (GO)', 13774, 2254, 6.11],
                        ['Caiapônia (GO)', 16507, 8628, 1.91],
                        ['Caldas Novas (GO)', 98622, 1609, 61.31],
                        ['Caldazinha (GO)', 4507, 252, 17.9],
                        ['Campestre de Goiás (GO)', 3755, 273, 13.77],
                        ['Campinaçu (GO)', 3708, 1978, 1.87]
                    ],
                    totalRows: 246
                },
                '/dados/dados_sgg.csv': {
                    columns: [
                        { name: 'id', type: 'number', description: 'Identificador único' },
                        { name: 'data', type: 'date', description: 'Data do registro' },
                        { name: 'orgao', type: 'string', description: 'Órgão responsável' },
                        { name: 'consumo_kwh', type: 'number', description: 'Consumo em kWh' },
                        { name: 'valor_fatura', type: 'number', description: 'Valor da fatura em R$' }
                    ],
                    rows: [
                        [1, '2020-01-01', 'Secretaria de Educação', 125000, 87500],
                        [2, '2020-01-01', 'Secretaria de Saúde', 98000, 68600],
                        [3, '2020-01-01', 'Secretaria de Segurança', 85000, 59500],
                        [4, '2020-01-01', 'Secretaria de Administração', 45000, 31500],
                        [5, '2020-01-01', 'Secretaria de Infraestrutura', 78000, 54600],
                        [6, '2020-02-01', 'Secretaria de Educação', 127500, 89250],
                        [7, '2020-02-01', 'Secretaria de Saúde', 99500, 69650],
                        [8, '2020-02-01', 'Secretaria de Segurança', 86500, 60550],
                        [9, '2020-02-01', 'Secretaria de Administração', 46000, 32200],
                        [10, '2020-02-01', 'Secretaria de Infraestrutura', 79500, 55650],
                        [11, '2020-03-01', 'Secretaria de Educação', 130000, 91000],
                        [12, '2020-03-01', 'Secretaria de Saúde', 101000, 70700],
                        [13, '2020-03-01', 'Secretaria de Segurança', 88000, 61600],
                        [14, '2020-03-01', 'Secretaria de Administração', 47000, 32900],
                        [15, '2020-03-01', 'Secretaria de Infraestrutura', 81000, 56700]
                    ],
                    totalRows: 1200
                }
            };
            
            // Simular delay de rede
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Verificar se temos dados mapeados para este arquivo
            if (realDataMapping[filePath]) {
                return {
                    status: 'success',
                    data: realDataMapping[filePath]
                };
            } else {
                // Se não temos dados mapeados, retornar erro
                return {
                    status: 'error',
                    message: `Não foi possível carregar dados para o arquivo: ${filePath}`
                };
            }
        } catch (error) {
            console.error('Erro ao carregar dados reais:', error);
            return {
                status: 'error',
                message: `Erro ao carregar dados: ${error}`
            };
        }
    },
    
    /**
     * Gera estatísticas para um conjunto de dados
     */
    generateStatistics: async (dataPreview: any) => {
        try {
            // Simular delay de processamento
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Verificar se temos dados numéricos para calcular estatísticas
            const numericColumns = dataPreview.columns
                .map((col: any, index: number) => ({ index, col }))
                .filter((item: any) => item.col.type === 'number');
            
            if (numericColumns.length === 0) {
                return {
                    status: 'error',
                    message: 'Não há colunas numéricas para gerar estatísticas'
                };
            }
            
            // Gerar estatísticas para cada coluna numérica
            const stats: any[] = [];
            
            // Encontrar a coluna com o valor total (se existir)
            const totalColumn = numericColumns.find((item: any) => 
                item.col.name.toLowerCase().includes('total') || 
                item.col.name.toLowerCase().includes('pessoas')
            );
            
            if (totalColumn) {
                // Calcular estatísticas para a coluna total
                const values = dataPreview.rows.map((row: any) => Number(row[totalColumn.index])).filter((val: number) => !isNaN(val));
                
                if (values.length > 0) {
                    // Média
                    const mean = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
                    stats.push({ 
                        name: `Média ${totalColumn.col.name}`, 
                        value: mean.toLocaleString('pt-BR')
                    });
                    
                    // Máximo
                    const max = Math.max(...values);
                    stats.push({ 
                        name: `Máximo ${totalColumn.col.name}`, 
                        value: max.toLocaleString('pt-BR')
                    });
                    
                    // Mínimo
                    const min = Math.min(...values);
                    stats.push({ 
                        name: `Mínimo ${totalColumn.col.name}`, 
                        value: min.toLocaleString('pt-BR')
                    });
                    
                    // Desvio padrão
                    const variance = values.reduce((sum: number, val: number) => sum + Math.pow(val - mean, 2), 0) / values.length;
                    const stdDev = Math.sqrt(variance);
                    stats.push({ 
                        name: 'Desvio Padrão', 
                        value: stdDev.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
                    });
                }
            }
            
            // Adicionar informações gerais
            stats.push({ name: 'Total de Registros', value: dataPreview.totalRows.toLocaleString('pt-BR') });
            
            return {
                status: 'success',
                stats
            };
        } catch (error) {
            console.error('Erro ao gerar estatísticas:', error);
            return {
                status: 'error',
                message: `Erro ao gerar estatísticas: ${error}`
            };
        }
    }
}; 