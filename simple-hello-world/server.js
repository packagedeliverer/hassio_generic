const express = require('express');
const app = express();
const port = 3000;

// Serve static files from public directory if it exists
app.use(express.static('public'));

// Main route - GUID Converter
app.get('/', (req, res) => {
  const currentTime = new Date().toLocaleString();
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GUID Converter - SAP Format Tool</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f4c75 0%, #3282b8 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            color: #0f4c75;
            margin-bottom: 10px;
            font-size: 2.5em;
            text-align: center;
        }
        .subtitle {
            color: #666;
            font-size: 1.1em;
            margin-bottom: 30px;
            text-align: center;
        }
        .converter-section {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 25px;
            margin: 20px 0;
        }
        .field-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            font-weight: bold;
            color: #0f4c75;
            margin-bottom: 8px;
            font-size: 1.1em;
        }
        input[type="text"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1em;
            font-family: 'Courier New', monospace;
            box-sizing: border-box;
            transition: border-color 0.3s;
        }
        input[type="text"]:focus {
            outline: none;
            border-color: #3282b8;
        }
        .format-info {
            font-size: 0.9em;
            color: #666;
            margin-top: 5px;
        }
        .buttons {
            text-align: center;
            margin: 25px 0;
        }
        button {
            background: #3282b8;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            font-size: 1em;
            cursor: pointer;
            margin: 0 10px;
            transition: background-color 0.3s;
        }
        button:hover {
            background: #0f4c75;
        }
        .example {
            background: #e3f2fd;
            border-left: 4px solid #3282b8;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .example h3 {
            margin-top: 0;
            color: #0f4c75;
        }
        .error {
            color: #d32f2f;
            font-size: 0.9em;
            margin-top: 5px;
        }
        .success {
            color: #388e3c;
            font-size: 0.9em;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💼 GUID Converter</h1>
        <p class="subtitle">Convert between Standard and SAP GUID formats</p>
        
        <div class="converter-section">
            <div class="field-group">
                <label for="standardGuid">Standard Format (lowercase with dashes):</label>
                <input type="text" id="standardGuid" placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890">
                <div class="format-info">Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (lowercase)</div>
                <div id="standardError" class="error" style="display: none;"></div>
            </div>
            
            <div class="field-group">
                <label for="sapGuid">SAP Format (uppercase without dashes):</label>
                <input type="text" id="sapGuid" placeholder="A1B2C3D4E5F67890ABCDEF1234567890">
                <div class="format-info">Format: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (32 uppercase characters)</div>
                <div id="sapError" class="error" style="display: none;"></div>
            </div>
            
            <div class="buttons">
                <button onclick="generateNewGuid()">🎲 Generate New GUID</button>
                <button onclick="clearFields()">🗑️ Clear All</button>
            </div>
        </div>
        
        <div class="example">
            <h3>📋 Examples:</h3>
            <p><strong>Standard:</strong> <code>a1b2c3d4-e5f6-7890-abcd-ef1234567890</code></p>
            <p><strong>SAP:</strong> <code>A1B2C3D4E5F67890ABCDEF1234567890</code></p>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 0.9em; margin-top: 30px;">
            Last updated: ${currentTime}
        </div>
    </div>

    <script>
        function isValidGuid(guid, format) {
            if (format === 'standard') {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guid);
            } else if (format === 'sap') {
                return /^[0-9A-F]{32}$/.test(guid);
            }
            return false;
        }
        
        function standardToSap(standardGuid) {
            return standardGuid.replace(/-/g, '').toUpperCase();
        }
        
        function sapToStandard(sapGuid) {
            const clean = sapGuid.toLowerCase();
            return clean.substring(0, 8) + '-' + 
                   clean.substring(8, 12) + '-' + 
                   clean.substring(12, 16) + '-' + 
                   clean.substring(16, 20) + '-' + 
                   clean.substring(20, 32);
        }
        
        function showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        function hideError(elementId) {
            document.getElementById(elementId).style.display = 'none';
        }
        
        function generateGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        
        document.getElementById('standardGuid').addEventListener('input', function(e) {
            const value = e.target.value.trim();
            hideError('standardError');
            hideError('sapError');
            
            if (value === '') {
                document.getElementById('sapGuid').value = '';
                return;
            }
            
            if (isValidGuid(value, 'standard')) {
                document.getElementById('sapGuid').value = standardToSap(value);
            } else {
                showError('standardError', 'Invalid standard GUID format');
            }
        });
        
        document.getElementById('sapGuid').addEventListener('input', function(e) {
            const value = e.target.value.trim();
            hideError('standardError');
            hideError('sapError');
            
            if (value === '') {
                document.getElementById('standardGuid').value = '';
                return;
            }
            
            if (isValidGuid(value, 'sap')) {
                document.getElementById('standardGuid').value = sapToStandard(value);
            } else {
                showError('sapError', 'Invalid SAP GUID format (32 uppercase hex characters)');
            }
        });
        
        function generateNewGuid() {
            const newGuid = generateGuid();
            document.getElementById('standardGuid').value = newGuid;
            document.getElementById('sapGuid').value = standardToSap(newGuid);
            hideError('standardError');
            hideError('sapError');
        }
        
        function clearFields() {
            document.getElementById('standardGuid').value = '';
            document.getElementById('sapGuid').value = '';
            hideError('standardError');
            hideError('sapError');
        }
    </script>
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