# 🔐 Team OAuth Setup Guide - Project 4

**Complete setup guide for Google OAuth authentication and team collaboration features**

This guide walks through setting up Project 4's enterprise-grade authentication and team collaboration system.

---

## 🎯 **Overview: What You'll Build**

### Before OAuth (Project 3)
- ✅ Single user task management
- ❌ No user identification
- ❌ No team collaboration
- ❌ No accountability tracking

### After OAuth (Project 4)
- ✅ Multi-user team collaboration
- ✅ Google OAuth authentication
- ✅ Complete audit trail (who, what, when)
- ✅ Role-based permissions
- ✅ Team dashboard and reporting

---

## 📋 **Prerequisites**

### Required Accounts & Access
- [ ] **Google Cloud Account** (free tier sufficient)
- [ ] **Google Workspace** or personal Gmail account
- [ ] **OpenAI API key** (for AI agents)
- [ ] **2-8 team members** with Google accounts for testing

### Technical Requirements
- [ ] **Docker Desktop** running
- [ ] **Git** installed
- [ ] **Basic terminal** knowledge
- [ ] **Text editor** for configuration files

---

## 🏗️ **Phase 1: Google Cloud Console Setup**

### Step 1.1: Create OAuth Application

1. **Go to Google Cloud Console**
   ```
   https://console.cloud.google.com/
   ```

2. **Create New Project** (or use existing)
   ```
   Project Name: AI Task Tracker for Teams
   Project ID: ai-task-tracker-teams-[random]
   ```

3. **Enable Required APIs**
   ```bash
   # Navigate to: APIs & Services > Library
   # Enable these APIs:
   □ Google+ API
   □ Google Sheets API
   □ Google Drive API
   ```

4. **Create OAuth 2.0 Credentials**
   ```bash
   # Navigate to: APIs & Services > Credentials
   # Click: + CREATE CREDENTIALS > OAuth 2.0 Client IDs

   Application Type: Web application
   Name: AI Task Tracker OAuth Client

   Authorized JavaScript origins:
   - http://localhost:3000
   - http://localhost:8000

   Authorized redirect URIs:
   - http://localhost:8000/auth/callback
   - http://localhost:3000/auth/callback
   ```

5. **Configure OAuth Consent Screen**
   ```bash
   # Navigate to: APIs & Services > OAuth consent screen

   User Type: External (for testing with team members)

   Application Information:
   - App name: AI Task Tracker for Teams
   - User support email: your_email@domain.com
   - Developer contact: your_email@domain.com

   Scopes: (Add these)
   - openid
   - email
   - profile
   ```

6. **Download Credentials**
   ```bash
   # From Credentials page, download JSON file
   # Save as: credentials/oauth-client-credentials.json
   # ⚠️ IMPORTANT: Add to .gitignore - never commit this file
   ```

### Step 1.2: Create Service Account (for Sheets Access)

1. **Create Service Account**
   ```bash
   # Navigate to: APIs & Services > Credentials
   # Click: + CREATE CREDENTIALS > Service account

   Service account name: task-tracker-sheets-service
   Service account ID: task-tracker-sheets-service
   Description: Service account for Google Sheets access
   ```

2. **Download Service Account Key**
   ```bash
   # Click on the created service account
   # Go to Keys tab > Add Key > Create new key
   # Choose JSON format
   # Save as: credentials/gcp-service-account.json
   ```

3. **Create Team Google Sheet**
   ```bash
   # Create new Google Sheet
   # Name: "AI Task Tracker - Team [Your Team Name]"
   # Share with service account email (from downloaded JSON)
   # Grant "Editor" permissions
   # Copy Sheet ID from URL for .env file
   ```

---

## 🔧 **Phase 2: Project Configuration**

### Step 2.1: Environment Setup

1. **Copy Environment Template**
   ```bash
   cd project-04-task-tracker-for-team
   cp .env.example .env
   ```

2. **Configure OAuth Settings**
   ```bash
   # Edit .env file with your OAuth credentials
   # From Google Cloud Console OAuth client:

   GOOGLE_CLIENT_ID=123456789012-abcdef123456.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPx-your_oauth_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback
   ```

3. **Configure JWT Settings**
   ```bash
   # Generate strong JWT secret (run this command):
   openssl rand -hex 32

   # Add to .env:
   JWT_SECRET_KEY=your_generated_32_char_secret_here
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
   JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
   ```

4. **Configure Google Sheets**
   ```bash
   # Add your Google Sheet ID to .env:
   GOOGLE_SHEETS_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms

   # Verify service account file exists:
   ls -la credentials/gcp-service-account.json
   ```

5. **Configure Team Settings**
   ```bash
   # Team management settings in .env:
   DEFAULT_TEAM_ROLE=member
   MAX_TEAM_SIZE=8
   ENABLE_TEAM_INVITATIONS=true
   ```

### Step 2.2: Verify Credentials Setup

```bash
# Check all required files exist:
□ credentials/gcp-service-account.json (Service account for Sheets)
□ .env (Environment configuration)
□ .gitignore includes credentials/ directory

# Verify .env contains all OAuth settings:
□ GOOGLE_CLIENT_ID
□ GOOGLE_CLIENT_SECRET
□ GOOGLE_REDIRECT_URI
□ JWT_SECRET_KEY
□ GOOGLE_SHEETS_ID
```

---

## 🚀 **Phase 3: Team Application Deployment**

### Step 3.1: Start Enhanced Services

```bash
# Start all services with OAuth support
make up

# Check all services are running
make status

# Expected output:
# ✅ Frontend Service (3000) - Running with OAuth UI
# ✅ API Gateway (8000) - Running with auth middleware
# ✅ CrewAI Service (8001) - Running with user attribution
```

### Step 3.2: Verify OAuth Integration

1. **Test Authentication Flow**
   ```bash
   # Open browser to: http://localhost:3000
   # Should see "Sign in with Google" button
   # Click and verify Google OAuth consent screen appears
   ```

2. **Check API Authentication**
   ```bash
   # Test auth endpoints:
   curl http://localhost:8000/auth/status

   # Should return authentication status
   # Before login: {"authenticated": false}
   # After login: {"authenticated": true, "user": {...}}
   ```

3. **Verify User Context**
   ```bash
   # After OAuth login, test task creation:
   # Enter: "Working on user authentication, high priority"
   # Check Google Sheet - should see user email in new columns
   ```

---

## 👥 **Phase 4: Team Member Setup**

### Step 4.1: Team Lead Responsibilities

1. **Share OAuth Application Access**
   ```bash
   # In Google Cloud Console > OAuth consent screen
   # Add team member emails to "Test users"
   # (Required while app is in development mode)
   ```

2. **Invite Team Members**
   ```bash
   # Share these with team:
   □ Application URL: http://localhost:3000
   □ Team Google Sheet (view access)
   □ Basic usage instructions
   ```

3. **Configure Sheet Permissions**
   ```bash
   # Google Sheet sharing settings:
   □ Service account: Editor access
   □ Team lead: Owner access
   □ Team members: Viewer access (app will update via service account)
   ```

### Step 4.2: Team Member Onboarding

1. **Each Member Should:**
   ```bash
   □ Have Google account
   □ Be added to OAuth test users list
   □ Access http://localhost:3000
   □ Sign in with Google OAuth
   □ Test creating a simple task
   □ Verify their email appears in audit trail
   ```

2. **Verify Team Functionality**
   ```bash
   # Test scenarios:
   □ Multiple users logged in simultaneously
   □ Task assignments between team members
   □ Audit trail shows all user attributions
   □ Team dashboard displays all members
   ```

---

## 🧪 **Phase 5: Testing & Validation**

### Step 5.1: Authentication Testing

```bash
# Test OAuth flow:
□ Login with Google account
□ Token refresh after 30 minutes
□ Logout functionality
□ Session persistence across browser refresh
□ Multiple users with different Google accounts

# Test security:
□ Invalid tokens rejected
□ Unauthorized access blocked
□ CORS properly configured
□ Session cookies secure
```

### Step 5.2: Team Collaboration Testing

```bash
# Test team features:
□ User attribution in all task operations
□ Task assignments between team members
□ Audit trail captures all changes
□ Team dashboard shows member activity
□ Role-based permissions working

# Test audit trail:
□ All user actions logged
□ Timestamps accurate
□ Change descriptions captured
□ Audit reports generated
```

### Step 5.3: Google Sheets Integration Testing

```bash
# Verify enhanced sheets:
□ Sheet 1 "Tasks" has new columns M-P
□ Sheet 2 "AuditTrail" created automatically
□ User emails appear in all operations
□ Service account can read/write both sheets
□ Manual sheet edits don't break system
```

---

## 🔍 **Troubleshooting Common Issues**

### OAuth Issues

**Problem**: "Error 400: redirect_uri_mismatch"
```bash
# Solution:
1. Check Google Cloud Console > Credentials
2. Verify redirect URI exactly matches: http://localhost:8000/auth/callback
3. No trailing slashes, exact protocol/domain/port
```

**Problem**: "This app isn't verified"
```bash
# Solution:
1. Click "Advanced"
2. Click "Go to AI Task Tracker (unsafe)"
3. This is normal for development apps
4. For production, submit app for verification
```

**Problem**: "Access blocked: This app's request is invalid"
```bash
# Solution:
1. Check OAuth consent screen configuration
2. Verify all required fields completed
3. Add team member emails to "Test users" list
```

### Service Account Issues

**Problem**: "The caller does not have permission"
```bash
# Solution:
1. Verify service account email has Editor access to Google Sheet
2. Check credentials file path in .env
3. Ensure service account has correct API permissions
```

**Problem**: "File not found: gcp-service-account.json"
```bash
# Solution:
1. Download service account key from Google Cloud Console
2. Save as credentials/gcp-service-account.json
3. Verify file permissions are readable by Docker
```

### Team Functionality Issues

**Problem**: "User email not appearing in tasks"
```bash
# Solution:
1. Verify user is authenticated (check /auth/status)
2. Check JWT token is valid and contains user info
3. Ensure enhanced Google Sheets tools are being used
4. Verify columns M-P exist in Google Sheet
```

**Problem**: "Audit trail not working"
```bash
# Solution:
1. Check if "AuditTrail" sheet exists in Google Sheets
2. Verify ENABLE_AUDIT_TRAIL=true in .env
3. Check crew-service logs for audit errors
4. Ensure service account has write access to audit sheet
```

---

## 📈 **Success Criteria Checklist**

### Technical Implementation
- [ ] OAuth 2.0 flow working end-to-end
- [ ] JWT tokens generated and validated correctly
- [ ] User sessions persistent and secure
- [ ] Google Sheets enhanced with user attribution
- [ ] Audit trail capturing all user actions
- [ ] Role-based access control implemented

### Business Functionality
- [ ] Team members can sign in with Google accounts
- [ ] Task ownership and assignments clear
- [ ] Complete accountability for all changes
- [ ] Team dashboard shows member activity
- [ ] Audit reports available for management
- [ ] Two-pizza team coordination working

### Educational Value
- [ ] Students understand OAuth 2.0 implementation
- [ ] JWT tokens and session management clear
- [ ] Audit trail design patterns learned
- [ ] Role-based access control implemented
- [ ] Enterprise security practices applied
- [ ] Team collaboration patterns understood

---

## 🎓 **Learning Outcomes**

### For Students
By completing this setup, students will have hands-on experience with:
- **OAuth 2.0 authentication flows** from scratch
- **JWT token management** and security
- **Audit trail design** for business accountability
- **Role-based access control** implementation
- **Google Cloud Console** configuration
- **Enterprise security patterns** and best practices

### For Teams
Teams will have a working system with:
- **Secure authentication** using familiar Google accounts
- **Complete accountability** for all task changes
- **Clear ownership** and assignment tracking
- **Team coordination** without manual overhead
- **Audit reports** for management visibility
- **Scalable foundation** for future growth

---

## 🔄 **Next Steps**

### Immediate (Week 1)
1. **Complete OAuth setup** following this guide
2. **Test with 2-3 team members** to verify functionality
3. **Create sample tasks** to populate audit trail
4. **Generate first team report** to verify accountability

### Short Term (Month 1)
1. **Add remaining team members** (up to 8 total)
2. **Customize task categories** for your team's needs
3. **Set up regular team reviews** using audit reports
4. **Establish team workflow** patterns and conventions

### Long Term (Quarter 1)
1. **Deploy to cloud environment** for 24/7 access
2. **Add advanced reporting** and analytics
3. **Integrate with team communication** tools (Slack, etc.)
4. **Scale to multiple teams** if business grows

---

**🎯 Goal**: Transform your team from scattered task management to focused, accountable collaboration with enterprise-grade authentication and complete audit trails.**