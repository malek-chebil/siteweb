#!/bin/sh
# Simplified startup script - relies on Docker healthchecks
# This script just waits a bit and starts nginx
# Docker healthchecks ensure services are ready

echo "Waiting for services to be healthy (managed by Docker healthchecks)..."
sleep 5  # Small delay to ensure DNS is ready

echo "Starting nginx..."
exec nginx -g 'daemon off;'

