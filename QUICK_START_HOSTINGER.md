# Quick Start - Hostinger Deployment

Fast track guide to get your Advocate Diary running on Hostinger VPS in under 30 minutes.

## Before You Start

You need:
- ✅ Hostinger VPS access (IP address and root password)
- ✅ Domain name
- ✅ SSH client (PowerShell/Terminal/PuTTY)

---

## Step-by-Step Deployment

### 1. Connect to Your VPS (2 minutes)

```bash
ssh root@YOUR_VPS_IP
# Enter password when prompted
```

### 2. Run Automated Setup (10-15 minutes)

```bash
# Download and run deployment script
wget https://raw.githubusercontent.com/Pragashraja/AdvocateDiary/main/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

The script will:
- ✅ Install Docker & Docker Compose
- ✅ Clone your repository
- ✅ Setup environment files
- ✅ Start all services

### 3. Configure Environment (5 minutes)

```bash
cd ~/apps/AdvocateDiary/server
nano .env
```

**Update these lines** (the script shows generated keys):
```env
FLASK_ENV=production
SECRET_KEY=paste_generated_key_here
JWT_SECRET_KEY=paste_generated_key_here
DATABASE_URL=mysql+pymysql://advdiary_user:CHANGE_THIS_PASSWORD@db:3306/advdiary_db
```

Save: `Ctrl+X`, then `Y`, then `Enter`

```bash
# Update frontend
cd ~/apps/AdvocateDiary/client
nano .env
```

**Add your domain**:
```env
VITE_API_URL=https://yourdomain.com/api
```

Save and restart:
```bash
cd ~/apps/AdvocateDiary
docker-compose restart
```

### 4. Configure Domain DNS (5 minutes)

**In Hostinger hPanel → Domains → DNS:**

| Type | Name | Points to | TTL |
|------|------|-----------|-----|
| A | @ | YOUR_VPS_IP | 3600 |
| A | www | YOUR_VPS_IP | 3600 |

Wait 10-15 minutes for DNS propagation.

### 5. Setup SSL Certificate (5 minutes)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow prompts and choose to redirect HTTP to HTTPS.

### 6. Access Your Application

**Done!** Visit:
- 🌐 **https://yourdomain.com**

---

## Verification Checklist

- [ ] Can access https://yourdomain.com
- [ ] Can register a new user
- [ ] Can login
- [ ] Can create a case
- [ ] Can add a hearing
- [ ] Can view hearings page
- [ ] SSL certificate is active (padlock icon in browser)

---

## Common Issues & Fixes

### Application not loading?

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Restart
docker-compose restart
```

### Database connection error?

```bash
# Check .env file
cat server/.env | grep DATABASE_URL

# Restart backend
docker-compose restart backend
```

### Domain not working?

```bash
# Test DNS
ping yourdomain.com

# Should show your VPS IP
# If not, wait for DNS propagation (up to 1 hour)
```

### SSL certificate error?

```bash
# Check certificate
sudo certbot certificates

# Renew if needed
sudo certbot renew
```

---

## Essential Commands

```bash
# View all containers
docker-compose ps

# View logs
docker-compose logs -f

# Restart application
docker-compose restart

# Stop application
docker-compose down

# Start application
docker-compose up -d

# Update application
cd ~/apps/AdvocateDiary
git pull
docker-compose up -d --build
```

---

## Need More Help?

See detailed guide: [HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md)

---

**Your application is now live!** 🚀
