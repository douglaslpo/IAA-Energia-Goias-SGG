class TestSuite:
    def __init__(self):
        self.test_cases = {
            'data_quality': DataQualityTests(),
            'model_performance': ModelTests(),
            'api_integration': APITests(),
            'ui_functionality': UITests()
        }
    
    def run_all_tests(self):
        # ... existing code ...
        self.generate_test_report()
        self.update_documentation()
        # ... existing code ... 