# 💸 AI Expense Tracker - Multi-Agent System

> Start Here (2 minutes)
> - Prereqs: Docker Desktop running (verify with `docker info`); `make` installed (see ../setup/makefile-essentials.md)
> - Commands:
>   ```bash
>   # from this folder
>   [ -f .env ] || cp .env.example .env   # add keys if needed
>   make up                # starts backend (expense-tracker) + frontend
>   ```
> - Open: http://localhost:3001 (frontend) and http://localhost:8001 (backend)
> - Common targets: `make logs`, `make test-backend`, `make test-frontend`, `make down`

**Professional expense tracking using CrewAI + FastAPI + TypeScript**

[![CrewAI](https://img.shields.io/badge/CrewAI-0.177.0-blue)](https://crewai.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://docker.com/)

## 🎯 Project Overview

This project demonstrates a production-ready multi-agent AI content generation system where **3 specialized AI agents** work together to create high-quality content:

1. **🔍 Research Agent**: Gathers comprehensive information and data
2. **🎯 Strategy Agent**: Develops content framework and structure  
3. **📝 Writer Agent**: Creates engaging, professional content

**Perfect for learning:** Multi-agent coordination, web development, API design, and professional deployment patterns.

---

## 🚀 Quick Start (10 minutes)

### Workflow (Choose One)

| Step                  | 🤖 AI-Powered (Recommended)                                                 | 💻 Manual Command Line                                                                                                   |     |                                        |
| --------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --- | -------------------------------------- |
| 1. Clone the Repo     | Tell your agent: “Clone the multi-ai-coding-agent repo and open Project 2.” | `git clone https://github.com/pingwu/multi-ai-coding-agent.git`<br>`cd multi-ai-coding-agent/project-02-expense-tracker` |     |                                        |
| 2. Launch Project     | “Bring up Project 2” or “Start the expense tracker project.”                | From repo root: `make -C project-02-expense-tracker up`<br>From this folder: `make up`                                   |     |                                        |
| 3. Configure API Keys | “Help me set up my API keys.”                                               | `[ -f .env ]                                                                                                             |     | cp .env.example .env` then edit `.env` |
| Result                | App at `http://localhost:3001` (UI) and `http://localhost:8001` (API).      | App at `http://localhost:3001` (UI) and `http://localhost:8001` (API).                                                   |     |                                        |

### Prerequisites
- **Docker Desktop** installed and running
- **OpenAI API Key** for AI models ([Get it here](https://platform.openai.com/api-keys))
- **Serper API Key** for web search (FREE - [Get it here](https://serper.dev/))
- **Git** for cloning
- **8GB+ RAM** recommended

### 1. Clone and Setup (manual, detailed)
```bash
git clone https://github.com/pingwu/multi-ai-coding-agent.git
cd multi-ai-coding-agent/project-02-expense-tracker

# Copy environment template (skip if .env already exists)
[ -f .env ] || cp .env.example .env

# Add your API keys to .env file (or edit with your editor)
echo "OPENAI_API_KEY=your-openai-key-here" >> .env
echo "SERPER_API_KEY=your-serper-key-here" >> .env
```

### 2. Start the Application
```bash
# Recommended (Makefile)
make up

# Alternative (Compose v2)
docker compose up --build

# Backend: http://localhost:8001 (docs at /docs)
# Frontend: http://localhost:3001
```

### 3. Test the API
```bash
# Test with curl
curl -X POST "http://localhost:8001/api/generate" \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI in Healthcare 2025"}'
```

### 4. Use the Web Interface
Open your browser to http://localhost:3001 to use the web interface for content generation.

**🎉 Success!** You now have a professional AI content generation system running locally.

---

## 📊 Sample Data (Expenses)

This project ships with a sample dataset you can use to explore features quickly.

- Sample file: `data/expenses_sample.csv`
- Production file used by the app: `data/expenses.csv`

To replace your current dataset with the sample data:

```bash
cd project-02-expense-tracker
# Option A: Replace entirely (overwrites your current data)
cp data/expenses_sample.csv data/expenses.csv

# Option B: Append sample rows (skip header)
tail -n +2 data/expenses_sample.csv >> data/expenses.csv
```

If containers are already running, you typically don't need to restart. If needed:

```bash
docker compose down && docker compose up -d
```

Because `./data` is bind-mounted into the container (`/app/data`), CSV edits are picked up immediately — no container restart needed. Use the "Refresh" button in the UI or reload the page to see updates. If you still don't see changes, restart Project 2 containers.

Now refresh the UI and you should see the sample expenses reflected.

---

## ⚡ Agent vs Commands Cheatsheet

| Task | Natural Language (Claude/agents) | Manual Command |
| --- | --- | --- |
| Start Project 2 | "Start the expense tracker project." | `docker compose -f project-02-expense-tracker/docker-compose.yml up -d` |
| Stop Project 2 | "Shut down the expense tracker project." | `docker compose -f project-02-expense-tracker/docker-compose.yml down` |
| Logs (follow) | "Show logs for Project 2 until I say stop." | `docker compose -f project-02-expense-tracker/docker-compose.yml logs -f` |
| Status | "Show running containers for Project 2." | `docker compose -f project-02-expense-tracker/docker-compose.yml ps` |
| Backend tests | "Run backend tests for Project 2." | `docker compose -f project-02-expense-tracker/docker-compose.yml run --rm expense-tracker pytest -q` |
| Frontend tests | "Run frontend tests for Project 2." | `docker compose -f project-02-expense-tracker/docker-compose.yml run --rm frontend npm test -- --watchAll=false` |
| Rebuild images | "Rebuild Project 2 images from scratch." | `docker compose -f project-02-expense-tracker/docker-compose.yml build --no-cache` |

Ports (when running alongside Project 1):
- Frontend: http://localhost:3001
- Backend: http://localhost:8001


## 🏗️ Architecture Overview

### **Multi-Agent Workflow**
```
User Input (Topic) 
    ↓
🔍 Research Agent → Uses web search to gather real-time information, statistics, trends
    ↓
🎯 Strategy Agent → Creates content strategy and structure
    ↓  
📝 Writer Agent → Generates final polished content
    ↓
Generated Content (Markdown)
```

### **Technology Stack**

**Backend:**
- **CrewAI 0.177.0**: Multi-agent orchestration framework
- **SerperDevTool**: Free web search API integration
- **FastAPI**: Modern Python web framework with async support
- **Uvicorn**: ASGI server for production deployment
- **WebSockets**: Real-time console output streaming
- **Pydantic**: Data validation and serialization

**Frontend:**
- **React 18**: Modern JavaScript UI library
- **TypeScript**: Type-safe JavaScript for better development
- **Real-time Updates**: WebSocket integration for live progress
- **Responsive Design**: Works on desktop and mobile

**DevOps:**
- **Docker**: Containerized deployment
- **Docker Compose**: Multi-service orchestration
- **Environment Management**: Secure API key handling

---

## 📂 Project Structure

```
content-generator/
├── 📋 README.md                    # This file
├── 🐳 docker-compose.yml           # Container orchestration
├── 🐳 Dockerfile                   # Python backend container
├── ⚙️  pyproject.toml              # Python dependencies (CrewAI 0.177.0)
├── 🔐 .env.example                 # Environment template
│
├── 📁 src/my_mas/                  # CrewAI backend
│   ├── 🤖 crew.py                 # Agent and task definitions
│   ├── 🌐 web_api.py              # FastAPI web server
│   ├── 🚀 main.py                 # CLI entry point
│   └── 📁 config/                 # YAML configurations
│       ├── agents.yaml             # Agent definitions
│       └── tasks.yaml              # Task definitions
│
├── 📁 frontend/                    # React TypeScript UI
│   ├── 📦 package.json            # Node.js dependencies
│   ├── 📁 src/
│   │   ├── 🎨 App.tsx             # Main React application
│   │   ├── 💅 App.css             # Styling
│   │   └── 📁 components/          # React components
│   │       ├── ContentForm.tsx     # Input form
│   │       ├── LiveConsole.tsx     # Real-time output
│   │       └── ResultsDisplay.tsx  # Generated content
│   └── 🐳 Dockerfile              # Frontend container
│
└── 📁 generated_content/           # Output directory
```

---

<details>
<summary><strong>For Course Participants: Learning Objectives</strong></summary>

### Session 1-2: Multi-Agent Foundations
- Understand CrewAI agent coordination patterns
- Learn agent role definition and task assignment
- Master Docker-based development workflow
- Build professional API endpoints with FastAPI

### Session 3-4: Frontend Integration
- Create TypeScript React applications
- Implement real-time WebSocket communication
- Design responsive, professional user interfaces
- Handle asynchronous API interactions

### Skills You'll Gain
- Multi-Agent AI Systems: Design and coordinate specialized AI agents
- Full-Stack Development: Python backend + TypeScript frontend
- API Design: RESTful services with WebSocket real-time updates
- Professional Deployment: Docker containerization and orchestration
- Production Patterns: Error handling, logging, and monitoring

</details>

## 🔧 Customization Guide

### **Easy Modifications** (No coding required)
- **Change Agent Personalities**: Edit `config/agents.yaml`
- **Modify Tasks**: Update `config/tasks.yaml` 
- **Add New Topics**: Use the web interface
- **Adjust Styling**: Modify `frontend/src/App.css`

### **Medium Modifications** (Basic coding)
```python
# Add a new agent to crew.py
@agent
def editor(self) -> Agent:
    return Agent(
        config=self.agents_config['editor'],
        verbose=True
    )
```

### **Advanced Modifications** (Full development)
- **Add New Tools**: Integrate web search, databases, APIs
- **Custom Processing**: Add specialized content types
- **Advanced UI**: Add drag-and-drop, file uploads, previews
- **Integration**: Connect to CMS, social media, email systems

---

## 🛠️ API Reference

### **Generate Content**
```http
POST /api/generate
Content-Type: application/json

{
  "topic": "AI in Healthcare this year",
  "agents": { ... },  # Optional agent customization
  "tasks": { ... }    # Optional task customization  
}

Response: {
  "job_id": "uuid",
  "status": "pending"
}
```

### **Check Status**
```http
GET /api/status/{job_id}

Response: {
  "job_id": "uuid",
  "status": "completed|running|error",
  "created_at": "2026-01-15T10:30:00Z",
  "result": "Generated content..."
}
```

### **Get Results**
```http
GET /api/result/{job_id}

Response: {
  "job_id": "uuid", 
  "topic": "AI in Healthcare 2026",
  "result": "# AI in Healthcare 2026\n\n..."
}
```

### **Real-time Console** 
```javascript
// WebSocket connection for live updates
const ws = new WebSocket('ws://localhost:8001/ws/console/{job_id}');
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log(message.message); // Agent progress updates
};
```

---

## 🚀 Deployment Guide

### **Local Development**
```bash
# Full stack (backend + frontend) - DEFAULT
docker compose up --build

# Backend only (if you only need the API)
docker compose up expense-tracker

# Frontend only (requires backend running separately)
docker compose up frontend
```

### **Production Deployment**
```bash
# Build production images
docker compose -f docker-compose.prod.yml build

# Deploy to cloud (Google Cloud Run example)
gcloud run deploy content-generator \
  --source . \
  --region us-central1 \
  --set-env-vars OPENAI_API_KEY=your-key
```

### **Environment Variables**
```bash
# Required
OPENAI_API_KEY=your-openai-api-key      # Get from https://platform.openai.com/api-keys
SERPER_API_KEY=your-serper-api-key      # Get FREE key from https://serper.dev/

# Optional
ANTHROPIC_API_KEY=your-anthropic-key    # Alternative AI model
DEBUG=true                              # Development mode
CORS_ORIGINS=http://localhost:3001      # Frontend URL
```

---

## 🔍 Troubleshooting

### **Common Issues**

**Problem**: `Agent execution timeout` or `Search failed`  
**Solution**: Check API key configuration:
```bash
# Verify .env file contains valid keys
cat .env | grep OPENAI_API_KEY
cat .env | grep SERPER_API_KEY
```

**Problem**: `SerperDevTool authentication failed`  
**Solution**: Get a FREE Serper API key:
1. Visit https://serper.dev/
2. Sign up for free account (100 searches/month)
3. Copy your API key
4. Add to your .env file: `SERPER_API_KEY=your-key-here`

**Problem**: `Docker build fails`  
**Solution**: Clean Docker cache and rebuild:
```bash
docker system prune -f
docker compose build --no-cache
```

### **Performance Optimization**
- **API Keys**: Use efficient AI models (GPT-4 vs GPT-3.5-turbo)
- **Caching**: Implement Redis for agent results
- **Scaling**: Use multiple worker processes with Gunicorn
- **Monitoring**: Add logging and metrics collection

---

## 💡 Lessons Learned from Testing

*   **Asynchronous API**: The content generation process is asynchronous.
    1.  A `POST` request to `/api/generate` starts the job and returns a `job_id`.
    2.  The status can be monitored via `docker compose logs`.
    3.  The final article must be retrieved with a `GET` request to `/api/result/{job_id}`.

*   **Content Storage**: The generated content is **not** automatically saved to the filesystem in the `generated_content/` directory. It is only available via the API endpoint. The content was manually saved to `generated_content/AI_in_Healthcare_2025.md` after being retrieved from the API.

*   **Initial Build Time**: The first time you run `docker compose up --build`, it can take a significant amount of time (several minutes) to download and install all the Python dependencies. Subsequent builds are much faster.

*   **Environment Variables**: Ensure your `.env` file is correctly set up with valid `OPENAI_API_KEY` and `SERPER_API_KEY` before starting the services.

---

## 📚 Additional Resources

### **CrewAI Documentation**
- [Official CrewAI Docs](https://docs.crewai.com/) - Complete framework documentation
- [Agent Configuration](https://docs.crewai.com/concepts/agents) - How to define agents
- [Task Management](https://docs.crewai.com/concepts/tasks) - Task creation and coordination

### **FastAPI Resources**  
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/) - Web framework fundamentals
- [WebSocket Guide](https://fastapi.tiangolo.com/advanced/websockets/) - Real-time communication

### **React/TypeScript**
- [React TypeScript Guide](https://react-typescript-cheatsheet.netlify.app/) - Frontend development
- [WebSocket Client](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) - Real-time frontend

### **Docker Resources**
- [Docker Compose Guide](https://docs.docker.com/compose/) - Multi-container deployment
- [Production Deployment](https://docs.docker.com/compose/production/) - Scaling and monitoring

---

## 🎯 What's Next?

### **Immediate Next Steps** (Session 2)
1. **Customize Agents**: Modify roles and tasks for your use case
2. **Test Different Topics**: Explore various content generation scenarios
3. **UI Enhancements**: Add new features to the frontend interface

### **Advanced Projects** (Sessions 3-4)
1. **Multi-Format Output**: Generate blogs, social media, emails
2. **Content Templates**: Save and reuse successful configurations
3. **Integration**: Connect to content management systems
4. **A/B Testing**: Compare different agent approaches

### **Production Features** (Sessions 5-6)  
1. **User Authentication**: Multi-user content generation
2. **Content Scheduling**: Automated publishing workflows
3. **Analytics**: Track content performance and optimization
4. **Enterprise Integration**: API keys, team management, billing

---

## 🌟 Success Criteria

By completing this project, you will have:

- ✅ **Built a professional multi-agent AI system** using CrewAI 0.177.0
- ✅ **Created a full-stack web application** with Python + TypeScript
- ✅ **Implemented real-time communication** using WebSockets
- ✅ **Deployed using industry-standard tools** (Docker, containerization)
- ✅ **Gained experience with production patterns** (APIs, error handling, logging)

**Portfolio Ready**: This project demonstrates advanced AI development skills that employers value highly.

---

**🚀 Ready to start building amazing AI-powered content systems? Let's create something incredible together!**

---

## 📄 License & Contributing

This project is part of the CSTU Multi-Agent Systems course. Feel free to customize and extend it for your own projects!

**Instructor**: Ping Wu  
**Course**: Multi-Agent Systems - November 2025  
**Institution**: California Science and Technology University
