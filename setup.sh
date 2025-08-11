#!/bin/bash

# Mental Health AI - Deployment Script
# This script helps set up the project for development or production

echo "🧠 Mental Health AI - Setup Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm is installed"

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "ℹ️  No package.json found, skipping dependency installation"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "🔧 Creating .env file from .env.example..."
        cp .env.example .env
        echo "✅ .env file created"
        echo "⚠️  Please edit .env file and add your Gemini API key"
    else
        echo "⚠️  .env.example not found, creating basic .env file..."
        cat > .env << EOF
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
PORT=3000
EOF
        echo "✅ Basic .env file created"
    fi
else
    echo "ℹ️  .env file already exists"
fi

# Check if Gemini API key is set
if grep -q "your_gemini_api_key_here" .env 2>/dev/null; then
    echo ""
    echo "🔑 API KEY SETUP REQUIRED:"
    echo "1. Visit https://makersuite.google.com/"
    echo "2. Get your Gemini API key"
    echo "3. Replace 'your_gemini_api_key_here' in .env file"
    echo ""
fi

# Create images directory if it doesn't exist
if [ ! -d "images" ]; then
    echo "📁 Creating images directory..."
    mkdir -p images
    echo "✅ Images directory created"
fi

# Check if live-server is installed globally
if ! command -v live-server &> /dev/null; then
    echo "🌐 Installing live-server globally for development..."
    npm install -g live-server
    echo "✅ live-server installed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file and add your Gemini API key"
echo "2. Run 'npm start' to start development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📖 Additional commands:"
echo "- npm run dev    : Start development server"
echo "- npm run build  : Build for production"
echo "- npm run lint   : Check code quality"
echo ""
echo "💡 For help, check README.md"
