# Team Collaboration Architecture - Project 04

## 🎯 Business Objectives

### Problem Statement
Teams struggle to stay focused and accountable when ideas are "all over the place." This application helps **two-pizza teams** (5-8 people) maintain focus through collaborative task tracking with individual accountability.

### Target Users
- **Small Teams**: 2-8 people (two-pizza rule)
- **Project Managers**: Need visibility into who's doing what
- **Team Members**: Want clear accountability and focus
- **Students**: Learning Google OAuth SSO implementation

## 📊 Enhanced Google Sheets Schema

### Current Project 3 Schema (Single Sheet)
Based on `project-03-task-tracker`, the current schema has these columns:

| Col | Field | Description |
|-----|-------|-------------|
| A | task_id | Unique identifier |
| B | title | Task description |
| C | status | NOT_STARTED, IN_PROGRESS, COMPLETED, BLOCKED |
| D | category | DEVELOPMENT, MEETING, DOCUMENTATION, etc. |
| E | priority | LOW, MEDIUM, HIGH, CRITICAL |
| F | created_date | ISO timestamp when created |
| G | updated_date | ISO timestamp when last updated |
| H | due_date | Optional due date |
| I | notes | Additional notes |
| J | last_update_action | Timestamped action log |
| K | motivation_type | INTRINSIC, EXTRINSIC, MIXED |
| L | parent_item_id | Optional parent task ID |
| M | last_updated_date | Duplicate of updated_date |
| N | last_update_message | Brief update message |

### Project 4 Extended Schema - Two Sheets Approach

#### Sheet 1: "Tasks" (Main Task Sheet)
**Extended from Project 3 with team collaboration fields:**

| Col | Field | Description | New/Modified |
|-----|-------|-------------|--------------|
| A | task_id | Unique identifier | *(unchanged)* |
| B | title | Task description | *(unchanged)* |
| C | status | NOT_STARTED, IN_PROGRESS, COMPLETED, BLOCKED | *(unchanged)* |
| D | category | DEVELOPMENT, MEETING, DOCUMENTATION, etc. | *(unchanged)* |
| E | priority | LOW, MEDIUM, HIGH, URGENT | *(unchanged)* |
| F | created_date | ISO timestamp when created | *(unchanged)* |
| G | updated_date | ISO timestamp when last updated | *(unchanged)* |
| H | due_date | Optional due date | *(unchanged)* |
| I | notes | Additional notes | *(unchanged)* |
| J | last_update_action | Timestamped action log | *(unchanged)* |
| K | motivation_type | INTRINSIC, EXTRINSIC, MIXED | *(unchanged)* |
| L | parent_item_id | Optional parent task ID | *(unchanged)* |
| M | **created_by** | Email of user who created task | **NEW** |
| N | **assigned_to** | Email of user assigned to task | **NEW** |
| O | **updated_by** | Email of user who made last update | **NEW** |
| P | **update_summary** | Brief summary of what changed | **NEW** |

#### Sheet 2: "AuditTrail" (New Accountability Sheet)
**Complete audit log for team accountability:**

| Col | Field | Description |
|-----|-------|-------------|
| A | audit_id | Unique audit entry ID |
| B | task_id | Reference to task in main sheet |
| C | action_type | CREATE, UPDATE, DELETE, ASSIGN, COMPLETE |
| D | user_email | Who performed the action |
| E | timestamp | When action occurred (ISO format) |
| F | field_changed | What field was modified |
| G | old_value | Previous value |
| H | new_value | New value |
| I | update_summary | User-provided summary of change |
| J | raw_input | Original natural language input |

## 🏗️ Technical Architecture

### Authentication Flow (Teaching Point #1: OAuth 2.0)
```
1. User clicks "Sign in with Google"
2. Redirect to Google OAuth consent screen
3. User authorizes application access
4. Google returns authorization code
5. Exchange code for access token + user profile
6. Store user session and profile
7. All API calls include user context
```

### Data Flow with User Identity (Teaching Point #2: Audit Trail)
```
Frontend (React) → FastAPI Backend → Google Sheets API
     ↓                    ↓                ↓
User Profile      Add user metadata     Sheet updates with
  (OAuth)         to all operations      user attribution
     ↓                    ↓                ↓
Session Storage   User context in API   Audit trail logging
```

### Google Sheets Operations (Teaching Point #3: Service Account + User Auth)
- **Sheet Owner**: Uses service account for sheet creation/management
- **User Operations**: All task operations include user email attribution
- **Dual-Sheet Strategy**: Main tasks + audit trail for complete accountability
- **Real-time Updates**: WebSocket notifications for team coordination

## 🔐 Security Architecture

### Authentication Layers
1. **Google OAuth 2.0**: User identity verification
2. **JWT Session Management**: Secure token storage with refresh
3. **API Authorization**: Verify user permissions per request
4. **Google Sheets Access**: Service account + user attribution

### Permission Model
- **Team Lead**: Can invite/remove members, manage sheet permissions, view all audit logs
- **Team Member**: Can create/update own tasks, view team tasks, limited audit access
- **Guest**: Read-only access to shared sheets

## 📈 Enhanced Data Models

### User Profile (Extended)
```json
{
  "google_id": "string",
  "email": "string",
  "name": "string",
  "picture": "string",
  "role": "team_lead|member|guest",
  "team_id": "string",
  "joined_at": "timestamp",
  "last_active": "timestamp"
}
```

### Task with Team Attribution (Extended from Project 3)
```json
{
  "task_id": "string",
  "title": "string",
  "status": "NOT_STARTED|IN_PROGRESS|COMPLETED|BLOCKED",
  "category": "string",
  "priority": "LOW|MEDIUM|HIGH|URGENT",
  "created_date": "timestamp",
  "updated_date": "timestamp",
  "due_date": "timestamp",
  "notes": "string",
  "last_update_action": "string",
  "motivation_type": "INTRINSIC|EXTRINSIC|MIXED",
  "parent_item_id": "string",
  "created_by": "user_email",
  "assigned_to": "user_email",
  "updated_by": "user_email",
  "update_summary": "string"
}
```

### Audit Trail Entry (New)
```json
{
  "audit_id": "string",
  "task_id": "string",
  "action_type": "CREATE|UPDATE|DELETE|ASSIGN|COMPLETE",
  "user_email": "string",
  "timestamp": "timestamp",
  "field_changed": "string",
  "old_value": "string",
  "new_value": "string",
  "update_summary": "string",
  "raw_input": "string"
}
```

## 🎓 Teaching Points Breakdown

### Teaching Point #1: Google OAuth Implementation
**Learning Objectives:**
- Understand OAuth 2.0 flow and security implications
- Implement secure user authentication without storing passwords
- Handle OAuth tokens, refresh, and expiration gracefully

**Implementation Steps:**
1. Register application with Google Cloud Console
2. Configure OAuth consent screen and scopes
3. Add Google OAuth library to FastAPI backend
4. Create authentication endpoints (`/auth/login`, `/auth/callback`, `/auth/logout`)
5. Implement frontend OAuth flow with proper state management
6. Handle token refresh and session management

### Teaching Point #2: User Session Management with JWT
**Learning Objectives:**
- Secure session storage and user context
- JWT token creation, validation, and refresh patterns
- User context propagation through API requests

**Implementation Steps:**
1. Create JWT signing/verification utilities
2. Add user authentication middleware to FastAPI
3. Implement secure session storage (httpOnly cookies)
4. Add user context to all API request handlers
5. Create logout functionality with token invalidation

### Teaching Point #3: Audit Trail for Accountability
**Learning Objectives:**
- Design audit systems for business accountability
- Track user actions with detailed logging
- Create meaningful audit reports for team management

**Implementation Steps:**
1. Design audit trail data model
2. Create audit logging middleware for all data changes
3. Implement audit trail Google Sheets writer
4. Add user attribution to all task operations
5. Build audit reporting and analytics features

### Teaching Point #4: Team Management and Permissions
**Learning Objectives:**
- Role-based access control implementation
- Team invitation and membership management
- Granular permissions for collaborative environments

**Implementation Steps:**
1. Design team membership and role models
2. Implement team invitation system with email verification
3. Add role-based middleware for API endpoints
4. Create team management UI components
5. Handle team member removal and permission changes

## 🚀 Development Phases

### Phase 1: Google OAuth Integration (Week 1)
- Set up Google Cloud Console project with OAuth credentials
- Implement OAuth flow in FastAPI backend
- Add Google sign-in to React frontend
- Test complete authentication workflow
- Add user profile management

### Phase 2: Enhanced Data Models (Week 2)
- Extend Google Sheets tools for team collaboration
- Add user attribution to all task operations
- Implement audit trail sheet creation and logging
- Update frontend to display user information
- Test multi-user task operations

### Phase 3: Team Management Features (Week 3)
- Create team invitation system
- Implement role-based permissions
- Add team member management UI
- Create team dashboard with member activity
- Test complete team collaboration workflow

### Phase 4: Advanced Collaboration (Week 4)
- Add real-time updates with WebSockets
- Implement activity feeds and notifications
- Create team accountability reports
- Add advanced filtering and search by user
- Performance optimization and deployment readiness

## 🎯 Success Metrics

### Technical Learning
- Students understand OAuth 2.0 implementation from scratch
- Practical knowledge of audit trail design and implementation
- Experience with role-based access control systems
- Understanding of Google Sheets as a collaborative database

### Business Value
- Teams maintain focus with clear task ownership
- Complete accountability trail for who changed what when
- Reduced confusion about task assignments and status
- Improved team coordination and productivity metrics

### User Experience
- Seamless Google sign-in with familiar UI patterns
- Clear visibility into team member contributions
- Intuitive task assignment and tracking workflow
- Professional team collaboration interface

## 🔧 Development Setup Requirements

### Google Cloud Console Setup
1. Create new project: "Task Tracker for Teams"
2. Enable APIs: Google+ API, Google Sheets API, Google Drive API
3. Create OAuth 2.0 credentials with authorized redirect URIs
4. Create service account for Sheets access with domain-wide delegation
5. Configure OAuth consent screen with appropriate scopes

### Environment Variables (Extended from Project 3)
```env
# Existing Project 3 Variables
GOOGLE_SHEETS_ID=your_sheet_id
OPENAI_API_KEY=your_openai_key
CREW_SERVICE_URL=http://crew-service:8001
REACT_APP_API_URL=http://localhost:8000

# New OAuth Configuration
GOOGLE_CLIENT_ID=your_oauth_client_id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key_here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# Service Account for Sheets (existing)
GOOGLE_APPLICATION_CREDENTIALS=credentials/gcp-service-account.json

# Team Management
DEFAULT_TEAM_ROLE=member
MAX_TEAM_SIZE=8
```

## 📋 Migration Strategy from Project 3

### Backward Compatibility
- All existing Project 3 functionality remains intact
- Current single-user sheets can be "adopted" by teams
- Gradual migration path from individual to team usage

### Data Migration Steps
1. **Sheet Backup**: Create backup of existing Project 3 data
2. **Column Extension**: Add new columns M-P to existing sheet
3. **Audit Sheet Creation**: Add second "AuditTrail" sheet
4. **Default User Assignment**: Assign existing tasks to sheet owner
5. **Audit Backfill**: Create audit entries for existing tasks

This architecture provides a comprehensive foundation for teaching modern web authentication, team collaboration patterns, and audit trail implementation while building on the solid foundation of Project 3.