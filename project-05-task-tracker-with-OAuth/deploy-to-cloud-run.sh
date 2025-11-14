#!/bin/bash
# Deploy Project 05 to Google Cloud Run
# Usage: ./deploy-to-cloud-run.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Project 05: Cloud Run Deployment${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${YELLOW}Please login to Google Cloud${NC}"
    gcloud auth login
fi

# Get project ID
echo -e "${YELLOW}Enter your Google Cloud Project ID:${NC}"
read -r PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: Project ID cannot be empty${NC}"
    exit 1
fi

# Set project
echo -e "${GREEN}Setting project to: $PROJECT_ID${NC}"
gcloud config set project "$PROJECT_ID"

# Select region
echo -e "${YELLOW}Select region (press Enter for us-central1):${NC}"
read -r REGION
REGION=${REGION:-us-central1}

echo -e "${GREEN}Using region: $REGION${NC}"

# Enable required APIs
echo -e "${GREEN}Enabling required Google Cloud APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable sheets.googleapis.com

# Setup secrets
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Step 1: Configure Secrets${NC}"
echo -e "${GREEN}========================================${NC}"

setup_secret() {
    local secret_name=$1
    local secret_description=$2

    # Check if secret already exists
    if gcloud secrets describe "$secret_name" &> /dev/null; then
        echo -e "${YELLOW}Secret '$secret_name' already exists. Skip? (y/n)${NC}"
        read -r skip
        if [ "$skip" = "y" ]; then
            return
        fi
    fi

    echo -e "${YELLOW}$secret_description:${NC}"
    read -rs secret_value
    echo

    # Create or update secret
    if gcloud secrets describe "$secret_name" &> /dev/null; then
        echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=-
    else
        echo -n "$secret_value" | gcloud secrets create "$secret_name" --data-file=-
    fi

    echo -e "${GREEN}✓ Secret '$secret_name' configured${NC}"
}

# Configure all secrets
setup_secret "openai-api-key" "Enter your OpenAI API key"
setup_secret "google-sheets-id" "Enter your Google Sheets ID"
setup_secret "google-client-id" "Enter your Google OAuth Client ID"
setup_secret "google-client-secret" "Enter your Google OAuth Client Secret"
setup_secret "jwt-secret-key" "Enter a JWT secret key (random string, min 32 chars)"

# Service account JSON
if [ -f "./credentials/gcp-service-account.json" ]; then
    echo -e "${GREEN}Found service account JSON, uploading...${NC}"
    if gcloud secrets describe gcp-service-account &> /dev/null; then
        gcloud secrets versions add gcp-service-account --data-file=./credentials/gcp-service-account.json
    else
        gcloud secrets create gcp-service-account --data-file=./credentials/gcp-service-account.json
    fi
    echo -e "${GREEN}✓ Service account JSON uploaded${NC}"
else
    echo -e "${RED}Warning: credentials/gcp-service-account.json not found${NC}"
    echo -e "${YELLOW}Please add this file and run the script again${NC}"
    exit 1
fi

# Deploy crew-service
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Step 2: Deploy Crew Service (Internal)${NC}"
echo -e "${GREEN}========================================${NC}"

cd crew-service

gcloud run deploy crew-service \
  --source . \
  --region "$REGION" \
  --platform managed \
  --no-allow-unauthenticated \
  --port 8001 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --min-instances 0 \
  --max-instances 10 \
  --set-secrets="OPENAI_API_KEY=openai-api-key:latest,GOOGLE_SHEETS_ID=google-sheets-id:latest,GOOGLE_APPLICATION_CREDENTIALS=gcp-service-account:latest" \
  --set-env-vars="PORT=8001"

CREW_SERVICE_URL=$(gcloud run services describe crew-service --region "$REGION" --format 'value(status.url)')
echo -e "${GREEN}✓ Crew Service deployed at: $CREW_SERVICE_URL${NC}"

cd ..

# Deploy api-service
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Step 3: Deploy API Service (Public)${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "${YELLOW}Enter your frontend URL (leave empty if deploying frontend to Cloud Run):${NC}"
read -r FRONTEND_URL

if [ -z "$FRONTEND_URL" ]; then
    FRONTEND_URL="https://frontend-placeholder.example.com"
fi

cd api-service

gcloud run deploy api-service \
  --source . \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --port 8000 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60 \
  --min-instances 0 \
  --max-instances 10 \
  --set-secrets="GOOGLE_CLIENT_ID=google-client-id:latest,GOOGLE_CLIENT_SECRET=google-client-secret:latest,JWT_SECRET_KEY=jwt-secret-key:latest" \
  --set-env-vars="CREW_SERVICE_URL=$CREW_SERVICE_URL,FRONTEND_URL=$FRONTEND_URL,ALLOWED_ORIGINS=$FRONTEND_URL,JWT_ALGORITHM=HS256,JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60,LOG_LEVEL=INFO,LOG_REDACT_INPUTS=true"

API_SERVICE_URL=$(gcloud run services describe api-service --region "$REGION" --format 'value(status.url)')
echo -e "${GREEN}✓ API Service deployed at: $API_SERVICE_URL${NC}"

cd ..

# Grant API service permission to call crew service
echo -e "${GREEN}Configuring service-to-service authentication...${NC}"
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
gcloud run services add-iam-policy-binding crew-service \
  --region "$REGION" \
  --member "serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role "roles/run.invoker"

echo -e "${GREEN}✓ Service authentication configured${NC}"

# Deploy frontend (optional)
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Step 4: Deploy Frontend (Optional)${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "${YELLOW}Deploy frontend to Cloud Run? (y/n):${NC}"
read -r deploy_frontend

if [ "$deploy_frontend" = "y" ]; then
    cd frontend

    gcloud run deploy frontend \
      --source . \
      --region "$REGION" \
      --platform managed \
      --allow-unauthenticated \
      --port 3000 \
      --memory 256Mi \
      --cpu 1 \
      --min-instances 0 \
      --max-instances 5 \
      --set-env-vars="REACT_APP_API_URL=$API_SERVICE_URL,CHOKIDAR_USEPOLLING=false,REACT_APP_ENABLE_BREAKDOWN=false"

    FRONTEND_SERVICE_URL=$(gcloud run services describe frontend --region "$REGION" --format 'value(status.url)')
    echo -e "${GREEN}✓ Frontend deployed at: $FRONTEND_SERVICE_URL${NC}"

    # Update API service with correct frontend URL
    echo -e "${GREEN}Updating API service with frontend URL...${NC}"
    gcloud run services update api-service \
      --region "$REGION" \
      --set-env-vars="FRONTEND_URL=$FRONTEND_SERVICE_URL,ALLOWED_ORIGINS=$FRONTEND_SERVICE_URL"

    cd ..
else
    echo -e "${YELLOW}Skipping frontend deployment${NC}"
    echo -e "${YELLOW}Remember to update REACT_APP_API_URL to: $API_SERVICE_URL${NC}"
fi

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo
echo -e "${GREEN}Service URLs:${NC}"
echo -e "Crew Service (internal): $CREW_SERVICE_URL"
echo -e "API Service:             $API_SERVICE_URL"
if [ "$deploy_frontend" = "y" ]; then
    echo -e "Frontend:                $FRONTEND_SERVICE_URL"
fi
echo
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update Google OAuth redirect URIs with:"
echo "   - $API_SERVICE_URL/auth/callback"
if [ "$deploy_frontend" = "y" ]; then
    echo "   - $FRONTEND_SERVICE_URL/auth/callback"
fi
echo
echo "2. Test the deployment:"
echo "   curl $API_SERVICE_URL/health"
echo
echo "3. View logs:"
echo "   gcloud run services logs read api-service --region $REGION"
echo
echo -e "${GREEN}Deployment script completed successfully!${NC}"
