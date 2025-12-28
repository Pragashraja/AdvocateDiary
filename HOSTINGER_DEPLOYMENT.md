# Hostinger VPS Deployment Guide - Advocate Diary

Complete step-by-step guide to deploy your Advocate Diary application on Hostinger VPS.

## Prerequisites

- ✅ Hostinger VPS purchased and active
- ✅ Domain name purchased
- ✅ SSH access to VPS
- ✅ GitHub repository: https://github.com/Pragashraja/AdvocateDiary

---

## Table of Contents

1. [Initial VPS Setup](#1-initial-vps-setup)
2. [Domain Configuration](#2-domain-configuration)
3. [Server Preparation](#3-server-preparation)
4. [Deploy with Docker (Recommended)](#4-deploy-with-docker-recommended)
5. [Manual Deployment (Alternative)](#5-manual-deployment-alternative)
6. [SSL Certificate Setup](#6-ssl-certificate-setup)
7. [Final Configuration](#7-final-configuration)
8. [Maintenance & Updates](#8-maintenance--updates)

---

## 1. Initial VPS Setup

### Step 1.1: Get VPS Credentials

1. **Login to Hostinger hPanel**
   - Go to https://hpanel.hostinger.com
   - Navigate to **VPS** section
   - Click on your VPS

2. **Note Down VPS Details**:
   - **IP Address**: (e.g., 123.45.67.89)
   - **SSH Port**: Usually 22
   - **Root Password**: Found in email or hPanel

### Step 1.2: Connect to VPS via SSH

#### Windows (using PowerShell or Command Prompt):
```bash
ssh root@YOUR_VPS_IP
# Enter password when prompted
```

#### Windows (using PuTTY):
1. Download PuTTY from https://www.putty.org
2. Enter VPS IP address
3. Port: 22
4. Click "Open"
5. Login as: root
6. Enter password

#### Mac/Linux:
```bash
ssh root@YOUR_VPS_IP
# Enter password when prompted
```

### Step 1.3: Initial Server Setup

Once connected, run these commands:

```bash
# Update system packages
apt update && apt upgrade -y

# Create a new sudo user (more secure than using root)
adduser advdiary
# Enter password and details when prompted

# Add user to sudo group
usermod -aG sudo advdiary

# Switch to new user
su - advdiary
```

---

## 2. Domain Configuration

### Step 2.1: Configure DNS in Hostinger

1. **Go to Hostinger hPanel**
   - Navigate to **Domains**
   - Click on your domain
   - Go to **DNS / Nameservers**

2. **Add/Update DNS Records**:

   Add these A records:

   | Type | Name | Points to | TTL |
   |------|------|-----------|-----|
   | A | @ | YOUR_VPS_IP | 3600 |
   | A | www | YOUR_VPS_IP | 3600 |
   | A | api | YOUR_VPS_IP | 3600 |

   Example:
   ```
   Type: A
   Name: @
   Points to: 123.45.67.89
   TTL: 3600
   ```

3. **Save Changes**
   - DNS propagation takes 5-60 minutes
   - Check status: https://www.whatsmydns.net

### Step 2.2: Verify Domain

```bash
# Wait 10-15 minutes, then test:
ping yourdomain.com
# Should return your VPS IP
```

---

## 3. Server Preparation

### Step 3.1: Install Required Software

```bash
# Install essential tools
sudo apt install -y git curl wget nano ufw

# Enable firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 4. Deploy with Docker (Recommended)

This is the **easiest and fastest** method.

### Step 4.1: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker-compose --version

# Logout and login again for group changes
exit
# Then ssh back in: ssh advdiary@YOUR_VPS_IP
```

### Step 4.2: Clone Repository

```bash
# Create application directory
mkdir -p /home/advdiary/apps
cd /home/advdiary/apps

# Clone your repository
git clone https://github.com/Pragashraja/AdvocateDiary.git
cd AdvocateDiary
```

### Step 4.3: Configure Environment Variables

```bash
# Backend environment
cd server
cp .env.example .env
nano .env
```

**Update these values in .env**:
```env
FLASK_ENV=production
DATABASE_URL=mysql+pymysql://advdiary_user:STRONG_PASSWORD_HERE@db:3306/advdiary_db
SECRET_KEY=GENERATE_RANDOM_STRING_HERE
JWT_SECRET_KEY=GENERATE_DIFFERENT_RANDOM_STRING_HERE
```

**Generate random keys**:
```bash
# Generate SECRET_KEY
python3 -c "import secrets; print(secrets.token_hex(32))"

# Generate JWT_SECRET_KEY
python3 -c "import secrets; print(secrets.token_hex(32))"
```

```bash
# Save and exit (Ctrl+X, Y, Enter)
cd ..
```

### Step 4.4: Update Docker Compose for Production

```bash
nano docker-compose.yml
```

**Update these sections**:

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    container_name: advdiary-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: STRONG_ROOT_PASSWORD
      MYSQL_DATABASE: advdiary_db
      MYSQL_USER: advdiary_user
      MYSQL_PASSWORD: STRONG_PASSWORD_HERE
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - advdiary-network

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: advdiary-backend
    restart: always
    env_file:
      - ./server/.env
    ports:
      - "5000:5000"
    volumes:
      - backend_uploads:/app/uploads
    depends_on:
      - db
    networks:
      - advdiary-network

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: advdiary-frontend
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - advdiary-network

volumes:
  mysql_data:
  backend_uploads:

networks:
  advdiary-network:
    driver: bridge
```

### Step 4.5: Update Frontend API URL

```bash
cd client
nano .env
```

Add:
```env
VITE_API_URL=http://yourdomain.com:5000/api
```

Or for API subdomain:
```env
VITE_API_URL=http://api.yourdomain.com/api
```

### Step 4.6: Build and Start Application

```bash
cd /home/advdiary/apps/AdvocateDiary

# Build and start all services
docker-compose up -d --build

# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f
# Press Ctrl+C to exit logs
```

### Step 4.7: Verify Deployment

```bash
# Check backend
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost
```

**Open in browser**:
- http://YOUR_VPS_IP
- http://yourdomain.com (after DNS propagation)

---

## 5. Manual Deployment (Alternative)

Use this if you prefer not to use Docker.

### Step 5.1: Install Dependencies

```bash
# Install Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx

# Secure MySQL
sudo mysql_secure_installation
```

### Step 5.2: Setup MySQL Database

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE advdiary_db;
CREATE USER 'advdiary_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON advdiary_db.* TO 'advdiary_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 5.3: Deploy Backend

```bash
cd /home/advdiary/apps/AdvocateDiary/server

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
nano .env
```

Update .env:
```env
FLASK_ENV=production
DATABASE_URL=mysql+pymysql://advdiary_user:YOUR_PASSWORD@localhost:3306/advdiary_db
SECRET_KEY=YOUR_SECRET_KEY
JWT_SECRET_KEY=YOUR_JWT_SECRET
```

```bash
# Run migrations
flask db upgrade

# Test backend
python run.py
# Press Ctrl+C to stop
```

### Step 5.4: Setup Backend Service

```bash
sudo nano /etc/systemd/system/advdiary-backend.service
```

Add:
```ini
[Unit]
Description=Advocate Diary Backend
After=network.target mysql.service

[Service]
User=advdiary
WorkingDirectory=/home/advdiary/apps/AdvocateDiary/server
Environment="PATH=/home/advdiary/apps/AdvocateDiary/server/venv/bin"
ExecStart=/home/advdiary/apps/AdvocateDiary/server/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 run:app
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Install Gunicorn
source /home/advdiary/apps/AdvocateDiary/server/venv/bin/activate
pip install gunicorn
deactivate

# Start service
sudo systemctl daemon-reload
sudo systemctl enable advdiary-backend
sudo systemctl start advdiary-backend
sudo systemctl status advdiary-backend
```

### Step 5.5: Deploy Frontend

```bash
cd /home/advdiary/apps/AdvocateDiary/client

# Install dependencies
npm install

# Configure API URL
nano .env
```

Add:
```env
VITE_API_URL=http://yourdomain.com/api
```

```bash
# Build frontend
npm run build

# Copy build to nginx
sudo mkdir -p /var/www/advdiary
sudo cp -r dist/* /var/www/advdiary/
sudo chown -R www-data:www-data /var/www/advdiary
```

### Step 5.6: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/advdiary
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/advdiary;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/advdiary /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

---

## 6. SSL Certificate Setup

### Step 6.1: Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Step 6.2: Get SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow prompts:
- Enter email address
- Agree to terms
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

### Step 6.3: Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up auto-renewal
# Verify
sudo systemctl status certbot.timer
```

---

## 7. Final Configuration

### Step 7.1: Update Frontend for HTTPS

If using Docker:
```bash
cd /home/advdiary/apps/AdvocateDiary/client
nano .env
```

Update:
```env
VITE_API_URL=https://yourdomain.com:5000/api
# Or
VITE_API_URL=https://api.yourdomain.com/api
```

```bash
# Rebuild frontend
docker-compose up -d --build frontend
```

### Step 7.2: Configure Backend CORS

```bash
cd /home/advdiary/apps/AdvocateDiary/server
nano app/__init__.py
```

Update CORS origins:
```python
cors.init_app(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com", "https://www.yourdomain.com"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})
```

Restart backend:
```bash
# Docker
docker-compose restart backend

# Manual
sudo systemctl restart advdiary-backend
```

---

## 8. Maintenance & Updates

### Check Application Status

**Docker:**
```bash
docker-compose ps
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

**Manual:**
```bash
sudo systemctl status advdiary-backend
sudo systemctl status nginx
sudo systemctl status mysql
```

### Update Application

```bash
cd /home/advdiary/apps/AdvocateDiary

# Pull latest changes
git pull origin main

# Docker deployment
docker-compose down
docker-compose up -d --build

# Manual deployment
# Backend
cd server
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade
sudo systemctl restart advdiary-backend

# Frontend
cd ../client
npm install
npm run build
sudo cp -r dist/* /var/www/advdiary/
sudo systemctl restart nginx
```

### Database Backup

```bash
# Create backup directory
mkdir -p /home/advdiary/backups

# Backup script
nano /home/advdiary/backup.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/advdiary/backups"

# Docker
docker-compose exec -T db mysqldump -u advdiary_user -pYOUR_PASSWORD advdiary_db > "$BACKUP_DIR/backup_$DATE.sql"

# Or manual
# mysqldump -u advdiary_user -pYOUR_PASSWORD advdiary_db > "$BACKUP_DIR/backup_$DATE.sql"

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql"
```

```bash
chmod +x /home/advdiary/backup.sh

# Schedule daily backups
crontab -e
```

Add:
```
0 2 * * * /home/advdiary/backup.sh
```

### Monitor Resources

```bash
# CPU and Memory
htop

# Disk usage
df -h

# Docker stats
docker stats
```

---

## Quick Reference

### Important Commands

```bash
# Restart services (Docker)
docker-compose restart

# View logs (Docker)
docker-compose logs -f

# Restart services (Manual)
sudo systemctl restart advdiary-backend
sudo systemctl restart nginx

# Check SSL
sudo certbot certificates

# Renew SSL
sudo certbot renew
```

### Important Files

```
/home/advdiary/apps/AdvocateDiary/          # Application
/home/advdiary/apps/AdvocateDiary/server/.env   # Backend config
/home/advdiary/apps/AdvocateDiary/client/.env   # Frontend config
/etc/nginx/sites-available/advdiary         # Nginx config
/etc/systemd/system/advdiary-backend.service # Backend service
```

### URLs to Test

- Frontend: https://yourdomain.com
- Backend Health: https://yourdomain.com:5000/api/health
- API Docs: Check your API routes

---

## Troubleshooting

### Frontend not loading
```bash
# Check nginx
sudo nginx -t
sudo systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### Backend not responding
```bash
# Docker
docker-compose logs backend

# Manual
sudo systemctl status advdiary-backend
sudo journalctl -u advdiary-backend -f
```

### Database connection issues
```bash
# Docker
docker-compose exec db mysql -u advdiary_user -p

# Manual
mysql -u advdiary_user -p advdiary_db
```

### SSL issues
```bash
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```

---

## Security Checklist

- [ ] Changed all default passwords
- [ ] Configured firewall (ufw)
- [ ] SSL certificate installed
- [ ] Using non-root user
- [ ] Environment variables secured
- [ ] Regular backups scheduled
- [ ] Monitoring setup

---

## Support

If you encounter issues:
1. Check logs (see above commands)
2. Verify all services are running
3. Check firewall settings
4. Verify DNS propagation
5. Review nginx/backend configurations

---

**Congratulations!** Your Advocate Diary application is now live! 🎉
