#!/bin/sh
# Wait for services and get IPs using getent (DNS lookup in Docker network)
# HTTPS VERSION - Supports SSL certificates
# DEBUG VERSION - More logging

set -e  # Exit on error
set -x  # Debug mode - show all commands

echo "=== Starting Nginx with HTTPS (DEBUG) ==="
echo "Date: $(date)"
echo ""

# Wait for frontend to be reachable via DNS
TIMEOUT=60
ELAPSED=0
echo "Waiting for frontend DNS..."
until getent hosts frontend > /dev/null 2>&1; do
  if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "ERROR: Timeout waiting for frontend DNS after ${TIMEOUT}s"
    break
  fi
  echo "Waiting for frontend DNS... (${ELAPSED}s/${TIMEOUT}s)"
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done

# Wait for backend to be reachable via DNS
ELAPSED=0
echo "Waiting for backend DNS..."
until getent hosts backend > /dev/null 2>&1; do
  if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "ERROR: Timeout waiting for backend DNS after ${TIMEOUT}s"
    break
  fi
  echo "Waiting for backend DNS... (${ELAPSED}s/${TIMEOUT}s)"
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done

# Get IPs using getent (works in Docker network)
FRONTEND_IP=$(getent hosts frontend | awk '{print $1}' | head -1)
BACKEND_IP=$(getent hosts backend | awk '{print $1}' | head -1)

echo "Frontend IP: $FRONTEND_IP"
echo "Backend IP: $BACKEND_IP"

if [ -z "$FRONTEND_IP" ] || [ -z "$BACKEND_IP" ]; then
  echo "ERROR: Could not get IPs for services"
  echo "Frontend IP: $FRONTEND_IP"
  echo "Backend IP: $BACKEND_IP"
  echo "Trying to use service names directly..."
  FRONTEND_IP="frontend"
  BACKEND_IP="backend"
fi

# Check if SSL certificates exist
echo ""
echo "Checking SSL certificates..."
if [ -f "/etc/letsencrypt/live/cartagespa.com/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/cartagespa.com/privkey.pem" ]; then
  echo "✓ SSL certificates found"
  SSL_ENABLED=true
  ls -la /etc/letsencrypt/live/cartagespa.com/
else
  echo "✗ SSL certificates NOT found"
  echo "Looking in /etc/letsencrypt/live/cartagespa.com/"
  ls -la /etc/letsencrypt/live/cartagespa.com/ 2>&1 || echo "Directory does not exist"
  SSL_ENABLED=false
fi

echo ""
echo "Creating Nginx configuration..."

# Create nginx config with IPs and HTTPS (if certificates exist)
if [ "$SSL_ENABLED" = true ]; then
  echo "Creating HTTPS configuration..."
  cat > /etc/nginx/nginx.conf <<EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # HTTP server - Redirect to HTTPS
    server {
        listen 80;
        server_name cartagespa.com www.cartagespa.com 89.147.111.166;
        
        # Allow Let's Encrypt validation
        location /.well-known/acme-challenge/ {
            root /var/www/html;
        }
        
        # Redirect all other traffic to HTTPS
        location / {
            return 301 https://\$server_name\$request_uri;
        }
    }

    # HTTPS server
    server {
        listen 443 ssl;
        http2 on;
        server_name cartagespa.com www.cartagespa.com;

        # SSL certificates (mounted from host)
        ssl_certificate /etc/letsencrypt/live/cartagespa.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/cartagespa.com/privkey.pem;

        # SSL configuration (secure)
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # Frontend (React build)
        location / {
            proxy_pass http://${FRONTEND_IP}:80;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_set_header X-Forwarded-Host \$host;
            proxy_set_header X-Forwarded-Port \$server_port;
        }

        # Backend API
        location /api {
            proxy_pass http://${BACKEND_IP}:8000;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_set_header X-Forwarded-Host \$host;
            proxy_set_header X-Forwarded-Port \$server_port;
        }

        # Health check
        location /health {
            proxy_pass http://${BACKEND_IP}:8000/health;
        }
    }

    # Default server block - catch all other requests
    server {
        listen 80 default_server;
        server_name _;

        # Return 444 (close connection) for unmatched Host headers
        return 444;
    }
}
EOF
else
  echo "Creating HTTP-only configuration (fallback)..."
  cat > /etc/nginx/nginx.conf <<EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # HTTP server (temporary - before SSL setup)
    server {
        listen 80;
        server_name cartagespa.com www.cartagespa.com 89.147.111.166;

        # Frontend (React build)
        location / {
            proxy_pass http://${FRONTEND_IP}:80;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Backend API
        location /api {
            proxy_pass http://${BACKEND_IP}:8000;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Health check
        location /health {
            proxy_pass http://${BACKEND_IP}:8000/health;
        }
    }

    # Default server block - catch all other requests
    server {
        listen 80 default_server;
        server_name _;

        # Return 444 (close connection) for unmatched Host headers
        return 444;
    }
}
EOF
fi

echo "Nginx configuration created"
echo "Testing Nginx configuration..."

# Test configuration
if nginx -t; then
  echo "✓ Nginx configuration test: SUCCESS"
else
  echo "✗ Nginx configuration test: FAILED"
  echo "Error details above"
  exit 1
fi

echo ""
echo "Starting Nginx..."
exec nginx -g 'daemon off;'

