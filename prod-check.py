import os
import re
from pathlib import Path

print("Production readiness check for Mental Health AI")
print("=" * 50)

# Security checks
print("\n1. Security Checks:")
print("- Checking for exposed API keys...")

# Check .env.example for real values
if os.path.exists('.env.example'):
    with open('.env.example', 'r', encoding='utf-8') as f:
        content = f.read()
        if 'your_' in content and 'here' in content:
            print("  ✅ .env.example uses placeholders (GOOD)")
        else:
            print("  ⚠️  .env.example may contain real values")

# Check if .env is in gitignore
if os.path.exists('.gitignore'):
    with open('.gitignore', 'r', encoding='utf-8') as f:
        if '.env' in f.read():
            print("  ✅ .env is in .gitignore (GOOD)")
        else:
            print("  ⚠️  .env should be in .gitignore")

# File checks
print("\n2. File Structure Checks:")
critical_files = [
    'index.html',
    'chat.html',
    'dashboard.html',
    'server.py',
    'js/config.js',
    'js/auth.js',
    'js/main.js'
]

all_files_exist = True
for file_path in critical_files:
    if os.path.exists(file_path):
        print(f"  ✅ {file_path}")
    else:
        print(f"  ❌ Missing: {file_path}")
        all_files_exist = False

# Production files check
print("\n3. Production Configuration:")
prod_files = [
    'vercel.json',
    'Dockerfile',
    'requirements.txt',
    'PRODUCTION_CHECKLIST.md'
]

for file_path in prod_files:
    if os.path.exists(file_path):
        print(f"  ✅ {file_path}")
    else:
        print(f"  ❌ Missing: {file_path}")

print("\n" + "=" * 50)
if all_files_exist:
    print("🎉 Core files check PASSED!")
else:
    print("🚨 Some critical files are missing!")

print("\nNext steps for production:")
print("1. Review and update .env with production values")
print("2. Set up domain and SSL certificate")
print("3. Configure monitoring and analytics")
print("4. Review PRODUCTION_CHECKLIST.md")
print("5. Deploy using: vercel --prod")
