from typing import Dict, List
import pandas as pd

class DataProcessor:
    def __init__(self):
        self.transformers = {
            'numeric': NumericTransformer(),
            'categorical': CategoricalTransformer(),
            'temporal': TemporalFeatureExtractor()
        }
    
    def process_energy_data(self, raw_data: pd.DataFrame) -> pd.DataFrame:
        """
        Processa dados brutos de consumo energético
        """
        processed_data = (
            raw_data
            .pipe(self.transformers['temporal'].extract_features)
            .pipe(self.transformers['numeric'].normalize)
            .pipe(self.transformers['categorical'].encode)
        )
        
        return processed_data 