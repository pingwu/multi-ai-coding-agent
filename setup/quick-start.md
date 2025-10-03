# Quick Start - Get Your First AI App Running in 30 Minutes

## Table of Contents
- [Prerequisites](#prerequisites-complete-these-first)
  - [Windows: WSL Installation](#windows-users-install-wsl-windows-subsystem-for-linux)
  - [All Platforms: Node.js & Git](#all-platforms-install-nodejs-and-npm)
- [Step 1: Docker Desktop](#step-1-install-docker-desktop-5-minutes)
- [Step 2: AI Coding Agents](#step-2-install-ai-coding-agents-highly-recommended-10-minutes)
  - [Quick Start Options](#high-level-overview---choose-your-path)
  - [Claude Code](#claude-code-installation)
  - [OpenAI Codex](#openai-codex-installation)
  - [Gemini CLI](#gemini-cli-installation)
  - [Professional Setup](#professional-setup)
- [Step 3: Clone & Run](#step-3-clone-and-run-your-first-ai-app-15-minutes)
- [Step 4: Success!](#step-4-experience-your-ai-app-working-5-minutes)
- [Agent vs Commands Cheatsheet](#agent-vs-commands-cheatsheet)
- [Optional: GitHub CLI](#optional-github-cli-setup)
- [Need Help?](#need-help)

---

## Prerequisites (Complete These First)

### Step 0: System Prerequisites

#### **Windows Users: Install WSL (Windows Subsystem for Linux)**
**Required for professional development environment**
- **Install**: Open PowerShell as Administrator and run:
  ```powershell
  wsl --install -d Ubuntu
  ```
- **Restart** your computer when prompted
- **Setup**: Follow the Ubuntu setup wizard after restart
- **Details**: Visit [Microsoft WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/install) for troubleshooting
- **Troubleshooting**: If you encounter issues, search on Google AI mode or Perplexity, describe the problem you are encounter.  It would give you good instructions.

#### **All Platforms: Install Node.js and npm**
**Required for most coding agents and development tools**
- **Download**: Visit [nodejs.org](https://nodejs.org) and install the LTS version
- **Verify**: Open terminal and run:
  ```bash
  node --version
  npm --version
  ```
- **Note**: Most coding agents (Claude Code, GitHub Copilot CLI, etc.) use npm for installation

#### **All Platforms: Install Git**
**Required for cloning course projects**
- **Download**: Visit [git-scm.com](https://git-scm.com/downloads)
- **Verify**: Open terminal and run:
  ```bash
  git --version
  ```

## 4 Essential Steps to Success

### Step 1: Install Docker Desktop (5 minutes)
- **Mac**: Download from [docker.com](https://docker.com) → Install → Start
- **Windows**: Download from [docker.com](https://docker.com) → Install → Restart → Start
- **Linux**: Follow Docker Engine installation guide at [docs.docker.com](https://docs.docker.com/engine/install/)
- **Verify**: Open terminal and run:
  ```bash
  docker --version
  docker compose version
  ```

### Step 2: Install AI Coding Agents (HIGHLY RECOMMENDED) (10 minutes)

#### **High-Level Overview - Choose Your Path**

This course was developed using **three primary coding agents** in rotation. Choose based on your needs:

**Quick Start (Choose One):**
- **[Install Claude Code Only](#claude-code-installation)** - Best for beginners, excellent Docker integration
- **[Install All Coding Agents](#professional-setup)** - Professional approach, maximum flexibility

**The Three-Agent System:**
- **Claude Code**: Architecture, Docker, complex refactoring ([Install Guide](#claude-code-installation))
- **OpenAI Codex CLI**: Rapid prototyping, debugging ([Install Guide](#openai-codex-installation))
- **Gemini CLI**: Code review, optimization ([Install Guide](#gemini-cli-installation))

---
All following session are assume to be running in WSL (Windows Subsystem for Linux) or Linux/Mac terminal.
---
#### **Claude Code Installation**
**Best for**: Beginners, system architecture, containerized development, project planning, PRD - product requirement documentation.

1. **Visit**: [claude.ai/code](https://claude.ai/code)
2. **Install via npm**:
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```
3. **Setup**: Follow authentication process
4. **Verify**:
   ```bash
   claude --version
   ```
5. **Start Claude Code**:
   ```bash
   claude
   ```

**You're Ready!** Skip to [Step 3: Clone and Run](#step-3-clone-and-run) or continue for additional agents.

---

#### **OpenAI Codex Installation**
**Best for**: Quick prototyping, debugging, API integrations

1. **Install via npm**:
   ```bash
   npm install -g @openai/codex
   ```
2. **Setup API key**:
   ```bash
   export OPENAI_API_KEY=your_key_here
   # Add to your shell profile (.bashrc, .zshrc)
   ```
3. **Verify**:
   ```bash
   openai --version
   ```
4. **Start OpenAI Codex**:
   ```bash
   codex
   ```

---

#### **Gemini CLI Installation**
**Best for**: Code review, performance optimization, alternative solutions

1. **Install via npm**:
   ```bash
   npm install -g @google/gemini-cli
   ```
2. **Get API key**: Visit [Google AI Studio](https://aistudio.google.com)
3. **Configure**:
   ```bash
   export GEMINI_API_KEY=your_key_here
   ```
4. **Verify**:
   ```bash
   gemini --version
   ```
5. **Start Gemini CLI**:
   ```bash
   gemini
   ```

---

#### **Professional Setup**
**Install all three for maximum flexibility:**
```bash
# Professional multi-agent setup
npm install -g @anthropic-ai/claude-code
npm install -g @openai/codex
npm install -g @google/gemini-cli
npm install -g @github/copilot
# install cursor-agent visit https://cursor.com/docs/cli/installation 
```

**Why Multi-Agent Approach:**
- **Different Strengths**: Each agent excels in different areas
- **Redundancy**: If one agent is down, others keep you productive
- **Real-World Practice**: Enterprise teams use multiple AI tools

**Usage Note**: Detailed coding agent usage, software development architecture, principles and concepts will be covered in the November class sessions.

---

#### **Additional Options (Optional)**
- **GitHub Copilot CLI**: `npm install -g @githubnext/github-copilot-cli`
- **Cursor IDE**: Download from [cursor.sh](https://cursor.sh)
- **Codeium**: Visit [codeium.com](https://codeium.com)

### Step 3: Clone and Run Your First AI App (15 minutes)

#### **For Windows (WSL) and Linux/Mac:**
```bash
# Clone the course repository
git clone https://github.com/pingwu/multi-ai-coding-agent.git
cd multi-ai-coding-agent
```

#### **Start Your AI Application:**

| Task                                                                                                | 🤖 AI-Powered                                         | 💻 Manual Command Line                          |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| Start Project 1 (** make sure you have all prerequisites installed and docker desktop is tarted **) | "Bring up Project 1 (content generator) environment." | `make -C project-01-content-generator up`       |
| Fix API keys (if errors)                                                                            | "Create .env from .env.example in Project 1."         | `cd project-01-content-generator && [ -f .env ] |
| Stop Expense Tracker                                                                                | "Shut down the expense tracker project."              | `make -C project-02-expense-tracker down`       |

Then open: http://localhost:3000 (frontend) and http://localhost:8000 (backend)


### Step 4: Experience Your AI App Working (5 minutes)
1. **Open browser** to `http://localhost:8000`
2. **Type**: "I spent $25 on lunch at McDonald's"
3. **Watch** AI automatically categorize and save to CSV file
4. **SUCCESS!** 🎉 You just ran your first multi-agent AI system!

## What You Just Accomplished
✅ **Professional development environment** with Docker + WSL (Windows)
✅ **AI-powered coding assistant** ready for natural language development
✅ **Multi-agent AI system** processing real business expenses
✅ **Production-ready containerized application** running locally

## ⚡ Agent vs Commands Cheatsheet

| Task                    | 🤖 AI-Powered Natural Language (via Coding agents) | 💻 Manual Command Line                               |
| ----------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| Start Project 1         | "Bring up Project 1 environment."                  | `make -C project-01-content-generator up`            |
| Start Project 2         | "Start the expense tracker project."               | `make -C project-02-expense-tracker up`              |
| Start Project 3         | "Start the task tracker project."                  | `make -C project-03-task-tracker up`                 |
| Start Project 4         | "Start the Google OAuth task tracker."             | `make -C project-04-Google-OAuth up`                 |
| Start ADK Chat          | "Start the ADK quickstart demo."                   | `make up-adk`                                         |
| Stop Project 1          | "Shut down Project 1."                             | `make -C project-01-content-generator down`          |
| Stop Project 4          | "Shut down the Google OAuth task tracker."         | `make -C project-04-Google-OAuth down`               |
| Stop ADK Chat           | "Stop the ADK quickstart."                         | `make down-adk`                                       |
| Setup OAuth (Proj 4)    | "Help me set up Google OAuth for Project 4."       | `make -C project-04-Google-OAuth setup-oauth`        |
| Backend tests (Proj 1)  | "Run backend tests for Project 1."                 | `make -C project-01-content-generator test-backend`  |
| Follow logs (Proj 4)    | "Show Google OAuth task tracker logs."             | `make -C project-04-Google-OAuth logs`               |
| Follow ADK logs         | "Show ADK chat logs."                              | `make logs-adk`                                       |
Note: the application ports number are the same across many applications.  Change to different port number if you want multiple project running simultaneously.  Use coding agent to change it or guide you through it. 

## Next Steps with Claude Code
Try these natural language commands with Claude Code:
```
"Show me how this expense tracker works"
"Add a monthly report feature to this project"
"Help me deploy this to Google Cloud"
"Create a copy of this project for demo purposes"
```

## Course Progression
- **Session 1**: Explore and understand your working AI system
- **Session 2**: Customize and extend using natural language development
- **Session 3**: Deploy to production with professional patterns
- **Session 4**: Build team collaboration features

## Need Help?

### **Installation Issues:**
- **Docker problems?** → See `troubleshooting.md`
- **WSL not working?** → Visit [Microsoft WSL Troubleshooting](https://docs.microsoft.com/en-us/windows/wsl/troubleshooting)
- **Node.js/npm issues?** → Visit [Node.js Documentation](https://nodejs.org/en/docs/)

### **Development Issues:**
- **Commands not working?** → See `troubleshooting.md`
- **Want to understand Docker?** → See `docker-essentials.md`
- **Claude Code not responding?** → Check authentication and internet connection

### **Course Support:**
- **GitHub Issues**: Report technical problems
- **Discord/Slack**: Real-time help from instructors and peers
- **Office Hours**: Weekly Q&A sessions

---

## Optional: GitHub CLI Setup

### **Install GitHub CLI (Recommended for Smoother Experience)**

The GitHub CLI simplifies authentication and repository management.

#### **Installation:**
- **macOS (with Homebrew)**:
  ```bash
  brew install gh
  ```
- **Other platforms**: Download from [cli.github.com](https://cli.github.com)
- **npm alternative**:
  ```bash
  npm install -g @github/gh
  ```

#### **Setup:**
```bash
gh auth login
# Follow prompts to authenticate
```

#### **Benefits:**
- Clone repositories without credential management
- Create pull requests from command line
- Seamless integration with course projects

---

**Remember**: Professional AI development starts with proper tooling. You're building enterprise-grade skills from day one! 🚀
