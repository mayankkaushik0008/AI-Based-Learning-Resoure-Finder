@echo off
setlocal enabledelayedexpansion

echo ========================================
echo LearnWise AI - Complete Setup
echo ========================================
echo.

REM Check if Docker is available
echo [1/8] Checking for Docker...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Docker is installed
    set DOCKER_AVAILABLE=1
) else (
    echo ✗ Docker is not installed
    set DOCKER_AVAILABLE=0
)
echo.

REM Check if PostgreSQL is available locally
echo [2/8] Checking for PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ PostgreSQL is installed
    set POSTGRES_AVAILABLE=1
) else (
    echo ✗ PostgreSQL is not installed locally
    set POSTGRES_AVAILABLE=0
)
echo.

REM Decide which database setup to use
if !DOCKER_AVAILABLE! equ 1 (
    echo Using Docker for PostgreSQL...
    echo.
    echo [3/8] Starting PostgreSQL container...
    docker-compose up -d
    if %errorlevel% neq 0 (
        echo ERROR: Failed to start Docker container
        echo Please ensure Docker Desktop is running
        pause
        exit /b 1
    )
    echo ✓ PostgreSQL container started
    echo Waiting 5 seconds for database to be ready...
    timeout /t 5 /nobreak >nul
    echo.
) else if !POSTGRES_AVAILABLE! equ 1 (
    echo Using local PostgreSQL installation...
    echo.
    echo [3/8] Creating database...
    psql -U postgres -c "CREATE DATABASE learnwise_ai;" 2>nul
    if %errorlevel% equ 0 (
        echo ✓ Database created
    ) else (
        echo ℹ Database may already exist (this is okay)
    )
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: No database solution available
    echo ========================================
    echo.
    echo You need either:
    echo   1. Docker Desktop (recommended) - Download from: https://www.docker.com/products/docker-desktop
    echo   2. PostgreSQL installed locally - Download from: https://www.postgresql.org/download/windows/
    echo.
    echo After installing one of these, run this script again.
    echo.
    pause
    exit /b 1
)

echo [4/8] Installing root dependencies...
call npm install >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)
echo ✓ Root dependencies installed
echo.

echo [5/8] Installing server dependencies...
cd server
call npm install >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
echo ✓ Server dependencies installed
echo.

echo [6/8] Setting up Prisma...
call npx prisma generate >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)
echo ✓ Prisma client generated
echo.

echo [7/8] Running database migrations...
call npx prisma migrate deploy >nul 2>&1
if %errorlevel% neq 0 (
    echo Running dev migration instead...
    call npx prisma migrate dev --name init
    if %errorlevel% neq 0 (
        echo ERROR: Failed to run migrations
        echo.
        echo Possible issues:
        echo - PostgreSQL is not running
        echo - Database credentials are incorrect
        echo - Network connection issue
        echo.
        pause
        exit /b 1
    )
)
echo ✓ Database migrations completed
echo.

echo [8/8] Seeding database with demo data...
call npx tsx prisma/seed.ts
if %errorlevel% neq 0 (
    echo Warning: Failed to seed database
    echo You can run "npm run prisma:seed" later
) else (
    echo ✓ Database seeded successfully
)
echo.

cd ..

echo Installing client dependencies...
cd client
call npm install >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
echo ✓ Client dependencies installed
cd ..
echo.

echo ========================================
echo ✓ Setup Complete!
echo ========================================
echo.
echo Your application is ready to run!
echo.
echo To start the application:
echo   1. Run: npm run dev
echo   2. Open: http://localhost:5173
echo   3. Login: demo@learnwise.ai / demo123
echo.
if !DOCKER_AVAILABLE! equ 1 (
    echo Database: Running in Docker container
    echo To stop database: docker-compose down
)
echo.
echo ========================================
echo.
pause
