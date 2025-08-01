#!/bin/bash

# Mood2Food Deployment Setup Script
# This script helps set up the initial Google Cloud Platform deployment

set -e

echo "🚀 Mood2Food Deployment Setup"
echo "=============================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Please authenticate with Google Cloud:"
    gcloud auth login
fi

# Get project ID
read -p "Enter your Google Cloud Project ID: " PROJECT_ID

# Set project
gcloud config set project $PROJECT_ID

echo "📋 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable monitoring.googleapis.com

echo "🗄️  Setting up Cloud SQL database..."
read -p "Enter database root password: " DB_ROOT_PASSWORD
read -p "Enter database user password: " DB_USER_PASSWORD

# Create Cloud SQL instance
gcloud sql instances create mood2food-db \
    --database-version=MYSQL_8_0 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=$DB_ROOT_PASSWORD \
    --quiet

# Create database
gcloud sql databases create mood2food --instance=mood2food-db --quiet

# Create user
gcloud sql users create mood2food-user \
    --instance=mood2food-db \
    --password=$DB_USER_PASSWORD \
    --quiet

# Get instance IP
DB_IP=$(gcloud sql instances describe mood2food-db --format="value(ipAddresses[0].ipAddress)")

echo "🔧 Setting up environment variables..."

# Create .env file
cat > .env << EOF
# Database Configuration
DB_URL=jdbc:mysql://$DB_IP:3306/mood2food
DB_USERNAME=mood2food-user
DB_PASSWORD=$DB_USER_PASSWORD

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRATION=86400000

# ML Backend (will be updated after deployment)
ML_BACKEND_URL=https://mood2food-ml-xxxxxxxx-uc.a.run.app/classify-emotion

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_API_BASE=https://api.openai.com/v1
EOF

echo "📝 Created .env file with database configuration"
echo "⚠️  Please update the OpenAI API key in the .env file"

echo "🐳 Building and deploying services..."
gcloud builds submit --config cloudbuild.yaml

echo "🔄 Updating service URLs..."
ML_URL=$(gcloud run services describe mood2food-ml --region=us-central1 --format="value(status.url)")
gcloud run services update mood2food-backend \
    --region=us-central1 \
    --set-env-vars="ML_BACKEND_URL=$ML_URL/classify-emotion"

echo "✅ Deployment completed!"
echo ""
echo "🌐 Service URLs:"
echo "Frontend: $(gcloud run services describe mood2food-frontend --region=us-central1 --format='value(status.url)')"
echo "Backend: $(gcloud run services describe mood2food-backend --region=us-central1 --format='value(status.url)')"
echo "ML Service: $(gcloud run services describe mood2food-ml --region=us-central1 --format='value(status.url)')"
echo ""
echo "📋 Next steps:"
echo "1. Update the OpenAI API key in your environment variables"
echo "2. Test the application endpoints"
echo "3. Set up monitoring and logging"
echo "4. Configure custom domain (optional)"
echo ""
echo "📚 For more information, see deployment-guide.md" 