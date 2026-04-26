@echo off
REM DevTest - Simple Windows Startup Script
REM Uses npm instead of pnpm for better compatibility

setlocal enabledelayedexpansion
cd /d "%~dp0"

title DevTest - Starting...
color 0A
cls

echo.
echo ============================================
echo   DevTest - iOS and Android App Testing
echo          Starting Application...
echo ============================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found
    echo Install from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js installed

REM Check Docker (optional)
docker --version >nul 2>&1
if errorlevel 1 (
    echo [WARN] Docker not found - skipping database setup
) else (
    echo [OK] Docker found
    echo Starting database services...
    call docker-compose up -d
    timeout /t 3 >nul
)

REM Create .env file if missing
if not exist "backend\.env" (
    echo Creating backend/.env with defaults...
    (
        echo DATABASE_URL=postgresql://devtest:devtest@localhost:5432/devtest
        echo JWT_SECRET=dev-secret-key-change-in-production
        echo REFRESH_SECRET=dev-refresh-secret-key-change-in-production
        echo NODE_ENV=development
        echo PORT=3001
        echo FRONTEND_URL=http://localhost:5173
    ) > backend\.env
    echo [OK] Created backend/.env
)

REM Build backend
echo.
echo Building backend...
cd backend
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
REM Generate Prisma client
echo Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo [WARN] Prisma generate had issues, continuing anyway...
)
call npm run build
if errorlevel 1 (
    echo ERROR: Backend build failed
    cd ..
    pause
    exit /b 1
)
echo [OK] Backend built
cd ..

REM Build frontend
echo.
echo Building frontend...
cd frontend
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed
    cd ..
    pause
    exit /b 1
)
echo [OK] Frontend built
cd ..

REM Start the application
echo.
echo ============================================
echo   Starting DevTest Server...
echo   Opening: http://localhost:3001
echo ============================================
echo.
echo The application will open in your browser.
echo Press Ctrl+C in this window to stop the server.
echo.

timeout /t 3 >nul
start http://localhost:3001

cd backend
node dist/index.js
