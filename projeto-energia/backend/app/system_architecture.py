class SystemArchitecture:
    def __init__(self):
        self.data_sources = {
            'primary': 'dados/consumo_energia/',
            'weather': 'dados/clima/',
            'demographic': 'dados/demografia/'
        }
        
        self.processing_layers = {
            'ingestion': ETLPipeline(),
            'processing': DataProcessor(),
            'analysis': PredictiveAnalytics(),
            'presentation': DashboardManager()
        }
        
        self.output_interfaces = {
            'api': FastAPIService(),
            'web': ReactFrontend(),
            'reporting': AutomatedReporting()
        } 