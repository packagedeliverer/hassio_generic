const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files from public directory if it exists
app.use(express.static('public'));

// Read addon options from Home Assistant
function getAddonOptions() {
  const possiblePaths = [
    '/data/options.json',
    '/config/options.json',
    './options.json',
    '/share/options.json'
  ];

  for (const optionsPath of possiblePaths) {
    try {
      if (fs.existsSync(optionsPath)) {
        const optionsContent = fs.readFileSync(optionsPath, 'utf8');
        const options = JSON.parse(optionsContent);
        if (options.dev_domain && options.acc_domain && options.prd_domain) {
          console.log('Using configured options from:', optionsPath);
          return options;
        }
      }
    } catch (error) {
      console.log('Error reading options from', optionsPath, ':', error.message);
    }
  }

  // Environment variable fallback
  if (process.env.DEV_DOMAIN && process.env.ACC_DOMAIN && process.env.PRD_DOMAIN) {
    console.log('Using domains from environment variables');
    return {
      dev_domain: process.env.DEV_DOMAIN,
      acc_domain: process.env.ACC_DOMAIN,
      prd_domain: process.env.PRD_DOMAIN,
      crm_dev_domain: process.env.CRM_DEV_DOMAIN || 'crm-dev.example.com:8443',
      crm_acc_domain: process.env.CRM_ACC_DOMAIN || 'crm-acc.example.com:8443',
      crm_prd_domain: process.env.CRM_PRD_DOMAIN || 'crm-prd.example.com:8443',
      c4cv2_dev_domain: process.env.C4CV2_DEV_DOMAIN || 'dev-tenant.de1.test.crm.cloud.sap',
      c4cv2_acc_domain: process.env.C4CV2_ACC_DOMAIN || 'acc-tenant.de1.test.crm.cloud.sap',
      c4cv2_prd_domain: process.env.C4CV2_PRD_DOMAIN || 'prd-tenant.de1.crm.cloud.sap',
      crm_roles: []
    };
  }

  // Defaults
  console.log('Using default options - no configuration found');
  return {
    dev_domain: 'dev-tenant.crm.ondemand.com',
    acc_domain: 'acc-tenant.crm.ondemand.com',
    prd_domain: 'prd-tenant.crm.ondemand.com',
    crm_dev_domain: 'crm-dev.example.com:8443',
    crm_acc_domain: 'crm-acc.example.com:8443',
    crm_prd_domain: 'crm-prd.example.com:8443',
    c4cv2_dev_domain: 'dev-tenant.de1.test.crm.cloud.sap',
    c4cv2_acc_domain: 'acc-tenant.de1.test.crm.cloud.sap',
    c4cv2_prd_domain: 'prd-tenant.de1.crm.cloud.sap',
    crm_roles: []
  };
}

// ─── Main page ────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  const currentTime = new Date().toLocaleString();

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAP Tools</title>
    <style>
        * { box-sizing: border-box; }
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
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-width: 900px;
            margin: 0 auto;
        }
        h1 {
            color: #0f4c75;
            font-size: 1.9em;
            text-align: center;
            margin: 0 0 6px 0;
        }
        .subtitle {
            color: #666;
            font-size: 1em;
            text-align: center;
            margin: 0 0 24px 0;
        }
        .section {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 24px;
            margin: 16px 0;
        }
        .field-group { margin-bottom: 18px; }
        label {
            display: block;
            font-weight: 600;
            color: #0f4c75;
            margin-bottom: 6px;
            font-size: 0.95em;
        }
        input[type="text"], select, textarea {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 0.95em;
            transition: border-color 0.2s;
        }
        input[type="text"]:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #3282b8;
        }
        .mono { font-family: 'Courier New', monospace; }
        .hint { font-size: 0.82em; color: #777; margin-top: 4px; }
        .error { color: #c62828; font-size: 0.85em; margin-top: 4px; display: none; }
        .success { color: #2e7d32; font-size: 0.85em; margin-top: 4px; display: none; }
        .buttons { text-align: center; margin: 20px 0 8px; }
        button {
            background: #3282b8;
            color: white;
            border: none;
            padding: 10px 22px;
            border-radius: 8px;
            font-size: 0.95em;
            cursor: pointer;
            margin: 4px 6px;
            transition: background-color 0.2s;
        }
        button:hover { background: #0f4c75; }
        button.btn-green { background: #388e3c; }
        button.btn-green:hover { background: #1b5e20; }
        button.btn-grey { background: #757575; }
        button.btn-grey:hover { background: #424242; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 580px) { .row2 { grid-template-columns: 1fr; } }
        .divider { border: none; border-top: 2px solid #e0e0e0; margin: 36px 0 28px; }
        /* Tab bar */
        .tab-bar { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .tab-btn {
            background: #e0e0e0;
            color: #333;
            border: none;
            padding: 8px 18px;
            border-radius: 6px;
            font-size: 0.9em;
            cursor: pointer;
            margin: 0;
            transition: background-color 0.2s;
        }
        .tab-btn.active { background: #3282b8; color: white; }
        .tab-btn:hover { background: #0f4c75; color: white; }
        .tab-panel { display: none; }
        .tab-panel.active { display: block; }
        /* Checkbox row */
        .check-row {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-top: 6px;
        }
        .check-row label {
            font-weight: normal;
            display: flex;
            align-items: center;
            gap: 6px;
            color: #333;
            cursor: pointer;
        }
        .inline-pair {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 10px;
        }
        .inline-pair label { font-weight: normal; white-space: nowrap; color: #333; margin: 0; }
        .inline-pair input, .inline-pair select { width: auto; padding: 8px 10px; }
    </style>
</head>
<body>
<div class="container">

<!-- ═══════════════════════════════════════════════════════════
     GUID CONVERTER
═══════════════════════════════════════════════════════════ -->
<h1>💼 GUID Converter</h1>
<p class="subtitle">Convert between Standard and SAP GUID formats</p>
<div class="section">
    <div class="field-group">
        <label for="stdGuid">Standard format (lowercase with dashes):</label>
        <input type="text" id="stdGuid" class="mono" placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890">
        <div class="hint">xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</div>
        <div id="stdGuidErr" class="error"></div>
    </div>
    <div class="field-group">
        <label for="sapGuid">SAP format (uppercase without dashes):</label>
        <input type="text" id="sapGuid" class="mono" placeholder="A1B2C3D4E5F67890ABCDEF1234567890">
        <div class="hint">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (32 chars)</div>
        <div id="sapGuidErr" class="error"></div>
    </div>
    <div class="buttons">
        <button onclick="genNewGuid()">🎲 Generate New GUID</button>
        <button class="btn-grey" onclick="clearGuid()">🗑️ Clear</button>
    </div>
</div>

<hr class="divider">

<!-- ═══════════════════════════════════════════════════════════
     C4C v1 (ByD) DEEP LINK
═══════════════════════════════════════════════════════════ -->
<h1>🔗 C4C v1 (ByD) Deep Link</h1>
<p class="subtitle">Generate direct links to SAP ByD / C4C v1 objects</p>
<div class="section">
    <div class="row2">
        <div class="field-group">
            <label for="bydTier">Environment:</label>
            <select id="bydTier"></select>
        </div>
        <div class="field-group">
            <label for="bydObjType">Object Type:</label>
            <select id="bydObjType">
                <option value="COD_ACCOUNT_TT">Accounts (COD_ACCOUNT_TT)</option>
                <option value="COD_CONTACT_TT">Contact (COD_CONTACT_TT)</option>
                <option value="COD_SRQ_AGENT_TT">Tickets / Service Requests (COD_SRQ_AGENT_TT)</option>
                <option value="COD_OPPORTUNITY_THINGTYPE">Opportunities (COD_OPPORTUNITY_THINGTYPE)</option>
                <option value="COD_SALESORDER_TT">Sales Orders (COD_SALESORDER_TT)</option>
                <option value="COD_MATERIAL">Products (COD_MATERIAL)</option>
                <option value="COD_APPOINTMENT">Appointments (COD_APPOINTMENT)</option>
                <option value="COD_TASK">Tasks (COD_TASK)</option>
                <option value="COD_QUOTE_TT">Sales Quotes (COD_QUOTE_TT)</option>
                <option value="COD_MKT_PROSPECT">Leads (COD_MKT_PROSPECT)</option>
            </select>
        </div>
    </div>
    <div class="field-group">
        <label for="bydId">Internal ID:</label>
        <input type="text" id="bydId" placeholder="e.g., 1022241, 3561, GRONOS_WIND_ONSHORE">
        <div class="hint">The Internal ID of the object to link to</div>
        <div id="bydErr" class="error"></div>
    </div>
    <div class="buttons">
        <button onclick="genBydLink()">🔗 Generate</button>
        <button onclick="copyField('bydLink','bydOk','bydErr')">📋 Copy</button>
        <button class="btn-green" onclick="openField('bydLink','bydErr')">↗ Open</button>
        <button class="btn-grey" onclick="clearByd()">🗑️ Clear</button>
    </div>
    <div class="field-group">
        <label for="bydLink">Generated link:</label>
        <textarea id="bydLink" class="mono" readonly style="min-height:68px;resize:vertical;"></textarea>
        <div id="bydOk" class="success"></div>
    </div>
</div>

<hr class="divider">

<!-- ═══════════════════════════════════════════════════════════
     CRM DEEP LINK
═══════════════════════════════════════════════════════════ -->
<h1>🏢 CRM Deep Link</h1>
<p class="subtitle">Generate direct links to SAP CRM objects</p>
<div class="section">
    <div class="tab-bar">
        <button class="tab-btn active" id="crmTabBtnDesc" onclick="switchCrmTab('desc')">By Description / Property</button>
        <button class="tab-btn" id="crmTabBtnGuid" onclick="switchCrmTab('guid')">By GUID</button>
    </div>

    <!-- ── Description / Property ── -->
    <div id="crmPanelDesc" class="tab-panel active">
        <div class="row2">
            <div class="field-group">
                <label for="crmDescTier">Environment:</label>
                <select id="crmDescTier"></select>
            </div>
            <div class="field-group">
                <label for="crmDescAction">Action:</label>
                <select id="crmDescAction">
                    <option value="B">B – Display</option>
                    <option value="C">C – Edit</option>
                    <option value="A">A – Search</option>
                    <option value="D">D – Create</option>
                </select>
            </div>
        </div>
        <div class="row2">
            <div class="field-group">
                <label for="crmDescObjType">Navigation Object Type:</label>
                <select id="crmDescObjType">
                    <option value="BT111_OPPT">Opportunity / Study (BT111_OPPT)</option>
                    <option value="BT126_APPT">Appointment (BT126_APPT)</option>
                    <option value="BT126_CALL">Phone Call (BT126_CALL)</option>
                    <option value="BP_ACCOUNT">Account (BP_ACCOUNT)</option>
                    <option value="BP_CONTACT">Contact (BP_CONTACT)</option>
                    <option value="BT112_SC">Contract (BT112_SC)</option>
                </select>
            </div>
            <div class="field-group">
                <label for="crmDescKeyName">Key Name (Property):</label>
                <select id="crmDescKeyName">
                    <option value="DESCRIPTION">DESCRIPTION (study ref / name)</option>
                    <option value="OBJECT_ID">OBJECT_ID</option>
                    <option value="CP_KEY">CP_KEY (contact: accountGUID + contactGUID)</option>
                </select>
            </div>
        </div>
        <div class="row2">
            <div class="field-group">
                <label for="crmDescValue">Property Value:</label>
                <input type="text" id="crmDescValue" placeholder="e.g., EOS-0001">
                <div class="hint">Value of the selected key property</div>
                <div id="crmDescErr" class="error"></div>
            </div>
            <div class="field-group">
                <label for="crmDescRole">Role ID (optional):</label>
                <select id="crmDescRole">
                    <option value="">— none —</option>
                </select>
                <div class="hint">Configured in addon options (saprole parameter)</div>
            </div>
        </div>
        <div class="buttons">
            <button onclick="genCrmDescLink()">🔗 Generate</button>
            <button onclick="copyField('crmDescLink','crmDescOk','crmDescErr')">📋 Copy</button>
            <button class="btn-green" onclick="openField('crmDescLink','crmDescErr')">↗ Open</button>
            <button class="btn-grey" onclick="clearCrmDesc()">🗑️ Clear</button>
        </div>
        <div class="field-group">
            <label for="crmDescLink">Generated link:</label>
            <textarea id="crmDescLink" class="mono" readonly style="min-height:80px;resize:vertical;"></textarea>
            <div id="crmDescOk" class="success"></div>
        </div>
    </div>

    <!-- ── GUID ── -->
    <div id="crmPanelGuid" class="tab-panel">
        <div class="row2">
            <div class="field-group">
                <label for="crmGuidTier">Environment:</label>
                <select id="crmGuidTier"></select>
            </div>
            <div class="field-group">
                <label for="crmGuidAction">Action:</label>
                <select id="crmGuidAction">
                    <option value="B">B – Display</option>
                    <option value="C">C – Edit</option>
                    <option value="A">A – Search</option>
                </select>
            </div>
        </div>
        <div class="row2">
            <div class="field-group">
                <label for="crmGuidObjType">Object Type ID:</label>
                <select id="crmGuidObjType">
                    <option value="BUS2000111">Study (BUS2000111)</option>
                    <option value="BUS2000115">REA (BUS2000115)</option>
                    <option value="BUS2000126">Change Request (BUS2000126)</option>
                    <option value="BUS2000125">Task (BUS2000125)</option>
                    <option value="BUS2000116">Annex 2/3 / Contact Annex Renewal (BUS2000116)</option>
                    <option value="BUS2000112">CC Contract (BUS2000112)</option>
                </select>
            </div>
            <div class="field-group">
                <label for="crmGuidRole">Role ID (optional):</label>
                <select id="crmGuidRole">
                    <option value="">— none —</option>
                </select>
                <div class="hint">Configured in addon options (saprole parameter)</div>
            </div>
        </div>
        <div class="field-group">
            <label for="crmGuidValue">Object GUID (32 hex chars, no dashes):</label>
            <input type="text" id="crmGuidValue" class="mono" placeholder="A1B2C3D4E5F67890ABCDEF1234567890" maxlength="32">
            <div class="hint">SAP GUIDs have no dashes. Use the GUID Converter above if needed.</div>
            <div id="crmGuidErr" class="error"></div>
        </div>
        <div class="buttons">
            <button onclick="genCrmGuidLink()">🔗 Generate</button>
            <button onclick="copyField('crmGuidLink','crmGuidOk','crmGuidErr')">📋 Copy</button>
            <button class="btn-green" onclick="openField('crmGuidLink','crmGuidErr')">↗ Open</button>
            <button class="btn-grey" onclick="clearCrmGuid()">🗑️ Clear</button>
        </div>
        <div class="field-group">
            <label for="crmGuidLink">Generated link:</label>
            <textarea id="crmGuidLink" class="mono" readonly style="min-height:80px;resize:vertical;"></textarea>
            <div id="crmGuidOk" class="success"></div>
        </div>
    </div>
</div>

<hr class="divider">

<!-- ═══════════════════════════════════════════════════════════
     C4C v2 DEEP LINK
═══════════════════════════════════════════════════════════ -->
<h1>☁️ C4C v2 Deep Link</h1>
<p class="subtitle">Generate direct links to SAP C4C v2 (cloud.sap) objects</p>
<div class="section">
    <div class="row2">
        <div class="field-group">
            <label for="v2Tier">Environment:</label>
            <select id="v2Tier"></select>
        </div>
        <div class="field-group">
            <label for="v2NavType">Navigation Type:</label>
            <select id="v2NavType" onchange="v2ToggleIdFields()">
                <option value="detail">Detail view</option>
                <option value="list">List view</option>
            </select>
        </div>
    </div>
    <div class="row2">
        <div class="field-group">
            <label for="v2ObjType">Object Type:</label>
            <select id="v2ObjType">
                <option value="mdaccount">Account (mdaccount)</option>
                <option value="mdcontact">Contact (mdcontact)</option>
                <option value="case">Case / Service Request (case)</option>
                <option value="mdemployee">Employee (mdemployee)</option>
                <option value="salesorder">Sales Order (salesorder)</option>
                <option value="salesquote">Sales Quote (salesquote)</option>
                <option value="lead">Lead (lead)</option>
                <option value="opportunity">Opportunity (opportunity)</option>
                <option value="appointment">Appointment (appointment)</option>
                <option value="product">Product (product)</option>
            </select>
        </div>
        <div class="field-group" id="v2IdTypeGroup">
            <label for="v2IdType">ID Type:</label>
            <select id="v2IdType" onchange="v2ToggleIdFields()">
                <option value="displayId">Display ID (human-readable)</option>
                <option value="nodeid">Node ID (GUID with dashes)</option>
            </select>
        </div>
    </div>
    <div class="field-group" id="v2IdValueGroup">
        <label for="v2IdValue">ID Value:</label>
        <input type="text" id="v2IdValue" class="mono" placeholder="e.g., 1000360  or  11efe390-9393-8e4e-afdb-812509020a00">
        <div class="hint" id="v2IdHint">Display ID: plain number. Node ID: GUID with dashes (lowercase).</div>
        <div id="v2Err" class="error"></div>
    </div>
    <!-- Optional parameters -->
    <div class="field-group">
        <label>Optional URL parameters:</label>
        <div class="check-row">
            <label><input type="checkbox" id="v2AuthSso" checked> auth=sso</label>
            <label><input type="checkbox" id="v2NoHeader"> ui-header=false</label>
            <label><input type="checkbox" id="v2NoTabs"> ui-tabs=false</label>
        </div>
        <div class="inline-pair">
            <label for="v2Lang">ui-language:</label>
            <input type="text" id="v2Lang" placeholder="e.g., en, de" style="width:110px;">
            <label for="v2Theme" style="margin-left:12px;">ui-theme:</label>
            <select id="v2Theme" style="width:auto;">
                <option value="">— default —</option>
                <option value="horizon">horizon</option>
                <option value="sap_horizon_dark">sap_horizon_dark</option>
            </select>
        </div>
    </div>
    <div class="buttons">
        <button onclick="genV2Link()">🔗 Generate</button>
        <button onclick="copyField('v2Link','v2Ok','v2Err')">📋 Copy</button>
        <button class="btn-green" onclick="openField('v2Link','v2Err')">↗ Open</button>
        <button class="btn-grey" onclick="clearV2()">🗑️ Clear</button>
    </div>
    <div class="field-group">
        <label for="v2Link">Generated link:</label>
        <textarea id="v2Link" class="mono" readonly style="min-height:68px;resize:vertical;"></textarea>
        <div id="v2Ok" class="success"></div>
    </div>
</div>

<div style="text-align:center;color:#999;font-size:0.82em;margin-top:28px;">
    Last updated: ${currentTime}
</div>
</div><!-- /container -->

<script>
// ─── Shared helpers ────────────────

function showErr(id, msg) {
    var el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = 'block';
}
function hideErr(id) { document.getElementById(id).style.display = 'none'; }
function showOk(id, msg) {
    var el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = 'block';
}
function hideOk(id) { document.getElementById(id).style.display = 'none'; }

function copyField(fieldId, okId, errId) {
    var field = document.getElementById(fieldId);
    if (!field.value) { showErr(errId, 'Generate a link first.'); return; }
    hideErr(errId);
    navigator.clipboard.writeText(field.value).then(function() {
        showOk(okId, 'Copied to clipboard!');
    }).catch(function() {
        field.select();
        document.execCommand('copy');
        showOk(okId, 'Copied to clipboard!');
    });
}

function openField(fieldId, errId) {
    var field = document.getElementById(fieldId);
    if (!field.value) { showErr(errId, 'Generate a link first.'); return; }
    hideErr(errId);
    window.open(field.value, '_blank');
}

function addTierOptions(selectId, domains) {
    var sel = document.getElementById(selectId);
    sel.innerHTML = '';
    [['DEV', domains.dev], ['ACC', domains.acc], ['PRD', domains.prd]].forEach(function(pair) {
        var opt = document.createElement('option');
        opt.value = pair[1];
        opt.textContent = pair[0] + ' - ' + pair[1];
        sel.appendChild(opt);
    });
}

function addRoleOptions(selectId, roles) {
    var sel = document.getElementById(selectId);
    while (sel.options.length > 1) sel.remove(1);
    (roles || []).forEach(function(r) {
        var opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = r.id + (r.label ? ' (' + r.label + ')' : '');
        sel.appendChild(opt);
    });
}

// ─── GUID Converter ────────────────

function isStdGuid(v) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v); }
function isSapGuid(v) { return /^[0-9A-Fa-f]{32}$/.test(v); }
function stdToSap(v) { return v.replace(/-/g, '').toUpperCase(); }
function sapToStd(v) {
    var c = v.toLowerCase();
    return c.slice(0,8)+'-'+c.slice(8,12)+'-'+c.slice(12,16)+'-'+c.slice(16,20)+'-'+c.slice(20);
}
function makeGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c=='x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

document.getElementById('stdGuid').addEventListener('input', function() {
    var v = this.value.trim();
    hideErr('stdGuidErr'); hideErr('sapGuidErr');
    if (!v) { document.getElementById('sapGuid').value = ''; return; }
    if (isStdGuid(v)) { document.getElementById('sapGuid').value = stdToSap(v); }
    else { showErr('stdGuidErr', 'Invalid standard GUID format'); }
});
document.getElementById('sapGuid').addEventListener('input', function() {
    var v = this.value.trim();
    hideErr('stdGuidErr'); hideErr('sapGuidErr');
    if (!v) { document.getElementById('stdGuid').value = ''; return; }
    if (isSapGuid(v)) { document.getElementById('stdGuid').value = sapToStd(v); }
    else { showErr('sapGuidErr', 'Invalid SAP GUID (32 hex chars)'); }
});
function genNewGuid() {
    var g = makeGuid();
    document.getElementById('stdGuid').value = g;
    document.getElementById('sapGuid').value = stdToSap(g);
    hideErr('stdGuidErr'); hideErr('sapGuidErr');
}
function clearGuid() {
    document.getElementById('stdGuid').value = '';
    document.getElementById('sapGuid').value = '';
    hideErr('stdGuidErr'); hideErr('sapGuidErr');
}

// ─── C4C v1 (ByD) ────────────────

function genBydLink() {
    var tier = document.getElementById('bydTier').value;
    var objType = document.getElementById('bydObjType').value;
    var id = document.getElementById('bydId').value.trim();
    hideErr('bydErr'); hideOk('bydOk');
    if (!id) { showErr('bydErr', 'Please enter an Internal ID'); return; }
    var params = 'bo_ns=http%3A%2F%2Fsap.com%2FthingTypes&bo=COD_GENERIC&node=Root&operation=OnExtInspect'
        + '&param.InternalID=' + encodeURIComponent(id)
        + '&param.Type=' + encodeURIComponent(objType)
        + '&sapbyd-agent=TAB';
    document.getElementById('bydLink').value = 'https://' + tier + '/sap/public/byd/runtime?' + params;
    showOk('bydOk', 'Link generated!');
}
function clearByd() {
    document.getElementById('bydId').value = '';
    document.getElementById('bydLink').value = '';
    hideErr('bydErr'); hideOk('bydOk');
}
document.getElementById('bydId').addEventListener('input', function() {
    if (this.value.trim()) genBydLink();
    else { document.getElementById('bydLink').value = ''; hideOk('bydOk'); }
});
document.getElementById('bydTier').addEventListener('change', function() {
    if (document.getElementById('bydId').value.trim()) genBydLink();
});
document.getElementById('bydObjType').addEventListener('change', function() {
    if (document.getElementById('bydId').value.trim()) genBydLink();
});

// ─── CRM ────────────────

function switchCrmTab(tab) {
    document.getElementById('crmPanelDesc').classList.toggle('active', tab === 'desc');
    document.getElementById('crmPanelGuid').classList.toggle('active', tab === 'guid');
    document.getElementById('crmTabBtnDesc').classList.toggle('active', tab === 'desc');
    document.getElementById('crmTabBtnGuid').classList.toggle('active', tab === 'guid');
}

function buildCrmBase(domain) {
    return 'https://' + domain
        + '/sap/bc/bsp/sap/crm_ui_start/default.htm'
        + '?sap-client=100&sap-language=EN&sap-domainRelax=min';
}

function genCrmDescLink() {
    var tier    = document.getElementById('crmDescTier').value;
    var action  = document.getElementById('crmDescAction').value;
    var objType = document.getElementById('crmDescObjType').value;
    var keyName = document.getElementById('crmDescKeyName').value;
    var value   = document.getElementById('crmDescValue').value.trim();
    var role    = document.getElementById('crmDescRole').value;
    hideErr('crmDescErr'); hideOk('crmDescOk');
    if (!value) { showErr('crmDescErr', 'Please enter a property value'); return; }
    var url = buildCrmBase(tier)
        + '&crm-object-value='   + encodeURIComponent(value)
        + '&crm-object-action='  + encodeURIComponent(action)
        + '&crm-object-keyname=' + encodeURIComponent(keyName)
        + '&crm-object-type='    + encodeURIComponent(objType);
    if (role) url += '&saprole=' + encodeURIComponent(role);
    document.getElementById('crmDescLink').value = url;
    showOk('crmDescOk', 'Link generated!');
}
function clearCrmDesc() {
    document.getElementById('crmDescValue').value = '';
    document.getElementById('crmDescLink').value = '';
    hideErr('crmDescErr'); hideOk('crmDescOk');
}
document.getElementById('crmDescValue').addEventListener('input', function() {
    if (this.value.trim()) genCrmDescLink();
    else { document.getElementById('crmDescLink').value = ''; hideOk('crmDescOk'); }
});
['crmDescTier','crmDescAction','crmDescObjType','crmDescKeyName','crmDescRole'].forEach(function(id) {
    document.getElementById(id).addEventListener('change', function() {
        if (document.getElementById('crmDescValue').value.trim()) genCrmDescLink();
    });
});

function genCrmGuidLink() {
    var tier    = document.getElementById('crmGuidTier').value;
    var action  = document.getElementById('crmGuidAction').value;
    var objType = document.getElementById('crmGuidObjType').value;
    var guid    = document.getElementById('crmGuidValue').value.trim().toUpperCase();
    var role    = document.getElementById('crmGuidRole').value;
    hideErr('crmGuidErr'); hideOk('crmGuidOk');
    if (!guid) { showErr('crmGuidErr', 'Please enter a GUID'); return; }
    if (!/^[0-9A-F]{32}$/.test(guid)) {
        showErr('crmGuidErr', 'GUID must be 32 hex characters without dashes'); return;
    }
    var url = buildCrmBase(tier)
        + '&crm-object-action='        + encodeURIComponent(action)
        + '&crm-object-borobjecttype=' + encodeURIComponent(objType)
        + '&crm-object-borobjectkey='  + encodeURIComponent(guid);
    if (role) url += '&saprole=' + encodeURIComponent(role);
    document.getElementById('crmGuidLink').value = url;
    showOk('crmGuidOk', 'Link generated!');
}
function clearCrmGuid() {
    document.getElementById('crmGuidValue').value = '';
    document.getElementById('crmGuidLink').value = '';
    hideErr('crmGuidErr'); hideOk('crmGuidOk');
}
document.getElementById('crmGuidValue').addEventListener('input', function() {
    if (this.value.trim()) genCrmGuidLink();
    else { document.getElementById('crmGuidLink').value = ''; hideOk('crmGuidOk'); }
});
['crmGuidTier','crmGuidAction','crmGuidObjType','crmGuidRole'].forEach(function(id) {
    document.getElementById(id).addEventListener('change', function() {
        if (document.getElementById('crmGuidValue').value.trim()) genCrmGuidLink();
    });
});

// ─── C4C v2 ────────────────

function v2ToggleIdFields() {
    var navType = document.getElementById('v2NavType').value;
    var idType  = document.getElementById('v2IdType').value;
    var showId  = (navType === 'detail');
    document.getElementById('v2IdTypeGroup').style.display  = showId ? '' : 'none';
    document.getElementById('v2IdValueGroup').style.display = showId ? '' : 'none';
    if (showId) {
        document.getElementById('v2IdHint').textContent = idType === 'displayId'
            ? 'Display ID: plain human-readable number (e.g., 1000360)'
            : 'Node ID: GUID with dashes, lowercase (e.g., 11efe390-9393-8e4e-afdb-812509020a00)';
        document.getElementById('v2IdValue').placeholder = idType === 'displayId'
            ? 'e.g., 1000360'
            : 'e.g., 11efe390-9393-8e4e-afdb-812509020a00';
    }
}

function genV2Link() {
    var tier    = document.getElementById('v2Tier').value;
    var navType = document.getElementById('v2NavType').value;
    var objType = document.getElementById('v2ObjType').value;
    hideErr('v2Err'); hideOk('v2Ok');
    var params = [];
    if (document.getElementById('v2AuthSso').checked)  params.push('auth=sso');
    if (document.getElementById('v2NoHeader').checked) params.push('ui-header=false');
    if (document.getElementById('v2NoTabs').checked)   params.push('ui-tabs=false');
    var lang  = document.getElementById('v2Lang').value.trim();
    var theme = document.getElementById('v2Theme').value;
    if (lang)  params.push('ui-language=' + encodeURIComponent(lang));
    if (theme) params.push('ui-theme='    + encodeURIComponent(theme));
    var url;
    if (navType === 'list') {
        url = 'https://' + tier + '/go/list/' + objType;
        if (params.length) url += '?' + params.join('&');
    } else {
        var idType = document.getElementById('v2IdType').value;
        var idVal  = document.getElementById('v2IdValue').value.trim();
        if (!idVal) { showErr('v2Err', 'Please enter an ID value'); return; }
        params.push(idType + '=' + encodeURIComponent(idVal));
        url = 'https://' + tier + '/go/detail/' + objType + '?' + params.join('&');
    }
    document.getElementById('v2Link').value = url;
    showOk('v2Ok', 'Link generated!');
}
function clearV2() {
    document.getElementById('v2IdValue').value = '';
    document.getElementById('v2Link').value = '';
    hideErr('v2Err'); hideOk('v2Ok');
}
document.getElementById('v2IdValue').addEventListener('input', function() {
    if (this.value.trim()) genV2Link();
    else { document.getElementById('v2Link').value = ''; hideOk('v2Ok'); }
});
['v2Tier','v2NavType','v2ObjType','v2IdType','v2AuthSso','v2NoHeader','v2NoTabs','v2Theme'].forEach(function(id) {
    document.getElementById(id).addEventListener('change', function() { genV2Link(); });
});

// ─── Load configuration ────────────────

async function loadConfiguration() {
    try {
        var response = await fetch('./api/config');
        var cfg = await response.json();
        addTierOptions('bydTier',     cfg.domains.byd);
        addTierOptions('crmDescTier', cfg.domains.crm);
        addTierOptions('crmGuidTier', cfg.domains.crm);
        addTierOptions('v2Tier',      cfg.domains.c4cv2);
        addRoleOptions('crmDescRole', cfg.crm_roles);
        addRoleOptions('crmGuidRole', cfg.crm_roles);
        v2ToggleIdFields();
    } catch (e) {
        console.error('Failed to load configuration:', e);
        document.getElementById('bydTier').innerHTML =
            '<option value="dev-tenant.crm.ondemand.com">DEV - dev-tenant.crm.ondemand.com</option>';
        ['crmDescTier','crmGuidTier'].forEach(function(id) {
            document.getElementById(id).innerHTML =
                '<option value="crm-dev.example.com:8443">DEV - crm-dev.example.com:8443</option>';
        });
        document.getElementById('v2Tier').innerHTML =
            '<option value="dev-tenant.de1.test.crm.cloud.sap">DEV - dev-tenant.de1.test.crm.cloud.sap</option>';
        v2ToggleIdFields();
    }
}

document.addEventListener('DOMContentLoaded', loadConfiguration);
</script>
</body>
</html>`);
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// ─── API info ─────────────────────────────────────────────────────────────────
app.get('/api/info', (req, res) => {
  res.json({ name: 'SAP Tools Addon', version: '4.4.0', runtime: 'Node.js', framework: 'Express.js', timestamp: new Date().toISOString() });
});

// ─── Configuration endpoint ───────────────────────────────────────────────────
app.get('/api/config', (req, res) => {
  const options = getAddonOptions();
  res.json({
    domains: {
      byd: {
        dev: options.dev_domain,
        acc: options.acc_domain,
        prd: options.prd_domain
      },
      crm: {
        dev: options.crm_dev_domain  || 'crm-dev.example.com:8443',
        acc: options.crm_acc_domain  || 'crm-acc.example.com:8443',
        prd: options.crm_prd_domain  || 'crm-prd.example.com:8443'
      },
      c4cv2: {
        dev: options.c4cv2_dev_domain || 'dev-tenant.de1.test.crm.cloud.sap',
        acc: options.c4cv2_acc_domain || 'acc-tenant.de1.test.crm.cloud.sap',
        prd: options.c4cv2_prd_domain || 'prd-tenant.de1.crm.cloud.sap'
      }
    },
    crm_roles: (options.crm_roles || []).map(function(r) {
      var idx = r.indexOf(':');
      if (idx === -1) return { id: r, label: r };
      return { id: r.slice(0, idx), label: r.slice(idx + 1) };
    })
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(port, '0.0.0.0', () => {
  console.log('SAP Tools server listening on port ' + port);
  console.log('Server started at ' + new Date().toISOString());
  const opts = getAddonOptions();
  console.log('Configuration:', JSON.stringify(opts, null, 2));
});
