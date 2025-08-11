#!/usr/bin/env python3
"""
Quick setup script for Mental Health AI
This script helps users set up their environment quickly
"""

import os
import sys
from pathlib import Path


def main():
    print("🚀 Mental Health AI - Quick Setup")
    print("=" * 50)

    # Check if .env exists
    env_file = Path('.env')
    if not env_file.exists():
        print("📝 Creating .env file from template...")

        # Copy from .env.example
        example_file = Path('.env.example')
        if example_file.exists():
            with open(example_file, 'r', encoding='utf-8') as f:
                content = f.read()

            with open(env_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print("✅ .env file created successfully!")
        else:
            print("❌ .env.example file not found!")
            return
    else:
        print("✅ .env file already exists")

    # Check if API key is set
    api_key_set = False
    with open(env_file, 'r', encoding='utf-8') as f:
        for line in f:
            if line.startswith('GEMINI_API_KEY=') and '=' in line:
                value = line.split('=', 1)[1].strip()
                if value and value != 'your_gemini_api_key_here' and not value.startswith('AIzaSyCyan'):
                    api_key_set = True
                    break

    if not api_key_set:
        print("\n⚠️  API Key Setup Required")
        print("-" * 30)
        print("To use the AI chatbot, you need a Gemini API key:")
        print("1. Visit: https://aistudio.google.com/app/apikey")
        print("2. Create a new API key")
        print("3. Copy the API key")
        print("4. Edit your .env file and replace GEMINI_API_KEY value")
        print("\nExample:")
        print("GEMINI_API_KEY=AIzaSyC1234567890abcdef...")

        # Ask if user wants to enter API key now
        try:
            response = input(
                "\n🔑 Do you want to enter your API key now? (y/N): ").strip().lower()
            if response == 'y' or response == 'yes':
                api_key = input("Enter your Gemini API key: ").strip()
                if api_key and api_key.startswith('AIzaSy'):
                    # Update .env file
                    with open(env_file, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Replace the API key line
                    lines = content.split('\n')
                    for i, line in enumerate(lines):
                        if line.startswith('GEMINI_API_KEY='):
                            lines[i] = f'GEMINI_API_KEY={api_key}'
                            break

                    with open(env_file, 'w', encoding='utf-8') as f:
                        f.write('\n'.join(lines))

                    print("✅ API key updated successfully!")
                    api_key_set = True
                else:
                    print("❌ Invalid API key format. Please edit .env file manually.")
        except KeyboardInterrupt:
            print("\n⏸️  Setup cancelled by user")
            return
    else:
        print("✅ API key is configured")

    print("\n🎯 Setup Complete!")
    print("-" * 20)
    print("Next steps:")
    print("1. Run: python server.py")
    print("2. Open: http://localhost:3000")
    print("3. Create an account or login")
    print("4. Start chatting with the AI!")

    if api_key_set:
        print("\n🤖 AI chatbot is ready to use!")
    else:
        print("\n⚠️  Remember to add your API key to use the AI chatbot")

    print("\n📚 For more help, check the README.md file")


if __name__ == "__main__":
    main()
