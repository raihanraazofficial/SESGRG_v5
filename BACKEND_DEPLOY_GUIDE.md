# Backend Deployment Guide for Vercel

## 🚀 Steps to Deploy Backend:

### 1. MongoDB Atlas Setup (Free)
1. Go to https://www.mongodb.com/atlas/database
2. Create free account & cluster
3. Get connection string like: `mongodb+srv://username:password@cluster.mongodb.net/`
4. Whitelist all IPs (0.0.0.0/0) for Vercel

### 2. Deploy Backend to Vercel
1. Go to https://vercel.com/dashboard
2. Click "New Project" 
3. Import your GitHub repository
4. Select **ROOT directory as /backend** (important!)
5. Framework Preset: Other
6. Build Command: Leave empty
7. Output Directory: Leave empty
8. Install Command: `pip install -r requirements.txt`

### 3. Environment Variables in Vercel
Add these in Vercel Project Settings → Environment Variables:

```
MONGO_URL = mongodb+srv://your-connection-string
DB_NAME = sesg_research_db
CORS_ORIGINS = *
PUBLICATIONS_API_URL = https://script.google.com/macros/s/AKfycbzQ6XwRBYMc5PaDDns3XlgpRGYQFZtC45RtVRUhyvVlt869zH9mL0IlGlnvBV2-e_s/exec?sheet=sheet6
PROJECTS_API_URL = https://script.google.com/macros/s/AKfycbz5-vZBCz8DZQhLDmLjJNA70HQ3OazQ2uTAUuK7UQaTVip7pG8ulVPLuzA8VN8rqTGH/exec?sheet=sheet7
ACHIEVEMENTS_API_URL = https://script.google.com/macros/s/AKfycbxScZMmNtYyVJ5Je8iRpAFTGVpCuA-5tnS3jGVGk6aYbRjbiL7NAAquXsxcQU2T_I/exec?sheet=sheet8
NEWS_EVENTS_API_URL = https://script.google.com/macros/s/AKfycbwLVCtEI2Mr2J76jf72kfK6OhaMNNdfvLTcJTV8J6mtWcNNGVnHtt0Gxu__lavtnrc8/exec?sheet=sheet9
```

### 4. Update Frontend Environment
After backend deployment, update your frontend's .env:
```
REACT_APP_BACKEND_URL = https://your-backend-name.vercel.app
```

### 5. Redeploy Frontend
After updating frontend .env, redeploy your frontend on Vercel.

## 🔗 Expected URLs:
- Backend: `https://your-backend-name.vercel.app/api/publications`
- Frontend: `https://sesgrg-v2.vercel.app/publications`

## ⚠️ Troubleshooting:
- If "Module not found" error: Check requirements.txt
- If CORS error: Check CORS_ORIGINS environment variable
- If database error: Check MongoDB Atlas connection string
- If API not found: Check vercel.json routing configuration