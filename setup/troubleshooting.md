# Quick Troubleshooting - Top 5 Issues & Fixes

## Issue #1: Docker Won't Start
**Problem**: "Docker Desktop failed to start"  
**Solution**: 
1. Restart computer
2. Start Docker Desktop manually
3. Wait 2 minutes for startup
4. Try `docker --version` again

## Issue #2: "Command Not Found" 
**Problem**: `git` or `docker` commands not recognized  
**Mac Solution**: Install command line tools: `xcode-select --install`  
**Windows Solution**: Install Git from [git-scm.com](https://git-scm.com)

## Issue #3: Port Already in Use
**Problem**: "Port 8000 is already allocated"  
**Solution**: 
```bash
# Stop other containers
docker compose down
# Or use different port
docker compose up --scale web=1:8001
```

## Issue #4: Permission Denied
**Problem**: Docker permission errors  
**Mac/Linux Solution**: Add to docker group: `sudo usermod -aG docker $USER`  
**Windows Solution**: Run terminal as Administrator

## Issue #5: API Keys Not Working
**Problem**: AI responses failing  
**Solution**: 
1. Check `.env` file exists
2. Verify API key format: `OPENAI_API_KEY=sk-...`
3. Restart container: `docker compose restart`

## Still Stuck? 
**During Class**: Ask instructor or classmates  
**Outside Class**: Post in course GitHub Discussions  
**Emergency**: Email instructor with screenshot

## Pro Tip 💡
**95% of issues** are solved by:
1. Restart Docker Desktop
2. Restart your terminal  
3. Try the command again

**Remember**: Everyone hits these issues. Getting unstuck is part of learning! 🔧
