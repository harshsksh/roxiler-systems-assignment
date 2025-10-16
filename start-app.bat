@echo off
echo Starting Store Rating System...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo npm is not available
    pause
    exit /b 1
)

REM Run the Node.js startup script
node start-app.js

pause
