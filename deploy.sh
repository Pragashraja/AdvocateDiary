#!/bin/bash

# Advocate Diary - Automated Deployment Script for Hostinger VPS
# This script automates the Docker deployment process

set -e  # Exit on error

echo "=================================="
echo "Advocate Diary Deployment Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

# Step 1: Update system
print_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_success "System updated"

# Step 2: Install Docker
if ! command -v docker &> /dev/null; then
    print_info "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_success "Docker installed"
else
    print_success "Docker already installed"
fi

# Step 3: Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_info "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed"
else
    print_success "Docker Compose already installed"
fi

# Step 4: Install Git
if ! command -v git &> /dev/null; then
    print_info "Installing Git..."
    sudo apt install -y git
    print_success "Git installed"
else
    print_success "Git already installed"
fi

# Step 5: Configure firewall
print_info "Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp
sudo ufw --force enable
print_success "Firewall configured"

# Step 6: Create application directory
APP_DIR="$HOME/apps/AdvocateDiary"
if [ ! -d "$APP_DIR" ]; then
    print_info "Creating application directory..."
    mkdir -p $HOME/apps
    cd $HOME/apps

    # Clone repository
    print_info "Cloning repository..."
    git clone https://github.com/Pragashraja/AdvocateDiary.git
    print_success "Repository cloned"
else
    print_info "Application directory already exists. Pulling latest changes..."
    cd $APP_DIR
    git pull origin main
    print_success "Repository updated"
fi

cd $APP_DIR

# Step 7: Setup environment files
print_info "Setting up environment files..."

if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    print_info "Created server/.env - Please edit this file with your configuration"
    print_error "IMPORTANT: Update SECRET_KEY, JWT_SECRET_KEY, and DATABASE_URL in server/.env"
else
    print_info "server/.env already exists"
fi

if [ ! -f "client/.env" ]; then
    cp client/.env.example client/.env
    print_info "Created client/.env - Please edit this file with your domain"
else
    print_info "client/.env already exists"
fi

# Step 8: Generate secret keys
print_info "Generating secret keys (use these in server/.env)..."
echo ""
echo "SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))')"
echo "JWT_SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))')"
echo ""

# Step 9: Build and start containers
print_info "Building and starting Docker containers..."
print_info "This may take several minutes..."

if docker-compose up -d --build; then
    print_success "Containers started successfully"
else
    print_error "Failed to start containers"
    print_info "Check logs with: docker-compose logs"
    exit 1
fi

# Step 10: Wait for services to be ready
print_info "Waiting for services to be ready..."
sleep 10

# Step 11: Check container status
print_info "Checking container status..."
docker-compose ps

# Step 12: Display access information
echo ""
echo "=================================="
echo "Deployment Complete!"
echo "=================================="
echo ""
print_success "Application is now running!"
echo ""
echo "Access your application:"
echo "  - Frontend: http://$(curl -s ifconfig.me)"
echo "  - Backend API: http://$(curl -s ifconfig.me):5000/api/health"
echo ""
echo "Next steps:"
echo "  1. Edit server/.env with your SECRET_KEY and JWT_SECRET_KEY (shown above)"
echo "  2. Edit client/.env with your domain name"
echo "  3. Configure your domain DNS to point to this server"
echo "  4. Run 'sudo certbot --nginx -d yourdomain.com' to setup SSL"
echo ""
echo "Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Restart: docker-compose restart"
echo "  - Stop: docker-compose down"
echo "  - Update: git pull && docker-compose up -d --build"
echo ""
print_info "NOTE: If you updated .env files, restart with: docker-compose restart"
echo ""
