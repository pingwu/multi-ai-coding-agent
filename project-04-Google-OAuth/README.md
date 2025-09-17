# 👥 Project 4: AI Task Tracker for Teams - OAuth & Accountability

**Enterprise Team Collaboration with Google OAuth SSO and Audit Trails**

Transform scattered team ideas into focused collaboration using AI agents, Google OAuth authentication, and comprehensive accountability tracking.

## Security Warning
- Never commit `.env` files or credentials JSON (e.g., `credentials/*.json`).
- Use `.env.example` as your template, then create a local `.env` with your values.
- Store Google service account JSON locally only; Docker will mount it read-only at runtime.
- If a secret is ever committed, rotate keys immediately and purge from Git history.

Key rotation quick steps (reference only):
- OpenAI: revoke the exposed key in your account, generate a new one, update local `.env`.
- Google Service Account: create a new key, delete the old key, update local credentials JSON, and ensure it’s ignored by Git.

---

## 🎯 **Business Case & Problem Statement**

### The "Two-Pizza Team" Challenge
Small teams (5-8 people) struggle with:
- **Ideas all over the place** - no central focus mechanism
- **Accountability gaps** - unclear who did what when
- **Context switching** - losing track of task ownership
- **Manual coordination** - too much overhead for small teams

### Project 4 Solution
AI-powered task management with **individual accountability** that helps teams **stay focused** while learning **enterprise-grade authentication patterns**.

---

## 📌 **Use Case: Real Team Coordination**

### Target Scenario
**Marketing team at a startup** preparing for product launch:
- **Sarah (Team Lead)**: Needs visibility into who's doing what
- **Mike (Designer)**: Working on landing page mockups
- **Lisa (Copywriter)**: Creating email campaign content
- **Jake (Developer)**: Implementing tracking pixels
- **Ana (Analyst)**: Setting up conversion metrics

### Current Pain Points
```
❌ "Who was supposed to update the landing page copy?"
❌ "When did we decide to change the campaign timeline?"
❌ "Why did the tracking setup get delayed?"
❌ "Who has the latest version of the email templates?"
```

### Project 4 Solution
```
✅ "Sarah assigned landing page copy to Lisa on Monday 2PM"
✅ "Mike updated timeline in task #T-4567 with reason: client feedback"
✅ "Jake marked tracking as blocked due to API key delays - see audit trail"
✅ "Ana created email templates v3 - all versions tracked with timestamps"
```

---

## 🔐 **Key Learning Objectives (Enterprise Skills)**

### 1. **Google OAuth 2.0 Implementation**
**Why Critical**: Every enterprise application needs secure authentication
- OAuth flow implementation from scratch
- Token management and refresh patterns
- User profile and session handling
- Security best practices and PKCE

### 2. **Audit Trail Design**
**Why Critical**: Compliance and accountability are business requirements
- Complete change tracking (who, what, when, why)
- Audit log design and implementation
- Business reporting from audit data
- Data governance and retention

### 3. **Role-Based Access Control (RBAC)**
**Why Critical**: Enterprise applications require permission management
- Team membership and invitation systems
- Granular permission design
- Role-based API security
- User context propagation

### 4. **Multi-User Data Architecture**
**Why Critical**: Understanding shared data patterns
- User attribution in all operations
- Conflict resolution and concurrency
- Team coordination patterns
- Real-time collaboration features

---

## 🏗️ **Technical Architecture Evolution**

### From Project 3 (Individual) → Project 4 (Team)

```
Project 3: Single User              Project 4: Team Collaboration
┌─────────────────┐                ┌─────────────────┐
│   Individual    │                │   Team Lead     │
│   Task Entry    │                │   Dashboard     │
└─────────────────┘                └─────────────────┘
        │                                   │
        ▼                                   ▼
┌─────────────────┐                ┌─────────────────┐
│  Google Sheets  │       →        │  Enhanced       │
│  (Single Sheet) │                │  Sheets + OAuth │
└─────────────────┘                └─────────────────┘
                                           │
                                           ▼
                                   ┌─────────────────┐
                                   │   Audit Trail   │
                                   │   Sheet         │
                                   └─────────────────┘
```

### Enhanced Microservices Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   CrewAI        │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   Service       │
│   + OAuth UI    │    │   + Auth        │    │   + User        │
│   Port 3000     │    │   Middleware    │    │   Attribution   │
└─────────────────┘    │   Port 8000     │    │   Port 8001     │
                       └─────────────────┘    └─────────────────┘
                               │                        │
                               ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Google OAuth   │    │  Enhanced       │
                       │     API         │    │  Sheets API     │
                       └─────────────────┘    │  (2 Sheets)     │
                                              └─────────────────┘
```

---

## 📊 **Enhanced Data Model**

### Google Sheets Evolution

#### Sheet 1: "Tasks" (Extended from Project 3)
| Col | Field | Project 3 | Project 4 Enhancement |
|-----|-------|-----------|----------------------|
| A-L | *Original* | ✅ All preserved | *No changes* |
| M | **created_by** | ❌ | ✅ User email who created |
| N | **assigned_to** | ❌ | ✅ User email assigned |
| O | **updated_by** | ❌ | ✅ User email who updated |
| P | **update_summary** | ❌ | ✅ Brief change description |

#### Sheet 2: "AuditTrail" (New - Complete Accountability)
| Col | Field | Purpose |
|-----|-------|---------|
| A | audit_id | Unique audit entry |
| B | task_id | Links to main task |
| C | action_type | CREATE/UPDATE/DELETE/ASSIGN |
| D | user_email | Who performed action |
| E | timestamp | When it happened |
| F | field_changed | What was modified |
| G | old_value | Previous value |
| H | new_value | New value |
| I | update_summary | User's explanation |
| J | raw_input | Original natural language |

---

## 🚀 **Quick Start for Teams**

### Prerequisites
- Docker Desktop running
- Google account (for OAuth setup)
- OpenAI API key
- Google Cloud Console project with OAuth 2.0 credentials
- Google Sheets API enabled
- Google service account JSON file
- 2-8 team members ready to test

### 1. Start Enhanced Services
```bash
# All services with OAuth support
make up

# Verify OAuth configuration
make check-oauth
```

### 2. Configure Team Authentication
```bash
# Copy enhanced environment template
cp .env.example .env

# Edit .env with your credentials:
# GOOGLE_CLIENT_ID=your_oauth_app.googleusercontent.com
# GOOGLE_CLIENT_SECRET=your_oauth_secret
# JWT_SECRET_KEY=your_super_secret_key
# GOOGLE_SHEETS_ID=your_google_sheets_id
# OPENAI_API_KEY=your_openai_api_key

# Place Google service account JSON in credentials/
# cp path/to/your-service-account.json credentials/gcp-service-account.json
```

#### Required Google Cloud Setup:
1. **Create OAuth 2.0 Client ID** in Google Cloud Console
2. **Configure redirect URIs**: `http://localhost:8000/auth/callback`
3. **Enable APIs**: Google Sheets API, Google+ API
4. **Create Service Account** for Sheets access
5. **Share Google Sheet** with service account email

### 3. Team Setup Workflow
```bash
# 1. Team lead creates Google Cloud OAuth app
# 2. Team lead invites members via email
# 3. Members sign in with Google OAuth
# 4. All task operations automatically tracked
```

### 4. Access Team Interface
- **API Documentation**: http://localhost:8000/docs *(FastAPI with OAuth endpoints)*
- **Health Check**: http://localhost:8000/health *(Service status validation)*
- **OAuth Login**: http://localhost:8000/auth/login *(Google OAuth redirect)*
- **Authentication Status**: http://localhost:8000/auth/status *(Current auth state)*
- **Task Management API**: http://localhost:8000/api/tasks *(CRUD operations)*
- **Frontend**: http://localhost:3000 *(React UI with Google Sign-In)*

### 5. Verify OAuth Integration
```bash
# Test backend services health
curl http://localhost:8000/health
curl http://localhost:8001/health

# Test OAuth authentication flow
curl -L http://localhost:8000/auth/login  # Should redirect to Google OAuth

# Test authentication status
curl http://localhost:8000/auth/status    # Returns: {"authenticated":false,"user":null}

# Test task management (requires auth for full functionality)
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"input": "Test OAuth integration", "user_email": "test@example.com"}'

# Get all tasks from Google Sheets
curl http://localhost:8000/api/tasks
```

---

## ✅ **Verified Architecture & Services**

### Backend Services (Docker)
- **Crew Service** (Port 8001): CrewAI agents for task processing
- **API Service** (Port 8000): FastAPI gateway with OAuth endpoints
- **Frontend Service** (Port 3000): React UI with Google Sign-In

### Working OAuth Endpoints
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/health` | GET | Service health check | ✅ Working |
| `/auth/login` | GET | Google OAuth redirect | ✅ Working |
| `/auth/status` | GET | Authentication status | ✅ Working |
| `/auth/callback` | GET | OAuth callback handler | ✅ Configured |
| `/auth/logout` | POST | Clear session | ✅ Available |
| `/api/tasks` | GET/POST | Task CRUD operations | ✅ Working |
| `/docs` | GET | FastAPI documentation | ✅ Working |

### Google Integrations
- **OAuth 2.0**: Complete authentication flow
- **Sheets API**: Task storage and retrieval
- **Service Account**: Backend API access
- **JWT Tokens**: Session management

---

## 🎓 **Student Learning Path**

### Phase 1: OAuth Implementation (Week 1)
**Skills Gained**: Enterprise authentication patterns
```bash
# Teaching checkpoints:
□ Google Cloud Console OAuth setup
□ Authorization code flow implementation
□ JWT token generation and validation
□ Secure session management
□ User profile integration
```

### Phase 2: Audit Trail Design (Week 2)
**Skills Gained**: Business accountability systems
```bash
# Teaching checkpoints:
□ Audit log data modeling
□ Change tracking middleware
□ User attribution in all operations
□ Audit report generation
□ Compliance considerations
```

### Phase 3: Team Management (Week 3)
**Skills Gained**: Role-based access control
```bash
# Teaching checkpoints:
□ Team invitation system
□ Role-based permissions
□ Member management UI
□ Permission enforcement
□ Team coordination features
```

### Phase 4: Advanced Collaboration (Week 4)
**Skills Gained**: Real-time team coordination
```bash
# Teaching checkpoints:
□ WebSocket real-time updates
□ Activity feeds and notifications
□ Team productivity analytics
□ Conflict resolution patterns
□ Performance optimization
```

---

## 💻 **Enhanced Development Commands**

### Team-Specific Commands
```bash
# OAuth and authentication
make setup-oauth        # Generate OAuth configuration
make test-auth          # Test authentication flow
make verify-tokens      # Validate JWT tokens

# Team management
make invite-user        # Send team invitation
make list-members       # Show current team
make audit-report       # Generate accountability report

# Development workflow
make up                 # Start all services
make logs-auth          # View authentication logs
make test-team          # Run team collaboration tests
```

---

## 🧪 **Team Testing Scenarios**

### End-to-End Team Workflow
1. **Team Lead Setup**
   - Creates OAuth app and invites 3-4 members
   - Verifies Google Sheets permissions

2. **Member Onboarding**
   - Each member signs in with Google OAuth
   - Verifies user profile and permissions

3. **Collaborative Task Management**
   ```bash
   # Sarah (Team Lead): "Create landing page mockups, assign to Mike, high priority"
   # Mike (Designer): "Started landing page mockups, need brand guidelines"
   # Lisa (Copywriter): "Finished email copy, ready for review"
   # Jake (Developer): "Landing page implementation blocked, waiting for mockups"
   ```

4. **Accountability Verification**
   - Check audit trail shows all user attributions
   - Verify task assignments and status changes
   - Generate team activity report

---

## 🎯 **Business Value & Feasibility**

### Immediate Business Benefits
- **📈 Team Productivity**: Clear task ownership reduces confusion
- **👀 Transparency**: Complete audit trail for all changes
- **⚡ Fast Onboarding**: Google OAuth = no new passwords
- **🎯 Focus**: Two-pizza team size keeps communication simple

### Technical Feasibility
- **✅ Low Risk**: Builds on proven Project 3 foundation
- **✅ Incremental**: OAuth and audit can be added step-by-step
- **✅ Scalable**: Google Sheets handles 2-8 users easily
- **✅ Cost-Effective**: Google free tier + OAuth included

### Enterprise Readiness
- **🔐 Security**: OAuth 2.0 industry standard
- **📋 Compliance**: Complete audit trail for regulations
- **🏢 Professional**: Enterprise authentication patterns
- **📈 Scalable**: Ready for cloud deployment when needed

---

## Logging & Privacy Defaults

- Safe by default: services avoid logging raw inputs or PII.
- Env flags:
  - `LOG_LEVEL` default `INFO` (set `DEBUG` for verbose troubleshooting).
  - `LOG_REDACT_INPUTS` default `true` to redact emails/tokens; set `false` only for local debugging.
  - `AUDIT_STORE_RAW_INPUT` default `false`; when `true`, crew-service includes raw natural-language input in the sheet’s last_update_action.
- Recommended local debug combo: set `LOG_LEVEL=DEBUG` and keep `LOG_REDACT_INPUTS=true` unless you explicitly need unredacted traces.

Examples:
```bash
# Default safe behavior (recommended)
LOG_LEVEL=INFO
LOG_REDACT_INPUTS=true
AUDIT_STORE_RAW_INPUT=false

# Verbose local debugging (still redacted)
LOG_LEVEL=DEBUG
LOG_REDACT_INPUTS=true

# Only if necessary locally – unredacted debug
LOG_LEVEL=DEBUG
LOG_REDACT_INPUTS=false
```

---

## 🔄 **Migration from Project 3**

### Backward Compatibility Strategy
```bash
# Existing Project 3 users can:
1. Import existing single-user sheets
2. Gradually add team members
3. Maintain all current functionality
4. Add OAuth when ready for team features
```

### Data Migration Steps
1. **Backup existing data** from Project 3
2. **Extend sheet schema** with new columns M-P
3. **Add audit trail sheet** to same Google Sheets file
4. **Assign existing tasks** to current user
5. **Enable team features** when ready

---

## 🏆 **Success Metrics**

### For Students (Technical Skills)
- [ ] Can implement OAuth 2.0 flow from scratch
- [ ] Understands audit trail design and compliance
- [ ] Can build role-based access control systems
- [ ] Knows enterprise authentication patterns

### For Teams (Business Value)
- [ ] Reduced task confusion and lost context
- [ ] Complete accountability for all changes
- [ ] Faster onboarding with familiar Google login
- [ ] Clear visibility into team contributions

### For Educators (Teaching Value)
- [ ] Real-world authentication implementation
- [ ] Business-relevant accountability systems
- [ ] Progressive complexity from individual to team
- [ ] Enterprise-ready security patterns

---

## 🔧 **Troubleshooting**

### Common Issues & Solutions

#### 1. Services Won't Start
```bash
# Check Docker daemon is running
docker --version

# Check port conflicts
docker ps -a

# Rebuild containers
docker compose down && docker compose up --build
```

#### 2. OAuth Errors
```bash
# Verify environment variables
grep GOOGLE .env

# Check OAuth configuration
curl http://localhost:8000/auth/status

# Validate redirect URI in Google Cloud Console
# Must match: http://localhost:8000/auth/callback
```

#### 3. Google Sheets Access Issues
```bash
# Verify service account file exists
ls -la credentials/gcp-service-account.json

# Check Sheets API is enabled in Google Cloud Console
# Verify sheet ID in environment: GOOGLE_SHEETS_ID

# Test Sheets access
curl http://localhost:8000/api/tasks
```

#### 4. Container Build Issues
```bash
# Clear Docker cache
docker system prune -a

# Check build logs
docker compose logs crew-service
docker compose logs api-service
docker compose logs frontend
```

---

## 📚 **Resources & Documentation**

- **Team Setup Guide**: `setup/team-oauth-setup-guide.md`
- **Architecture Details**: `TEAM-COLLABORATION-ARCHITECTURE.md`
- **OAuth Implementation**: `docs/oauth-implementation.md`
- **Audit Trail Design**: `docs/audit-trail-patterns.md`
- **Troubleshooting**: `docs/team-troubleshooting.md`

---

## 🤔 **Why This Project Matters**

### For Students
Learn **enterprise-grade authentication** and **team collaboration patterns** through a practical, business-relevant application that demonstrates real-world development challenges.

### For Teams
Get a **working team coordination system** that grows from simple task tracking to full accountability management, all while learning **professional software development patterns**.

### For Educators
Teach **OAuth, audit trails, and RBAC** through a progressive project that builds on familiar concepts while introducing essential enterprise patterns.

---

**Built for teams who want to stay focused and accountable while students learn enterprise-grade authentication and collaboration patterns through hands-on implementation.**
