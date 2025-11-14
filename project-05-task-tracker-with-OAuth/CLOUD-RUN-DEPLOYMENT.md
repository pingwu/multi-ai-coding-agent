# Google Cloud Run Deployment Guide
# Project 05: AI Task Tracker with OAuth

## 🏗️ Architecture Overview

### Current (Local Docker Compose)
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│ API Service │────▶│Crew Service │
│  Port 3000  │     │  Port 8000  │     │  Port 8001  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Cloud Run Deployment
```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Cloud Run       │     │  Cloud Run       │     │  Cloud Run       │
│  Frontend        │────▶│  API Service     │────▶│  Crew Service    │
│  (Public)        │     │  (Public)        │     │  (Internal Only) │
└──────────────────┘     └──────────────────┘     └──────────────────┘
         │                       │                         │
         │                       │                         │
         ▼                       ▼                         ▼
┌──────────────────────────────────────────────────────────────────┐
│              Google Cloud Platform Services                      │
│  • Secret Manager (API keys, OAuth secrets)                     │
│  • Google Sheets API (data storage)                             │
│  • Identity Platform / OAuth 2.0                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

### 1. Google Cloud Setup
- [ ] Google Cloud account created
- [ ] Billing enabled
- [ ] gcloud CLI installed

### 2. Enable Required APIs
```bash
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable sheets.googleapis.com
```

### 3. Environment Configuration
- [ ] Google Sheets ID
- [ ] OpenAI API key
- [ ] Google OAuth Client ID/Secret
- [ ] JWT Secret Key
- [ ] Service Account JSON

---

## 🚀 Deployment Strategy

### Option 1: All Services on Cloud Run (Recommended)
**Best for:** Production deployment with independent scaling

```
crew-service  → Cloud Run (internal)
api-service   → Cloud Run (public)
frontend      → Cloud Run (public) OR Cloud Storage + CDN
```

**Pros:**
- ✅ Independent scaling per service
- ✅ Only pay for what you use
- ✅ Full Cloud Run benefits

**Cons:**
- ⚠️ More complex inter-service communication
- ⚠️ Frontend on Cloud Run may be overkill

### Option 2: Hybrid Deployment (Simpler)
**Best for:** Quick deployment and testing

```
crew-service + api-service → Cloud Run
frontend                   → Firebase Hosting / Netlify
```

**Pros:**
- ✅ Simpler frontend deployment
- ✅ Better static asset performance
- ✅ Free tier for frontend

**Cons:**
- ⚠️ Multiple platforms to manage

---

## 📦 Step-by-Step Deployment

### Step 1: Prepare Secrets in Secret Manager

```bash
# Set project
export PROJECT_ID=your-project-id
gcloud config set project $PROJECT_ID

# Create secrets
echo -n "your-openai-api-key" | gcloud secrets create openai-api-key --data-file=-
echo -n "your-google-sheets-id" | gcloud secrets create google-sheets-id --data-file=-
echo -n "your-oauth-client-id" | gcloud secrets create google-client-id --data-file=-
echo -n "your-oauth-client-secret" | gcloud secrets create google-client-secret --data-file=-
echo -n "your-jwt-secret-key" | gcloud secrets create jwt-secret-key --data-file=-

# Upload service account JSON
gcloud secrets create gcp-service-account --data-file=./credentials/gcp-service-account.json
```

### Step 2: Deploy Crew Service (Internal)

```bash
cd crew-service

# Build and deploy
gcloud run deploy crew-service \
  --source . \
  --region us-central1 \
  --platform managed \
  --no-allow-unauthenticated \
  --port 8001 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --set-secrets="OPENAI_API_KEY=openai-api-key:latest,GOOGLE_SHEETS_ID=google-sheets-id:latest,GOOGLE_APPLICATION_CREDENTIALS=gcp-service-account:latest" \
  --set-env-vars="PORT=8001"
```

**Note:** `--no-allow-unauthenticated` makes this service internal-only

### Step 3: Deploy API Service (Public)

```bash
cd ../api-service

# Get crew-service URL
export CREW_SERVICE_URL=$(gcloud run services describe crew-service --region us-central1 --format 'value(status.url)')

# Build and deploy
gcloud run deploy api-service \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8000 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60 \
  --set-secrets="GOOGLE_CLIENT_ID=google-client-id:latest,GOOGLE_CLIENT_SECRET=google-client-secret:latest,JWT_SECRET_KEY=jwt-secret-key:latest" \
  --set-env-vars="CREW_SERVICE_URL=$CREW_SERVICE_URL,FRONTEND_URL=https://your-frontend-url,ALLOWED_ORIGINS=https://your-frontend-url,JWT_ALGORITHM=HS256,JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60,LOG_LEVEL=INFO"
```

### Step 4: Deploy Frontend

#### Option A: Cloud Run
```bash
cd ../frontend

# Get API URL
export API_URL=$(gcloud run services describe api-service --region us-central1 --format 'value(status.url)')

# Build and deploy
gcloud run deploy frontend \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 256Mi \
  --cpu 1 \
  --set-env-vars="REACT_APP_API_URL=$API_URL"
```

#### Option B: Firebase Hosting (Recommended)
```bash
# Build production frontend locally
npm run build

# Deploy to Firebase
firebase init hosting
firebase deploy
```

---

## 🔐 OAuth Configuration for Cloud Run

### Update Google OAuth Redirect URIs

```
Authorized JavaScript origins:
- https://api-service-xxxxx-uc.a.run.app

Authorized redirect URIs:
- https://api-service-xxxxx-uc.a.run.app/auth/callback
- https://your-frontend-url/auth/callback
```

---

## 🧪 Testing Deployed Services

### 1. Health Checks
```bash
# Crew Service (requires auth token)
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  https://crew-service-xxxxx-uc.a.run.app/health

# API Service
curl https://api-service-xxxxx-uc.a.run.app/health

# Frontend
curl https://frontend-xxxxx-uc.a.run.app
```

### 2. End-to-End Test
1. Open frontend URL in browser
2. Click "Sign in with Google"
3. Create a test task
4. Verify in Google Sheets
5. Check audit trail

---

## 💰 Cost Optimization

### Free Tier Limits (Cloud Run)
- 2 million requests/month
- 360,000 GB-seconds/month
- 180,000 vCPU-seconds/month

### Optimization Tips
```bash
# Set minimum instances to 0 (scale to zero)
gcloud run services update crew-service --min-instances 0

# Set concurrency higher (handle more requests per instance)
gcloud run services update api-service --concurrency 80

# Use smaller memory for API service
gcloud run services update api-service --memory 256Mi
```

---

## 🔧 Environment Variables Summary

### Crew Service
```
OPENAI_API_KEY          → Secret Manager
GOOGLE_SHEETS_ID        → Secret Manager
GOOGLE_APPLICATION_CREDENTIALS → Secret Manager
PORT=8001
```

### API Service
```
CREW_SERVICE_URL        → From crew-service deployment
GOOGLE_CLIENT_ID        → Secret Manager
GOOGLE_CLIENT_SECRET    → Secret Manager
JWT_SECRET_KEY          → Secret Manager
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_URL            → Your frontend URL
ALLOWED_ORIGINS         → Your frontend URL
LOG_LEVEL=INFO
```

### Frontend
```
REACT_APP_API_URL       → From api-service deployment
```

---

## 🚨 Troubleshooting

### Issue: Service-to-Service Authentication Failed
```bash
# Grant API service permission to call crew service
gcloud run services add-iam-policy-binding crew-service \
  --region us-central1 \
  --member "serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role "roles/run.invoker"
```

### Issue: CORS Errors
Update `ALLOWED_ORIGINS` in api-service with correct frontend URL

### Issue: OAuth Redirect Mismatch
1. Check Google Cloud Console OAuth configuration
2. Verify redirect URIs match deployed URLs
3. Update `GOOGLE_REDIRECT_URI` environment variable

### Issue: Cold Start Latency
```bash
# Keep 1 instance warm (costs more but faster)
gcloud run services update api-service --min-instances 1
```

---

## 📊 Monitoring & Logging

### View Logs
```bash
# API Service logs
gcloud run services logs read api-service --region us-central1

# Crew Service logs
gcloud run services logs read crew-service --region us-central1

# Real-time logs
gcloud run services logs tail api-service --region us-central1
```

### Metrics
View in Cloud Console:
- https://console.cloud.google.com/run

---

## 🔄 CI/CD Pipeline (Optional)

### Using Cloud Build

Create `cloudbuild.yaml`:
```yaml
steps:
  # Build crew-service
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/crew-service', './crew-service']

  # Build api-service
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/api-service', './api-service']

  # Deploy crew-service
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'crew-service'
      - '--image=gcr.io/$PROJECT_ID/crew-service'
      - '--region=us-central1'

  # Deploy api-service
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'api-service'
      - '--image=gcr.io/$PROJECT_ID/api-service'
      - '--region=us-central1'

images:
  - 'gcr.io/$PROJECT_ID/crew-service'
  - 'gcr.io/$PROJECT_ID/api-service'
```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All secrets configured in Secret Manager
- [ ] OAuth credentials updated with Cloud Run URLs
- [ ] Service account has Sheets API access
- [ ] Docker images build successfully locally

### Deployment
- [ ] Crew service deployed and healthy
- [ ] API service deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Service-to-service auth configured

### Post-Deployment
- [ ] OAuth flow works end-to-end
- [ ] Task creation writes to Sheets
- [ ] Audit trail records properly
- [ ] All logs show no errors
- [ ] Load testing completed

---

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Secret Manager Guide](https://cloud.google.com/secret-manager/docs)
- [Cloud Run Multi-Container](https://cloud.google.com/run/docs/deploying#sidecars)
- [OAuth 2.0 Best Practices](https://cloud.google.com/identity-platform/docs)

---

**Last Updated:** 2025-10-15
**Status:** Ready for Deployment
