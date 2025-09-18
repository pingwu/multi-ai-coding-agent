# ADK Quickstart — Containerized Google ADK with Custom Chat Frontend

A **Docker-first, containerized Google ADK solution** with a custom React chat interface that replaces Google's built-in web UI. This project demonstrates modern development infrastructure using containers instead of local Python installations, providing a production-ready foundation for Google ADK integration.

## 🎯 **Purpose & Value**

**Replace Google ADK's built-in web UI** with a professional chat interface while maintaining Docker-first development:

- ✅ **Custom Frontend**: Modern React + TypeScript chat interface instead of Google's default UI
- ✅ **Containerized Infrastructure**: No local Python installation required - everything runs in Docker
- ✅ **Real Google ADK Integration**: Connect to actual Google Gemini AI with your API key
- ✅ **Development-Ready**: Hot reload, WebSocket real-time updates, professional UI patterns
- ✅ **Production Foundation**: Enterprise-ready patterns with proper environment configuration

## 🚀 **Why This Exists**

**Traditional ADK Setup Problems:**
- Requires local Python environment setup
- Uses Google's basic web UI
- Manual dependency management
- Environment configuration complexity

**Our Container-First Solution:**
- ✅ **Docker-only development** - no local Python installation needed
- ✅ **Custom chat interface** - professional UI with real-time WebSocket updates
- ✅ **Environment isolation** - all dependencies containerized
- ✅ **Production patterns** - enterprise-ready configuration management

## ⚡ **Quick Start** *(5 minutes)*

### Prerequisites
- Docker Desktop installed and running
- Google AI API key ([Get one here](https://aistudio.google.com/app/apikey))

### 1. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your Google API key:
# ENABLE_REAL_ADK=true
# GOOGLE_API_KEY=your-actual-google-api-key-here
```

### 2. Launch the Application
```bash
# Option 1: Using Make (recommended)
make up

# Option 2: Using Docker Compose directly
docker compose up --build

# Option 3: From repo root
make up-adk
```

### 3. Access Your Custom Chat Interface
- **Frontend**: http://localhost:3000 (your custom chat UI)
- **Backend API**: http://localhost:8000/docs (FastAPI documentation)

### 4. Test Real Google ADK Integration
1. Open http://localhost:3000
2. Type any message in the chat interface
3. Watch real-time processing updates via WebSocket
4. Receive actual Google Gemini AI responses
5. See token usage and execution time metadata

## 🏗️ **Architecture**

### **Container Stack**
```
┌─────────────────────────────────────────┐
│           Custom Chat Frontend          │
│        React + TypeScript + WS         │
│            localhost:3000               │
└─────────────────┬───────────────────────┘
                  │ HTTP + WebSocket
┌─────────────────▼───────────────────────┐
│         FastAPI Backend                 │
│      Google ADK Integration             │
│            localhost:8000               │
└─────────────────┬───────────────────────┘
                  │ HTTPS API
┌─────────────────▼───────────────────────┐
│         Google Gemini AI                │
│        (Real API Calls)                 │
└─────────────────────────────────────────┘
```

### **Key Components**
- **Frontend**: React chat interface with WebSocket real-time updates
- **Backend**: FastAPI server with Google ADK integration
- **WebSocket**: Live progress updates during AI processing
- **Environment**: Docker containers with isolated dependencies

## 🔧 **Development Features**

### **Custom Chat Interface**
- Real-time message status (sending → sent → completed)
- WebSocket live updates during AI processing
- Token usage and execution time display
- Configurable model settings (temperature, max tokens)
- Professional chat UI with typing indicators

### **Container Benefits**
- **No Local Python**: Everything runs in Docker containers
- **Hot Reload**: Frontend auto-updates during development
- **Isolated Dependencies**: No conflicts with system Python
- **Production Ready**: Same containers work in production

### **Google ADK Integration**
- **Real API Calls**: Actual Google Gemini responses
- **Fallback Mode**: Simulation when API key not provided
- **Environment-Based**: Easy switching between modes
- **Secure Configuration**: API keys via environment variables

## 📁 **Project Structure**

```
adk-quickstart/
├── README.md                    # This file
├── docker-compose.yml          # Container orchestration
├── Makefile                    # Development shortcuts
├── .env.example               # Environment template
├── .env                      # Your actual config (gitignored)
│
├── backend/                  # FastAPI + Google ADK
│   ├── Dockerfile           # Python container setup
│   ├── requirements.txt     # Python dependencies
│   └── app/
│       └── main.py          # ADK integration + WebSocket
│
└── frontend/                # React + TypeScript
    ├── Dockerfile          # Node container setup
    ├── package.json        # Frontend dependencies
    └── src/
        ├── App.tsx         # Main chat application
        ├── components/     # Chat UI components
        │   ├── ChatBox.tsx
        │   ├── MessageList.tsx
        │   ├── ChatInput.tsx
        │   └── ConfigPanel.tsx
        └── types/          # TypeScript definitions
            └── chat.ts
```

## ⚙️ **Configuration Options**

### **Environment Variables**
```bash
# Google ADK Integration
ENABLE_REAL_ADK=true                    # Enable real Google API calls
GOOGLE_API_KEY=your-api-key-here       # Your Google AI API key

# Backend Configuration
ALLOWED_ORIGINS=http://localhost:3000   # CORS settings
SIMULATION_DELAY_SECONDS=0.6           # Demo mode timing
MAX_CONCURRENT_SESSIONS=25             # Rate limiting

# Frontend Configuration (optional)
REACT_APP_BACKEND_BASE_URL=            # Backend override
```

### **Google ADK Models**
Available models in the chat interface:
- `gemini-1.5-flash` (default) - Fast, efficient responses
- `gemini-1.5-pro` - Advanced reasoning capabilities
- `gemini-2.0-flash-lite` - Latest model variant

## 🚀 **Usage Scenarios**

### **Development Workflow**
```bash
# Start development environment
make up

# Watch logs in real-time
make logs

# Stop when done
make stop

# Rebuild after changes
make rebuild
```

### **Production Deployment**
1. **Environment Setup**: Configure production environment variables
2. **Container Build**: Use same Dockerfiles for production
3. **Orchestration**: Deploy with Docker Compose or Kubernetes
4. **Scaling**: Add load balancer for multiple backend instances

## 🔒 **Security & Best Practices**

### **API Key Management**
- ✅ **Environment Variables**: Store API keys in `.env` (never commit)
- ✅ **Container Isolation**: Secrets stay within Docker environment
- ✅ **CORS Protection**: Configured for localhost development
- ✅ **No Disk Persistence**: Session data stays in memory

### **Local Development Considerations**
- ✅ **Sanitized Logs**: Email and ID redaction in console output
- ✅ **Rate Limiting**: Configurable concurrent session limits
- ✅ **Error Handling**: Graceful fallback when API unavailable
- ✅ **Local Network Only**: Not exposed to public internet by default

## 🛠️ **Development Commands**

| Command | Description |
|---------|-------------|
| `make up` | Start containers with build |
| `make stop` | Stop and remove containers |
| `make logs` | Follow logs for both services |
| `make rebuild` | Rebuild images without cache |
| `docker compose ps` | Check container status |

## 🔄 **Operating Modes**

### **1. Real Google ADK Mode** (Production)
```bash
# .env configuration
ENABLE_REAL_ADK=true
GOOGLE_API_KEY=your-actual-api-key
```
- Connects to Google Gemini API
- Real AI responses and token usage
- Production-ready setup

### **2. Simulation Mode** (Demo/Testing)
```bash
# .env configuration
ENABLE_REAL_ADK=false
# GOOGLE_API_KEY=commented-out
```
- Simulated responses for demo purposes
- No external API calls
- Suitable for public demonstrations

## 🐛 **Troubleshooting**

### **Common Issues**

**"Offline" status in chat interface:**
- Check that both containers are running: `docker compose ps`
- Verify backend is accessible: `curl http://localhost:8000/api/agent`
- Check WebSocket connection in browser developer tools

**API errors:**
- Verify `GOOGLE_API_KEY` is set correctly in `.env`
- Check API key permissions at Google AI Studio
- Review backend logs: `make logs`

**Container build failures:**
- Ensure Docker Desktop is running
- Try rebuilding: `make rebuild`
- Check disk space and Docker memory limits

### **Log Analysis**
```bash
# Check backend status
make logs

# Look for these key messages:
# ✅ "Real ADK mode enabled; live Gemini calls will be attempted."
# ✅ "Connected to Google ADK. Ensure secrets stay off disk."
```

## 🎓 **Educational Value**

**Learning Objectives:**
- **Docker-First Development**: Build without local Python setup
- **Custom Frontend Integration**: Replace vendor-provided UIs
- **Real-time WebSocket Communication**: Live updates in web applications
- **Environment Configuration**: Production-ready secret management
- **API Integration Patterns**: Connect to external AI services

**Perfect for:**
- AI engineering students learning production patterns
- Developers wanting to customize Google ADK experience
- Teams building AI applications with custom interfaces
- Anyone preferring containerized development environments

---

## 📚 **Related Documentation**

- **Main Project**: [../README.md](../README.md) - Overview of all projects
- **Development Guide**: [../CLAUDE.md](../CLAUDE.md) - AI-powered development patterns
- **Google ADK Official**: [Google AI Platform Documentation](https://ai.google.dev/)

---

**Built for the Multi-Agent Systems course as a production-ready example of containerized AI development with custom frontends.**