# SAP Tools Addon

A comprehensive SAP tools addon for Home Assistant that provides GUID conversion and deep link generation for SAP ByD objects.

## About

This addon provides essential SAP development and administration tools through a web interface accessible via Home Assistant's ingress system. It's designed for SAP administrators, developers, and consultants who need quick access to GUID conversion and deep link generation for SAP Business ByDesign (ByD) objects.

## Features

- ✅ **GUID Converter**: Convert between standard GUID format (lowercase with dashes) and SAP format (uppercase without dashes)
- ✅ **SAP Deep Link Generator**: Generate direct links to SAP ByD objects
- ✅ **10 Object Types Supported**: Accounts, Contacts, Tickets, Opportunities, Sales Orders, Products, Appointments, Tasks, Sales Quotes, Leads
- ✅ **Configurable Environments**: Set your own SAP tenant domains through Home Assistant UI
- ✅ **Real-time Generation**: Links update automatically as you type
- ✅ **Ingress Support**: Access the web interface directly through Home Assistant
- ✅ **Multi-Architecture**: Supports ARM and x86 architectures
- ✅ **Responsive Design**: Mobile-friendly web interface

## Installation

1. Navigate to **Supervisor** → **Add-on Store** in your Home Assistant interface
2. Add the repository: `https://github.com/packagedeliverer/hassio_generic.git`
3. Find "SAP Tools" in the **Generic Home Assistant Add-ons** repository
4. Click **Install**

## Configuration

Configure your SAP tenant domains in the addon configuration:

```yaml
dev_domain: "your-dev-tenant.crm.ondemand.com"
acc_domain: "your-acc-tenant.crm.ondemand.com"
prd_domain: "your-prd-tenant.crm.ondemand.com"
```

### Configuration Options

- **dev_domain**: Development environment domain
- **acc_domain**: Acceptance environment domain  
- **prd_domain**: Production environment domain

## Usage

1. **Install** the addon from the Add-on Store
2. **Configure** your SAP tenant domains
3. **Start** the addon
4. Click **Open Web UI** or access it from the sidebar

### GUID Converter

- Enter a standard GUID format (lowercase with dashes)
- Automatically converts to SAP format (uppercase without dashes)
- Works bidirectionally - enter either format
- Generate new random GUIDs with the click of a button

### Deep Link Generator

- Select your target environment (DEV/ACC/PRD)
- Choose the SAP object type (Account, Contact, Ticket, etc.)
- Enter the Internal ID of the object
- Get a direct link to open the object in SAP ByD
- Copy the link to clipboard with one click

## Supported SAP Object Types

- **COD_ACCOUNT_TT**: Customer/Vendor Accounts
- **COD_CONTACT_TT**: Business Contacts
- **COD_SRQ_AGENT_TT**: Service Requests/Tickets/Cases
- **COD_OPPORTUNITY_THINGTYPE**: Sales Opportunities
- **COD_SALESORDER_TT**: Sales Orders
- **COD_MATERIAL**: Products/Materials
- **COD_APPOINTMENT**: Calendar Appointments
- **COD_TASK**: Tasks
- **COD_QUOTE_TT**: Sales Quotes
- **COD_MKT_PROSPECT**: Marketing Leads

## API Endpoints

The addon includes API endpoints:

- `GET /` - Main SAP Tools interface
- `GET /health` - Health check endpoint
- `GET /api/info` - Addon information
- `GET /api/config` - Current domain configuration

## Technical Details

### Ingress Integration

- Web interface accessible through Home Assistant ingress
- No external ports exposed
- Authentication handled by Home Assistant
- Integrated within the HA web UI

### Technical Stack

- **Runtime**: Node.js with Express.js
- **Port**: 3000 (internal only)
- **Configuration**: Dynamic loading from Home Assistant options

## Security

- No sensitive data is hardcoded in the repository
- SAP tenant domains are configurable through Home Assistant UI
- All sensitive hostnames have been removed from git history

## Support

This addon is designed for SAP professionals working with Business ByDesign environments.

## License

This addon is provided under the MIT License.