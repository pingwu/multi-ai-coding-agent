# Quick Start - Get Your First AI App Running in 30 Minutes

## 3 Simple Steps to Success

### Step 1: Install Docker Desktop (5 minutes)
- **Mac**: Download from [docker.com](https://docker.com) → Install → Start
- **Windows**: Download from [docker.com](https://docker.com) → Install → Restart → Start
- **Verify**: Open terminal, type `docker --version`

### Optional: Install Claude Code (2 minutes)
- **Enhanced AI Development**: Get Claude Code CLI for advanced AI-assisted coding
- **Installation**: Visit [claude.ai/code](https://claude.ai/code) and follow platform-specific instructions
- **Verify**: Type `claude --version` in terminal
- **Benefits**: Real-time AI assistance, code generation, and debugging help during development
- **Note**: Not required for course projects, but highly recommended for professional development

### Step 2: Clone and Run (15 minutes)
```bash
git clone https://github.com/pingwu/multi-ai-coding-agent.git
cd multi-ai-coding-agent/project-02-expense-tracker

# Setup environment
[ -f .env ] || cp .env.example .env
# Edit .env file and add your OpenAI API key:
# OPENAI_API_KEY=your_key_here

# Start the application (Compose v2)
docker compose up --build
```

Tip: Prefer Makefile shortcuts if available (WSL/macOS/Linux):

```bash
cd multi-ai-coding-agent
make -C project-02-expense-tracker up
```

See also: [Makefile Essentials](./makefile-essentials.md)

### Step 3: See Your AI App Working (10 minutes)
- Open browser to `http://localhost:8000`
- Type: "I spent $25 on lunch at McDonald's"
- Watch AI automatically categorize and save to CSV file
- **SUCCESS!** 🎉 You just ran your first multi-agent AI system!

## What You Just Accomplished
✅ Local AI development environment  
✅ Multi-agent AI system running  
✅ Real business expense processing with NLP
✅ Production-ready containerized app  

## Next Steps
- **Session 1**: We'll explore what you just built
- **Session 2**: You'll customize it for your needs
- **Session 3**: You'll deploy it to the cloud

## Need Help?
- **Can't install Docker?** → See `troubleshooting.md`
- **Commands not working?** → See `troubleshooting.md`
- **Want to understand Docker?** → See `docker-essentials.md`

**Remember**: The goal is to get working quickly, then understand deeply. You're already succeeding! 🚀
