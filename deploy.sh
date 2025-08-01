#!/bin/bash

echo "🚀 Mood2Food Deployment Script"
echo "================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check environment variables
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  Warning: OPENAI_API_KEY is not set"
    echo "Please set it with: export OPENAI_API_KEY='your-api-key'"
fi

if [ -z "$OPENAI_API_BASE" ]; then
    echo "⚠️  Warning: OPENAI_API_BASE is not set"
    echo "Please set it with: export OPENAI_API_BASE='your-api-base'"
fi

echo "📦 Building and starting services..."
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "🔍 Checking service status..."
docker-compose ps

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: http://localhost"
echo ""
echo "📊 Service URLs:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost/api"
echo "   ML Service: http://localhost/ml"
echo ""
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down" 