const express = require('express');
const app = express();
const port = 3000;

// Serve static files from public directory if it exists
app.use(express.static('public'));

// Main route
app.get('/', (req, res) => {
  const currentTime = new Date().toLocaleString();
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Node.js Hello World - Home Assistant Addon</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 500px;
            margin: 20px;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
            font-size: 2.5em;
        }
        .subtitle {
            color: #666;
            font-size: 1.2em;
            margin-bottom: 30px;
        }
        .info-box {
            background: #f8f9fa;
            border-left: 4px solid #68a063;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
        }
        .info-box h3 {
            margin-top: 0;
            color: #68a063;
        }
        .status {
            display: inline-block;
            background: #68a063;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px 0;
        }
        .timestamp {
            color: #999;
            font-size: 0.9em;
            margin-top: 20px;
        }
        .nodejs-logo {
            color: #68a063;
            font-size: 1.2em;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Hello World!</h1>
        <p class="subtitle">Welcome to your <span class="nodejs-logo">Node.js</span> Home Assistant Addon</p>
        
        <div class="status">✅ Express Server Running Successfully</div>
        
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
            <p><strong>Runtime:</strong> Node.js with Express</p>
            <p><strong>Port:</strong> 3000 (internal)</p>
            <p><strong>Framework:</strong> Express.js</p>
            <p><strong>Architecture:</strong> Multi-arch support</p>
        </div>
        
        <div class="timestamp">
            Page loaded: ${currentTime}
        </div>
    </div>
</body>
</html>
  `;
  
  res.send(html);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API endpoint example
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Node.js Hello World Addon',
    version: '1.0.0',
    runtime: 'Node.js',
    framework: 'Express.js',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Node.js Hello World server listening on port ${port}`);
  console.log(`Server started at ${new Date().toISOString()}`);
});