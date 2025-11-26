# Production Deployment Guide - Chit Fund Management System

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Web Deployment](#frontend-web-deployment)
5. [Mobile App Configuration](#mobile-app-configuration)
6. [Database Setup](#database-setup)
7. [Domain & SSL Configuration](#domain--ssl-configuration)
8. [Security Checklist](#security-checklist)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Overview

Your application consists of three components:
- **Backend API** (Node.js + Express)
- **Web Frontend** (React + Vite)
- **Mobile App** (Flutter)

All components will connect to MongoDB Atlas (already configured).

---

## Prerequisites

### Server Requirements
- Ubuntu 20.04+ or similar Linux server
- Minimum 2GB RAM, 2 CPU cores
- 20GB storage
- Root/sudo access

### Services Needed
1. **VPS/Cloud Provider** (Choose one):
   - AWS EC2
   - DigitalOcean Droplet
   - Linode
   - Vultr
   - Google Cloud Platform

2. **Domain Name** (e.g., yourcompany.com)

3. **SSL Certificate** (Free with Let's Encrypt)

---

## Backend Deployment

### Step 1: Prepare Backend for Production

#### 1.1 Update Backend Environment Variables

Edit `backend/.env`:

```env
# Production Environment
NODE_ENV=production
PORT=5000

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://kkanagaraj2253:2253@cluster0.dk8vo.mongodb.net/chitfund?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration (CHANGE THIS!)
JWT_SECRET=your_super_secure_random_string_min_32_chars_long_change_this
JWT_EXPIRE=30d

# CORS Origins (Your domain)
CORS_ORIGIN=https://yourcompany.com,https://www.yourcompany.com

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

#### 1.2 Update `backend/server.js` for Production

Add these security enhancements:

```javascript
// At the top, after existing imports
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// After app initialization
// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000 || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

#### 1.3 Install Security Packages

```bash
cd backend
npm install helmet express-mongo-sanitize xss-clean express-rate-limit hpp compression
```

#### 1.4 Add Compression Middleware

In `backend/server.js`:

```javascript
const compression = require('compression');
app.use(compression());
```

#### 1.5 Create Production Start Script

Update `backend/package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "prod": "NODE_ENV=production node server.js"
  }
}
```

### Step 2: Deploy Backend to Server

#### 2.1 Connect to Your Server

```bash
ssh root@your-server-ip
```

#### 2.2 Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

#### 2.3 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

#### 2.4 Upload Backend Code

**Option A: Using Git (Recommended)**

```bash
# On your server
cd /var/www
git clone https://github.com/yourusername/chitfund-backend.git
cd chitfund-backend
npm install --production
```

**Option B: Using SCP**

```bash
# On your local machine
cd "d:\New folder\myapp\backend"
tar -czf backend.tar.gz .
scp backend.tar.gz root@your-server-ip:/var/www/
# On server
ssh root@your-server-ip
cd /var/www
tar -xzf backend.tar.gz -C chitfund-backend
cd chitfund-backend
npm install --production
```

#### 2.5 Create .env File on Server

```bash
nano /var/www/chitfund-backend/.env
# Paste your production environment variables
```

#### 2.6 Start Backend with PM2

```bash
cd /var/www/chitfund-backend
pm2 start server.js --name chitfund-api
pm2 save
pm2 startup
```

#### 2.7 Configure Nginx as Reverse Proxy

```bash
sudo apt update
sudo apt install nginx
sudo nano /etc/nginx/sites-available/chitfund-api
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name api.yourcompany.com;

    location / {
        proxy_pass http://localhost:5000;
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

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/chitfund-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Frontend Web Deployment

### Step 1: Prepare Frontend for Production

#### 1.1 Update API URL

Edit `web/src/services/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://api.yourcompany.com/api';
```

#### 1.2 Create Environment File

Create `web/.env.production`:

```env
VITE_API_URL=https://api.yourcompany.com/api
```

#### 1.3 Build for Production

```bash
cd web
npm run build
```

This creates a `dist` folder with optimized production files.

### Step 2: Deploy Frontend

#### 2.1 Upload Build Files to Server

```bash
# On your local machine
cd "d:\New folder\myapp\web"
tar -czf web-dist.tar.gz dist
scp web-dist.tar.gz root@your-server-ip:/var/www/

# On server
cd /var/www
mkdir chitfund-web
tar -xzf web-dist.tar.gz -C chitfund-web
```

#### 2.2 Configure Nginx for Web App

```bash
sudo nano /etc/nginx/sites-available/chitfund-web
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name yourcompany.com www.yourcompany.com;
    root /var/www/chitfund-web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/chitfund-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Mobile App Configuration

### Step 1: Update API URL for Production

Edit `mobile/lib/config/api_config.dart`:

```dart
class ApiConfig {
  // Production API URL
  static const String baseUrl = 'https://api.yourcompany.com/api';
  
  static const int timeout = 30;
}
```

### Step 2: Build Mobile App

#### For Android APK:

```bash
cd mobile
flutter build apk --release
```

Output: `build/app/outputs/flutter-apk/app-release.apk`

#### For Android App Bundle (Google Play):

```bash
flutter build appbundle --release
```

Output: `build/app/outputs/bundle/release/app-release.aab`

#### For iOS (Requires Mac):

```bash
flutter build ios --release
```

### Step 3: Distribute Mobile App

**Option A: Direct APK Distribution**
- Share the APK file directly to users
- Users must enable "Install from Unknown Sources"

**Option B: Google Play Store**
1. Create Google Play Developer account ($25 one-time fee)
2. Upload app-release.aab
3. Follow Play Store submission guidelines

**Option C: Apple App Store**
1. Requires Apple Developer account ($99/year)
2. Follow App Store submission guidelines

---

## Database Setup

Your MongoDB Atlas is already configured. No changes needed, but ensure:

### Security Checklist for MongoDB Atlas:

1. **Whitelist Server IP**
   - Go to MongoDB Atlas → Network Access
   - Add your server's IP address
   - Or allow access from anywhere (0.0.0.0/0) - less secure

2. **Database Backup**
   - Enable automatic backups in Atlas
   - Schedule: Daily recommended

3. **Database User Permissions**
   - Ensure user has appropriate read/write permissions
   - Don't use admin privileges unnecessarily

---

## Domain & SSL Configuration

### Step 1: Configure DNS

In your domain registrar (GoDaddy, Namecheap, etc.):

```
A Record: yourcompany.com → your-server-ip
A Record: www.yourcompany.com → your-server-ip
A Record: api.yourcompany.com → your-server-ip
```

### Step 2: Install SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx

# For API domain
sudo certbot --nginx -d api.yourcompany.com

# For Web domain
sudo certbot --nginx -d yourcompany.com -d www.yourcompany.com
```

Certbot will automatically update Nginx configuration and redirect HTTP to HTTPS.

### Step 3: Auto-renewal

```bash
sudo certbot renew --dry-run
```

Certificates auto-renew every 90 days.

---

## Security Checklist

### Backend Security

- [x] Change JWT_SECRET to a strong random string
- [x] Enable helmet.js for security headers
- [x] Implement rate limiting
- [x] Sanitize user inputs (mongo-sanitize, xss-clean)
- [x] Use HTTPS only in production
- [x] Enable CORS with specific origins
- [x] Set NODE_ENV=production
- [ ] Implement logging (Winston, Morgan)
- [ ] Set up error monitoring (Sentry)
- [ ] Regular dependency updates (`npm audit`)

### Database Security

- [x] Use MongoDB Atlas with authentication
- [x] Strong password for database user
- [x] Whitelist only server IP
- [ ] Enable database encryption at rest
- [ ] Regular backups
- [ ] Monitor database access logs

### Server Security

- [ ] Configure firewall (UFW)
  ```bash
  sudo ufw allow 22    # SSH
  sudo ufw allow 80    # HTTP
  sudo ufw allow 443   # HTTPS
  sudo ufw enable
  ```
- [ ] Disable root SSH login
- [ ] Use SSH keys instead of passwords
- [ ] Keep system updated: `sudo apt update && sudo apt upgrade`
- [ ] Install fail2ban: `sudo apt install fail2ban`

---

## Monitoring & Maintenance

### PM2 Monitoring

```bash
# Check app status
pm2 status

# View logs
pm2 logs chitfund-api

# Monitor resources
pm2 monit

# Restart app
pm2 restart chitfund-api

# Stop app
pm2 stop chitfund-api
```

### Nginx Monitoring

```bash
# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log

# Reload configuration
sudo nginx -t && sudo systemctl reload nginx
```

### Database Monitoring

- Monitor in MongoDB Atlas dashboard
- Set up alerts for high CPU/memory usage
- Review slow queries

### Regular Maintenance Tasks

**Daily:**
- Check PM2 logs for errors
- Monitor server resources (CPU, RAM, disk)

**Weekly:**
- Review security logs
- Check backup status
- Update dependencies if needed

**Monthly:**
- Review and rotate logs
- Database performance optimization
- Security audit

---

## Quick Reference Commands

### Server Management

```bash
# Connect to server
ssh root@your-server-ip

# Check disk space
df -h

# Check memory
free -h

# Check CPU
top
```

### Application Management

```bash
# Restart backend
pm2 restart chitfund-api

# View backend logs
pm2 logs chitfund-api --lines 100

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx
```

### Update Application

```bash
# Backend update
cd /var/www/chitfund-backend
git pull origin main
npm install --production
pm2 restart chitfund-api

# Frontend update
cd /var/www/chitfund-web
# Upload new dist folder
sudo systemctl reload nginx
```

---

## Deployment Providers Comparison

### Option 1: DigitalOcean (Recommended for Beginners)
- **Cost**: $6-12/month
- **Pros**: Simple, good docs, one-click apps
- **Setup Time**: 30 minutes
- **Website**: https://www.digitalocean.com

### Option 2: AWS EC2
- **Cost**: $8-15/month (t2.micro/t3.small)
- **Pros**: Scalable, many services
- **Setup Time**: 1-2 hours
- **Website**: https://aws.amazon.com

### Option 3: Heroku (Easy but More Expensive)
- **Cost**: $7-25/month
- **Pros**: No server management, git deploy
- **Setup Time**: 15 minutes
- **Website**: https://www.heroku.com

### Option 4: Vercel (Frontend) + Railway (Backend)
- **Cost**: Free tier available
- **Pros**: Easy deployment, automatic SSL
- **Setup Time**: 20 minutes
- **Websites**: 
  - Frontend: https://vercel.com
  - Backend: https://railway.app

---

## Code Changes Summary

### Changes Required for Production:

#### Backend (`backend/server.js`)
```javascript
// Add security middleware
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

#### Backend (`backend/.env`)
```env
NODE_ENV=production
MONGODB_URI=your-atlas-connection-string
JWT_SECRET=change-to-secure-random-string-min-32-chars
CORS_ORIGIN=https://yourcompany.com
```

#### Frontend (`web/.env.production`)
```env
VITE_API_URL=https://api.yourcompany.com/api
```

#### Frontend (`web/src/services/api.js`)
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://api.yourcompany.com/api';
```

#### Mobile (`mobile/lib/config/api_config.dart`)
```dart
static const String baseUrl = 'https://api.yourcompany.com/api';
```

---

## Support & Troubleshooting

### Common Issues

**Issue: Cannot connect to backend**
- Check PM2 status: `pm2 status`
- Check Nginx: `sudo systemctl status nginx`
- Verify .env file has correct values
- Check firewall: `sudo ufw status`

**Issue: CORS errors**
- Update CORS_ORIGIN in backend .env
- Restart backend: `pm2 restart chitfund-api`

**Issue: MongoDB connection failed**
- Check MongoDB Atlas Network Access (whitelist IP)
- Verify connection string in .env
- Test connection: `mongo "mongodb+srv://..."`

**Issue: SSL certificate not working**
- Run certbot again: `sudo certbot --nginx -d yourdomain.com`
- Check Nginx config: `sudo nginx -t`

---

## Next Steps After Deployment

1. **Test thoroughly**
   - Login/logout
   - Create customers
   - Create chit plans
   - Record payments
   - Generate reports

2. **Set up monitoring**
   - Install Sentry for error tracking
   - Set up uptime monitoring (UptimeRobot)
   - Configure PM2 monitoring

3. **Backup strategy**
   - MongoDB Atlas automatic backups
   - Server backups (DigitalOcean Snapshots)
   - Code in Git repository

4. **Documentation**
   - User manual
   - Admin guide
   - API documentation

5. **Training**
   - Train staff on using the system
   - Document common procedures

---

## Estimated Costs

### Monthly Operating Costs:

- **VPS/Server**: $6-15/month
- **Domain Name**: $10-15/year
- **MongoDB Atlas**: Free (M0 tier) or $9+/month for dedicated
- **SSL Certificate**: Free (Let's Encrypt)
- **Total**: ~$10-25/month

---

## Contact & Support

For deployment assistance:
- Review this documentation thoroughly
- Test in a staging environment first
- Keep backups before making changes
- Document any custom modifications

Good luck with your deployment! 🚀
