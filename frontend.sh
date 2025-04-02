#!/bin/bash

# Frontend-only startup script
echo "Starting frontend-only application..."
cd client

# Use the vite server directly
npx vite --config vite.config.ts