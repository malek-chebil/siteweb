#!/bin/sh
# Wait for backend and frontend to be ready
echo "Waiting for backend and frontend services..."

# Timeout configuration
TIMEOUT=120  # 2 minutes max
ELAPSED=0
INTERVAL=2

# Wait for backend
echo "Checking backend availability..."
while [ $ELAPSED -lt $TIMEOUT ]; do
  # Try multiple methods to check backend
  if wget --spider --timeout=2 --tries=1 http://backend:8000/health 2>/dev/null || \
     wget --spider --timeout=2 --tries=1 http://backend:8000/ 2>/dev/null; then
    echo "Backend is ready!"
    break
  fi
  
  echo "Waiting for backend:8000... (${ELAPSED}s/${TIMEOUT}s)"
  sleep $INTERVAL
  ELAPSED=$((ELAPSED + INTERVAL))
done

if [ $ELAPSED -ge $TIMEOUT ]; then
  echo "ERROR: Timeout waiting for backend after ${TIMEOUT}s"
  echo "Backend may not be starting correctly. Check backend logs."
  # Continue anyway - nginx will retry
fi

# Reset for frontend
ELAPSED=0

# Wait for frontend
echo "Checking frontend availability..."
while [ $ELAPSED -lt $TIMEOUT ]; do
  if wget --spider --timeout=2 --tries=1 http://frontend:80 2>/dev/null; then
    echo "Frontend is ready!"
    break
  fi
  
  echo "Waiting for frontend:80... (${ELAPSED}s/${TIMEOUT}s)"
  sleep $INTERVAL
  ELAPSED=$((ELAPSED + INTERVAL))
done

if [ $ELAPSED -ge $TIMEOUT ]; then
  echo "ERROR: Timeout waiting for frontend after ${TIMEOUT}s"
  echo "Frontend may not be starting correctly. Check frontend logs."
  # Continue anyway - nginx will retry
fi

# Start nginx
echo "Starting nginx..."
exec nginx -g 'daemon off;'

