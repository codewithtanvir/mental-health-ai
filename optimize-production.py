#!/usr/bin/env python3
"""
Production Optimization Script for Mental Health AI
This script prepares the application for production deployment
"""

import os
import re
import json
import shutil
from pathlib import Path


def check_security():
    """Check for security issues"""
    print("🔒 Running security checks...")

    issues = []

    # Check for exposed API keys
    for file_path in Path('.').rglob('*.js'):
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            if re.search(r'AIza[0-9A-Za-z_-]{35}', content):
                issues.append(f"⚠️  Potential API key found in {file_path}")

    # Check .env.example for real values
    if os.path.exists('.env.example'):
        with open('.env.example', 'r') as f:
            content = f.read()
            if 'AIza' in content or 'supabase.co' in content:
                issues.append(
                    "⚠️  .env.example contains real values instead of placeholders")

    # Check if .env is in gitignore
    if os.path.exists('.gitignore'):
        with open('.gitignore', 'r') as f:
            if '.env' not in f.read():
                issues.append("⚠️  .env not found in .gitignore")

    if issues:
        print("🚨 Security issues found:")
        for issue in issues:
            print(f"   {issue}")
        return False
    else:
        print("✅ No security issues found")
        return True


def optimize_files():
    """Optimize files for production"""
    print("⚡ Optimizing files...")

    # Remove console.log statements from JS files
    js_files = list(Path('.').rglob('*.js'))
    for js_file in js_files:
        try:
            with open(js_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Remove console.log statements but keep console.error for debugging
            optimized_content = re.sub(
                r'console\.log\([^)]*\);?\s*', '', content)

            if content != optimized_content:
                with open(js_file, 'w', encoding='utf-8') as f:
                    f.write(optimized_content)
                print(f"   ✅ Optimized {js_file}")
        except Exception as e:
            print(f"   ⚠️  Could not optimize {js_file}: {e}")


def create_production_config():
    """Create production configuration"""
    print("⚙️  Creating production configuration...")

    config = {
        "environment": "production",
        "version": "1.0.0",
        "build_date": "2025-01-11",
        "features": {
            "chat": True,
            "authentication": True,
            "dashboard": True,
            "blog": True,
            "resources": True
        },
        "security": {
            "rate_limiting": True,
            "csrf_protection": True,
            "content_security_policy": True
        },
        "performance": {
            "caching": True,
            "compression": True,
            "lazy_loading": True
        }
    }

    with open('production-config.json', 'w') as f:
        json.dump(config, f, indent=2)

    print("   ✅ Created production-config.json")


def verify_dependencies():
    """Verify all dependencies are working"""
    print("📦 Verifying dependencies...")

    # Check if critical files exist
    critical_files = [
        'index.html',
        'chat.html',
        'dashboard.html',
        'server.py',
        'js/config.js',
        'js/auth.js',
        'js/main.js',
        'css/styles.css'
    ]

    missing_files = []
    for file_path in critical_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)

    if missing_files:
        print("🚨 Missing critical files:")
        for file_path in missing_files:
            print(f"   ❌ {file_path}")
        return False
    else:
        print("   ✅ All critical files present")
        return True


def run_production_checks():
    """Run all production checks"""
    print("🚀 Running production readiness checks...\n")

    all_passed = True

    # Run checks
    if not check_security():
        all_passed = False

    print()
    if not verify_dependencies():
        all_passed = False

    print()
    optimize_files()

    print()
    create_production_config()

    print(f"\n{'='*50}")
    if all_passed:
        print("🎉 Production checks PASSED! Ready for deployment.")
        print("\nNext steps:")
        print("1. Set up environment variables in production")
        print("2. Configure domain and SSL")
        print("3. Set up monitoring and analytics")
        print("4. Review the PRODUCTION_CHECKLIST.md")
    else:
        print("🚨 Production checks FAILED! Please fix issues before deployment.")

    print(f"{'='*50}")


if __name__ == "__main__":
    run_production_checks()
