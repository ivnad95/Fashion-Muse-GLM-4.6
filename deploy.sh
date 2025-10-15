#!/bin/bash

# FASHION MUSE Studio - Deployment Script
# This script automates the deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="fashion-muse-studio"
BACKUP_DIR="./backups"
LOG_FILE="./deployment.log"

# Create backup directory
mkdir -p $BACKUP_DIR

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a $LOG_FILE
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a $LOG_FILE
}

# Check if environment file exists
check_env() {
    if [ ! -f ".env.production" ]; then
        error ".env.production file not found. Please create it before deploying."
    fi
    log "Environment file found ✓"
}

# Backup current deployment
backup_current() {
    if [ -d ".next" ]; then
        log "Creating backup of current deployment..."
        tar -czf "$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).tar.gz" .next uploads 2>/dev/null || true
        log "Backup created ✓"
    fi
}

# Install dependencies
install_deps() {
    log "Installing dependencies..."
    npm ci --only=production
    log "Dependencies installed ✓"
}

# Generate Prisma client
generate_prisma() {
    log "Generating Prisma client..."
    npx prisma generate
    log "Prisma client generated ✓"
}

# Build application
build_app() {
    log "Building application..."
    npm run build
    log "Application built successfully ✓"
}

# Database migration
migrate_db() {
    log "Running database migrations..."
    npx prisma db push
    log "Database migrations completed ✓"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Wait for application to start
    sleep 5
    
    # Check if application responds
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log "Health check passed ✓"
    else
        error "Health check failed. Application may not be running correctly."
    fi
}

# Docker deployment
deploy_docker() {
    log "Starting Docker deployment..."
    
    check_env
    backup_current
    install_deps
    generate_prisma
    
    # Build Docker image
    log "Building Docker image..."
    docker build -t $APP_NAME .
    
    # Stop existing container
    if docker ps -a | grep -q $APP_NAME; then
        log "Stopping existing container..."
        docker stop $APP_NAME || true
        docker rm $APP_NAME || true
    fi
    
    # Run new container
    log "Starting new container..."
    docker run -d \
        --name $APP_NAME \
        -p 3000:3000 \
        --env-file .env.production \
        -v $(pwd)/uploads:/app/uploads \
        --restart unless-stopped \
        $APP_NAME
    
    health_check
    log "Docker deployment completed successfully! 🚀"
}

# PM2 deployment
deploy_pm2() {
    log "Starting PM2 deployment..."
    
    check_env
    backup_current
    install_deps
    generate_prisma
    build_app
    migrate_db
    
    # Stop existing application
    if pm2 list | grep -q $APP_NAME; then
        log "Stopping existing application..."
        pm2 stop $APP_NAME || true
        pm2 delete $APP_NAME || true
    fi
    
    # Start application
    log "Starting application with PM2..."
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save
    
    health_check
    log "PM2 deployment completed successfully! 🚀"
}

# Vercel deployment
deploy_vercel() {
    log "Starting Vercel deployment..."
    
    check_env
    install_deps
    generate_prisma
    build_app
    
    # Deploy to Vercel
    log "Deploying to Vercel..."
    vercel --prod
    
    log "Vercel deployment completed successfully! 🚀"
}

# Show usage
usage() {
    echo "Usage: $0 [docker|pm2|vercel]"
    echo ""
    echo "Deployment methods:"
    echo "  docker  - Deploy using Docker containers"
    echo "  pm2     - Deploy using PM2 process manager"
    echo "  vercel  - Deploy to Vercel platform"
    echo ""
    echo "Example: $0 docker"
}

# Main script
main() {
    log "Starting FASHION MUSE Studio deployment..."
    
    case "${1:-}" in
        "docker")
            deploy_docker
            ;;
        "pm2")
            deploy_pm2
            ;;
        "vercel")
            deploy_vercel
            ;;
        *)
            usage
            error "Invalid deployment method. Please specify docker, pm2, or vercel."
            ;;
    esac
}

# Run main function with all arguments
main "$@"