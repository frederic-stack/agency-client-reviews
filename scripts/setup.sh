#!/bin/bash

# ClientScore Setup Script
# This script automates the setup process for the ClientScore application

set -e

echo "🚀 Setting up ClientScore..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        print_status "Docker found: $(docker -v)"
    else
        print_warning "Docker not found. You can still run the project manually."
    fi
    
    # Check Docker Compose (optional)
    if command -v docker-compose &> /dev/null; then
        print_status "Docker Compose found: $(docker-compose -v)"
    else
        print_warning "Docker Compose not found."
    fi
    
    print_status "Prerequisites check complete!"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Server environment
    if [ ! -f "server/.env" ]; then
        print_status "Creating server environment file..."
        cp server/env.example server/.env
        print_warning "Please edit server/.env with your configuration"
    fi
    
    # Client environment
    if [ ! -f "client/.env.local" ]; then
        print_status "Creating client environment file..."
        cp client/env.example client/.env.local
        print_warning "Please edit client/.env.local with your configuration"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Server dependencies
    print_status "Installing server dependencies..."
    cd server
    npm install
    cd ..
    
    # Client dependencies
    print_status "Installing client dependencies..."
    cd client
    npm install
    cd ..
    
    print_status "Dependencies installed successfully!"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    cd server
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    # Ask if user wants to run migrations
    read -p "Do you want to run database migrations now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Running database migrations..."
        npx prisma migrate dev --name init
        
        read -p "Do you want to seed the database with sample data? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Seeding database..."
            npx prisma db seed
        fi
    else
        print_warning "Skipping database setup. Run 'npx prisma migrate dev' in the server directory when ready."
    fi
    
    cd ..
}

# Docker setup
setup_docker() {
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        read -p "Do you want to use Docker for development? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Starting Docker services..."
            docker-compose up -d postgres redis
            
            print_status "Waiting for services to start..."
            sleep 10
            
            return 0
        fi
    fi
    return 1
}

# Main setup function
main() {
    echo "
    ╔═══════════════════════════════════════╗
    ║            ClientScore Setup          ║
    ║   Secure Anonymous Client Reviews     ║
    ╚═══════════════════════════════════════╝
    "
    
    check_prerequisites
    setup_environment
    
    # Ask about Docker
    DOCKER_SETUP=false
    if setup_docker; then
        DOCKER_SETUP=true
    fi
    
    install_dependencies
    
    if [ "$DOCKER_SETUP" = true ]; then
        setup_database
    else
        print_warning "Make sure PostgreSQL and Redis are running before setting up the database."
        print_warning "Run the following commands when ready:"
        print_warning "  cd server && npx prisma migrate dev"
        print_warning "  cd server && npx prisma db seed"
    fi
    
    echo ""
    print_status "🎉 ClientScore setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Configure your environment files:"
    echo "   - server/.env"
    echo "   - client/.env.local"
    echo ""
    echo "2. Start the development servers:"
    if [ "$DOCKER_SETUP" = true ]; then
        echo "   docker-compose up"
    else
        echo "   Server: cd server && npm run dev"
        echo "   Client: cd client && npm run dev"
    fi
    echo ""
    echo "3. Open your browser:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - API: http://localhost:5000"
    echo ""
    echo "4. Check the README.md for detailed documentation"
    echo ""
    print_status "Happy coding! 🚀"
}

# Run main function
main "$@" 