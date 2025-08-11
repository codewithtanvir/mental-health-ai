#!/usr/bin/env python3
"""
Simple development server with environment variable support
for Mental Health AI application
"""

import os
import sys
import json
import http.server
import socketserver
from pathlib import Path


class EnvHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler that can serve environment variables to frontend"""

    def do_GET(self):
        # Handle config.json request - serve environment variables
        if self.path == '/env.json':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            # Load environment variables from .env file
            env_vars = self.load_env_vars()

            # Only send safe environment variables to frontend
            safe_env = {
                'GEMINI_API_KEY': env_vars.get('GEMINI_API_KEY', ''),
                'SUPABASE_URL': env_vars.get('SUPABASE_URL', ''),
                'SUPABASE_ANON_KEY': env_vars.get('SUPABASE_ANON_KEY', ''),
                'NODE_ENV': env_vars.get('NODE_ENV', 'development'),
                'ENABLE_CHAT': env_vars.get('ENABLE_CHAT', 'true') == 'true',
                'ENABLE_BLOG': env_vars.get('ENABLE_BLOG', 'true') == 'true',
                'ENABLE_RESOURCES': env_vars.get('ENABLE_RESOURCES', 'true') == 'true',
                'ENABLE_ANALYTICS': env_vars.get('ENABLE_ANALYTICS', 'false') == 'true'
            }

            response = json.dumps(safe_env, indent=2)
            self.wfile.write(response.encode())
            return

        # Handle regular file requests
        super().do_GET()

    def load_env_vars(self):
        """Load environment variables from .env file"""
        env_vars = {}
        env_file = Path('.env')

        if env_file.exists():
            with open(env_file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        env_vars[key.strip()] = value.strip()

        return env_vars


def main():
    """Start the development server"""
    PORT = int(os.environ.get('PORT', 3000))

    print(f"🚀 Starting Mental Health AI development server...")
    print(f"📍 Server running at: http://localhost:{PORT}")
    print(f"📁 Serving files from: {os.getcwd()}")
    print(f"🔧 Environment variables loaded from .env file")
    print(f"⚡ Press Ctrl+C to stop the server")
    print("-" * 50)

    try:
        with socketserver.TCPServer(("", PORT), EnvHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped gracefully")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"\n❌ Error: Port {PORT} is already in use")
            print(f"💡 Try using a different port: python server.py")
            print(f"💡 Or stop the process using port {PORT}")
        else:
            print(f"\n❌ Error starting server: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
