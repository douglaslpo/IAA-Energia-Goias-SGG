from datetime import datetime
from typing import List, Dict

class AlertSystem:
    def __init__(self):
        self.alert_levels = {
            'critical': self._handle_critical,
            'warning': self._handle_warning,
            'info': self._handle_info
        }
        
    def monitor_metrics(self, current_metrics: Dict[str, float]) -> List[str]:
        """
        Monitora métricas em tempo real e gera alertas
        """
        alerts = []
        
        for metric_name, value in current_metrics.items():
            if self._is_anomalous(metric_name, value):
                alert = self._generate_alert(metric_name, value)
                alerts.append(alert)
                
        return alerts 