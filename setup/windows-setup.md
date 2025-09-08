# Windows Setup Testing Guide

## 🎯 Testing Goals
- Validate 10-minute quick start promise on Windows
- Identify real-world Windows-specific issues
- Test student experience end-to-end
- Refine documentation based on actual usage

## 📋 Windows Testing Checklist

### **Phase 1: Clean Environment Simulation (5 minutes)**
```powershell
# Check current state (use PowerShell or Command Prompt)
docker --version
git --version
python --version

# If Docker exists, note version
# If git missing, we'll test installation
# If Python missing, note for documentation
```

### **Phase 2: Docker Desktop Installation (5 minutes)**
1. **Download Docker Desktop for Windows**
   - Go to [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Click "Download for Windows"
   - Requires Windows 10/11 with WSL 2 support

2. **Installation Process**
   ```powershell
   # After download completes:
   # 1. Open Downloads folder
   # 2. Double-click Docker Desktop Installer.exe
   # 3. Follow setup wizard (may require admin privileges)
   # 4. Choose "Use WSL 2 instead of Hyper-V" when prompted
   # 5. Restart computer when prompted
   ```

3. **WSL 2 Setup (if needed)**
   ```powershell
   # If WSL 2 isn't installed, run as Administrator:
   wsl --install
   # Restart computer after installation
   
   # Check WSL version
   wsl --list --verbose
   ```

4. **Verification**
   ```powershell
   # Wait for Docker Desktop to fully start (whale icon in system tray)
   docker --version
   docker run hello-world
   ```

### **Phase 3: Git Setup Check (2 minutes)**
```powershell
# Check if git is installed
git --version

# If not installed, download from:
# https://git-scm.com/download/win
# Choose "Git for Windows Setup" and run installer
# Use default settings during installation
```

### **Phase 4: Course Repository Clone (3 minutes)**
```powershell
# Clone the course repository (when ready)
git clone https://github.com/pingwu/cstu-mas-2025
cd cstu-mas-2025

# Check structure
dir
dir sample-projects\
```

### **Phase 5: First AI App Test - Expense Tracker (10 minutes)**
```powershell
cd sample-projects\expense-tracker

# Check if all required files exist
dir
type docker-compose.yml
type .env.example

# Copy environment template
copy .env.example .env

# Edit .env file with your API keys
# (We'll create a test version that works without real keys)

# Start the application
docker-compose up --build

# Test in browser
start http://localhost:8000
```

## 🧪 **Testing Scenarios**

### **Success Criteria**
- [ ] Docker Desktop installs without issues
- [ ] WSL 2 is properly configured
- [ ] Git works or installs easily  
- [ ] Repository clones successfully
- [ ] Expense tracker builds without errors
- [ ] Web interface loads at localhost:8000
- [ ] Sample expense input works
- [ ] Total time under 20 minutes (with buffer)

### **Common Issues to Watch For**
- Windows version compatibility (Windows 10 vs 11)
- WSL 2 requirement and setup complexity
- Admin permissions for Docker installation
- Windows Defender or antivirus interference
- Port conflicts (8000 already in use)
- API key configuration issues
- PowerShell vs Command Prompt differences

### **Testing Notes Template**
```
Testing Date: ___________
Windows Version: ___________
System Type: 64-bit / 32-bit ___________
WSL 2 Pre-installed: Y/N ___________

Phase 1 - Environment Check:
- Docker installed: Y/N, Version: _____
- Git installed: Y/N, Version: _____
- Python installed: Y/N, Version: _____

Phase 2 - Docker Installation:
- Download time: _____ minutes
- Installation time: _____ minutes
- WSL 2 setup needed: Y/N
- Restart required: Y/N
- Issues encountered: _________________

Phase 3 - Git Setup:
- Already installed: Y/N
- Installation time: _____ minutes
- Issues: _____________________

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
- Windows-specific issues: _______________
- Documentation improvements needed: _______________
```

## 🔧 **Setup Refinements Based on Testing**

After your testing, we'll update:

1. **quick-start.md** - Based on real timing and Windows issues
2. **troubleshooting.md** - Add Windows-specific solutions
3. **docker-essentials.md** - Include Windows-specific Docker tips
4. **WSL 2 guide** - If needed for complex setups

## 💡 **Windows-Specific Considerations**

### **WSL 2 vs Hyper-V**
- **WSL 2** (Recommended): Better performance, lighter resource usage
- **Hyper-V**: Legacy option, requires Windows Pro/Enterprise

### **PowerShell vs Command Prompt**
- Use **PowerShell** for better compatibility with modern tools
- Most students will use PowerShell by default

### **Antivirus Considerations**
- Windows Defender may slow Docker builds
- Corporate antivirus can block container operations

## 📊 **Success Metrics**
- **Time Goal**: Under 15 minutes total (including buffer)
- **Confidence Goal**: Student feels "I did it!" not "That was complicated"  
- **Error Rate**: Zero critical failures
- **Documentation Gap**: Nothing major missing
- **Cross-Windows Compatibility**: Works on Windows 10 and 11

## 🚀 **Ready to Test?**

Follow this guide step-by-step on your Windows system and document any issues, timing, or improvements needed. This real-world testing will ensure our students have a smooth experience across all Windows versions!

## 🔗 **Additional Windows Resources**
- [WSL 2 Installation Guide](https://docs.microsoft.com/en-us/windows/wsl/install)
- [Docker Desktop Windows Requirements](https://docs.docker.com/desktop/windows/install/)
- [Git for Windows](https://git-scm.com/download/win)