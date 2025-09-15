# CLAUDE.md - Multi-AI Coding Agent Development Guide

This file provides Claude Code-specific instructions for developing and customizing the Multi-AI Coding Agent sample projects.

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
- **Deployment**: Docker + Docker Compose
- **Architecture**: Multi-agent coordination with professional web UI
- **Progressive Complexity**: Simple → Data Storage → API Integration → Cloud Deployment

---

## 🏗️ **Architecture Overview**

### **Multi-Service Architecture**
Each project follows a consistent pattern:
- **Backend**: CrewAI + FastAPI (Python 3.10-3.12)
- **Frontend**: React + TypeScript + WebSocket integration
- **Orchestration**: Docker Compose with service dependencies
- **Data**: Local file storage (CSV, JSON) with Docker volume mounts

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
├── LICENSE                           # MIT License
├── .gitignore                        # Privacy protection
│
├── project-01-content-generator/     # Multi-agent content creation
├── project-02-expense-tracker/       # Business expense automation
├── project-03-project-analyzer/      # Risk assessment (Under Development)
├── project-04-rental-analyzer/       # Investment analysis (Under Development)
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

### **Project 3: Project Analyzer** *(Under Development)*
**Focus**: Risk assessment with Google Sheets integration
**Key Features**:
- Google Sheets API integration
- Multi-agent risk analysis
- Executive dashboard reporting
- Actionable recommendations

### **Project 4: Rental Property Analyzer** *(Under Development)*
**Focus**: Investment analysis with synthetic data
**Key Features**:
- Financial modeling (ROI, cash flow, cap rate)
- Multi-agent market analysis
- Professional financial reports
- Investment decision support

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
