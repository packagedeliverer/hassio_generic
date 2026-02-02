#!/bin/bash

echo "Starting Simple Hello World Python server..."

# Change to app directory
cd /app

# Start the Python server
echo "Starting Python HTTP server on port 8080..."
exec python3 app.py
