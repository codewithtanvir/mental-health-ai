#!/bin/bash

# Mental Health AI - GitHub Setup Script
# Run this script to prepare and push your project to GitHub

echo "🚀 Mental Health AI - GitHub Setup"
echo "=================================="

# Step 1: Initialize Git repository (if not already done)
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Step 2: Check for sensitive files
echo "🔒 Checking for sensitive files..."
if [ -f ".env" ]; then
    echo "⚠️  Found .env file - make sure it's in .gitignore"
fi

if [ -f "config/config.json" ]; then
    echo "⚠️  Found config.json with credentials - make sure it's in .gitignore"
fi

if [ -f "quick-test.html" ]; then
    echo "⚠️  Found quick-test.html with hardcoded credentials - make sure it's in .gitignore"
fi

# Step 3: Add all files
echo "📝 Adding files to Git..."
git add .

# Step 4: Check git status
echo "📊 Git status:"
git status

# Step 5: Commit
echo "💾 Creating initial commit..."
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
echo ""
echo "🎯 Next Steps:"
echo "============="
echo "1. Create a new repository on GitHub:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: mental-health-ai"
echo "   - Description: AI-powered mental health support for Bengali speakers"
echo "   - Make it Public (recommended for open source)"
echo ""
echo "2. Add your GitHub repository as remote:"
echo "   git remote add origin https://github.com/YOUR-USERNAME/mental-health-ai.git"
echo ""
echo "3. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. After pushing, update your README:"
echo "   - Replace README.md with README-GITHUB.md"
echo "   - Update demo links and GitHub URLs"
echo ""
echo "🔐 Security Reminder:"
echo "==================="
echo "✅ .env file is excluded from Git"
echo "✅ config.json with real credentials is excluded"
echo "✅ Test files with hardcoded keys are excluded"
echo "✅ Only template/example files are included"
echo ""
echo "🚀 Ready for deployment!"
echo ""

# Optional: Open GitHub in browser (Windows/macOS)
read -p "🌐 Open GitHub in browser to create repository? (y/n): " open_github
if [[ $open_github =~ ^[Yy]$ ]]; then
    if command -v start &> /dev/null; then
        start https://github.com/new  # Windows
    elif command -v open &> /dev/null; then
        open https://github.com/new   # macOS
    else
        echo "Please manually open: https://github.com/new"
    fi
fi

echo "✨ Setup complete! Follow the instructions above to push to GitHub."
