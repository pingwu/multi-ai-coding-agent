# CLAUDE.md - Multi-AI Coding Agent Development Guide

This file provides Claude Code-specific instructions for developing and customizing the Multi-AI Coding Agent sample projects.

**IMPORTANT**: This is part of a multi-agent software development workflow. Read `AGENTS.md` (Codex Agent) and `GEMINI.md` (Gemini Agent) for complete collaboration protocols.

---

## 🤝 **Multi-Agent Collaboration Framework**

### **Agent Roles & Responsibilities**
- **Claude Code (This Agent)**: Natural language development, Docker-first workflows, course/docs scaffolding, learning flows, and public-safe documentation with redaction
- **Codex Agent** (AGENTS.md): Precise code changes, diffs, repository automation, security hardening, Makefile targets, and deterministic Docker runs
- **Gemini Agent** (GEMINI.md): Cross-checks, alternative approaches, performance considerations, risk analysis, and web research synthesis

### **Collaboration Protocols**
- **Identity**: Always identify contributions as "Claude Code" in shared files and commit messages
- **Coordination**: Coordinate with other agents through user-mediated communication
- **Perspective**: Offer different approaches when they provide value, raise concerns for user decision-making
- **Privacy**: Follow `AGENTS.md` boundaries for secrets, dependencies, and container security

### **Multi-Agent Development Flow**
1. **Planning Phase**: Claude Code scaffolds structure and Docker workflows
2. **Implementation Phase**: Codex Agent handles precise code changes and automation
3. **Validation Phase**: Gemini Agent performs cross-checks and risk analysis
4. **Documentation Phase**: Claude Code creates user-facing documentation

### **Commit Attribution**
When Claude Code contributes to changes:
- Add commit trailer: `🤖 Generated with [Claude Code](https://claude.ai/code)`
- Add co-author: `Co-Authored-By: Claude <noreply@anthropic.com>`
- Follow patterns from `AGENTS.md` for multi-agent attribution
- Git supports multiple `Co-Authored-By` lines for collaborative work

---

## 🎯 **Development Philosophy**

### **Core Approach**
- **Business-First**: Real automation problems, not technical demos
- **Production-Ready**: Enterprise deployment patterns from day one
- **Natural Language Development**: Build and modify using conversational AI
- **10-Minute Setup**: Working applications from clone to running

### **Tech Stack Standards**
- **Backend**: CrewAI + FastAPI + Python 3.10-3.12
- **Frontend**: React + TypeScript + WebSocket integration
- **Authentication**: Google OAuth 2.0 + JWT tokens + session management
- **Data Storage**: Google Sheets API + CSV/JSON + audit trails
- **Deployment**: Docker + Docker Compose
- **Architecture**: Multi-agent coordination with professional web UI
- **Progressive Complexity**: Simple → Data Storage → Team Collaboration → Cloud Deployment

---

## 🏗️ **Architecture Overview**

### **Multi-Service Architecture**
Each project follows a consistent pattern:
- **Backend**: CrewAI + FastAPI (Python 3.10-3.12)
- **Frontend**: React + TypeScript + WebSocket integration
- **Authentication**: Google OAuth 2.0 + JWT + secure sessions (Project 4+)
- **Orchestration**: Docker Compose with service dependencies
- **Data**: Google Sheets API + Local file storage (CSV, JSON) + audit trails

### **CrewAI Agent Patterns**
All projects use standardized agent configurations:
```
src/agents/
├── researcher.py      # Data gathering and research
├── strategist.py      # Analysis and planning  
├── writer.py          # Content generation/reports
```

### **API Integration Layer**
- **FastAPI backend**: `/api/` endpoints for frontend communication
- **WebSocket support**: Real-time crew execution status
- **Environment-based config**: API keys via Docker environment
- **Cross-origin handling**: Configured for localhost development

---

## 🚀 **Quick Development Workflow**

### **Setting Up a New Project**
```bash
# 1. Choose your base project
cd project-01-content-generator

# 2. Start development with Claude Code
claude code .

# 3. Natural language development
# Tell Claude what you want to build or modify
```

### **Natural Language Development Commands**
Use these conversational patterns with Claude Code:

- **"Modify the expense tracker to handle receipts differently"**
- **"Add a new agent that does market research"**
- **"Create a monthly report feature for this project"**
- **"Fix the Docker setup issue"**
- **"Deploy this project to Google Cloud"**
- **"Add authentication to the web interface"**
- **"Set up Google OAuth for team collaboration"**
- **"Create audit trail for task accountability"**
- **"Add team member management to Project 4"**

### **Team Development Workflows (Project 4+)**
Use these patterns for multi-user and team collaboration projects:

- **"Help me set up Google OAuth for my team"**
- **"Configure team roles and permissions"**
- **"Show me the audit trail for task changes"**
- **"Add a new team member with guest access"**
- **"Create a team productivity dashboard"**
- **"Set up JWT token management"**

### **Container-First Development**
All development happens in Docker containers:
- **Consistent environments** across all developers
- **No native dependencies** required
- **Production-ready** from development

---

## 📂 **Project Structure**

```
multi-ai-coding-agent/
├── README.md                         # Main documentation
├── CLAUDE.md                         # This file - development guide
├── GEMINI.md                         # Gemini AI agent instructions
├── LICENSE                           # MIT License
├── .gitignore                        # Privacy protection
│
├── project-01-content-generator/     # Multi-agent content creation
├── project-02-expense-tracker/       # Business expense automation
├── project-03-task-tracker/          # Natural language task logging to Google Sheets
├── project-04-task-tracker-for-team/ # Team collaboration with OAuth & audit trails
└── project-05-cloud-deployment/      # Production deployment (Under Development)
```

Each project is **completely self-contained** with:
- Docker configuration (`docker-compose.yml`, `Dockerfile`)
- Environment setup (`.env.example`)
- Complete documentation (`README.md`)
- Web interface and API
- Customization examples

---

## 🎓 **Project-Specific Guidelines**

### **Project 1: Content Generator**
**Focus**: Multi-agent content creation with real-time web UI
**Key Features**:
- Pre-configured CrewAI agents (Researcher → Strategist → Writer)
- WebSocket for live console output
- Topic-based content generation
- Professional React frontend

**Customization Examples**:
- Change content types (blogs → social media → emails)
- Add new research sources
- Modify writing tone and style
- Add content scheduling features

### **Project 2: Expense Tracker**
**Focus**: IRS-compliant business expense automation
**Key Features**:
- Natural language expense input
- AI-powered categorization and validation
- CSV storage with business-ready schema
- Multi-agent processing pipeline

**Customization Examples**:
- Add receipt image processing
- Create custom expense categories
- Build monthly/quarterly reports
- Integrate with accounting software APIs

### **Project 3: Task Tracker**
**Focus**: Natural language task logging to Google Sheets with AI agents
**Key Features**:
- Google Sheets API integration for task storage
- Natural language input processing with CrewAI agents
- Automatic task categorization and priority detection
- Microservices architecture with Docker Compose
- Real-time task updates and reporting

**Customization Examples**:
- Add custom task categories for your business
- Integrate with project management tools
- Create automated task reminders
- Build team productivity reports

### **Project 4: AI Task Tracker for Teams**
**Focus**: Team collaboration with Google OAuth authentication and audit trails
**Key Features**:
- Google OAuth 2.0 SSO authentication
- Complete audit trail system (who, what, when, why)
- Enhanced Google Sheets with user attribution
- Role-based access control (team_lead, member, guest)
- Two-pizza team coordination (5-8 people)
- JWT token management and secure sessions

**Customization Examples**:
- Configure team roles and permissions
- Set up OAuth with Google Cloud Console
- Create team productivity dashboards
- Add real-time collaboration features
- Integrate with team communication tools

### **Project 5: Cloud Deployment Guide** *(Under Development)*
**Focus**: Production deployment patterns
**Coverage**:
- Google Cloud Run deployment
- Container optimization
- Environment configuration
- Monitoring and scaling

---

## 🔧 **Common Development Tasks**

### **Starting a Project**
```bash
# Recommended (Makefile)
make up

# Alternative (Compose v2)
docker compose up --build

# Backend only (for API testing)
docker compose up content-generator

# Logs
docker compose logs -f content-generator
```

### **Makefile Targets (per project)**
- `up` — start backend + frontend
- `logs` — follow logs for both services
- `test-backend` — run pytest in backend container
- `test-frontend` — run CRA/Jest tests in frontend container
- `down` — stop and remove containers
- `rebuild` — rebuild images without cache
- `sh-backend` / `sh-frontend` — open interactive shells

Examples:
```bash
make up
make logs
make test-backend
make down
```

### **Modifying CrewAI Agents**
```python
# Example: Modify agent behavior
from crewai import Agent

researcher = Agent(
    role='Research Specialist',
    goal='Find comprehensive information about the topic',
    backstory='Expert researcher with access to various sources',
    # Customize these parameters for your use case
    verbose=True,
    allow_delegation=False
)
```

### **Environment Configuration**
```bash
# Copy and customize environment (no overwrite)
[ -f .env ] || cp .env.example .env

# Key variables to configure:
OPENAI_API_KEY=your-key-here
ANTHROPIC_API_KEY=your-key-here
SERPER_API_KEY=your-search-key

# Google Sheets integration (Project 3+):
GOOGLE_SHEETS_ID=your_sheet_id_here
GOOGLE_APPLICATION_CREDENTIALS=credentials/gcp-service-account.json

# Team collaboration (Project 4+):
GOOGLE_CLIENT_ID=your_oauth_client_id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_oauth_client_secret
JWT_SECRET_KEY=your_super_secret_jwt_key
```

---

## 🛠️ **Customization Patterns**

### **Adding New Agents**
1. **Define the agent role** and responsibilities
2. **Create agent configuration** in `src/agents/`
3. **Add to crew workflow** in main coordination file
4. **Test agent interaction** with existing agents
5. **Update frontend** to display new agent output

### **Modifying Business Logic**
1. **Identify the target functionality** in agent tasks
2. **Update agent prompts** and goals
3. **Modify data processing** in backend APIs
4. **Update frontend** to reflect changes
5. **Test end-to-end workflow**

### **Adding External APIs**
1. **Research API integration** requirements
2. **Add API configuration** to environment
3. **Create API client** in backend
4. **Integrate with agents** as tools
5. **Handle errors gracefully** in UI

---

## 🔐 **Authentication Setup Guide (Project 4)**

### **Google Cloud Console Setup**
1. **Create OAuth Application**
   - Go to Google Cloud Console
   - Create new project or use existing
   - Enable Google+ API, Google Sheets API
   - Create OAuth 2.0 credentials
   - Configure authorized redirect URIs

2. **Service Account Setup**
   - Create service account for Sheets access
   - Download JSON credentials
   - Share Google Sheet with service account email

### **Team Authentication Workflow**
```bash
# 1. Configure OAuth in .env
GOOGLE_CLIENT_ID=your_oauth_app.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_oauth_secret

# 2. Set up JWT tokens
JWT_SECRET_KEY=$(openssl rand -hex 32)

# 3. Test authentication flow
"Help me test Google OAuth login"

# 4. Verify team features
"Show me the audit trail for my team"
```

### **Learning Objectives**
- **OAuth 2.0 flow implementation** from scratch
- **JWT token management** and security
- **Audit trail design** for business accountability
- **Role-based access control** patterns
- **Team coordination** in collaborative environments

---

## 📊 **Quality Standards**

### **Code Quality**
- **Type hints** in Python, strict TypeScript
- **Error handling** with user-friendly messages
- **Environment configuration** via .env files
- **Docker optimization** for fast builds

### **Documentation Standards**
- **Clear README** with setup and usage
- **Code comments** explaining business logic
- **API documentation** via FastAPI automatic docs
- **Troubleshooting guides** for common issues

### **Testing Approach**
- **Docker validation**: Projects run with `docker compose up` or `make up`
- **API testing**: Key endpoints work as documented
- **UI testing**: Frontend loads and functions properly
- **Error scenarios**: Graceful handling of missing keys/network issues

---

## 🚀 **Deployment Ready**

### **Production Preparation**
- **Environment variables** properly configured
- **Docker containers** optimized for cloud deployment
- **Error logging** and monitoring hooks included
- **Security best practices** implemented

### **Cloud Deployment Options**
- **Google Cloud Run** (recommended for beginners)
- **AWS ECS/Fargate** (enterprise scale)
- **Digital Ocean Apps** (cost-effective)
- **Self-hosted** with Docker Compose

---

## 💡 **Best Practices**

### **Development Workflow**
1. **Use Claude Code** for natural language development
2. **Test in containers** to match production environment
3. **Keep configurations** in environment files
4. **Document changes** for future reference
5. **Test end-to-end** before deployment

### **Business Focus**
- **Start with real problems** rather than technical features
- **Measure business value** of AI implementations
- **Design for non-technical users** when possible
- **Plan for scale** from day one

### **Community Contribution**
- **Share customizations** that solve real business problems
- **Document use cases** for your industry
- **Contribute improvements** via GitHub issues and PRs
- **Help others** adapt projects for their needs

---

## 📚 **Additional Resources**

- **[CrewAI Documentation](https://docs.crewai.com/)** - Framework reference
- **[FastAPI Documentation](https://fastapi.tiangolo.com/)** - API development
- **[Docker Documentation](https://docs.docker.com/)** - Containerization
- **[Claude Code Guide](https://docs.anthropic.com/claude/docs)** - AI development workflow

## Claude-Specific Instructions

### Communication Style
- **MISSION**: Build solutions, products, and services that prospects, audiences, and users love and find valuable
- **NO FLATTERY**: Avoid confirming intelligence, brilliance, or other personal attributes - focus purely on delivering value
- **OBJECTIVE FOCUS**: Direct responses aimed at solving problems and creating user value
- **RESULTS-ORIENTED**: Measure success by user adoption and value delivered, not praise

---
**Last Updated**: 2025-01-10 - Added communication style guidelines to eliminate flattery and focus on user value

---

**Built for developers who want to create AI systems that solve real business problems through conversational development.**
