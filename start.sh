#!/bin/bash

echo "🚀 DevTest - Building & Starting..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build frontend
echo "🔨 Building frontend..."
pnpm --filter frontend build

# Build backend
echo "🔨 Building backend..."
pnpm --filter backend build

# Start backend (serves frontend + API)
echo "⚡ Starting DevTest server..."
cd backend
node dist/index.js
