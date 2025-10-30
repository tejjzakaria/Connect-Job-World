# 🚀 Production Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Security Dependencies](#security-dependencies)
3. [Environment Setup](#environment-setup)
4. [Database Setup](#database-setup)
5. [Application Deployment](#application-deployment)
6. [Process Management with PM2](#process-management-with-pm2)
7. [Nginx Configuration](#nginx-configuration)
8. [SSL/TLS Setup](#ssltls-setup)
9. [Monitoring & Logging](#monitoring--logging)
10. [Backup Strategy](#backup-strategy)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04 LTS or higher (recommended)
- **RAM**: Minimum 2GB (4GB+ recommended)
- **CPU**: 2 cores minimum
- **Storage**: 20GB minimum
- **Node.js**: v18.x or v20.x LTS
- **MongoDB**: v6.0+ (Atlas or self-hosted)

### Required Software
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20.x)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

---

## Security Dependencies

Install required security packages:

```bash
npm install --save express-rate-limit helmet express-mongo-sanitize hpp compression
```

### Package Descriptions:
- **express-rate-limit**: Rate limiting to prevent brute force attacks
- **helmet**: Security headers middleware
- **express-mongo-sanitize**: NoSQL injection protection
- **hpp**: HTTP parameter pollution protection
- **compression**: Gzip compression for responses

---

## Environment Setup

### 1. Clone Repository
```bash
cd /var/www
git clone https://github.com/yourusername/connect-job-world.git
cd connect-job-world
```

### 2. Create Production Environment File
```bash
cp .env.production.example .env.production
nano .env.production
```

### 3. Configure Environment Variables
Fill in all required values in `.env.production`:

**Critical Variables:**
- `NODE_ENV=production`
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Generate a strong secret (min 32 characters)
- `ALLOWED_ORIGINS`: Your frontend domain(s)
- `API_URL`: Your API domain

**Generate Secrets:**
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Database Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster
3. Whitelist your server IP
4. Create database user
5. Get connection string and add to `.env.production`

### Option 2: Self-Hosted MongoDB
```bash
# Install MongoDB
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Secure MongoDB
mongo
> use admin
> db.createUser({
  user: "admin",
  pwd: "your-strong-password",
  roles: ["root"]
})
> exit

# Enable authentication
sudo nano /etc/mongod.conf
# Add: security.authorization: enabled

sudo systemctl restart mongod
```

---

## Application Deployment

### 1. Install Dependencies
```bash
npm ci --production
```

### 2. Build Frontend
```bash
npm run build:prod
```

### 3. Create Required Directories
```bash
mkdir -p logs uploads
chmod 755 logs uploads
```

### 4. Set File Permissions
```bash
# Create dedicated user (recommended)
sudo useradd -r -s /bin/false nodeapp
sudo chown -R nodeapp:nodeapp /var/www/connect-job-world

# Or use current user
chown -R $USER:$USER /var/www/connect-job-world
```

---

## Process Management with PM2

### 1. Start Application
```bash
npm run pm2:start
```

### 2. Save PM2 Process List
```bash
pm2 save
```

### 3. Setup PM2 Startup Script
```bash
pm2 startup systemd -u $USER --hp $HOME
# Copy and run the command PM2 outputs
```

### 4. PM2 Commands
```bash
# View logs
npm run pm2:logs

# Monitor processes
npm run pm2:monit

# Restart application
npm run pm2:restart

# Stop application
npm run pm2:stop

# View process info
pm2 info connect-job-world-api
```

---

## Nginx Configuration

### 1. Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/connect-job-world
```

```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS - Main Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    # Root directory
    root /var/www/connect-job-world/dist;
    index index.html;

    # API Proxy
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Frontend - SPA Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # File upload size
    client_max_body_size 10M;
}
```

### 2. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/connect-job-world /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## SSL/TLS Setup

### Using Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

---

## Monitoring & Logging

### 1. Application Logs
```bash
# PM2 logs
pm2 logs connect-job-world-api

# Application logs
tail -f logs/production.log
tail -f logs/pm2-error.log
```

### 2. System Monitoring
```bash
# Install monitoring tools
sudo apt install -y htop

# Monitor resources
htop

# PM2 monitoring
pm2 monit
```

### 3. Log Rotation
```bash
# Create logrotate config
sudo nano /etc/logrotate.d/connect-job-world
```

```
/var/www/connect-job-world/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    copytruncate
}
```

---

## Backup Strategy

### 1. Database Backup Script
```bash
#!/bin/bash
# /var/www/connect-job-world/scripts/backup-db.sh

BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="production-db"

mkdir -p $BACKUP_DIR

mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/backup_$DATE"

# Keep only last 7 days of backups
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +

echo "Backup completed: backup_$DATE"
```

### 2. Schedule Backups
```bash
# Make script executable
chmod +x scripts/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /var/www/connect-job-world/scripts/backup-db.sh
```

### 3. Uploads Backup
```bash
# Sync uploads to backup location
rsync -av /var/www/connect-job-world/uploads /var/backups/uploads
```

---

## Performance Optimization

### 1. Enable Compression in Node.js
Add to `server.production.js`:
```javascript
import compression from 'compression';
app.use(compression());
```

### 2. MongoDB Indexes
Ensure all indexes are created (already defined in models)

### 3. Frontend Optimization
- Code splitting is handled by Vite
- Assets are minified during build
- Lazy loading for routes

---

## Security Checklist

- [✓] Environment variables secured
- [✓] HTTPS/SSL enabled
- [✓] Rate limiting configured
- [✓] CORS properly configured
- [✓] Security headers (Helmet)
- [✓] NoSQL injection protection
- [✓] File upload size limits
- [✓] JWT secrets rotated
- [✓] Database credentials secured
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication
- [ ] Fail2Ban installed
- [ ] Regular security updates

### Firewall Setup
```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## Troubleshooting

### Application Won't Start
```bash
# Check PM2 logs
pm2 logs connect-job-world-api --lines 100

# Check if port is in use
sudo lsof -i :5001

# Check environment variables
pm2 env connect-job-world-api
```

### Database Connection Issues
```bash
# Test MongoDB connection
mongosh "$MONGODB_URI"

# Check network connectivity
ping your-mongodb-host

# Verify IP whitelist in MongoDB Atlas
```

### Nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### High Memory Usage
```bash
# Check PM2 processes
pm2 list

# Restart with lower instances
pm2 scale connect-job-world-api 2
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All code tested locally
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificate obtained
- [ ] Backups configured
- [ ] Monitoring setup

### Deployment
- [ ] Pull latest code
- [ ] Install dependencies
- [ ] Build frontend
- [ ] Run database migrations (if any)
- [ ] Restart application
- [ ] Clear caches

### Post-Deployment
- [ ] Test health endpoint
- [ ] Test authentication
- [ ] Test file uploads
- [ ] Monitor logs for errors
- [ ] Verify SSL certificate
- [ ] Check performance metrics

---

## Quick Deploy Script

Create `deploy.sh`:
```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Install dependencies
npm ci --production

# Build frontend
npm run build:prod

# Restart PM2
npm run pm2:restart

# Wait for health check
sleep 5
curl -f http://localhost:5001/api/health || exit 1

echo "✅ Deployment successful!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

---

## Support & Resources

- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **PM2 Documentation**: https://pm2.keymetrics.io/
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/

---

**Last Updated**: $(date +%Y-%m-%d)
