# FASHION MUSE Studio - Deployment Guide

This guide provides comprehensive instructions for deploying the FASHION MUSE Studio application to various platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Deployment Options](#deployment-options)
4. [Docker Deployment](#docker-deployment)
5. [Vercel Deployment](#vercel-deployment)
6. [Traditional VPS Deployment](#traditional-vps-deployment)
7. [Post-Deployment Checklist](#post-deployment-checklist)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- A Google Cloud Project with OAuth credentials
- Gemini API key (or use Google Sign-In)
- Domain name (optional but recommended)
- SSL certificate (for production)

## Environment Configuration

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google Identity Platform
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://your-domain.com/api/auth/callback/google`

### 2. Environment Variables

Create `.env.production` with the following variables:

```env
# Production Environment
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Database (use PostgreSQL for production)
DATABASE_URL="postgresql://user:password@localhost:5432/fashion_muse"

# Gemini API
GEMINI_API_KEY=your_production_gemini_api_key

# NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_secure_nextauth_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# CORS
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### 3. Generate Secure Secrets

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate database password (if using PostgreSQL)
openssl rand -base64 16
```

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Build and Run with Docker

```bash
# Build the image
docker build -t fashion-muse-studio .

# Run the container
docker run -d \
  --name fashion-muse \
  -p 3000:3000 \
  --env-file .env.production \
  -v $(pwd)/uploads:/app/uploads \
  fashion-muse-studio
```

#### Docker Compose (Recommended for Production)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/fashion_muse
    env_file:
      - .env.production
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=fashion_muse
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
```

Deploy with:

```bash
docker-compose up -d
```

### Option 2: Vercel Deployment

#### 1. Install Vercel CLI

```bash
npm i -g vercel
```

#### 2. Configure for Vercel

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### 3. Deploy

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### 4. Set Environment Variables in Vercel Dashboard

Go to your Vercel project dashboard and add all environment variables from the configuration section.

### Option 3: Traditional VPS Deployment

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install PostgreSQL (optional, for production database)
sudo apt install postgresql postgresql-contrib -y
```

#### 2. Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd fashion-muse-studio

# Install dependencies
npm ci --only=production

# Generate Prisma client
npx prisma generate

# Build application
npm run build

# Setup database
npx prisma db push

# Start with PM2
pm2 start ecosystem.config.js
```

#### 3. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'fashion-muse-studio',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: '.env.production',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

#### 4. Nginx Configuration

Create `/etc/nginx/sites-available/fashion-muse`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/fashion-muse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Post-Deployment Checklist

### 1. Verify Application Health

```bash
# Check if application is running
curl https://your-domain.com/api/health

# Check logs
pm2 logs fashion-muse-studio
```

### 2. Test Core Features

- [ ] Google Sign-In flow works correctly
- [ ] Image generation functions properly
- [ ] All pages load without errors
- [ ] Mobile responsiveness is maintained
- [ ] Socket.IO connections work (if applicable)

### 3. Security Verification

- [ ] SSL certificate is properly installed
- [ ] Security headers are present
- [ ] Environment variables are not exposed
- [ ] Database connections are secure
- [ ] CORS is properly configured

### 4. Performance Optimization

- [ ] Images are optimized and loading quickly
- [ ] API response times are acceptable
- [ ] Static assets are cached properly
- [ ] Database queries are optimized

## Monitoring and Maintenance

### 1. Application Monitoring

Set up monitoring with:

```bash
# PM2 Monitoring
pm2 monit

# Log monitoring
tail -f logs/combined.log

# System monitoring
htop
df -h
free -h
```

### 2. Database Maintenance

```bash
# Backup database (PostgreSQL)
pg_dump fashion_muse > backup_$(date +%Y%m%d).sql

# Prisma migrations
npx prisma db push
```

### 3. Updates and Deployment

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm ci --only=production

# Rebuild application
npm run build

# Restart application
pm2 restart fashion-muse-studio
```

### 4. SSL Certificate Renewal

If using Let's Encrypt:

```bash
# Auto-renewal
sudo certbot renew --dry-run
```

## Troubleshooting

### Common Issues

1. **Build Errors**: Check Node.js version and clear cache
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Database Connection**: Verify DATABASE_URL and credentials
   ```bash
   npx prisma db pull
   ```

3. **OAuth Issues**: Check redirect URIs and environment variables
   - Ensure NEXTAUTH_URL matches your domain
   - Verify Google OAuth credentials

4. **Socket.IO Issues**: Check proxy configuration in Nginx
   - Verify WebSocket upgrade headers
   - Check CORS configuration

### Health Check Endpoint

The application includes a health check endpoint at `/api/health` that returns:
- Application status
- Database connection status
- Environment information

Use this for load balancer health checks and monitoring.

## Support

For deployment issues:

1. Check application logs first
2. Verify environment variables
3. Test with a fresh build
4. Consult the [Next.js deployment docs](https://nextjs.org/docs/deployment)
5. Check platform-specific documentation (Vercel, Docker, etc.)

---

**Note**: This deployment guide assumes you have basic knowledge of web server administration and deployment practices. Always test deployments in a staging environment before going to production.