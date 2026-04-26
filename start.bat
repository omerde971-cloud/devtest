@echo off
setlocal enabledelayedexpansion

title DevTest Startup
color 0A
cls

echo.
echo ============================================
echo   DevTest - iOS and Android App Testing
echo          Starting Application...
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if pnpm is installed, if not install it
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo Installing pnpm globally...
    call npm install -g pnpm
)

echo OK Node.js found
echo OK pnpm found
echo.

REM Install dependencies
echo Installing dependencies...
call pnpm install --no-frozen-lockfile
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo OK Dependencies installed
echo.

REM Build frontend
echo Building frontend...
call pnpm --filter frontend build
if errorlevel 1 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)
echo OK Frontend built
echo.

REM Build backend
echo Building backend...
call pnpm --filter backend build
if errorlevel 1 (
    echo ERROR: Backend build failed
    pause
    exit /b 1
)
echo OK Backend built
echo.

REM Start backend
echo ============================================
echo   Starting DevTest Server...
echo   Opening: http://localhost:3001
echo ============================================
echo.

REM Open browser
timeout /t 2 >nul
start http://localhost:3001

REM Start backend server
cd backend
node dist/index.js

pause
