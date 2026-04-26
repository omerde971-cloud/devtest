@echo off
setlocal enabledelayedexpansion

title DevTest Startup
color 0A
cls

echo.
echo ╔════════════════════════════════════════╗
echo ║  🚀 DevTest - iOS^&Android App Testing  ║
echo ║         Starting Application...         ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if pnpm is installed, if not install it
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing pnpm...
    call npm install -g pnpm
)

echo ✓ Node.js found
echo ✓ pnpm found
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call pnpm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

REM Build frontend
echo 🔨 Building frontend...
call pnpm --filter frontend build
if errorlevel 1 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)
echo ✓ Frontend built
echo.

REM Build backend
echo 🔨 Building backend...
call pnpm --filter backend build
if errorlevel 1 (
    echo ❌ Backend build failed
    pause
    exit /b 1
)
echo ✓ Backend built
echo.

REM Start backend
echo ╔════════════════════════════════════════╗
echo ║  ⚡ Starting DevTest Server...          ║
echo ║  Opening: http://localhost:3001       ║
echo ╚════════════════════════════════════════╝
echo.

REM Open browser
timeout /t 2 >nul
start http://localhost:3001

REM Start backend server
cd backend
node dist/index.js
