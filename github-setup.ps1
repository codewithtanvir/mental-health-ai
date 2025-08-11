# Mental Health AI - GitHub Setup Script (PowerShell)
# Run this script to prepare and push your project to GitHub

Write-Host "🚀 Mental Health AI - GitHub Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Step 1: Initialize Git repository (if not already done)
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Step 2: Check for sensitive files
Write-Host "🔒 Checking for sensitive files..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Write-Host "⚠️  Found .env file - make sure it's in .gitignore" -ForegroundColor Red
}

if (Test-Path "config/config.json") {
    Write-Host "⚠️  Found config.json with credentials - make sure it's in .gitignore" -ForegroundColor Red
}

if (Test-Path "quick-test.html") {
    Write-Host "⚠️  Found quick-test.html with hardcoded credentials - make sure it's in .gitignore" -ForegroundColor Red
}

# Step 3: Add all files
Write-Host "📝 Adding files to Git..." -ForegroundColor Yellow
git add .

# Step 4: Check git status
Write-Host "📊 Git status:" -ForegroundColor Cyan
git status

# Step 5: Commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Mental Health AI v1.0

✨ Features:
- AI-powered mental health chatbot (Bengali/English)
- Secure user authentication with Supabase
- Personal mood tracking and analytics
- Comprehensive mental health resources
- Responsive design for all devices
- Row-level security and data protection

🛠️ Tech Stack:
- Frontend: HTML5, CSS3, JavaScript, Tailwind CSS
- Backend: Supabase (Auth, Database, Storage)
- AI: Google Gemini 2.5 Flash API
- Database: PostgreSQL with RLS

🌍 Target: Bengali-speaking mental health community
🔒 Privacy-focused with secure authentication
📱 Mobile-responsive and accessible design"

# Step 6: Instructions for GitHub
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "=============" -ForegroundColor Cyan
Write-Host "1. Create a new repository on GitHub:"
Write-Host "   - Go to https://github.com/new"
Write-Host "   - Repository name: mental-health-ai"
Write-Host "   - Description: AI-powered mental health support for Bengali speakers"
Write-Host "   - Make it Public (recommended for open source)"
Write-Host ""
Write-Host "2. Add your GitHub repository as remote:"
Write-Host "   git remote add origin https://github.com/YOUR-USERNAME/mental-health-ai.git"
Write-Host ""
Write-Host "3. Push to GitHub:"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
Write-Host ""
Write-Host "4. After pushing, update your README:"
Write-Host "   - Replace README.md with README-GITHUB.md"
Write-Host "   - Update demo links and GitHub URLs"
Write-Host ""
Write-Host "🔐 Security Reminder:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "✅ .env file is excluded from Git"
Write-Host "✅ config.json with real credentials is excluded"
Write-Host "✅ Test files with hardcoded keys are excluded"
Write-Host "✅ Only template/example files are included"
Write-Host ""
Write-Host "🚀 Ready for deployment!" -ForegroundColor Green
Write-Host ""

# Optional: Open GitHub in browser
$openGitHub = Read-Host "🌐 Open GitHub in browser to create repository? (y/n)"
if ($openGitHub -eq "y" -or $openGitHub -eq "Y") {
    Start-Process "https://github.com/new"
}

Write-Host "✨ Setup complete! Follow the instructions above to push to GitHub." -ForegroundColor Green

# Keep window open
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
