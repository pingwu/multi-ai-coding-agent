# Project 05: Cloud Run Deployment TODO List

**Date Created:** 2025-10-15
**Status:** In Progress
**Goal:** Deploy AI Task Tracker with OAuth to Google Cloud Run

---

## ✅ Completed Tasks

- [x] Analyze project-05 architecture and services
- [x] Create comprehensive Cloud Run deployment guide (CLOUD-RUN-DEPLOYMENT.md)
- [x] Create automated deployment script (deploy-to-cloud-run.sh)

---

## 📋 Pending Tasks

### 1. Prepare Docker Configurations for Cloud Run
**Status:** Pending
**Priority:** High

**Tasks:**
- [ ] Review existing Dockerfiles in crew-service/, api-service/, frontend/
- [ ] Optimize Docker images for Cloud Run (multi-stage builds)
- [ ] Test Docker builds locally
- [ ] Ensure healthcheck endpoints work properly
- [ ] Verify port configurations (8001, 8000, 3000)

**Notes:**
- Dockerfiles already exist in all three services
- Need to verify they're Cloud Run compatible

---

### 2. Set Up Google Cloud Project and APIs
**Status:** Pending
**Priority:** High

**Tasks:**
- [ ] Create/select Google Cloud project
- [ ] Enable billing on project
- [ ] Enable required APIs:
  - [ ] Cloud Run API
  - [ ] Container Registry API
  - [ ] Secret Manager API
  - [ ] Google Sheets API
- [ ] Install gcloud CLI (if not already installed)
- [ ] Authenticate with: `gcloud auth login`
- [ ] Set project: `gcloud config set project PROJECT_ID`

**Commands:**
```bash
# Enable all required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable sheets.googleapis.com
```

---

### 3. Configure Secrets in Secret Manager
**Status:** Pending
**Priority:** High

**Tasks:**
- [ ] Create Secret Manager secrets:
  - [ ] openai-api-key
  - [ ] google-sheets-id
  - [ ] google-client-id
  - [ ] google-client-secret
  - [ ] jwt-secret-key
  - [ ] gcp-service-account (JSON file)

**Commands:**
```bash
# Use the deployment script or manually:
echo -n "your-openai-api-key" | gcloud secrets create openai-api-key --data-file=-
echo -n "your-google-sheets-id" | gcloud secrets create google-sheets-id --data-file=-
# ... etc
```

**Notes:**
- The deployment script (deploy-to-cloud-run.sh) automates this
- Have all credentials ready before starting

---

### 4. Deploy Services to Cloud Run
**Status:** Pending
**Priority:** High

**Deployment Order:**
1. [ ] Deploy crew-service (internal, no public access)
2. [ ] Deploy api-service (public, authenticated calls to crew-service)
3. [ ] Deploy frontend (public) OR use Firebase Hosting

**Option A: Use Automated Script**
```bash
cd C:\MASProjects\PING\MACA-Course\maca\project-05-task-tracker-with-OAuth
./deploy-to-cloud-run.sh
```

**Option B: Manual Deployment**
```bash
# Deploy crew-service
cd crew-service
gcloud run deploy crew-service \
  --source . \
  --region us-central1 \
  --no-allow-unauthenticated \
  --port 8001 \
  --memory 1Gi \
  --set-secrets="OPENAI_API_KEY=openai-api-key:latest,..."

# Deploy api-service
cd ../api-service
gcloud run deploy api-service \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8000 \
  --memory 512Mi \
  --set-secrets="..."

# Deploy frontend (optional)
cd ../frontend
gcloud run deploy frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

---

### 5. Configure OAuth for Cloud Run URLs
**Status:** Pending
**Priority:** High

**Tasks:**
- [ ] Get deployed service URLs from Cloud Run
- [ ] Update Google Cloud Console OAuth configuration
- [ ] Add authorized JavaScript origins:
  - [ ] https://api-service-xxxxx-uc.a.run.app
  - [ ] https://frontend-xxxxx-uc.a.run.app (if using Cloud Run)
- [ ] Add authorized redirect URIs:
  - [ ] https://api-service-xxxxx-uc.a.run.app/auth/callback
  - [ ] https://frontend-xxxxx-uc.a.run.app/auth/callback
- [ ] Update environment variables with new URLs

---

### 6. Test Deployed Application
**Status:** Pending
**Priority:** High

**Test Checklist:**
- [ ] Health check endpoints respond:
  - [ ] `curl https://api-service-xxxxx/health`
- [ ] Frontend loads in browser
- [ ] Google OAuth login works
- [ ] Task creation flows through all services
- [ ] Data writes to Google Sheets correctly
- [ ] Audit trail records properly
- [ ] Review logs for errors:
  ```bash
  gcloud run services logs read api-service --region us-central1
  gcloud run services logs read crew-service --region us-central1
  ```

**End-to-End Test:**
1. Open frontend URL
2. Click "Sign in with Google"
3. Authorize the application
4. Create a test task with natural language
5. Verify task appears in Google Sheets
6. Check audit trail sheet for entry
7. Test task updates and assignments

---

### 7. Performance Optimization (Post-Deployment)
**Status:** Pending
**Priority:** Medium

**Tasks:**
- [ ] Monitor cold start times
- [ ] Adjust memory/CPU allocations
- [ ] Set appropriate concurrency limits
- [ ] Configure min/max instances
- [ ] Review and optimize costs
- [ ] Set up monitoring alerts

**Cost Optimization:**
```bash
# Scale to zero when idle
gcloud run services update crew-service --min-instances 0

# Increase concurrency
gcloud run services update api-service --concurrency 80
```

---

### 8. Documentation and Handoff
**Status:** Pending
**Priority:** Medium

**Tasks:**
- [ ] Document deployed service URLs
- [ ] Create troubleshooting guide
- [ ] Document environment variables
- [ ] Create rollback procedures
- [ ] Share access with team members
- [ ] Update project README with Cloud Run URLs

---

## 🔗 Quick Reference

### Files Created
- `CLOUD-RUN-DEPLOYMENT.md` - Comprehensive deployment guide
- `deploy-to-cloud-run.sh` - Automated deployment script
- `DEPLOYMENT-TODO.md` - This file

### Key Commands
```bash
# Deploy using script
./deploy-to-cloud-run.sh

# View logs
gcloud run services logs read api-service --region us-central1

# Update service
gcloud run services update api-service --memory 1Gi

# List all services
gcloud run services list

# Delete service
gcloud run services delete SERVICE_NAME --region us-central1
```

### Important URLs to Track
- **Crew Service:** [After deployment]
- **API Service:** [After deployment]
- **Frontend:** [After deployment]
- **Google Sheets:** [Your sheet ID]
- **Google Cloud Console:** https://console.cloud.google.com

---

## 📝 Notes

### Current Status
- Project architecture analyzed ✓
- Deployment guides created ✓
- Ready to start actual deployment

### Prerequisites Checklist
Before running deployment:
- [ ] Google Cloud account with billing enabled
- [ ] gcloud CLI installed
- [ ] All API keys and credentials ready
- [ ] Service account JSON file in credentials/
- [ ] Google Sheets created and configured
- [ ] OAuth app created in Google Cloud Console

### After Reboot
1. Start from "Set Up Google Cloud Project and APIs"
2. Run the automated script: `./deploy-to-cloud-run.sh`
3. Follow the prompts to configure secrets
4. Test deployed services
5. Update OAuth redirect URIs

---

**Last Updated:** 2025-10-15
**Next Session:** Start with Google Cloud project setup and run deployment script
