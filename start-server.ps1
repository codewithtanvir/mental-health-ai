# Mental Health AI - Development Server Launcher
# PowerShell script for Windows users

param(
    [int]$Port = 3000,
    [switch]$Help
)

if ($Help) {
    Write-Host "Mental Health AI Development Server" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\start-server.ps1                # Start server on port 3000"
    Write-Host "  .\start-server.ps1 -Port 8080     # Start server on port 8080"
    Write-Host "  .\start-server.ps1 -Help          # Show this help"
    Write-Host ""
    Write-Host "Requirements:" -ForegroundColor Yellow
    Write-Host "  - Python 3.x installed"
    Write-Host "  - .env file configured with your API keys"
    Write-Host ""
    exit 0
}

# Check if Python is available
$pythonCmd = $null
foreach ($cmd in @("python", "python3", "py")) {
    try {
        $version = & $cmd --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            $pythonCmd = $cmd
            Write-Host "✅ Found Python: $version" -ForegroundColor Green
            break
        }
    }
    catch {
        # Continue to next command
    }
}

if (-not $pythonCmd) {
    Write-Host "❌ Python not found!" -ForegroundColor Red
    Write-Host "💡 Please install Python 3.x from https://python.org" -ForegroundColor Yellow
    Write-Host "💡 Make sure Python is added to your PATH" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Warning: .env file not found" -ForegroundColor Yellow
    Write-Host "💡 Copy .env.example to .env and configure your API keys" -ForegroundColor Yellow
    Write-Host ""
}

# Check if config.json exists, create if missing
if (-not (Test-Path "config.json")) {
    Write-Host "📝 Creating config.json..." -ForegroundColor Blue
    # Config.json should already exist from our setup
}

Write-Host "🚀 Starting Mental Health AI development server..." -ForegroundColor Green
Write-Host "📍 Server will run at: http://localhost:$Port" -ForegroundColor Cyan
Write-Host "📁 Serving files from: $PWD" -ForegroundColor Cyan
Write-Host "⚡ Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ("-" * 50) -ForegroundColor Gray

# Set the PORT environment variable
$env:PORT = $Port

# Start the server
try {
    & $pythonCmd server.py
}
catch {
    Write-Host "`n❌ Error starting server: $_" -ForegroundColor Red
    exit 1
}
