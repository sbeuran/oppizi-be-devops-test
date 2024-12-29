#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Function to log errors
error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

# Function to log warnings
warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to cleanup existing containers
cleanup() {
    log "Cleaning up existing containers..."
    
    # Stop the containers if they're running
    if docker-compose ps | grep -q "Up"; then
        warn "Stopping running containers..."
        docker-compose down
    fi

    # Remove any existing containers with the same name
    local containers=$(docker ps -a --filter "name=task-management-api" -q)
    if [ ! -z "$containers" ]; then
        warn "Removing existing containers..."
        docker rm -f $containers >/dev/null 2>&1
    fi
}

# Function to build and start containers
build_and_start() {
    log "Building Docker images..."
    if ! docker-compose build; then
        error "Failed to build Docker images"
        exit 1
    fi

    log "Starting containers..."
    if ! docker-compose up -d; then
        error "Failed to start containers"
        exit 1
    fi

    # Wait for the application to be ready
    log "Waiting for application to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:3001/api/tasks >/dev/null 2>&1; then
            log "Application is ready!"
            log "API is accessible at http://localhost:3001"
            log "Database is accessible at localhost:5433"
            return 0
        fi
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done

    error "Application failed to start within the expected time"
    docker-compose logs
    exit 1
}

# Main execution
main() {
    # Check if script is run with root privileges
    if [ "$EUID" -eq 0 ]; then 
        error "Please do not run this script as root"
        exit 1
    fi

    # Check if docker is installed and running
    check_docker

    # Cleanup existing containers
    cleanup

    # Build and start containers
    build_and_start

    # Add trap for cleanup on script interruption
    trap cleanup INT TERM
}

# Execute main function
main "$@" 