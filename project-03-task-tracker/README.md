# 🏗️ Project 3: AI Task Tracker - Microservices Architecture

**Enterprise-Level Architecture Made Simple with AI Coding Agents**

Transform natural language into organized task management using modern microservices patterns, CrewAI agents, and Google Sheets integration.

---

## 🎯 **What Makes This Different**

### Traditional Enterprise vs AI-Powered SMB Approach

**❌ Traditional Enterprise Complexity:**
- Requires teams of specialists (DevOps, architects, multiple developers)
- Months of setup before delivering business value
- Complex service meshes, multiple databases, message queues
- Expensive tooling and infrastructure from day one

**✅ AI-Powered SMB Solution:**
- **Single developer** + AI coding agents = enterprise capabilities
- **Working software in days**, not months
- **Start simple, scale smart** - add complexity when business justifies
- **Pay-as-you-scale** - no upfront investment in unused features

---

## 🏛️ **Microservices Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   CrewAI        │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   Service       │
│   Port 3000     │    │   Port 8000     │    │   Port 8001     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                             ┌─────────────────┐
                                             │  Google Sheets  │
                                             │      API        │
                                             └─────────────────┘
```

### Service Responsibilities

#### 🌐 **Frontend Service** (Port 3000)
- **What**: React application with TypeScript
- **Why**: User interface and experience
- **Teaching Points**:
  - Component-based UI architecture
  - API client separation
  - Environment-based configuration

#### 🚪 **API Gateway** (Port 8000)
- **What**: FastAPI HTTP gateway
- **Why**: Single entry point, request routing, error handling
- **Teaching Points**:
  - API Gateway pattern
  - Service-to-service communication
  - Centralized error handling and logging

#### 🤖 **CrewAI Service** (Port 8001)
- **What**: AI agents with Google Sheets integration
- **Why**: Natural language processing and task intelligence
- **Teaching Points**:
  - CrewAI best practices and professional packaging
  - Modern Python development with `pyproject.toml`
  - CLI + HTTP dual-mode operation

---

## 🚀 **Quick Start (SMB-Friendly)**

### Prerequisites
- Docker Desktop running
- Google account
- OpenAI API key

### 1. Start All Services
```bash
# Single command - AI agents handle the complexity
make up

# Or using docker-compose directly
docker compose up -d
```

### 2. Configure Google Sheets
```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
# See setup/google-sheets-setup-guide.md for detailed help
```

### 3. Access Your Application
- **Frontend**: http://localhost:3000 (User interface)
- **API Docs**: http://localhost:8000/docs (Interactive API)
- **Health Check**: http://localhost:8000/health

---

## 📁 **Project Structure**

```
project-03-task-tracker/
├── README.md                     # This file
├── ARCHITECTURE-DESIGN.md        # Detailed architecture documentation
├── docker-compose.yml            # Service orchestration
├── Makefile                      # Development commands
├── .env.example                  # Environment template
├── credentials/                  # Google Cloud credentials
│   └── .gitkeep
│
├── frontend/                     # React Application (Port 3000)
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── services/             # API client
│   │   └── types/                # TypeScript definitions
│   ├── Dockerfile
│   └── package.json
│
├── api-service/                  # FastAPI Gateway (Port 8000)
│   ├── src/
│   │   ├── main.py               # FastAPI application
│   │   ├── routes/               # API endpoints (future)
│   │   └── middleware/           # CORS, logging (future)
│   ├── Dockerfile
│   └── requirements.txt
│
└── crew-service/                 # CrewAI Service (Port 8001)
    ├── src/
    │   └── task_crew/            # Python package
    │       ├── main.py           # CLI + HTTP server
    │       ├── agents/           # CrewAI agents
    │       ├── tools/            # Google Sheets integration
    │       └── models/           # Data models
    ├── pyproject.toml            # Modern Python packaging
    └── Dockerfile
```

---

## 🎓 **Learning Objectives & Teaching Points**

### 1. **Microservices Without the Pain**
- **Service boundaries** that solve real problems
- **Inter-service communication** patterns
- **Independent deployment** and scaling

### 2. **CrewAI Professional Patterns**
- **Modern Python packaging** with `pyproject.toml`
- **Proper module structure** following reference architecture
- **CLI + HTTP server** dual-mode operation

### 3. **Production-Ready from Day One**
- **Docker containerization** for all services
- **Health checks** and service monitoring
- **Environment-based configuration**

### 4. **SMB-to-Enterprise Growth Path**
- **Phase 1**: `docker-compose up` (perfect for small teams)
- **Phase 2**: Cloud deployment when business grows
- **Phase 3**: Add monitoring/analytics when needed

---

## 💻 **Development Commands**

### Essential Commands
```bash
make up          # Start all services
make down        # Stop all services
make logs        # View logs from all services
make status      # Check service health
make rebuild     # Rebuild and restart everything
```

### Individual Services
```bash
make crew        # Start only CrewAI service
make api         # Start only API gateway
make frontend    # Start only React frontend
```

### Monitoring & Health
```bash
make health      # Check all health endpoints
make services    # List running Docker services
```

---

## 🔧 **Configuration**

### Environment Variables
```bash
# Required for Google Sheets integration
GOOGLE_SHEETS_ID=your_sheet_id_here
OPENAI_API_KEY=your_openai_key_here

# Service URLs (configured automatically)
CREW_SERVICE_URL=http://crew-service:8001
REACT_APP_API_URL=http://localhost:8000
# CORS and logging (API Gateway)
# Comma-separated list of allowed origins for CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
# Log level (DEBUG, INFO, WARNING, ERROR)
LOG_LEVEL=INFO
# Redact user inputs from API logs (true/false)
LOG_REDACT_INPUTS=true
```

### Frontend Performance (WSL/Volume Mounts)
- The React dev server file-watcher polling is disabled for faster startup in Docker on WSL: `CHOKIDAR_USEPOLLING=false`.
- Rationale: polling causes high I/O and can make the first compile take >60s. Disabling polling keeps hot reload while improving cold start.
- Change location: `docker-compose.yml` under the `frontend` service.
- Apply changes: `docker compose up -d frontend`.

### Google Sheets Setup
1. **Quick Setup**: Follow `setup/google-sheets-setup-guide.md`
2. **Create service account** and download credentials
3. **Share your sheet** with service account email
4. **Place credentials** in `credentials/gcp-service-account.json`

---

## 🧪 **Testing Your Setup**

### Health Check
```bash
# Check all services are running
make status

# Expected output:
# ✅ Crew Service (8001) - Running
# ✅ API Service (8000) - Running
# ✅ Frontend (3000) - Running
```

### End-to-End Test
1. **Open frontend**: http://localhost:3000
2. **Enter natural language**: "Working on user authentication, high priority"
3. **Check Google Sheet**: Should see new task with structured data
4. **Test completion**: "Finished user authentication"
5. **Verify update**: Task status should change to COMPLETED

---

## 🎯 **Example Usage**

### Natural Language Input → Structured Tasks

| What You Say | What Happens |
|--------------|--------------|
| `"Working on login system, high priority"` | ➕ Creates HIGH priority task |
| `"Finished the login feature"` | ✅ Updates existing task to COMPLETED |
| `"Bug in payment system, urgent"` | 🚨 Creates URGENT priority task |
| `"Meeting with team tomorrow 2pm"` | 📅 Creates scheduled task |

### Smart Task Management
- **Automatic categorization** (Development, Meeting, Documentation, etc.)
- **Priority detection** (LOW, MEDIUM, HIGH, URGENT)
- **Status tracking** (NOT_STARTED, IN_PROGRESS, COMPLETED)
- **Progress updates** with natural language

---

## 🔍 **Troubleshooting**

### Common Issues

#### **Services Won't Start**
```bash
# Check Docker is running
docker info

# Rebuild everything clean
make clean
make up
```

#### **Google Sheets Access Denied**
```bash
# Verify configuration
curl http://localhost:8000/api/config

# Check credentials file exists
ls -la credentials/gcp-service-account.json

# Verify sheet is shared with service account
```

#### **AI Processing Errors**
```bash
# Check OpenAI API key
grep OPENAI_API_KEY .env

# View crew service logs
docker compose logs crew-service
```

### Debug Commands
```bash
# View all service logs
make logs

# Check individual service
docker compose logs crew-service
docker compose logs api-service

# Test service connectivity
curl http://localhost:8001/health  # CrewAI service
curl http://localhost:8000/health  # API gateway

# Test CORS preflight from allowed origin
curl -i -X OPTIONS http://localhost:8000/api/tasks \
  -H 'Origin: http://localhost:3000' \
  -H 'Access-Control-Request-Method: POST'

# Temporarily enable DEBUG with no redaction (for local debugging only)
# Edit .env then rebuild/restart:
# LOG_LEVEL=DEBUG
# LOG_REDACT_INPUTS=false
make rebuild && make logs
```

---

## 🔄 **Scaling Path (SMB to Enterprise)**

### Current Setup (Perfect for SMB)
- **Single machine deployment** with `docker-compose`
- **3 services** handling up to 1000+ tasks
- **Local development** with hot reloading
- **Cost**: ~$20/month (OpenAI + Google Cloud free tier)

### Security Defaults
- Containers run as non-root users.
- API masks user input in logs by default (`LOG_REDACT_INPUTS=true`).
- CORS is limited to localhost origins by default (`ALLOWED_ORIGINS`).

### Growth Phase (Scale when needed)
```bash
# AI agents help you scale
claude-code "Deploy to Google Cloud Run"
# → Automatic container registry setup
# → Load balancing configuration
# → Environment management
```

### Enterprise Features (Add when business justifies)
- **Monitoring**: Prometheus + Grafana (AI-generated configs)
- **Analytics**: Task insights and team productivity
- **Auth**: User management and permissions
- **Advanced**: Multi-tenant, webhooks, integrations

---

## 🏆 **Success Metrics**

### For Students
- [ ] Can explain service boundaries and responsibilities
- [ ] Understands microservices communication patterns
- [ ] Can deploy and debug distributed systems
- [ ] Follows CrewAI and modern Python best practices

### For SMBs
- [ ] Working task management system in < 1 day
- [ ] Team collaboration through shared Google Sheets
- [ ] Natural language interface for non-technical users
- [ ] Ready to scale when business grows

---

## 📚 **Next Steps**

### Immediate
1. **Complete Google Sheets setup** following the guide
2. **Test with your team** - add members to the shared sheet
3. **Customize categories** for your business needs

### Growth
1. **Add team members** to Google Sheet for collaboration
2. **Customize task categories** for your domain
3. **Deploy to cloud** when you outgrow local development
4. **Add integrations** (Slack, email notifications, etc.)

### Enterprise
1. **Implement authentication** and user management
2. **Add advanced reporting** and analytics
3. **Scale infrastructure** with Kubernetes
4. **Add compliance features** (audit trails, data governance)

---

## 🔗 **Resources**

- **Setup Guide**: `setup/google-sheets-setup-guide.md`
- **Architecture Details**: `ARCHITECTURE-DESIGN.md`
- **CrewAI Documentation**: https://docs.crewai.com/
- **FastAPI Guide**: https://fastapi.tiangolo.com/
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/

---

**Built for SMBs who want enterprise-class architecture without the traditional complexity overhead. AI coding agents handle the tedious parts, you focus on business value.**
