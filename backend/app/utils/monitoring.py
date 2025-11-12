"""
Monitoring and Alerting Utilities.
Provides monitoring and alerting capabilities for security events.
"""

import logging
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone, timedelta
from app.utils.security_logger import SecurityEvent, security_logger
from app.config import settings


# Configure monitoring logger
monitoring_logger = logging.getLogger("monitoring")
monitoring_logger.setLevel(logging.INFO)


class SecurityMonitor:
    """
    Security monitoring and alerting system.
    Monitors security events and triggers alerts when thresholds are exceeded.
    """
    
    def __init__(self):
        self.event_counts: Dict[str, int] = {}
        self.event_timestamps: Dict[str, List[datetime]] = {}
        self.alert_thresholds: Dict[str, Dict[str, int]] = {
            SecurityEvent.AUTH_FAILURE: {
                "count": 5,  # Alert after 5 failed auth attempts
                "window": 300,  # Within 5 minutes
            },
            SecurityEvent.RATE_LIMIT_EXCEEDED: {
                "count": 10,  # Alert after 10 rate limit violations
                "window": 60,  # Within 1 minute
            },
            SecurityEvent.SUSPICIOUS_ACTIVITY: {
                "count": 3,  # Alert after 3 suspicious activities
                "window": 300,  # Within 5 minutes
            },
            SecurityEvent.FILE_UPLOAD_REJECTED: {
                "count": 5,  # Alert after 5 rejected uploads
                "window": 300,  # Within 5 minutes
            },
            SecurityEvent.SQL_INJECTION_ATTEMPT: {
                "count": 1,  # Alert immediately
                "window": 0,  # No window (immediate alert)
            },
            SecurityEvent.XSS_ATTEMPT: {
                "count": 1,  # Alert immediately
                "window": 0,  # No window (immediate alert)
            },
            SecurityEvent.DIRECTORY_TRAVERSAL_ATTEMPT: {
                "count": 1,  # Alert immediately
                "window": 0,  # No window (immediate alert)
            },
        }
    
    def record_event(self, event_type: str, details: Optional[Dict[str, Any]] = None):
        """
        Record a security event and check if alert should be triggered.
        
        Args:
            event_type: Type of security event
            details: Event details (optional)
        """
        current_time = datetime.now(timezone.utc)
        
        # Initialize event tracking if not exists
        if event_type not in self.event_counts:
            self.event_counts[event_type] = 0
            self.event_timestamps[event_type] = []
        
        # Increment event count
        self.event_counts[event_type] += 1
        self.event_timestamps[event_type].append(current_time)
        
        # Clean up old timestamps
        self._cleanup_old_timestamps(event_type)
        
        # Check if alert should be triggered
        if event_type in self.alert_thresholds:
            threshold = self.alert_thresholds[event_type]
            count = threshold["count"]
            window = threshold["window"]
            
            # Count events within window
            if window > 0:
                window_start = current_time - timedelta(seconds=window)
                events_in_window = [
                    ts for ts in self.event_timestamps[event_type]
                    if ts >= window_start
                ]
                event_count = len(events_in_window)
            else:
                # Immediate alert (window = 0)
                event_count = self.event_counts[event_type]
            
            # Trigger alert if threshold exceeded
            if event_count >= count:
                self._trigger_alert(event_type, event_count, details)
    
    def _cleanup_old_timestamps(self, event_type: str):
        """Clean up timestamps older than 1 hour."""
        current_time = datetime.now(timezone.utc)
        cutoff_time = current_time - timedelta(hours=1)
        
        self.event_timestamps[event_type] = [
            ts for ts in self.event_timestamps[event_type]
            if ts >= cutoff_time
        ]
    
    def _trigger_alert(self, event_type: str, event_count: int, details: Optional[Dict[str, Any]] = None):
        """
        Trigger a security alert.
        
        Args:
            event_type: Type of security event
            event_count: Number of events that triggered the alert
            details: Event details (optional)
        """
        alert_message = f"Security Alert: {event_type} - {event_count} events detected"
        
        if details:
            alert_message += f" - Details: {details}"
        
        # Log alert
        monitoring_logger.warning(alert_message)
        
        # TODO: Implement alerting mechanisms:
        # - Email alerts
        # - Slack notifications
        # - PagerDuty integration
        # - Webhook notifications
        # - SMS alerts
        
        # For now, just log the alert
        security_logger.warning(
            f"SECURITY_ALERT: {event_type} - {event_count} events - {details}"
        )
    
    def get_event_stats(self, event_type: Optional[str] = None) -> Dict[str, Any]:
        """
        Get event statistics.
        
        Args:
            event_type: Specific event type (optional)
        
        Returns:
            Event statistics dictionary
        """
        if event_type:
            return {
                "event_type": event_type,
                "count": self.event_counts.get(event_type, 0),
                "timestamps": [
                    ts.isoformat() for ts in self.event_timestamps.get(event_type, [])
                ],
            }
        else:
            return {
                event_type: {
                    "count": count,
                    "timestamps": [
                        ts.isoformat() for ts in self.event_timestamps.get(event_type, [])
                    ],
                }
                for event_type, count in self.event_counts.items()
            }
    
    def reset_stats(self, event_type: Optional[str] = None):
        """
        Reset event statistics.
        
        Args:
            event_type: Specific event type (optional)
        """
        if event_type:
            self.event_counts[event_type] = 0
            self.event_timestamps[event_type] = []
        else:
            self.event_counts.clear()
            self.event_timestamps.clear()


# Global security monitor instance
security_monitor = SecurityMonitor()


def monitor_security_event(event_type: str, details: Optional[Dict[str, Any]] = None):
    """
    Monitor a security event and trigger alerts if necessary.
    
    Args:
        event_type: Type of security event
        details: Event details (optional)
    """
    security_monitor.record_event(event_type, details)


def get_security_stats(event_type: Optional[str] = None) -> Dict[str, Any]:
    """
    Get security event statistics.
    
    Args:
        event_type: Specific event type (optional)
    
    Returns:
        Event statistics dictionary
    """
    return security_monitor.get_event_stats(event_type)


def reset_security_stats(event_type: Optional[str] = None):
    """
    Reset security event statistics.
    
    Args:
        event_type: Specific event type (optional)
    """
    security_monitor.reset_stats(event_type)

