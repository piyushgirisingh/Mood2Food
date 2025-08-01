# Mood2Food Deployment Guide

This guide provides multiple options to deploy your Mood2Food application to the internet.

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended for beginners)

Railway is a simple platform that can handle all your components.

#### Steps:
1. **Sign up** at [railway.app](https://railway.app)
2. **Connect your GitHub repository**
3. **Deploy each service separately:**

   **Frontend:**
   ```bash
   cd frontend
   railway login
   railway init
   railway up
   ```

   **Backend:**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

   **ML Service:**
   ```bash
   cd MachineLearning
   railway login
   railway init
   railway up
   ```

4. **Set environment variables** in Railway dashboard:
   - `OPENAI_API_KEY`
   - `OPENAI_API_BASE`
   - Database connection strings

### Option 2: Docker Compose (Local/Server)

Deploy using Docker Compose on any server with Docker.

#### Steps:
1. **Install Docker and Docker Compose**
2. **Set environment variables:**
   ```bash
   export OPENAI_API_KEY="your-api-key"
   export OPENAI_API_BASE="your-api-base"
   ```

3. **Deploy:**
   ```bash
   docker-compose up -d
   ```

4. **Access your app** at `http://localhost`

### Option 3: Individual Cloud Services

#### Frontend: Vercel/Netlify
```bash
# Vercel
npm install -g vercel
cd frontend
vercel

# Netlify
npm install -g netlify-cli
cd frontend
netlify deploy
```

#### Backend: Heroku/Railway
```bash
# Heroku
heroku create mood2food-backend
git push heroku main

# Railway
cd backend
railway up
```

#### ML Service: Railway/Google Cloud Run
```bash
# Railway
cd MachineLearning
railway up

# Google Cloud Run
gcloud run deploy mood2food-ml --source .
```

## 🔧 Environment Setup

### Required Environment Variables

**Frontend:**
```env
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_ML_URL=https://your-ml-service-url.com
```

**Backend:**
```env
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:mysql://your-db-url
SPRING_DATASOURCE_USERNAME=your-username
SPRING_DATASOURCE_PASSWORD=your-password
JWT_SECRET=your-jwt-secret
```

**ML Service:**
```env
OPENAI_API_KEY=your-openai-key
OPENAI_API_BASE=your-openai-base
FLASK_ENV=production
```

## 🗄️ Database Setup

### Option 1: Railway PostgreSQL
- Create a new PostgreSQL service in Railway
- Use the connection string provided

### Option 2: PlanetScale (MySQL)
- Sign up at [planetscale.com](https://planetscale.com)
- Create a new database
- Use the connection string

### Option 3: Supabase
- Sign up at [supabase.com](https://supabase.com)
- Create a new project
- Use the PostgreSQL connection string

## 🔒 Security Considerations

1. **Environment Variables:** Never commit API keys to Git
2. **HTTPS:** Always use HTTPS in production
3. **CORS:** Configure CORS properly for cross-origin requests
4. **Rate Limiting:** Already implemented in your ML service
5. **Database:** Use strong passwords and restrict access

## 📊 Monitoring

### Railway Dashboard
- Monitor logs and performance
- Set up alerts for errors

### External Monitoring
- **Uptime Robot:** Monitor service availability
- **Sentry:** Error tracking
- **Google Analytics:** User analytics

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] Database migrated and tested
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Error monitoring set up
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place
- [ ] Domain configured (optional)

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Configure CORS in your backend
   - Check frontend API URLs

2. **Database Connection:**
   - Verify connection strings
   - Check database permissions

3. **ML Service Issues:**
   - Verify OpenAI API credentials
   - Check model file paths

4. **Build Failures:**
   - Check Node.js/Java versions
   - Verify all dependencies

## 📞 Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify environment variables
3. Test locally with Docker Compose
4. Check the troubleshooting section above

## 🔄 Updates

To update your deployed application:
1. Push changes to your Git repository
2. Redeploy using your chosen platform
3. Test the new deployment
4. Monitor for any issues 