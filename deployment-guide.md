# Mood2Food Deployment Guide

## Google Cloud Platform Deployment

### Prerequisites
1. Google Cloud Account
2. Google Cloud CLI installed
3. Docker installed locally (for testing)
4. Git repository with your code

### Step 1: Setup Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create mood2food-app --name="Mood2Food Application"

# Set the project as default
gcloud config set project mood2food-app

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 2: Setup Cloud SQL Database

```bash
# Create Cloud SQL instance
gcloud sql instances create mood2food-db \
    --database-version=MYSQL_8_0 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=YOUR_ROOT_PASSWORD

# Create database
gcloud sql databases create mood2food --instance=mood2food-db

# Create user
gcloud sql users create mood2food-user \
    --instance=mood2food-db \
    --password=YOUR_DB_PASSWORD
```

### Step 3: Setup Environment Variables

Create a `.env` file in your project root:

```env
# Database Configuration
DB_URL=jdbc:mysql://YOUR_INSTANCE_IP:3306/mood2food
DB_USERNAME=mood2food-user
DB_PASSWORD=YOUR_DB_PASSWORD

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=86400000

# ML Backend (will be updated after deployment)
ML_BACKEND_URL=https://mood2food-ml-xxxxxxxx-uc.a.run.app/classify-emotion

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_API_BASE=https://api.openai.com/v1
```

### Step 4: Deploy Services

```bash
# Deploy all services using Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

### Step 5: Update Environment Variables

After deployment, get the ML service URL and update the backend environment:

```bash
# Get ML service URL
gcloud run services describe mood2food-ml --region=us-central1 --format="value(status.url)"

# Update backend with correct ML URL
gcloud run services update mood2food-backend \
    --region=us-central1 \
    --set-env-vars="ML_BACKEND_URL=https://mood2food-ml-xxxxxxxx-uc.a.run.app/classify-emotion"
```

### Step 6: Configure Custom Domain (Optional)

```bash
# Map custom domain to frontend
gcloud run domain-mappings create \
    --service=mood2food-frontend \
    --domain=your-domain.com \
    --region=us-central1
```

## Alternative Hosting Options

### Option 2: Heroku

#### Backend (Spring Boot):
```bash
# Create Heroku app
heroku create mood2food-backend

# Add MySQL addon
heroku addons:create cleardb:ignite

# Deploy
git push heroku main
```

#### Frontend (React):
```bash
# Create Heroku app
heroku create mood2food-frontend

# Set buildpack
heroku buildpacks:set mars/create-react-app

# Deploy
git push heroku main
```

### Option 3: AWS

#### Backend: AWS Elastic Beanstalk
#### Frontend: AWS S3 + CloudFront
#### Database: AWS RDS
#### ML Service: AWS Lambda or ECS

### Option 4: DigitalOcean

#### Backend: DigitalOcean App Platform
#### Frontend: DigitalOcean App Platform
#### Database: DigitalOcean Managed Databases

## Environment Configuration

### Required Environment Variables

#### Backend (.env):
- `DB_URL`: MySQL connection string
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRATION`: JWT expiration time
- `ML_BACKEND_URL`: URL of ML service
- `OPENAI_API_KEY`: OpenAI API key
- `OPENAI_API_BASE`: OpenAI API base URL

#### ML Service (.env):
- `OPENAI_API_KEY`: OpenAI API key
- `FLASK_ENV`: Production/Development

#### Frontend:
- Update API endpoints in `src/services/api.js` to point to deployed backend

## Security Considerations

1. **Environment Variables**: Never commit secrets to version control
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS properly for cross-origin requests
4. **Rate Limiting**: Implement rate limiting on APIs
5. **Input Validation**: Validate all user inputs
6. **SQL Injection**: Use parameterized queries
7. **JWT Security**: Use strong secrets and proper expiration

## Monitoring and Logging

### Google Cloud Monitoring:
```bash
# Enable monitoring
gcloud services enable monitoring.googleapis.com

# View logs
gcloud logging read "resource.type=cloud_run_revision"
```

### Health Checks:
- Backend: `/actuator/health`
- ML Service: `/health`
- Frontend: Static file serving

## Cost Optimization

### Google Cloud Run:
- Scales to zero when not in use
- Pay only for actual usage
- Automatic scaling based on traffic

### Cloud SQL:
- Start with db-f1-micro for development
- Scale up as needed for production

## Troubleshooting

### Common Issues:

1. **Database Connection**: Check Cloud SQL instance and connection string
2. **CORS Errors**: Verify CORS configuration in backend
3. **Environment Variables**: Ensure all required variables are set
4. **Memory Issues**: Increase memory allocation for ML service
5. **Timeout Issues**: Increase timeout settings for long-running operations

### Debug Commands:
```bash
# Check service status
gcloud run services list

# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=mood2food-backend"

# Test endpoints
curl https://mood2food-backend-xxxxxxxx-uc.a.run.app/actuator/health
```

## Next Steps

1. Set up CI/CD pipeline with GitHub Actions
2. Configure monitoring and alerting
3. Set up backup strategies
4. Implement proper logging
5. Add performance monitoring
6. Set up staging environment 