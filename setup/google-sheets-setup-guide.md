# 🚀 Google Sheets Setup Guide - Project 3: Task Tracker

**Transform natural language into intelligent Google Sheets task management**

This guide provides **two paths** for different student experience levels:
- 🏃‍♂️ **Quick Start** (10 minutes) - For experienced students
- 📚 **Detailed Guide** (30 minutes) - Step-by-step with explanations

## Learning Objectives
1. **Docker & AI Agents** - Continue using containerized development (Projects 1-2)
2. **Google Sheets Integration** - NEW: Connect AI agents to collaborative spreadsheets
3. **Production API Integration** - Real-world service account authentication

---

## 🏃‍♂️ QUICK START (Experienced Students)

### Prerequisites
- Docker Desktop running (`docker info`)
- Google account with Sheets access
- OpenAI API key

### 1. Google Cloud Setup (3 minutes)
```bash
# Create project: https://console.cloud.google.com
# Project name: "mas-task-tracker"
# Enable APIs: Google Sheets API + Google Drive API
```

### 2. Service Account (2 minutes)
```bash
# IAM & Admin → Service Accounts → CREATE SERVICE ACCOUNT
# Name: "sheets-service"
# Generate JSON key → Download
# Save as: credentials/gcp-service-account.json
```

### 3. Google Sheet Setup (3 minutes)
```bash
# Create sheet: https://sheets.google.com
# Name: "MAS Task Tracker"
# Headers (Row 1): task_id | title | status | category | priority | created_date | updated_date | due_date | notes | last_update_action | motivation_type | parent_item_id | last_updated_date | last_update_message
# Share with service account email (Editor permissions)
```

### 4. Configure & Launch (2 minutes)
```bash
cp .env.example .env
# Edit .env with your GOOGLE_SHEETS_ID and OPENAI_API_KEY
make up
# Test: http://localhost:3000
```

---

## 📚 DETAILED GUIDE (Step-by-Step with Explanations)

### Why Google Sheets Integration?
Google Sheets provides:
- **Collaborative task management** - Team members can view and update tasks
- **Real-time synchronization** - Changes appear instantly for all users
- **Familiar interface** - Everyone knows how to use spreadsheets
- **Professional API integration** - Learn enterprise authentication patterns

### Step 1: Google Cloud Project Setup

#### What We're Doing
Google APIs require a "project" container for managing permissions, billing, and access. Even free usage needs a project.

#### Instructions
1. **Open Google Cloud Console**
   - Go to [https://console.cloud.google.com](https://console.cloud.google.com)
   - Sign in with your Google account

2. **Create New Project**
   - Click "Select a project" → "NEW PROJECT"
   - Project Name: `"MAS Task Tracker"`
   - Project ID: will auto-generate (note this down)
   - Click "CREATE" and wait ~30 seconds

3. **Enable Required APIs**
   - Left sidebar → "APIs & services" → "Library"
   - Search and enable: **"Google Sheets API"**
   - Search and enable: **"Google Drive API"** (required for file access)

#### Why Both APIs?
- **Sheets API**: Read/write spreadsheet data
- **Drive API**: Access file permissions and sharing

### Step 2: Create Service Account (The "Robot User")

#### What We're Doing
A service account is a "robot user" that your application uses to access Google services. More secure than using personal credentials.

#### Instructions
1. **Navigate to Service Accounts**
   - Google Cloud Console → "IAM & Admin" → "Service Accounts"

2. **Create Service Account**
   - Click "+ CREATE SERVICE ACCOUNT"
   - Service account name: `"sheets-service"`
   - Service account ID: `sheets-service` (auto-fills)
   - Description: `"Service account for MAS Task Tracker"`
   - Click "CREATE AND CONTINUE"

3. **Skip Role Assignment** (click "CONTINUE", then "DONE")

4. **Generate JSON Credentials**
   - Click on your newly created "sheets-service" account
   - Go to "KEYS" tab → "ADD KEY" → "Create new key"
   - Select "JSON" → "CREATE"
   - File downloads automatically (`project-name-xxxxx.json`)

### Step 3: Store Credentials Securely

#### What We're Doing
Moving the credential file to the correct location and ensuring security.

#### Instructions
1. **Create credentials directory**
   ```bash
   mkdir -p credentials
   ```

2. **Move and rename the downloaded file**
   ```bash
   # Move from Downloads to project
   mv ~/Downloads/mas-task-tracker-*.json credentials/gcp-service-account.json
   ```

3. **Verify file structure**
   ```bash
   # Your project should look like:
   project-03-project-analyzer/
   ├── credentials/
   │   └── gcp-service-account.json  ← Credential file here
   ├── backend/
   ├── frontend/
   └── docker-compose.yml
   ```

#### Security Note ⚠️
The JSON file contains private keys. Never commit to version control or share publicly.

### Step 4: Create and Configure Google Sheet

#### What We're Doing
Setting up a properly formatted Google Sheet for task management.

#### Instructions
1. **Create New Google Sheet**
   - Go to [https://sheets.google.com](https://sheets.google.com)
   - Click "+ Blank" to create new sheet
   - Rename to: `"MAS Task Tracker"`

2. **Set Up Column Headers**
   In Row 1, starting from A1, enter these headers:
   ```
   task_id | title | status | category | priority | created_date | updated_date | due_date | notes | last_update_action | motivation_type | parent_item_id | last_updated_date | last_update_message
   ```

3. **Format Headers (Recommended)**
   - Select Row 1
   - Bold text (Ctrl+B or Cmd+B)
   - Add background color (Format → Background color → Light blue)
   - Freeze header row (View → Freeze → 1 row)

4. **Get Sheet ID**
   ```bash
   # From URL: https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   # Copy the long string between /d/ and /edit
   # Example: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   ```

### Step 5: Share Sheet with Service Account

#### What We're Doing
Granting the "robot user" permission to edit your spreadsheet.

#### Instructions
1. **Find Service Account Email**
   ```bash
   # Open credentials file and find client_email
   grep client_email credentials/gcp-service-account.json
   # Copy the email (looks like: sheets-service@project-name.iam.gserviceaccount.com)
   ```

2. **Share the Google Sheet**
   - In your sheet, click "Share" (top right)
   - Paste the service account email address
   - Set permission to **"Editor"**
   - **Uncheck "Notify people"** (it's a robot, not a person)
   - Click "Send"

#### Verification
The service account should appear in "Shared with" list as "Editor".

### Step 6: Configure Application Environment

#### What We're Doing
Connecting your application to the Google Sheet using environment variables.

#### Instructions
1. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env file**
   Open `.env` in your text editor and update these values:
   ```env
   # Required: Your Google Sheet ID (from Step 4)
   GOOGLE_SHEETS_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms

   # Required: Your OpenAI API key
   OPENAI_API_KEY=sk-your-openai-key-here

   # Path to credentials (should work as-is)
   GOOGLE_APPLICATION_CREDENTIALS=credentials/gcp-service-account.json
   ```

3. **Verify credentials file exists**
   ```bash
   ls -la credentials/gcp-service-account.json
   # Should show the file exists
   ```

---

## 🚀 Launch and Test

### Start the Application
```bash
# Start all services
make up
# or: docker compose up --build

# Verify services are running
docker compose ps
```

### Test Integration
1. **Open web interface**: http://localhost:3000
2. **Enter test input**: `"Working on user authentication module"`
3. **Check Google Sheet**: Should see new task with structured data
4. **Test status update**: `"Finished authentication module"`
5. **Verify update**: Existing task status should change to COMPLETED

### Expected Results
- ✅ Natural language creates structured tasks
- ✅ Tasks appear in Google Sheet immediately
- ✅ Status updates modify existing tasks
- ✅ Timestamps auto-populate
- ✅ Multiple team members can view/edit sheet

## 🔧 Troubleshooting

### Pre-Flight Checklist
- [ ] Docker Desktop running (`docker info` works)
- [ ] Google Cloud project created
- [ ] Google Sheets API + Drive API enabled
- [ ] Service account created with JSON key
- [ ] Credentials file: `credentials/gcp-service-account.json`
- [ ] Google Sheet created with proper headers
- [ ] Sheet shared with service account (Editor permissions)
- [ ] `.env` file configured with correct Sheet ID
- [ ] OpenAI API key valid with credits

### Common Errors & Solutions

#### **"Google Sheets access denied" / 403 Error**
```bash
# Check 1: Service account has sheet access
# Verify service account email appears in sheet's "Shared with" list

# Check 2: APIs enabled
# Google Cloud Console → APIs & Services → Enabled APIs
# Should see: Google Sheets API, Google Drive API

# Check 3: Wait for permissions
# Google permissions can take 2-3 minutes to apply
```

#### **"SpreadsheetNotFound" Error**
```bash
# Check 1: Correct Sheet ID in .env
grep GOOGLE_SHEETS_ID .env
# Should match the ID from your sheet URL

# Check 2: Sheet shared correctly
# Sheet must be shared with service account, not your personal email
```

#### **"OpenAI API key invalid"**
```bash
# Check 1: API key format
grep OPENAI_API_KEY .env
# Should start with: sk-

# Check 2: API key has credits
# Visit: https://platform.openai.com/usage

# Check 3: No extra spaces
# Remove any trailing spaces in .env file
```

#### **"Frontend can't connect to backend"**
```bash
# Check services are running
docker compose ps

# Check backend logs
docker compose logs backend

# Check ports (should be free)
netstat -an | grep 8000  # Backend port
netstat -an | grep 3000  # Frontend port
```

#### **"Permission denied" on credentials file**
```bash
# Check file exists and readable
ls -la credentials/gcp-service-account.json

# Fix permissions if needed
chmod 600 credentials/gcp-service-account.json
```

### Debug Commands
```bash
# Check all services status
docker compose ps

# View all logs
make logs
# or: docker compose logs

# View specific service logs
docker compose logs backend
docker compose logs frontend

# Restart everything
make down
make up

# Clean rebuild (if something is corrupted)
docker compose down
docker system prune -f
docker compose up --build
```

### Testing Your Setup
1. **Credentials Test**
   ```bash
   # Should show service account email
   grep client_email credentials/gcp-service-account.json
   ```

2. **Sheet Access Test**
   ```bash
   # Service account should appear in sheet's sharing settings
   ```

3. **Application Test**
   ```bash
   # Start application
   make up

   # Open http://localhost:3000
   # Enter: "Testing the setup"
   # Check Google Sheet for new task
   ```

---

## 📚 Student Success Tips

### For Quick Start Students
- Keep browser tabs open: Google Cloud Console, Google Sheets, localhost:3000
- Copy/paste service account email carefully (no typos)
- Sheet ID is the long string in URL (between /d/ and /edit)

### For Detailed Guide Students
- Read "What We're Doing" sections to understand concepts
- Don't rush - each step builds on the previous
- Test after each major step (credentials, sheet sharing, app launch)
- Ask for help if stuck more than 10 minutes

### Common Student Mistakes
1. **Wrong credentials location** - File must be in `credentials/gcp-service-account.json`
2. **Sheet not shared** - Service account needs Editor permissions
3. **Wrong Sheet ID** - Copy from URL, not sheet name
4. **Missing APIs** - Both Sheets and Drive APIs required
5. **Typos in .env** - Double-check Sheet ID and API key

---

## 🎯 Learning Outcomes

After completing this setup, students will have learned:

### Technical Skills
- **Google Cloud service accounts** - Enterprise authentication pattern
- **API credentials management** - Secure storage and configuration
- **Environment variable configuration** - Production-ready config management
- **Docker service integration** - Connecting containerized apps to external APIs

### Practical Skills
- **Real-world API integration** - Not just tutorials, actual production setup
- **Collaborative development** - Shared Google Sheets for team visibility
- **Troubleshooting methodology** - Systematic approach to debugging issues
- **Security awareness** - Understanding credential sensitivity

### Business Understanding
- **Why service accounts?** - Security and access control in enterprise
- **Why Google Sheets?** - Familiar interface for non-technical stakeholders
- **Why environment variables?** - Configuration management best practices

**🎉 Success! You've integrated AI agents with Google Sheets for collaborative task management.**
