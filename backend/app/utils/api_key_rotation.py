"""
API Key Rotation Utilities.
Provides API key rotation strategy and management.
"""

import logging
from typing import Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from app.config import settings


# Configure logger
rotation_logger = logging.getLogger("api_key_rotation")
rotation_logger.setLevel(logging.INFO)


class APIKeyRotation:
    """
    API key rotation management.
    Manages API key rotation schedule and notifications.
    """
    
    def __init__(self):
        self.rotation_schedule = {
            "supabase_anon_key": {
                "rotation_interval_days": 90,  # Rotate every 90 days
                "last_rotation": None,
                "next_rotation": None,
                "notification_days_before": 7,  # Notify 7 days before rotation
            },
            "supabase_jwt_secret": {
                "rotation_interval_days": 90,  # Rotate every 90 days
                "last_rotation": None,
                "next_rotation": None,
                "notification_days_before": 7,  # Notify 7 days before rotation
            },
            "database_password": {
                "rotation_interval_days": 180,  # Rotate every 180 days
                "last_rotation": None,
                "next_rotation": None,
                "notification_days_before": 14,  # Notify 14 days before rotation
            },
        }
    
    def check_rotation_status(self, key_name: str) -> Dict[str, Any]:
        """
        Check rotation status for a specific key.
        
        Args:
            key_name: Name of the key to check
        
        Returns:
            Rotation status dictionary
        """
        if key_name not in self.rotation_schedule:
            return {
                "key_name": key_name,
                "status": "unknown",
                "message": f"Key {key_name} not in rotation schedule",
            }
        
        schedule = self.rotation_schedule[key_name]
        last_rotation = schedule.get("last_rotation")
        next_rotation = schedule.get("next_rotation")
        rotation_interval = schedule["rotation_interval_days"]
        notification_days = schedule["notification_days_before"]
        
        current_time = datetime.now(timezone.utc)
        
        # Calculate next rotation if not set
        if not next_rotation:
            if last_rotation:
                next_rotation = last_rotation + timedelta(days=rotation_interval)
            else:
                # First rotation - set to rotation_interval days from now
                next_rotation = current_time + timedelta(days=rotation_interval)
            schedule["next_rotation"] = next_rotation
        
        # Calculate days until rotation
        days_until_rotation = (next_rotation - current_time).days
        
        # Check if rotation is due
        if days_until_rotation <= 0:
            status = "due"
            message = f"Key {key_name} is due for rotation"
        elif days_until_rotation <= notification_days:
            status = "warning"
            message = f"Key {key_name} will expire in {days_until_rotation} days"
        else:
            status = "ok"
            message = f"Key {key_name} is up to date (next rotation in {days_until_rotation} days)"
        
        return {
            "key_name": key_name,
            "status": status,
            "message": message,
            "last_rotation": last_rotation.isoformat() if last_rotation else None,
            "next_rotation": next_rotation.isoformat(),
            "days_until_rotation": days_until_rotation,
            "rotation_interval_days": rotation_interval,
        }
    
    def record_rotation(self, key_name: str):
        """
        Record that a key has been rotated.
        
        Args:
            key_name: Name of the key that was rotated
        """
        if key_name not in self.rotation_schedule:
            rotation_logger.warning(f"Key {key_name} not in rotation schedule")
            return
        
        schedule = self.rotation_schedule[key_name]
        current_time = datetime.now(timezone.utc)
        
        # Update last rotation
        schedule["last_rotation"] = current_time
        
        # Calculate next rotation
        rotation_interval = schedule["rotation_interval_days"]
        schedule["next_rotation"] = current_time + timedelta(days=rotation_interval)
        
        # Log rotation
        rotation_logger.info(
            f"Key {key_name} rotated successfully. Next rotation: {schedule['next_rotation'].isoformat()}"
        )
    
    def get_all_rotation_status(self) -> Dict[str, Dict[str, Any]]:
        """
        Get rotation status for all keys.
        
        Returns:
            Dictionary of rotation status for all keys
        """
        return {
            key_name: self.check_rotation_status(key_name)
            for key_name in self.rotation_schedule.keys()
        }
    
    def get_keys_due_for_rotation(self) -> list[Dict[str, Any]]:
        """
        Get list of keys due for rotation.
        
        Returns:
            List of keys due for rotation
        """
        due_keys = []
        for key_name in self.rotation_schedule.keys():
            status = self.check_rotation_status(key_name)
            if status["status"] in ["due", "warning"]:
                due_keys.append(status)
        return due_keys


# Global API key rotation instance
api_key_rotation = APIKeyRotation()


def check_api_key_rotation(key_name: str) -> Dict[str, Any]:
    """
    Check rotation status for a specific key.
    
    Args:
        key_name: Name of the key to check
    
    Returns:
        Rotation status dictionary
    """
    return api_key_rotation.check_rotation_status(key_name)


def record_api_key_rotation(key_name: str):
    """
    Record that a key has been rotated.
    
    Args:
        key_name: Name of the key that was rotated
    """
    api_key_rotation.record_rotation(key_name)


def get_all_api_key_rotation_status() -> Dict[str, Dict[str, Any]]:
    """
    Get rotation status for all keys.
    
    Returns:
        Dictionary of rotation status for all keys
    """
    return api_key_rotation.get_all_rotation_status()


def get_keys_due_for_rotation() -> list[Dict[str, Any]]:
    """
    Get list of keys due for rotation.
    
    Returns:
        List of keys due for rotation
    """
    return api_key_rotation.get_keys_due_for_rotation()

