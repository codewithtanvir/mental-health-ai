@echo off
REM Mental Health AI - Development Server Launcher
REM Batch script for Windows users

echo.
echo ==============================================
echo  Mental Health AI - Development Server
echo ==============================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python found
    set PYTHON_CMD=python
    goto :start_server
)

python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python found
    set PYTHON_CMD=python3
    goto :start_server
)

py --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python found
    set PYTHON_CMD=py
    goto :start_server
)

echo ❌ Python not found!
echo 💡 Please install Python 3.x from https://python.org
echo 💡 Make sure Python is added to your PATH
pause
exit /b 1

:start_server
REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  Warning: .env file not found
    echo 💡 Copy .env.example to .env and configure your API keys
    echo.
)

echo 🚀 Starting Mental Health AI development server...
echo 📍 Server will run at: http://localhost:3000
echo 📁 Serving files from: %CD%
echo ⚡ Press Ctrl+C to stop the server
echo ----------------------------------------------
echo.

REM Set default port
if "%PORT%"=="" set PORT=3000

REM Start the server
%PYTHON_CMD% server.py

echo.
echo ✅ Server stopped
pause
