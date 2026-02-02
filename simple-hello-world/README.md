# Simple Hello World Addon

A simple "Hello World" addon for Home Assistant that demonstrates ingress functionality.

## About

This addon serves a basic web page accessible through Home Assistant's ingress system. It's designed as a learning example for developers who want to understand how to create addons with web interfaces that integrate seamlessly with Home Assistant.

## Features

- ✅ **Ingress Support**: Access the web interface directly through Home Assistant
- ✅ **Lightweight**: Based on Alpine Linux with Nginx
- ✅ **Multi-Architecture**: Supports ARM and x86 architectures
- ✅ **No External Ports**: Uses Home Assistant's ingress proxy
- ✅ **Responsive Design**: Mobile-friendly web interface

## Installation

1. Navigate to **Supervisor** → **Add-on Store** in your Home Assistant interface
2. Find "Simple Hello World" in the **Local add-ons** section
3. Click **Install**

## Configuration

This addon requires no configuration. It works out of the box with default settings.

## Usage

1. **Install** the addon from the Add-on Store
2. **Start** the addon
3. Click **Open Web UI** or access it from the sidebar
4. You'll see a "Hello World" page with information about the addon

## How It Works

### Ingress Integration

This addon uses Home Assistant's ingress feature, which means:

- The web interface is accessible at `/api/hassio_ingress/<token>/`
- No external ports are exposed
- Authentication is handled by Home Assistant
- The interface appears integrated within the HA web UI

### Technical Stack

- **Base Image**: Home Assistant base image (Alpine Linux)
- **Web Server**: Nginx
- **Port**: 8080 (internal only)
- **Files**: Static HTML/CSS/JS served from `/var/www`

## Support

This is a demonstration addon for educational purposes.

## License

This addon is provided as-is for educational purposes.