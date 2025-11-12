"""
Input Sanitization Utilities.
Sanitizes user inputs to prevent XSS attacks.
"""

import re
from typing import Optional
try:
    from bleach import clean
    from bleach.css_sanitizer import CSSSanitizer
    BLEACH_AVAILABLE = True
except ImportError:
    BLEACH_AVAILABLE = False
    # Fallback if bleach is not available
    def clean(*args, **kwargs):
        return kwargs.get('html', '')
    CSSSanitizer = None


# Allowed HTML tags for rich text content
ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'a'
]

# Allowed HTML attributes
ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title', 'target', 'rel'],
    'p': ['class'],
    'span': ['class'],
    'div': ['class'],
}

# Allowed URL schemes
ALLOWED_SCHEMES = ['http', 'https', 'mailto']

# CSS sanitizer (only if bleach is available)
if BLEACH_AVAILABLE and CSSSanitizer:
    css_sanitizer = CSSSanitizer(allowed_css_properties=['color', 'background-color', 'font-weight', 'text-decoration'])
else:
    css_sanitizer = None


def sanitize_html(html: str, strip: bool = False) -> str:
    """
    Sanitize HTML content to prevent XSS attacks.
    
    Args:
        html: HTML content to sanitize
        strip: If True, strip disallowed tags instead of escaping them
    
    Returns:
        Sanitized HTML string
    """
    if not html:
        return ""
    
    if not BLEACH_AVAILABLE:
        # Fallback: remove all HTML tags if bleach is not available
        return re.sub(r'<[^>]+>', '', html)
    
    # Clean HTML using bleach
    cleaned = clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        protocols=ALLOWED_SCHEMES,
        strip=strip,
        css_sanitizer=css_sanitizer,
    )
    
    return cleaned


def sanitize_text(text: str, max_length: Optional[int] = None) -> str:
    """
    Sanitize plain text content.
    Strips HTML tags and limits length.
    
    Args:
        text: Text content to sanitize
        max_length: Maximum length of text (None for no limit)
    
    Returns:
        Sanitized text string
    """
    if not text:
        return ""
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove control characters
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
    
    # Limit length
    if max_length and len(text) > max_length:
        text = text[:max_length]
    
    return text.strip()


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent directory traversal and other attacks.
    
    Args:
        filename: Filename to sanitize
    
    Returns:
        Sanitized filename
    """
    if not filename:
        return "file"
    
    # Remove path components
    filename = filename.split('/')[-1].split('\\')[-1]
    
    # Remove dangerous characters
    filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
    
    # Limit length
    if len(filename) > 255:
        name, ext = filename.rsplit('.', 1) if '.' in filename else (filename, '')
        filename = name[:255 - len(ext) - 1] + '.' + ext if ext else name[:255]
    
    # Ensure filename is not empty
    if not filename:
        filename = "file"
    
    return filename


def sanitize_url(url: str) -> Optional[str]:
    """
    Sanitize URL to prevent XSS and other attacks.
    
    Args:
        url: URL to sanitize
    
    Returns:
        Sanitized URL or None if invalid
    """
    if not url:
        return None
    
    # Remove whitespace
    url = url.strip()
    
    # Validate URL scheme
    if not url.startswith(('http://', 'https://', 'mailto:')):
        # Try to add https:// if no scheme
        if '://' not in url:
            url = 'https://' + url
        else:
            return None
    
    # Validate URL format
    url_pattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE
    )
    
    if not url_pattern.match(url):
        return None
    
    return url


def sanitize_phone(phone: str) -> Optional[str]:
    """
    Sanitize phone number.
    
    Args:
        phone: Phone number to sanitize
    
    Returns:
        Sanitized phone number or None if invalid
    """
    if not phone:
        return None
    
    # Remove all non-digit characters except +
    phone = re.sub(r'[^\d+]', '', phone)
    
    # Validate phone number format (basic validation)
    if not phone or len(phone) < 8:
        return None
    
    return phone

