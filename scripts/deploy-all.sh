#!/bin/bash

# Full Deployment Script
# This script deploys both frontend and backend

set -e  # Exit on error

echo "🚀 Starting full deployment (frontend + backend)..."

# Change to project directory
cd /www/wwwroot/sjml

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build the Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Restart both PM2 instances
echo "♻️  Restarting all PM2 instances..."
pm2 restart ecosystem.config.js

# Show status
pm2 status

echo "✅ Full deployment completed successfully!"
echo "Frontend running on port 3000"
echo "Backend running on port 1001"
