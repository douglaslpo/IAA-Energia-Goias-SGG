import pandas as pd
import numpy as np
import os
import json
import logging
from typing import Dict, List, Any, Optional, Union
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('etl_pipeline')

class SchemaValidator:
    def __init__(self, schema_config: Optional[Dict[str, Any]] = None):
        self.schema_config = schema_config or {}
    
    def validate(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Validate dataframe against expected schema"""
        results = {
            'is_valid': True,
            'errors': []
        }
        
        # Check for required columns
        if 'required_columns' in self.schema_config:
            missing_columns = [col for col in self.schema_config['required_columns'] 
                              if col not in df.columns]
            if missing_columns:
                results['is_valid'] = False
                results['errors'].append(f"Missing required columns: {missing_columns}")
        
        # Check data types
        if 'column_types' in self.schema_config:
            for col, expected_type in self.schema_config['column_types'].items():
                if col in df.columns:
                    # Check if column type matches expected type
                    if expected_type == 'numeric' and not pd.api.types.is_numeric_dtype(df[col]):
                        results['is_valid'] = False
                        results['errors'].append(f"Column '{col}' should be numeric")
                    elif expected_type == 'datetime' and not pd.api.types.is_datetime64_dtype(df[col]):
                        results['is_valid'] = False
                        results['errors'].append(f"Column '{col}' should be datetime")
                    elif expected_type == 'categorical' and not pd.api.types.is_categorical_dtype(df[col]):
                        # Not a strict error, just convert
                        df[col] = df[col].astype('category')
        
        return results


class QualityChecker:
    def __init__(self, quality_config: Optional[Dict[str, Any]] = None):
        self.quality_config = quality_config or {}
    
    def check_quality(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Check data quality issues like nulls, outliers, duplicates"""
        results = {
            'quality_score': 1.0,  # Start with perfect score
            'issues': []
        }
        
        # Check for null values
        null_counts = df.isnull().sum()
        if null_counts.sum() > 0:
            null_percent = null_counts.sum() / (df.shape[0] * df.shape[1])
            results['quality_score'] -= null_percent
            results['issues'].append({
                'type': 'missing_values',
                'details': null_counts[null_counts > 0].to_dict()
            })
        
        # Check for duplicates
        duplicate_count = df.duplicated().sum()
        if duplicate_count > 0:
            dup_percent = duplicate_count / df.shape[0]
            results['quality_score'] -= dup_percent
            results['issues'].append({
                'type': 'duplicates',
                'count': int(duplicate_count)
            })
        
        # Check for outliers in numeric columns
        if 'outlier_detection' in self.quality_config:
            for col in df.select_dtypes(include=[np.number]).columns:
                if self.quality_config['outlier_detection']['method'] == 'zscore':
                    z_scores = np.abs((df[col] - df[col].mean()) / df[col].std())
                    outliers = df[z_scores > self.quality_config['outlier_detection']['threshold']]
                    if len(outliers) > 0:
                        results['issues'].append({
                            'type': 'outliers',
                            'column': col,
                            'count': len(outliers)
                        })
        
        # Ensure score is between 0 and 1
        results['quality_score'] = max(0.0, min(1.0, results['quality_score']))
        
        return results


class CompletenessAnalyzer:
    def analyze(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze data completeness"""
        total_cells = df.shape[0] * df.shape[1]
        missing_cells = df.isnull().sum().sum()
        
        completeness = 1.0 - (missing_cells / total_cells) if total_cells > 0 else 0
        
        # Completeness by column
        column_completeness = {
            col: 1.0 - (df[col].isnull().sum() / len(df)) 
            for col in df.columns
        }
        
        return {
            'overall_completeness': completeness,
            'column_completeness': column_completeness,
            'missing_cells': int(missing_cells),
            'total_cells': int(total_cells)
        }


class NumericTransformer:
    def normalize(self, df: pd.DataFrame) -> pd.DataFrame:
        """Normalize numeric columns"""
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        result = df.copy()
        
        for col in numeric_cols:
            min_val = result[col].min()
            max_val = result[col].max()
            if max_val > min_val:  # Avoid division by zero
                result[col] = (result[col] - min_val) / (max_val - min_val)
        
        return result
    
    def standardize(self, df: pd.DataFrame) -> pd.DataFrame:
        """Standardize numeric columns (z-score)"""
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        result = df.copy()
        
        for col in numeric_cols:
            mean = result[col].mean()
            std = result[col].std()
            if std > 0:  # Avoid division by zero
                result[col] = (result[col] - mean) / std
        
        return result


class CategoricalTransformer:
    def encode(self, df: pd.DataFrame) -> pd.DataFrame:
        """Encode categorical columns"""
        result = df.copy()
        cat_columns = result.select_dtypes(include=['object', 'category']).columns
        
        for col in cat_columns:
            result[col] = result[col].astype('category').cat.codes
        
        return result
    
    def one_hot_encode(self, df: pd.DataFrame, max_categories: int = 10) -> pd.DataFrame:
        """One-hot encode categorical columns with limited cardinality"""
        result = df.copy()
        cat_columns = result.select_dtypes(include=['object', 'category']).columns
        
        for col in cat_columns:
            if result[col].nunique() <= max_categories:
                # Create dummies and add to result
                dummies = pd.get_dummies(result[col], prefix=col)
                result = pd.concat([result, dummies], axis=1)
                # Drop original column
                result = result.drop(col, axis=1)
        
        return result


class TemporalFeatureExtractor:
    def extract_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Extract temporal features from datetime columns"""
        result = df.copy()
        datetime_cols = result.select_dtypes(include=['datetime64']).columns
        
        for col in datetime_cols:
            result[f'{col}_year'] = result[col].dt.year
            result[f'{col}_month'] = result[col].dt.month
            result[f'{col}_day'] = result[col].dt.day
            result[f'{col}_dayofweek'] = result[col].dt.dayofweek
            result[f'{col}_quarter'] = result[col].dt.quarter
            result[f'{col}_is_weekend'] = result[col].dt.dayofweek >= 5
        
        return result


class ETLPipeline:
    def __init__(self, config_path: Optional[str] = None):
        """Initialize ETL pipeline with optional configuration"""
        self.config = self._load_config(config_path)
        
        # Initialize components
        self.data_validators = {
            'schema': SchemaValidator(self.config.get('schema', {})),
            'quality': QualityChecker(self.config.get('quality', {})),
            'completeness': CompletenessAnalyzer()
        }
        
        # Initialize transformers
        self.transformers = {
            'numeric': NumericTransformer(),
            'categorical': CategoricalTransformer(),
            'temporal': TemporalFeatureExtractor()
        }
        
        # Initialize pipeline state
        self.raw_data = None
        self.validated_data = None
        self.transformed_data = None
        self.validation_results = {}
        self.transformation_results = {}
    
    def _load_config(self, config_path: Optional[str]) -> Dict[str, Any]:
        """Load configuration from file or use defaults"""
        default_config = {
            'schema': {
                'required_columns': [],
                'column_types': {}
            },
            'quality': {
                'outlier_detection': {
                    'method': 'zscore',
                    'threshold': 3.0
                }
            },
            'transformations': {
                'apply_normalization': True,
                'apply_one_hot_encoding': True,
                'extract_temporal_features': True
            },
            'output': {
                'format': 'csv',
                'destination': 'processed_data/'
            }
        }
        
        if config_path and os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    loaded_config = json.load(f)
                    # Merge with defaults
                    for key, value in loaded_config.items():
                        if key in default_config and isinstance(default_config[key], dict):
                            default_config[key].update(value)
                        else:
                            default_config[key] = value
            except Exception as e:
                logger.error(f"Error loading config: {e}")
        
        return default_config
    
    def load_data(self, source_path: str) -> pd.DataFrame:
        """Load data from various sources"""
        logger.info(f"Loading data from {source_path}")
        
        if source_path.endswith('.csv'):
            self.raw_data = pd.read_csv(source_path)
        elif source_path.endswith('.xlsx') or source_path.endswith('.xls'):
            self.raw_data = pd.read_excel(source_path)
        elif source_path.endswith('.json'):
            self.raw_data = pd.read_json(source_path)
        elif source_path.endswith('.parquet'):
            self.raw_data = pd.read_parquet(source_path)
        else:
            raise ValueError(f"Unsupported file format: {source_path}")
        
        logger.info(f"Loaded data with shape {self.raw_data.shape}")
        return self.raw_data
    
    def validate_data(self) -> Dict[str, Any]:
        """Validate data using various validators"""
        if self.raw_data is None:
            raise ValueError("No data loaded. Call load_data first.")
        
        logger.info("Validating data...")
        self.validation_results = {
            'schema': self.data_validators['schema'].validate(self.raw_data),
            'quality': self.data_validators['quality'].check_quality(self.raw_data),
            'completeness': self.data_validators['completeness'].analyze(self.raw_data)
        }
        
        # Check if validation passed
        validation_passed = self.validation_results['schema']['is_valid']
        logger.info(f"Data validation {'passed' if validation_passed else 'failed'}")
        
        if validation_passed:
            self.validated_data = self.raw_data.copy()
        
        return self.validation_results
    
    def transform_data(self) -> pd.DataFrame:
        """Apply transformations to data"""
        if self.validated_data is None:
            raise ValueError("No validated data. Call validate_data first.")
        
        logger.info("Transforming data...")
        df = self.validated_data.copy()
        
        # Convert datetime columns
        for col in df.select_dtypes(include=['object']).columns:
            try:
                df[col] = pd.to_datetime(df[col])
            except:
                pass  # Not a datetime column
        
        # Apply transformations based on config
        if self.config['transformations'].get('extract_temporal_features', True):
            df = self.transformers['temporal'].extract_features(df)
        
        if self.config['transformations'].get('apply_normalization', True):
            df = self.transformers['numeric'].normalize(df)
        
        if self.config['transformations'].get('apply_one_hot_encoding', True):
            df = self.transformers['categorical'].one_hot_encode(df)
        
        self.transformed_data = df
        logger.info(f"Data transformed with new shape {df.shape}")
        
        return self.transformed_data
    
    def load_processed_data(self, destination: Optional[str] = None) -> str:
        """Save processed data to destination"""
        if self.transformed_data is None:
            raise ValueError("No transformed data. Call transform_data first.")
        
        # Use config destination if not specified
        destination = destination or self.config['output']['destination']
        format_type = self.config['output'].get('format', 'csv')
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(destination), exist_ok=True)
        
        # Generate filename if destination is a directory
        if os.path.isdir(destination):
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"processed_data_{timestamp}.{format_type}"
            full_path = os.path.join(destination, filename)
        else:
            full_path = destination
        
        logger.info(f"Saving processed data to {full_path}")
        
        # Save in the specified format
        if format_type == 'csv':
            self.transformed_data.to_csv(full_path, index=False)
        elif format_type == 'parquet':
            self.transformed_data.to_parquet(full_path, index=False)
        elif format_type == 'json':
            self.transformed_data.to_json(full_path, orient='records')
        else:
            raise ValueError(f"Unsupported output format: {format_type}")
        
        return full_path
    
    def process_raw_data(self, source_path: str, destination: Optional[str] = None) -> Dict[str, Any]:
        """Run the full ETL pipeline"""
        try:
            # Load data
            self.load_data(source_path)
            
            # Validate data
            validation_results = self.validate_data()
            if not validation_results['schema']['is_valid']:
                logger.error("Data validation failed")
                return {
                    'status': 'error',
                    'message': 'Data validation failed',
                    'details': validation_results
                }
            
            # Transform data
            self.transform_data()
            
            # Load processed data
            output_path = self.load_processed_data(destination)
            
            return {
                'status': 'success',
                'message': 'ETL pipeline completed successfully',
                'output_path': output_path,
                'validation_results': validation_results,
                'rows_processed': len(self.transformed_data),
                'columns_processed': len(self.transformed_data.columns)
            }
        
        except Exception as e:
            logger.error(f"ETL pipeline error: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }

# Example usage
if __name__ == "__main__":
    etl = ETLPipeline()
    result = etl.process_raw_data("dados/consumo_energia.csv", "dados/processed/")
    print(json.dumps(result, indent=2, default=str)) 