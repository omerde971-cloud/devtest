#!/bin/bash

echo ""
echo "============================================"
echo "  DevTest - iOS & Android App Testing"
echo "        Starting Application..."
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if pnpm is installed, if not install it
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm globally..."
    npm install -g pnpm
fi

echo "OK Node.js found"
echo "OK pnpm found"
echo ""

# Install dependencies
echo "Installing dependencies..."
pnpm install --no-frozen-lockfile
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "OK Dependencies installed"
echo ""

# Build frontend
echo "Building frontend..."
pnpm --filter frontend build
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend build failed"
    exit 1
fi
echo "OK Frontend built"
echo ""

# Build backend
echo "Building backend..."
pnpm --filter backend build
if [ $? -ne 0 ]; then
    echo "ERROR: Backend build failed"
    exit 1
fi
echo "OK Backend built"
echo ""

# Start backend
echo "============================================"
echo "  Starting DevTest Server..."
echo "  Opening: http://localhost:3001"
echo "============================================"
echo ""

# Open browser (Mac/Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
    sleep 2
    open http://localhost:3001
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sleep 2
    xdg-open http://localhost:3001 &
fi

# Start backend server
cd backend
node dist/index.js
