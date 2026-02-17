const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files from public directory if it exists
app.use(express.static('public'));

// Default SAP domains (users can modify these in the code if needed)
function getAddonOptions() {
  return {
    dev_domain: 'dev-tenant.crm.ondemand.com',
    acc_domain: 'acc-tenant.crm.ondemand.com',
    prd_domain: 'prd-tenant.crm.ondemand.com'
  };
}

// Main route - GUID Converter
app.get('/', (req, res) => {
  const currentTime = new Date().toLocaleString();
  
  res.send(`<!DOCTYPE html>
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

        <!-- SAP Deep Link Generator -->
        <h1 style="margin-top: 50px;">🔗 SAP Deep Link Generator</h1>
        <p class="subtitle">Generate direct links to SAP ByD objects</p>
        
        <div class="converter-section">
            <div class="field-group">
                <label for="tier">Environment Tier:</label>
                <select id="tier" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1em; box-sizing: border-box;">
                    <!-- Options will be populated dynamically -->
                </select>
            </div>
            
            <div class="field-group">
                <label for="objectType">Object Type:</label>
                <select id="objectType" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1em; box-sizing: border-box;">
                    <option value="COD_ACCOUNT_TT">Accounts (COD_ACCOUNT_TT)</option>
                    <option value="COD_CONTACT_TT">Contact (COD_CONTACT_TT)</option>
                    <option value="COD_SRQ_AGENT_TT">Tickets/Cases/Service Requests (COD_SRQ_AGENT_TT)</option>
                    <option value="COD_OPPORTUNITY_THINGTYPE">Opportunities (COD_OPPORTUNITY_THINGTYPE)</option>
                    <option value="COD_SALESORDER_TT">Sales Orders (COD_SALESORDER_TT)</option>
                    <option value="COD_MATERIAL">Products (COD_MATERIAL)</option>
                    <option value="COD_APPOINTMENT">Appointments (COD_APPOINTMENT)</option>
                    <option value="COD_TASK">Tasks (COD_TASK)</option>
                    <option value="COD_QUOTE_TT">Sales Quotes (COD_QUOTE_TT)</option>
                    <option value="COD_MKT_PROSPECT">Leads (COD_MKT_PROSPECT)</option>
                </select>
            </div>
            
            <div class="field-group">
                <label for="internalId">Internal ID:</label>
                <input type="text" id="internalId" placeholder="e.g., 1022241, 3561, GRONOS_WIND_ONSHORE">
                <div class="format-info">Enter the Internal ID of the object you want to link to</div>
                <div id="linkError" class="error" style="display: none;"></div>
            </div>
            
            <div class="buttons">
                <button onclick="generateDeepLink()">🔗 Generate Deep Link</button>
                <button onclick="copyDeepLink()">📋 Copy Link</button>
                <button onclick="clearLinkFields()">🗑️ Clear</button>
            </div>
            
            <div class="field-group">
                <label for="generatedLink">Generated Deep Link:</label>
                <textarea id="generatedLink" readonly style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 0.9em; font-family: 'Courier New', monospace; box-sizing: border-box; min-height: 80px; resize: vertical;"></textarea>
                <div id="linkSuccess" class="success" style="display: none;"></div>
            </div>
        </div>
        
        <div class="example">
            <h3>📋 Deep Link Examples:</h3>
            <p><strong>Account:</strong> <code>https://[domain]/sap/public/byd/runtime?bo_ns=http://sap.com/thingTypes&bo=COD_GENERIC&node=Root&operation=OnExtInspect&param.InternalID=1022241&param.Type=COD_ACCOUNT_TT&sapbyd-agent=TAB</code></p>
            <p><strong>Contact:</strong> <code>https://[domain]/sap/public/byd/runtime?bo_ns=http://sap.com/thingTypes&bo=COD_GENERIC&node=Root&operation=OnExtInspect&param.InternalID=1022226&param.Type=COD_CONTACT_TT&sapbyd-agent=TAB</code></p>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 0.9em; margin-top: 30px;">
            Last updated: ' + currentTime + '
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
        
        // Deep Link Generator Functions
        function generateDeepLink() {
            const tier = document.getElementById('tier').value;
            const objectType = document.getElementById('objectType').value;
            const internalId = document.getElementById('internalId').value.trim();
            
            hideError('linkError');
            document.getElementById('linkSuccess').style.display = 'none';
            
            if (!internalId) {
                showError('linkError', 'Please enter an Internal ID');
                return;
            }
            
            // Construct the deep link URL
            const baseUrl = 'https://' + tier + '/sap/public/byd/runtime';
            const params = new URLSearchParams({
                'bo_ns': 'http://sap.com/thingTypes',
                'bo': 'COD_GENERIC',
                'node': 'Root',
                'operation': 'OnExtInspect',
                'param.InternalID': internalId,
                'param.Type': objectType,
                'sapbyd-agent': 'TAB'
            });
            
            const deepLink = baseUrl + '?' + params.toString();
            document.getElementById('generatedLink').value = deepLink;
            
            document.getElementById('linkSuccess').textContent = 'Deep link generated successfully!';
            document.getElementById('linkSuccess').style.display = 'block';
        }
        
        function copyDeepLink() {
            const linkField = document.getElementById('generatedLink');
            if (!linkField.value) {
                showError('linkError', 'Please generate a deep link first');
                return;
            }
            
            linkField.select();
            linkField.setSelectionRange(0, 99999); // For mobile devices
            
            try {
                document.execCommand('copy');
                document.getElementById('linkSuccess').textContent = 'Deep link copied to clipboard!';
                document.getElementById('linkSuccess').style.display = 'block';
                hideError('linkError');
            } catch (err) {
                showError('linkError', 'Failed to copy to clipboard');
            }
        }
        
        function clearLinkFields() {
            document.getElementById('internalId').value = '';
            document.getElementById('generatedLink').value = '';
            document.getElementById('tier').selectedIndex = 0;
            document.getElementById('objectType').selectedIndex = 0;
            hideError('linkError');
            document.getElementById('linkSuccess').style.display = 'none';
        }
        
        // Auto-generate link when Internal ID changes
        document.getElementById('internalId').addEventListener('input', function() {
            if (this.value.trim()) {
                generateDeepLink();
            } else {
                document.getElementById('generatedLink').value = '';
                document.getElementById('linkSuccess').style.display = 'none';
            }
        });
        
        // Auto-generate link when tier or object type changes
        document.getElementById('tier').addEventListener('change', function() {
            if (document.getElementById('internalId').value.trim()) {
                generateDeepLink();
            }
        });
        
        document.getElementById('objectType').addEventListener('change', function() {
            if (document.getElementById('internalId').value.trim()) {
                generateDeepLink();
            }
        });
        
        // Load configuration and populate tier dropdown
        async function loadConfiguration() {
            try {
                const response = await fetch('/api/config');
                const config = await response.json();
                
                const tierSelect = document.getElementById('tier');
                tierSelect.innerHTML = '';
                
                // Add options from configuration
                const option1 = document.createElement('option');
                option1.value = config.domains.dev;
                option1.textContent = 'DEV - ' + config.domains.dev;
                tierSelect.appendChild(option1);
                
                const option2 = document.createElement('option');
                option2.value = config.domains.acc;
                option2.textContent = 'ACC - ' + config.domains.acc;
                tierSelect.appendChild(option2);
                
                const option3 = document.createElement('option');
                option3.value = config.domains.prd;
                option3.textContent = 'PRD - ' + config.domains.prd;
                tierSelect.appendChild(option3);
                
            } catch (error) {
                console.error('Failed to load configuration:', error);
                // Fallback to default options
                const tierSelect = document.getElementById('tier');
                tierSelect.innerHTML = '<option value="dev-tenant.crm.ondemand.com">DEV - dev-tenant.crm.ondemand.com</option><option value="acc-tenant.crm.ondemand.com">ACC - acc-tenant.crm.ondemand.com</option><option value="prd-tenant.crm.ondemand.com">PRD - prd-tenant.crm.ondemand.com</option>';
            }
        }
        
        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', loadConfiguration);
    </script>
</body>
</html>`);
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

// Configuration endpoint for frontend
app.get('/api/config', (req, res) => {
  const options = getAddonOptions();
  res.json({
    domains: {
      dev: options.dev_domain,
      acc: options.acc_domain,
      prd: options.prd_domain
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log('Node.js Hello World server listening on port ' + port);
  console.log('Server started at ' + new Date().toISOString());
});