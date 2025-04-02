#!/bin/bash

# Frontend-only startup script
echo "Starting frontend-only application..."
cd client

# Use the vite server directly (frontend-only)
npx vite --config vite.config.ts