@echo off
REM Mental Health AI - Windows Setup Script

echo 🧠 Mental Health AI - Setup Script
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm is installed

REM Install dependencies if package.json exists
if exist "package.json" (
    echo 📦 Installing dependencies...
    npm install
    echo ✅ Dependencies installed
) else (
    echo ℹ️  No package.json found, skipping dependency installation
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    if exist ".env.example" (
        echo 🔧 Creating .env file from .env.example...
        copy ".env.example" ".env"
        echo ✅ .env file created
        echo ⚠️  Please edit .env file and add your Gemini API key
    ) else (
        echo ⚠️  .env.example not found, creating basic .env file...
        (
            echo GEMINI_API_KEY=your_gemini_api_key_here
            echo NODE_ENV=development
            echo PORT=3000
        ) > .env
        echo ✅ Basic .env file created
    )
) else (
    echo ℹ️  .env file already exists
)

REM Check if Gemini API key is set
findstr /C:"your_gemini_api_key_here" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo 🔑 API KEY SETUP REQUIRED:
    echo 1. Visit https://makersuite.google.com/
    echo 2. Get your Gemini API key
    echo 3. Replace 'your_gemini_api_key_here' in .env file
    echo.
)

REM Create images directory if it doesn't exist
if not exist "images" (
    echo 📁 Creating images directory...
    mkdir images
    echo ✅ Images directory created
)

REM Check if live-server is installed globally
live-server --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 🌐 Installing live-server globally for development...
    npm install -g live-server
    echo ✅ live-server installed
)

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit .env file and add your Gemini API key
echo 2. Run 'npm start' to start development server
echo 3. Open http://localhost:3000 in your browser
echo.
echo 📖 Additional commands:
echo - npm run dev    : Start development server
echo - npm run build  : Build for production
echo - npm run lint   : Check code quality
echo.
echo 💡 For help, check README.md

pause
