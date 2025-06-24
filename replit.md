# WhatsApp Mention Bot

## Overview

This is a WhatsApp bot application built with Node.js that provides automated mention functionality for WhatsApp groups. The system consists of a backend WhatsApp bot using the whatsapp-web.js library and a web-based dashboard for monitoring and authentication.

## System Architecture

The application follows a simple client-server architecture:

- **Backend Server**: Express.js server that hosts the WhatsApp bot and provides REST API endpoints
- **WhatsApp Bot**: Core bot functionality using whatsapp-web.js library with local authentication
- **Web Dashboard**: HTML/CSS/JavaScript frontend for bot monitoring and QR code authentication
- **Session Management**: Local file-based session storage for WhatsApp authentication

## Key Components

### 1. WhatsApp Bot (bot.js)
- **Purpose**: Core bot functionality and WhatsApp client management
- **Technology**: whatsapp-web.js with LocalAuth strategy
- **Features**:
  - QR code generation for authentication
  - Event handling for connection status
  - Session persistence in local files
  - Activity logging system

### 2. Express Server (server.js)
- **Purpose**: Web server and API endpoint provider
- **Technology**: Express.js 5.1.0
- **Features**:
  - Static file serving for web dashboard
  - REST API endpoints for status and QR code retrieval
  - Graceful shutdown handling
  - Bot instance management

### 3. Web Dashboard (index.html, script.js, style.css)
- **Purpose**: User interface for bot monitoring and authentication
- **Technology**: HTML5, vanilla JavaScript, Bootstrap 5.1.3, Font Awesome
- **Features**:
  - Real-time status monitoring
  - QR code display for WhatsApp authentication
  - Activity log viewer
  - Responsive design

## Data Flow

1. **Bot Initialization**: Server starts and creates WhatsApp bot instance
2. **Authentication**: Bot generates QR code for WhatsApp Web authentication
3. **Status Polling**: Web dashboard polls server every 2 seconds for status updates
4. **Event Handling**: Bot processes WhatsApp events and updates internal state
5. **API Communication**: Server exposes bot status through REST endpoints
6. **User Interaction**: Dashboard displays real-time status and QR codes to users

## External Dependencies

### Core Dependencies
- **whatsapp-web.js**: WhatsApp Web client library for bot functionality
- **express**: Web server framework for API and static file serving
- **qrcode-terminal**: Terminal QR code generation for authentication

### Frontend Dependencies (CDN)
- **Bootstrap 5.1.3**: UI framework for responsive design
- **Font Awesome 6.0.0**: Icon library for enhanced user interface

## Deployment Strategy

The application is configured for Replit deployment with:

- **Runtime**: Node.js 20 on Nix stable-24_05 channel
- **Port**: Configurable via environment variable (default: 5000)
- **Process Management**: Automatic dependency installation and server startup
- **Session Persistence**: Local file system storage for WhatsApp authentication

### Deployment Configuration
- Automatic npm package installation on startup
- Server binds to 0.0.0.0 for external accessibility
- Graceful shutdown handling for SIGINT and SIGTERM signals

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

- June 24, 2025: Added PostgreSQL database with user tracking, group management, and message logging capabilities
- June 24, 2025: Added database statistics display in web interface showing users, groups, messages, and logs count
- June 24, 2025: Enhanced Uptime Robot support with status-aware endpoints (/uptime, /health) that return proper HTTP status codes
- June 24, 2025: Fixed Chrome/Puppeteer compatibility issues with --no-sandbox configuration
- June 24, 2025: Installed system dependencies (libdrm, mesa, gtk3, etc.) for browser functionality
- June 23, 2025: Initial setup