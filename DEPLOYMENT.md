# Vercel Deployment Guide

## Prerequisites
- Vercel account
- GitHub repository with the code

## Deployment Steps

### 1. Environment Variables
Set these environment variables in Vercel dashboard:

```
NODE_ENV=production
REACT_APP_API_URL=/api
USE_SQLITE=true
JWT_SECRET=your-super-secret-jwt-key
```

### 2. Database Configuration
For production, you can either:
- Use SQLite (set `USE_SQLITE=true`)
- Use PostgreSQL (provide database credentials)

### 3. Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the `vercel.json` configuration
3. The build process will:
   - Install client dependencies
   - Build the React app
   - Deploy both frontend and backend

### 4. Post-Deployment
- The frontend will be served from the root URL
- The backend API will be available at `/api/*`
- Default admin credentials: admin@roxiler.com / Admin@123

## Troubleshooting

### Build Issues
- Ensure all dependencies are listed in package.json
- Check that the build script runs successfully locally
- Verify environment variables are set correctly

### API Issues
- Check that the API base URL is correctly configured
- Ensure database connection is working
- Verify CORS settings for production domain
