class EnergyPredictor:
    def __init__(self):
        self.models = {
            'consumption': XGBoostRegressor(),
            'anomaly': IsolationForest(),
            'efficiency': RandomForestClassifier()
        }
        
        self.feature_engineering = FeatureProcessor()
        self.model_validator = CrossValidator() 