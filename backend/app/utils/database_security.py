"""
Database Security Utilities.
Provides database security enhancements and connection security.
"""

import logging
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import QueuePool
from app.config import settings


# Configure logger
db_security_logger = logging.getLogger("database_security")
db_security_logger.setLevel(logging.INFO)


class DatabaseSecurity:
    """
    Database security enhancements.
    Provides security features for database connections.
    """
    
    def __init__(self):
        self.connection_pool_size = 10
        self.max_overflow = 20
        self.pool_timeout = 30
        self.pool_recycle = 3600  # Recycle connections after 1 hour
        self.pool_pre_ping = True  # Verify connections before using
    
    def validate_connection_string(self, connection_string: str) -> bool:
        """
        Validate database connection string for security.
        
        Args:
            connection_string: Database connection string
        
        Returns:
            True if connection string is valid, False otherwise
        """
        # Check for SSL/TLS in connection string
        if "sslmode" not in connection_string.lower():
            db_security_logger.warning(
                "Database connection string does not specify SSL mode. "
                "Consider using sslmode=require or sslmode=verify-full for production."
            )
            return False
        
        # Check for sensitive information in connection string
        sensitive_patterns = ["password", "pwd", "pass"]
        for pattern in sensitive_patterns:
            if pattern in connection_string.lower():
                # Password should be in connection string, but we should validate format
                if "=" not in connection_string:
                    db_security_logger.error(
                        "Invalid connection string format. Password should be specified as key=value."
                    )
                    return False
        
        return True
    
    def get_secure_connection_string(self, connection_string: str) -> str:
        """
        Get secure connection string with SSL/TLS enabled.
        
        Args:
            connection_string: Original connection string
        
        Returns:
            Secure connection string with SSL/TLS enabled
        """
        # Add SSL mode if not present
        if "sslmode" not in connection_string.lower():
            if "?" in connection_string:
                connection_string += "&sslmode=require"
            else:
                connection_string += "?sslmode=require"
        
        return connection_string
    
    def create_secure_engine(self, connection_string: str):
        """
        Create a secure database engine with connection pooling.
        
        Args:
            connection_string: Database connection string
        
        Returns:
            SQLAlchemy async engine with security enhancements
        """
        # Validate connection string
        if not self.validate_connection_string(connection_string):
            db_security_logger.warning(
                "Connection string validation failed. Proceeding with warnings."
            )
        
        # Get secure connection string
        secure_connection_string = self.get_secure_connection_string(connection_string)
        
        # Create engine with security enhancements
        engine = create_async_engine(
            secure_connection_string,
            poolclass=QueuePool,
            pool_size=self.connection_pool_size,
            max_overflow=self.max_overflow,
            pool_timeout=self.pool_timeout,
            pool_recycle=self.pool_recycle,
            pool_pre_ping=self.pool_pre_ping,
            echo=False,  # Don't echo SQL queries in production
            future=True,
        )
        
        db_security_logger.info(
            "Secure database engine created with connection pooling and SSL/TLS."
        )
        
        return engine
    
    def get_connection_security_status(self) -> Dict[str, Any]:
        """
        Get database connection security status.
        
        Returns:
            Security status dictionary
        """
        connection_string = settings.DATABASE_URL
        
        # Check SSL/TLS
        ssl_enabled = "sslmode" in connection_string.lower()
        
        # Check connection pooling
        pool_enabled = True  # Always enabled in our implementation
        
        # Check connection validation
        validation_enabled = self.pool_pre_ping
        
        return {
            "ssl_enabled": ssl_enabled,
            "pool_enabled": pool_enabled,
            "validation_enabled": validation_enabled,
            "pool_size": self.connection_pool_size,
            "max_overflow": self.max_overflow,
            "pool_recycle": self.pool_recycle,
        }


# Global database security instance
database_security = DatabaseSecurity()


def validate_database_connection_string(connection_string: str) -> bool:
    """
    Validate database connection string for security.
    
    Args:
        connection_string: Database connection string
    
    Returns:
        True if connection string is valid, False otherwise
    """
    return database_security.validate_connection_string(connection_string)


def get_secure_database_connection_string(connection_string: str) -> str:
    """
    Get secure connection string with SSL/TLS enabled.
    
    Args:
        connection_string: Original connection string
    
    Returns:
        Secure connection string with SSL/TLS enabled
    """
    return database_security.get_secure_connection_string(connection_string)


def get_database_security_status() -> Dict[str, Any]:
    """
    Get database connection security status.
    
    Returns:
        Security status dictionary
    """
    return database_security.get_connection_security_status()

