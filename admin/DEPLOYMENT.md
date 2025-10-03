# 🚀 DonateTrack Admin Panel - Deployment Guide

This guide covers deploying the admin panel separately from the main frontend and backend.

## 🏗️ Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Main Frontend │    │   Admin Panel   │    │     Backend     │
│                 │    │                 │    │                 │
│ yoursite.com    │    │ admin.site.com  │    │ api.site.com    │
│ Port: 3000      │    │ Port: 3001      │    │ Port: 5000      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Build Process

### 1. Environment Setup
```bash
# Navigate to admin folder
cd admin

# Install dependencies
npm install

# Create production environment file
cp .env.example .env.production
```

### 2. Production Environment Variables
```env
# .env.production
REACT_APP_API_URL=https://api.yourcompany.com/api
REACT_APP_ADMIN_TITLE=DonateTrack Admin Panel
REACT_APP_COMPANY_NAME=DonateTrack
REACT_APP_SUPPORT_EMAIL=admin@yourcompany.com
NODE_ENV=production
```

### 3. Build for Production
```bash
# Build the application
npm run build

# The build folder will contain the production files
ls build/
```

## 🌐 Deployment Options

### Option 1: Static Hosting (Recommended)

#### Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=build
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  REACT_APP_API_URL = "https://api.yourcompany.com/api"
```

#### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://api.yourcompany.com/api"
  }
}
```

### Option 2: Docker Deployment

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration (`nginx.conf`)
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    }
}
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  admin-panel:
    build: .
    ports:
      - "3001:80"
    environment:
      - REACT_APP_API_URL=https://api.yourcompany.com/api
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.admin.rule=Host(`admin.yourcompany.com`)"
      - "traefik.http.services.admin.loadbalancer.server.port=80"
```

### Option 3: VPS/Server Deployment

#### Using PM2 (Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Build the application
npm run build

# Serve with PM2
pm2 serve build 3001 --name "admin-panel" --spa

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Nginx Reverse Proxy
```nginx
# /etc/nginx/sites-available/admin.yourcompany.com
server {
    listen 80;
    server_name admin.yourcompany.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 SSL/HTTPS Setup

### Using Certbot (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d admin.yourcompany.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare SSL (Recommended)
1. Add your domain to Cloudflare
2. Set DNS record: `admin.yourcompany.com` → Your server IP
3. Enable "Full (strict)" SSL mode
4. Enable "Always Use HTTPS"

## 🌍 Environment-Specific Configurations

### Development
```env
REACT_APP_API_URL=http://localhost:5000/api
NODE_ENV=development
```

### Staging
```env
REACT_APP_API_URL=https://staging-api.yourcompany.com/api
NODE_ENV=production
```

### Production
```env
REACT_APP_API_URL=https://api.yourcompany.com/api
NODE_ENV=production
```

## 🔧 Backend Configuration

### CORS Setup
Update your backend to allow admin panel domain:
```javascript
// backend/server.js
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',           // Main frontend (dev)
    'http://localhost:3001',           // Admin panel (dev)
    'https://yourcompany.com',         // Main frontend (prod)
    'https://admin.yourcompany.com',   // Admin panel (prod)
    'https://staging-admin.yourcompany.com' // Staging
  ],
  credentials: true
}));
```

### Admin Routes
Ensure all admin routes are properly configured:
```javascript
// backend/src/routes/admin.js
const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');

// Apply admin authentication to all routes
router.use(authenticateToken);
router.use(requireRole('admin'));

// Admin routes
router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
// ... other routes

module.exports = router;
```

## 📊 Monitoring and Analytics

### Error Tracking (Sentry)
```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// src/index.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring
```javascript
// Google Analytics
import ReactGA from 'react-ga4';

ReactGA.initialize('YOUR_GA_MEASUREMENT_ID');
```

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy-admin.yml
name: Deploy Admin Panel

on:
  push:
    branches: [ main ]
    paths: [ 'admin/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd admin
        npm ci
        
    - name: Build
      run: |
        cd admin
        npm run build
      env:
        REACT_APP_API_URL: ${{ secrets.API_URL }}
        
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './admin/build'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🔍 Health Checks

### Basic Health Check
```javascript
// src/utils/healthCheck.js
export const checkAPIHealth = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};
```

### Monitoring Script
```bash
#!/bin/bash
# health-check.sh

URL="https://admin.yourcompany.com"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $STATUS -eq 200 ]; then
    echo "Admin panel is healthy"
else
    echo "Admin panel is down (Status: $STATUS)"
    # Send alert (email, Slack, etc.)
fi
```

## 🛡️ Security Considerations

### Content Security Policy
```html
<!-- public/index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.yourcompany.com;
">
```

### Environment Variables Security
- Never commit `.env` files
- Use secrets management in production
- Rotate API keys regularly
- Use different keys for different environments

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Backend CORS updated
- [ ] SSL certificate ready
- [ ] Domain DNS configured
- [ ] Build process tested

### Post-Deployment
- [ ] Admin login working
- [ ] All features functional
- [ ] API connectivity verified
- [ ] SSL certificate valid
- [ ] Performance metrics baseline
- [ ] Error tracking configured
- [ ] Backup strategy in place

## 🔄 Rollback Strategy

### Quick Rollback
```bash
# Keep previous build
mv build build-backup
mv build-previous build

# Or use Git tags
git tag v1.0.0
git checkout v1.0.0
npm run build
```

### Blue-Green Deployment
```bash
# Deploy to staging first
deploy-to-staging.sh

# Test staging
run-tests.sh staging

# Switch traffic
switch-traffic.sh production
```

## 📞 Support and Troubleshooting

### Common Issues

1. **White Screen on Load**
   - Check console for errors
   - Verify API URL in environment
   - Check network connectivity

2. **Authentication Failures**
   - Verify backend admin routes
   - Check CORS configuration
   - Validate JWT token handling

3. **Build Failures**
   - Clear node_modules and reinstall
   - Check for dependency conflicts
   - Verify Node.js version compatibility

### Getting Help
- Check deployment logs
- Verify environment variables
- Test API endpoints manually
- Review browser console errors

---

**Deployment completed successfully! 🎉**

Your admin panel should now be accessible at your configured domain with full functionality and security measures in place.