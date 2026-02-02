# Node.js Hello World Addon

A Node.js "Hello World" addon for Home Assistant that demonstrates ingress functionality with Express.js.

## About

This addon serves a beautiful web page using Node.js and Express.js, accessible through Home Assistant's ingress system. It's designed as a learning example for developers who want to understand how to create Node.js-based addons with web interfaces that integrate seamlessly with Home Assistant.

## Features

- ✅ **Node.js & Express**: Modern JavaScript runtime with Express framework
- ✅ **Ingress Support**: Access the web interface directly through Home Assistant
- ✅ **RESTful API**: Includes example API endpoints (/health, /api/info)
- ✅ **Multi-Architecture**: Supports ARM and x86 architectures
- ✅ **No External Ports**: Uses Home Assistant's ingress proxy
- ✅ **Responsive Design**: Mobile-friendly web interface

## Installation

1. Navigate to **Supervisor** → **Add-on Store** in your Home Assistant interface
2. Find "Node.js Hello World" in the **Generic Home Assistant Add-ons** repository
3. Click **Install**

## Configuration

This addon requires no configuration. It works out of the box with default settings.

## Usage

1. **Install** the addon from the Add-on Store
2. **Start** the addon
3. Click **Open Web UI** or access it from the sidebar
4. You'll see a "Hello World" page with Node.js branding

## API Endpoints

The addon includes example API endpoints:

- `GET /` - Main Hello World page
- `GET /health` - Health check endpoint (returns JSON)
- `GET /api/info` - Addon information endpoint (returns JSON)

## How It Works

### Ingress Integration

This addon uses Home Assistant's ingress feature, which means:

- The web interface is accessible at `/api/hassio_ingress/<token>/`
- No external ports are exposed
- Authentication is handled by Home Assistant
- The interface appears integrated within the HA web UI

### Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Port**: 3000 (internal only)
- **Package Manager**: npm

## Development

### Local Testing

You can test the Node.js server locally:

```bash
cd nodejs-hello-world
npm install
npm start
```

Then visit `http://localhost:3000`

### Customizing

- Edit `server.js` to modify routes and functionality
- Update `package.json` to add new dependencies
- Modify the HTML template in the main route for UI changes

## Support

This is a demonstration addon for educational purposes.

## License

This addon is provided as-is for educational purposes under the MIT License.