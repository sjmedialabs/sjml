#!/bin/bash

# Frontend Deployment Script
# This script builds and deploys the frontend (marketing pages)

set -e  # Exit on error

echo "🚀 Starting frontend deployment..."

# Change to project directory
cd /www/wwwroot/sjml

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install dependencies (if package.json changed)
echo "📦 Installing dependencies..."
npm ci --production=false

# Build the Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Restart frontend PM2 instance
echo "♻️  Restarting frontend PM2 instance..."
pm2 restart sjml-frontend

# Show status
pm2 status

echo "✅ Frontend deployment completed successfully!"
