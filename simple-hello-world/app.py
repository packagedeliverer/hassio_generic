#!/usr/bin/env python3

import http.server
import socketserver
import os
from datetime import datetime

class HelloWorldHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Hello World - Home Assistant Addon</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }}
        .container {{
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 500px;
            margin: 20px;
        }}
        h1 {{
            color: #333;
            margin-bottom: 20px;
            font-size: 2.5em;
        }}
        .subtitle {{
            color: #666;
            font-size: 1.2em;
            margin-bottom: 30px;
        }}
        .info-box {{
            background: #f8f9fa;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
        }}
        .info-box h3 {{
            margin-top: 0;
            color: #007bff;
        }}
        .status {{
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px 0;
        }}
        .timestamp {{
            color: #999;
            font-size: 0.9em;
            margin-top: 20px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 Hello World!</h1>
        <p class="subtitle">Welcome to your Simple Hello World Home Assistant Addon</p>
        
        <div class="status">✅ Python Server Running Successfully</div>
        
        <div class="info-box">
            <h3>🏠 Home Assistant Integration</h3>
            <p>This addon is running with <strong>ingress support</strong>, which means:</p>
            <ul>
                <li>No external ports needed</li>
                <li>Secure access through Home Assistant</li>
                <li>Integrated with HA's authentication</li>
                <li>Accessible from the sidebar</li>
            </ul>
        </div>
        
        <div class="info-box">
            <h3>🔧 Technical Details</h3>
            <p><strong>Server:</strong> Python HTTP Server</p>
            <p><strong>Port:</strong> 8080 (internal)</p>
            <p><strong>Architecture:</strong> Multi-arch support</p>
        </div>
        
        <div class="timestamp">
            Page loaded: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        </div>
    </div>
</body>
</html>
        """
        
        self.wfile.write(html_content.encode('utf-8'))

if __name__ == "__main__":
    PORT = 8080
    
    print(f"Starting Hello World server on port {PORT}")
    
    with socketserver.TCPServer(("", PORT), HelloWorldHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        httpd.serve_forever()