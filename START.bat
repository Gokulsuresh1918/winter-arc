@echo off
echo ======================================
echo    MOMENTUM - QUICK START
echo ======================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo [1/4] Checking MongoDB connection...
timeout /t 2 /nobreak >nul

echo [2/4] Starting Backend Server...
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/4] Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ======================================
echo    MOMENTUM IS STARTING...
echo ======================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Opening browser in 5 seconds...
echo.
echo Press Ctrl+C in each window to stop the servers.
echo ======================================

timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo MOMENTUM is now running!
echo Keep this window open.
pause

