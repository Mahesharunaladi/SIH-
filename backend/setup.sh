#!/bin/bash

# HerbTrace Backend Setup Script

echo "🌿 HerbTrace Backend Setup"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL CLI not found. Make sure PostgreSQL is installed and running."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists"
fi

# Create necessary directories
echo ""
echo "📁 Creating directories..."
mkdir -p logs uploads

# Ask if user wants to set up database
echo ""
read -p "🗄️  Do you want to set up the database now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter PostgreSQL database name (default: herbtrace): " DB_NAME
    DB_NAME=${DB_NAME:-herbtrace}
    
    read -p "Enter PostgreSQL username (default: postgres): " DB_USER
    DB_USER=${DB_USER:-postgres}
    
    echo ""
    echo "Creating database..."
    createdb -U $DB_USER $DB_NAME 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
    else
        echo "⚠️  Database may already exist or failed to create"
    fi
    
    echo ""
    echo "Running migrations..."
    npm run db:migrate
    
    if [ $? -eq 0 ]; then
        echo "✅ Database migration completed"
    else
        echo "❌ Database migration failed"
    fi
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. API will be available at http://localhost:5000/api/v1"
echo ""
echo "For production deployment:"
echo "- Run 'npm run build' to build the project"
echo "- Run 'npm start' to start the production server"
echo "- Or use 'docker-compose up' for containerized deployment"
