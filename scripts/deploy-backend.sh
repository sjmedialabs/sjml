#!/bin/bash

# Backend Deployment Script
# This script builds and deploys the backend (admin + API)

set -e  # Exit on error

echo "🚀 Starting backend deployment..."

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

# Restart backend PM2 instance
echo "♻️  Restarting backend PM2 instance..."
pm2 restart sjml-backend

# Show status
pm2 status

echo "✅ Backend deployment completed successfully!"
