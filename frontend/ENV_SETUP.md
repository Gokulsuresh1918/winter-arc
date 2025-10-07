# Environment Variables Setup

## 📋 Overview

This frontend application uses environment variables to configure the backend API endpoint and other settings.

## 🚀 Setup Instructions

### 1. Create `.env` file

Copy the `env.example` file and rename it to `.env`:

**Windows (Command Prompt):**
```cmd
copy env.example .env
```

**Windows (PowerShell):**
```powershell
Copy-Item env.example .env
```

**Linux/Mac:**
```bash
cp env.example .env
```

### 2. Configure Environment Variables

Open the `.env` file and configure the following variables:

```env
# Backend API URL (used for proxy in development)
VITE_API_URL=http://localhost:5000

# API Base URL (leave empty to use proxy, or set to full URL for production)
VITE_API_BASE_URL=/api

# Application Configuration
VITE_APP_NAME=Momentum
VITE_APP_DESCRIPTION=Build. Progress. Achieve.
```

## 🔧 Configuration Options

### Development Mode

For local development, use the proxy configuration:

```env
VITE_API_URL=http://localhost:5000
VITE_API_BASE_URL=/api
```

This will proxy all `/api` requests to `http://localhost:5000` during development.

### Production Mode

For production deployment, set the full backend URL:

```env
VITE_API_URL=https://your-backend-domain.com
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## 📝 Available Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend server URL for proxy | `http://localhost:5000` | Yes |
| `VITE_API_BASE_URL` | Base URL for API calls | `/api` | Yes |
| `VITE_APP_NAME` | Application name | `Momentum` | No |
| `VITE_APP_DESCRIPTION` | App tagline | `Build. Progress. Achieve.` | No |

## 🔒 Security Notes

- **Never commit `.env` file to version control**
- The `.env` file is already in `.gitignore`
- Use `env.example` as a template for sharing configuration structure
- Keep sensitive data (API keys, secrets) in `.env` only

## 🛠️ Usage in Code

Access environment variables in your React components:

```javascript
// Get API URL
const apiUrl = import.meta.env.VITE_API_URL;

// Get app name
const appName = import.meta.env.VITE_APP_NAME;
```

## 🔄 Restart Required

After changing `.env` variables, you need to restart the Vite development server:

1. Stop the server (Ctrl+C)
2. Start it again: `npm run dev`

## 📚 More Information

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- All environment variables must be prefixed with `VITE_` to be exposed to the client

