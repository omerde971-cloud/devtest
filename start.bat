@echo off
setlocal enabledelayedexpansion

echo.
echo 🚀 DevTest - Building ^& Starting...
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call pnpm install

REM Build frontend
echo.
echo 🔨 Building frontend...
call pnpm --filter frontend build
if errorlevel 1 (
    echo ❌ Frontend build failed
    exit /b 1
)

REM Build backend
echo.
echo 🔨 Building backend...
call pnpm --filter backend build
if errorlevel 1 (
    echo ❌ Backend build failed
    exit /b 1
)

REM Start backend
echo.
echo ⚡ Starting DevTest server on http://localhost:3001
echo ⏳ Waiting for server to start...
echo.

cd backend
node dist/index.js

pause
