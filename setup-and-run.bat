@echo off
echo ========================================
echo LearnWise AI - Setup and Run
echo ========================================
echo.

echo [1/6] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo [2/6] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)

echo.
echo [3/6] Setting up database...
call npm run prisma:generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)

call npm run prisma:migrate
if %errorlevel% neq 0 (
    echo ERROR: Failed to run migrations
    pause
    exit /b 1
)

call npm run prisma:seed
if %errorlevel% neq 0 (
    echo ERROR: Failed to seed database
    pause
    exit /b 1
)

cd ..

echo.
echo [4/6] Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo [5/6] Setup complete!
echo.
echo ========================================
echo Starting Development Servers...
echo ========================================
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.
echo Login with:
echo   Email: demo@learnwise.ai
echo   Password: demo123
echo.
echo Press Ctrl+C to stop the servers
echo ========================================
echo.

echo [6/6] Starting servers...
call npm run dev
