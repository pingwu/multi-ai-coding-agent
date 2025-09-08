# Mac Setup Testing Guide

## 🎯 Testing Goals
- Validate 10-minute quick start promise
- Identify real-world Mac-specific issues
- Test student experience end-to-end
- Refine documentation based on actual usage

## 📋 Mac Testing Checklist

### **Phase 1: Clean Environment Simulation (5 minutes)**
```bash
# Check current state
docker --version
git --version
python3 --version

# If Docker exists, note version
# If git missing, we'll test installation
# If Python missing, note for documentation
```

### **Phase 2: Docker Desktop Installation (5 minutes)**
1. **Download Docker Desktop for Mac**
   - Go to [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Click "Download for Mac"
   - Choose Apple Chip (M1/M2/M3) or Intel depending on your Mac

2. **Installation Process**
   ```bash
   # After download completes:
   # 1. Open Downloads folder
   # 2. Double-click Docker.dmg
   # 3. Drag Docker to Applications folder
   # 4. Launch Docker from Applications
   # 5. Follow setup wizard (may require admin password)
   ```

3. **Verification**
   ```bash
   # Wait for Docker Desktop to fully start (whale icon in menu bar)
   docker --version
   docker run hello-world
   ```

### **Phase 3: Git Setup Check (2 minutes)**
```bash
# Check if git is installed
git --version

# If not installed, install Xcode command line tools:
xcode-select --install
# Follow the installation prompts
```

### **Phase 4: Course Repository Clone (3 minutes)**
```bash
# Clone the course repository (when ready)
git clone https://github.com/pingwu/cstu-mas-2025
cd cstu-mas-2025

# Check structure
ls -la
ls sample-projects/
```

### **Phase 5: First AI App Test - Expense Tracker (10 minutes)**
```bash
cd sample-projects/expense-tracker

# Check if all required files exist
ls -la
cat docker-compose.yml
cat .env.example

# Copy environment template
cp .env.example .env

# Edit .env file with your API keys
# (We'll create a test version that works without real keys)

# Start the application
docker-compose up --build

# Test in browser
open http://localhost:8000
```

## 🧪 **Testing Scenarios**

### **Success Criteria**
- [ ] Docker Desktop installs without issues
- [ ] Git works or installs easily  
- [ ] Repository clones successfully
- [ ] Expense tracker builds without errors
- [ ] Web interface loads at localhost:8000
- [ ] Sample expense input works
- [ ] Total time under 20 minutes (with buffer)

### **Common Issues to Watch For**
- Mac chip compatibility (Apple Silicon M1/M2/M3 vs Intel)
- Admin permissions for Docker installation
- Xcode command line tools requirements
- Port conflicts (8000 already in use)
- API key configuration issues

### **Testing Notes Template**
```
Testing Date: ___________
Mac Model: ___________
macOS Version: ___________
Chip: Apple Silicon (M1/M2/M3) / Intel ___________

Phase 1 - Environment Check:
- Docker installed: Y/N, Version: _____
- Git installed: Y/N, Version: _____
- Python installed: Y/N, Version: _____

Phase 2 - Docker Installation:
- Download time: _____ minutes
- Installation time: _____ minutes
- Issues encountered: _________________

Phase 3 - Git Setup:
- Already installed: Y/N
- Xcode tools needed: Y/N
- Installation time: _____ minutes

Phase 4 - Repository Clone:
- Clone successful: Y/N
- Issues: _____________________

Phase 5 - First App:
- Build successful: Y/N
- App loads: Y/N
- Sample works: Y/N
- Total time: _____ minutes
- Issues: _____________________

Overall Experience:
- Would a student succeed: Y/N
- Confidence level after: ___/10
- Major pain points: _______________
- Mac-specific issues: _______________
- Documentation improvements needed: _______________
```

## 🔧 **Setup Refinements Based on Testing**

After your testing, we'll update:

1. **quick-start.md** - Based on real timing and issues
2. **troubleshooting.md** - Add Mac Mini specific solutions
3. **docker-essentials.md** - Include Mac-specific Docker tips

## 📊 **Success Metrics**
- **Time Goal**: Under 15 minutes total (including buffer)
- **Confidence Goal**: Student feels "I did it!" not "That was hard"  
- **Error Rate**: Zero critical failures
- **Documentation Gap**: Nothing major missing
- **Cross-Mac Compatibility**: Works on both Apple Silicon and Intel Macs

## 🚀 **Ready to Test?**

Follow this guide step-by-step on your Mac and document any issues, timing, or improvements needed. This real-world testing will ensure our students have a smooth experience across all Mac models!