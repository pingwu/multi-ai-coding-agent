# WSL Setup Guide: Windows Subsystem for Linux Configuration

**Target Audience**: Developers setting up containerized development environments on Windows 11

**Concept Type**: System Configuration & Development Environment Setup

**Related To**: [[glossary/system-administrator]], [[environment-variable]], [[docker-desktop-installation-guide]]

---

## Overview

Windows Subsystem for Linux (WSL) enables you to run a Linux environment directly on Windows, eliminating the need for dual boot or traditional virtual machines. This guide covers the complete setup process, including critical Windows virtualization features that must be enabled.

**Production Imperatives**:
- **Compatibility**: Run Linux development tools natively on Windows
- **Docker Integration**: WSL2 is the recommended backend for Docker Desktop on Windows
- **Performance**: Near-native Linux performance with full system call compatibility
- **Development Workflow**: Seamless integration between Windows and Linux environments

---

## Table of Contents

- [Understanding WSL and Virtualization](#understanding-wsl-and-virtualization)
- [Prerequisites and System Requirements](#prerequisites-and-system-requirements)
- [Critical Windows Features Configuration](#critical-windows-features-configuration)
- [WSL Installation Step-by-Step](#wsl-installation-step-by-step)
- [Post-Installation Configuration](#post-installation-configuration)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)
- [Verifying Your Installation](#verifying-your-installation)
- [Integration with Development Tools](#integration-with-development-tools)

---

## Understanding WSL and Virtualization

### What is WSL?

**Windows Subsystem for Linux (WSL)** is a compatibility layer that allows you to run Linux binaries natively on Windows. WSL2, the current version, runs a real Linux [[glossary/kernel|kernel]] using lightweight utility VM technology.

**Key Differences**:

| Feature | WSL 1 | WSL 2 (Current) |
|---------|-------|-----------------|
| **Architecture** | Translation layer | Actual Linux [[glossary/kernel\|kernel]] in lightweight VM |
| **Performance** | Slower I/O | Near-native performance |
| **System Calls** | Partial compatibility | 100% compatibility |
| **Docker Support** | Limited | Full support (recommended) |
| **Memory** | Static | Dynamic allocation |

### Why Virtualization Must Be Enabled

WSL2 runs on Microsoft's **Hyper-V** technology, which requires hardware virtualization features:

**Hardware Level** (BIOS/UEFI):
- **Intel VT-x** (Intel Virtualization Technology)
- **AMD-V** (AMD Virtualization)

**Windows OS Level** (Required Features):
- **Virtual Machine Platform** - Core virtualization infrastructure
- **Windows Subsystem for Linux** - WSL framework
- **Windows Hypervisor Platform** - Hyper-V components (optional but recommended)

**Why Both Are Needed**:
1. **BIOS Virtualization** → Enables CPU to support virtual machines
2. **Windows Features** → Provides OS-level virtualization framework for WSL2

---

## Prerequisites and System Requirements

### Minimum System Requirements

- **Operating System**: Windows 11 or Windows 10 version 2004+ (Build 19041+)
- **Architecture**: 64-bit processor
- **Memory**: 4 GB RAM minimum (8 GB+ recommended)
- **Storage**: 1 GB+ available disk space

### Check Your Windows Version

```powershell
# PowerShell (Run as [[glossary/system-administrator|System Administrator]])
winver

# Alternative: System Information
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
```

**Expected Output**:
```
OS Name: Microsoft Windows 11 Pro
OS Version: 10.0.22631 N/A Build 22631
```

### Verify BIOS Virtualization is Enabled

**You mentioned virtualization is enabled in BIOS** ✅ - This is the first critical requirement.

**To verify from Windows**:

```powershell
# PowerShell - Check virtualization status
Get-ComputerInfo | Select-Object -Property HyperV*

# Alternative: Task Manager
# Open Task Manager → Performance → CPU
# Look for "Virtualization: Enabled"
```

---

## Critical Windows Features Configuration

### Understanding Windows Feature Hierarchy

```
Hardware Virtualization (BIOS) ← You have this enabled
    ↓
Windows Hypervisor Platform
    ↓
Virtual Machine Platform ← WSL2 requires this
    ↓
Windows Subsystem for Linux ← WSL framework
```

### Method 1: Enable Features via PowerShell (Recommended)

**IMPORTANT**: This requires [[glossary/system-administrator|System Administrator]] privileges.

#### Step 1: Open PowerShell as Administrator

**How to Run as Administrator**:
1. Press `Windows Key`
2. Type `PowerShell`
3. **Right-click** on "Windows PowerShell"
4. Select **"Run as administrator"**
5. Click **"Yes"** on User Account Control (UAC) prompt

**Why Administrator Rights Are Required**:
- System-level Windows features modification requires elevated privileges
- See [[glossary/system-administrator#windows-uac|System Administrator - Windows UAC]] for details

#### Step 2: Enable Required Windows Features

```powershell
# Enable Windows Subsystem for Linux
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Enable Virtual Machine Platform (Critical for WSL2)
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Enable Windows Hypervisor Platform (Recommended)
dism.exe /online /enable-feature /featurename:HypervisorPlatform /all /norestart
```

**Expected Output for Each Command**:
```
Deployment Image Servicing and Management tool
Version: 10.0.22631.1

Image Version: 10.0.22631.4460

Enabling feature(s)
[==========================100.0%==========================]
The operation completed successfully.
```

#### Step 3: Restart Your Computer (Mandatory)

**CRITICAL**: Windows requires a restart to apply these low-level system changes.

```powershell
# Restart now
Restart-Computer

# Or schedule restart in 5 minutes
shutdown /r /t 300
```

**Why Restart is Mandatory**:
- Windows [[glossary/kernel|kernel]] must reload with new virtualization drivers
- Hypervisor components initialize during boot process
- Features do NOT activate until system restart
- See [[glossary/kernel#why-restart-is-required-for-kernel-changes|Kernel: Why Restart is Required]] for technical explanation

---

### Method 2: Enable Features via GUI (Alternative)

**If you prefer visual interface:**

#### Step 1: Open Windows Features Dialog

**Option A - Run Dialog**:
1. Press `Windows Key + R`
2. Type `optionalfeatures`
3. Press `Enter`

**Option B - Control Panel**:
1. Press `Windows Key`
2. Type `Turn Windows features on or off`
3. Click the result

#### Step 2: Enable Required Features

**Checklist**:
- ✅ **Virtual Machine Platform** ← CRITICAL for WSL2
- ✅ **Windows Subsystem for Linux** ← WSL framework
- ✅ **Windows Hypervisor Platform** ← Recommended (if available)

**Screenshot Reference**:
```
☑ Virtual Machine Platform
☑ Windows Hypervisor Platform
☑ Windows Subsystem for Linux
```

#### Step 3: Click OK and Restart

1. Click **OK**
2. Wait for "Windows is applying changes"
3. Click **Restart now** when prompted

**DO NOT skip the restart** - features will not work until reboot.

---

### Method 3: Verify Features Were Enabled

**After Restart**, verify installation:

```powershell
# PowerShell - Check feature status
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
Get-WindowsOptionalFeature -Online -FeatureName HypervisorPlatform

# Expected output for each:
# State : Enabled
```

**Troubleshooting**: If `State : Disabled`, the feature was not enabled or restart was not completed.

---

## WSL Installation Step-by-Step

### ⚠️ CRITICAL: Did You Restart After Enabling Features?

**STOP**: Before proceeding with the steps below, verify you completed a **FULL SYSTEM RESTART** after enabling Windows features in the previous section.

**How to Verify Restart is Complete**:
```powershell
# PowerShell - Check if restart is still needed
Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform

# Look for this line in output:
# RestartRequired  : Possible  ← BAD: You MUST restart
# RestartRequired  : No        ← GOOD: Features are active
```

**If you see `RestartRequired : Possible`**:
1. **Save all work and restart Windows NOW**
2. **Do NOT proceed** until after restart
3. The steps below will **hang or fail** without restart

---

### Phase 1: Set WSL2 as Default Version

**After restart**, open PowerShell as Administrator:

```powershell
# Set WSL2 as default for all future distributions
wsl --set-default-version 2
```

**Expected Output**:
```
For information on key differences with WSL 2 please visit https://aka.ms/wsl2
The operation completed successfully.
```

**Common Issues**:

**⏳ Command Hangs/Does Nothing**:
- **Cause**: You didn't restart after enabling features
- **Solution**: Restart Windows completely and try again

**❌ "Class not registered" Error**:
- **Cause**: WSL components not fully initialized
- **Solution**:
  1. Restart Windows
  2. Run `wsl --update` after restart
  3. Try `wsl --set-default-version 2` again

**❌ "WSL 2 requires an update to its kernel component"**:
- The WSL 2 [[glossary/kernel|kernel]] needs to be updated
- Proceed to "WSL Kernel Update" section below

---

### Phase 2: Install Linux Distribution

#### Option A: Install Ubuntu (Recommended for Beginners)

```powershell
# Install latest Ubuntu LTS
wsl --install -d Ubuntu

# Alternative: Specific version
wsl --install -d Ubuntu-22.04
```

#### Option B: View All Available Distributions

```powershell
# List all available Linux distributions
wsl --list --online

# Example output:
# NAME               FRIENDLY NAME
# Ubuntu             Ubuntu
# Debian             Debian GNU/Linux
# kali-linux         Kali Linux Rolling
# Ubuntu-20.04       Ubuntu 20.04 LTS
# Ubuntu-22.04       Ubuntu 22.04 LTS
```

#### Option C: Install Specific Distribution

```powershell
# Example: Install Debian
wsl --install -d Debian
```

---

### Phase 3: First-Time Linux Setup

**When distribution launches for the first time**:

1. **Wait for installation** (1-2 minutes)
   ```
   Installing, this may take a few minutes...
   ```

2. **Create Linux User Account**
   ```
   Enter new UNIX username: yourusername
   New password: [type password - will not display]
   Retype new password: [type again]
   ```

3. **Setup Complete**
   ```
   Installation successful!
   To run a command as [[glossary/system-administrator|administrator]] (user "root"), use "sudo <command>".
   ```

**IMPORTANT Security Note**:
- This Linux username is **separate** from your Windows username
- This user has `sudo` privileges inside WSL (see [[glossary/system-administrator#linux-sudo|System Administrator - Linux sudo]])
- Password is used for `sudo` commands, not for WSL login

---

### Phase 4: Update Linux System

**Inside WSL terminal**:

```bash
# Update package lists
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y

# Install essential development tools (optional)
sudo apt install -y build-essential git curl wget
```

**What This Does**:
- `apt update` → Refreshes package repository lists
- `apt upgrade` → Updates all installed packages to latest versions
- `build-essential` → Compilers and development tools (gcc, make, etc.)

---

## Post-Installation Configuration

### Verify WSL Installation

```powershell
# PowerShell - Check WSL status
wsl --status

# Expected output:
# Default Distribution: Ubuntu
# Default Version: 2
```

```powershell
# List all installed distributions
wsl --list --verbose

# Example output:
# NAME      STATE           VERSION
# * Ubuntu  Running         2
```

**Understanding Output**:
- `*` indicates default distribution
- `VERSION 2` confirms WSL2 is active
- `Running` means it's currently active

---

### Set Default Distribution (if multiple installed)

```powershell
# If you installed multiple Linux distributions
wsl --set-default Ubuntu

# Verify
wsl --list --verbose
```

---

### WSL Configuration File (Advanced)

Create `.wslconfig` in your Windows user directory to customize WSL2 behavior:

**Location**: `C:\Users\YourUsername\.wslconfig`

**Example Configuration**:
```ini
[wsl2]
# Memory allocation (default: 50% of total RAM)
memory=4GB

# CPU cores (default: all cores)
processors=2

# Swap storage
swap=8GB

# Disable page reporting (can improve performance)
pageReporting=false

# Network mode
networkingMode=NAT
```

**Apply Changes**:
```powershell
# Shutdown WSL completely
wsl --shutdown

# Restart your distribution
wsl
```

---

## Troubleshooting Common Issues

### Issue 1: `wsl --set-default-version 2` Hangs Forever

**Symptom**: Command runs as administrator but nothing happens, just hangs

**Diagnosis**:
```powershell
# Check if restart is needed
Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform

# If you see this, you MUST restart:
# RestartRequired  : Possible
```

**Solution**:
1. **Restart Windows completely** - this is non-negotiable
2. After restart, verify no restart required:
   ```powershell
   Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
   # Should show: RestartRequired  : No
   ```
3. Update WSL kernel:
   ```powershell
   wsl --update
   ```
4. Try again:
   ```powershell
   wsl --set-default-version 2
   ```

**Why This Happens**:
- Windows features show as "Enabled" immediately in registry
- But [[glossary/kernel|kernel drivers]] only load during boot
- WSL 2 needs these [[glossary/kernel|kernel]] drivers running
- Without restart, system is in half-enabled state
- See [[glossary/kernel#why-restart-is-required-for-kernel-changes|Why Restart is Required for Kernel Changes]] for technical details

---

### Issue 2: "Please enable Virtual Machine Platform"

**Symptom**: Error when running `wsl --set-default-version 2`

**Diagnosis**:
```powershell
Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
# Check if State : Enabled
```

**Solution**:
1. Ensure you enabled **Virtual Machine Platform** (see Method 1 or 2 above)
2. **Verify you restarted your computer** after enabling
3. If still failing, check BIOS virtualization is enabled

---

### Issue 3: "WSL 2 requires an update to its kernel component"

**Symptom**: Error message with link to kernel update

**Solution**:

```powershell
# Download WSL2 kernel update
# Visit: https://aka.ms/wsl2kernel
# Or download directly:
# https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi

# After download, run the installer
# Then retry:
wsl --set-default-version 2
```

**Alternative: Use Windows Update**:
```powershell
# Check for Windows updates which may include WSL kernel
wsl --update
```

---

### Issue 4: "WslRegisterDistribution failed with error: 0x80370102"

**Symptom**: Error during distribution installation

**Causes**:
1. Virtualization not enabled in BIOS
2. Virtual Machine Platform not enabled
3. Hyper-V conflict with other virtualization software

**Solution**:

**Step 1**: Verify BIOS virtualization
```powershell
# Task Manager → Performance → CPU → Virtualization: Enabled
```

**Step 2**: Verify Windows features
```powershell
Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All
```

**Step 3**: Check for conflicting software
- **VirtualBox**: Disable Hyper-V or use VirtualBox 6.0+ (supports Hyper-V)
- **VMware**: Update to version supporting Hyper-V

**Step 4**: Force enable Hyper-V
```powershell
# Run as Administrator
bcdedit /set hypervisorlaunchtype auto

# Restart
Restart-Computer
```

---

### Issue 5: WSL Distribution Won't Start

**Symptom**: Distribution terminates immediately or shows error

**Solution 1**: Check WSL service status
```powershell
# Restart WSL service
wsl --shutdown
wsl
```

**Solution 2**: Reset specific distribution
```powershell
# WARNING: This deletes all data in the distribution
wsl --unregister Ubuntu

# Reinstall
wsl --install -d Ubuntu
```

**Solution 3**: Check Windows logs
```powershell
# Event Viewer → Windows Logs → Application
# Look for errors from "WSL" source
```

---

### Issue 6: "Element not found" Error

**Symptom**: Error when trying to start WSL

**Solution**: Update WSL
```powershell
# Update WSL to latest version
wsl --update

# Verify version
wsl --version
```

---

### Issue 7: Slow Performance or High Memory Usage

**Symptom**: WSL2 using excessive RAM or CPU

**Solution**: Configure `.wslconfig`

**Create/Edit**: `C:\Users\YourUsername\.wslconfig`

```ini
[wsl2]
memory=4GB          # Limit memory
processors=2        # Limit CPU cores
localhostForwarding=true
```

**Apply**:
```powershell
wsl --shutdown
wsl
```

---

### Issue 8: WSL Corruption Error After `wsl --set-default-version 2` Hangs

**Symptom**: `wsl --set-default-version 2` command hangs for several minutes, and after running `wsl --update`, you get error: "WSL installation appears to be corrupted error code: Wsl/CallMsi/Install/REGDB_E_CLASSNOTREG"

**What Happened**:
- WSL features were enabled but system entered an inconsistent state
- Multiple reboots and disable/re-enable attempts didn't resolve the issue
- Windows installer registry entries became corrupted

**Solution: WSL Automatic Repair**

When you see this error message:
```
WSL installation appears to be corrupted
error code: Wsl/CallMsi/Install/REGDB_E_CLASSNOTREG

Press any key to repair WSL.....
```

**Steps**:
1. **Press any key** as prompted to start automatic repair
2. **Wait for repair to complete** (may take 1-2 minutes)
3. **Restart Windows** after repair completes
4. **Retry the command**:
   ```powershell
   wsl --set-default-version 2
   ```

**Why This Happens**:
- WSL installer components can become corrupted during feature enablement
- Registry entries for Windows installer may be incomplete or damaged
- This is more common when Windows features are enabled/disabled multiple times
- The corruption specifically affects the MSI (Microsoft Installer) integration

**Prevention**:
- **Complete full restart** after enabling WSL features (don't skip this!)
- **Avoid rapid enable/disable cycles** of WSL features
- If encountering hanging commands, try `wsl --update` first before multiple reboots

**Alternative Manual Repair** (if automatic repair doesn't work):

```powershell
# 1. Completely uninstall WSL components
wsl --unregister Ubuntu  # Remove all distributions first

# 2. Disable WSL features
dism.exe /online /disable-feature /featurename:Microsoft-Windows-Subsystem-Linux /norestart
dism.exe /online /disable-feature /featurename:VirtualMachinePlatform /norestart

# 3. Restart Windows
Restart-Computer

# 4. Re-enable features
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 5. Restart Windows again
Restart-Computer

# 6. Update WSL
wsl --update

# 7. Set default version
wsl --set-default-version 2
```

**Expected Recovery Time**: 5-10 minutes including restarts

---

## Verifying Your Installation

### Complete Verification Checklist

**In PowerShell (Windows)**:

```powershell
# 1. Check WSL status
wsl --status

# 2. Check WSL version
wsl --version

# 3. List installed distributions
wsl --list --verbose

# 4. Verify features enabled
Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

**In WSL (Linux)**:

```bash
# 1. Check kernel version (see [[glossary/kernel#checking-your-kernel-version|Checking Your Kernel Version]])
uname -r
# Expected: 5.15.0+ (WSL2 [[glossary/kernel|kernel]])

# 2. Check distribution version
lsb_release -a

# 3. Verify network connectivity
ping -c 3 google.com

# 4. Check available storage
df -h
```

**Expected Healthy Output**:
```
WSL Status: ✅ Default Version 2
Distribution: ✅ Ubuntu Running
Virtual Machine Platform: ✅ Enabled
Network: ✅ Internet connectivity working
```

---

## Integration with Development Tools

### Docker Desktop Integration

**Docker Desktop uses WSL2 as its backend on Windows.**

**Configuration**:
1. Install Docker Desktop for Windows
2. Open Docker Desktop Settings
3. Go to **General**
4. Ensure **"Use the WSL 2 based engine"** is checked
5. Go to **Resources → WSL Integration**
6. Enable integration for your distribution

**Verify**:
```bash
# Inside WSL
docker --version
docker compose version

# Test Docker
docker run hello-world
```

**Reference**: See [[docker-desktop-installation-guide]] for complete setup.

---

### Visual Studio Code Integration

**VS Code can connect to WSL for seamless development.**

**Setup**:
1. Install VS Code on Windows
2. Install "Remote - WSL" extension
3. Open folder in WSL:
   ```bash
   # From WSL terminal
   code .
   ```

**Or**:
1. Open VS Code on Windows
2. Press `F1`
3. Type "WSL: New Window"
4. Select your distribution

---

### Windows Terminal Integration

**Windows Terminal provides excellent WSL integration.**

**Setup**:
1. Install Windows Terminal from Microsoft Store
2. WSL profiles auto-created
3. Set default profile:
   - Settings → Startup → Default profile → Ubuntu

**Launch WSL**:
```powershell
# From Windows Terminal
wt -p Ubuntu
```

---

### File System Access

**Access Windows files from WSL**:
```bash
# Windows C: drive mounted at /mnt/c/
cd /mnt/c/Users/YourUsername/Documents
ls -la
```

**Access WSL files from Windows**:
```
# Windows File Explorer
\\wsl$\Ubuntu\home\yourusername\
```

**Best Practice**: Store project files in WSL filesystem for better performance
```bash
# GOOD: Native WSL performance
~/projects/my-app

# SLOWER: Accessing Windows filesystem from WSL
/mnt/c/Users/YourUsername/projects/my-app
```

---

## Environment Variables in WSL Context

**WSL integrates with Windows environment variables**, but each maintains separate [[environment-variable|environments]].

### Windows Environment Variables in WSL

**Automatic Path Integration**:
```bash
# WSL automatically appends Windows PATH
echo $PATH
# /usr/local/bin:/usr/bin:/bin:/mnt/c/Windows/System32:...

# This allows running Windows executables from WSL
code.exe .       # Launches VS Code (Windows)
explorer.exe .   # Opens File Explorer
```

### WSL-Specific Environment Variables

**Set in `~/.bashrc` or `~/.profile`**:

```bash
# Edit WSL environment
nano ~/.bashrc

# Add environment variables
export ANTHROPIC_API_KEY="sk-ant-api03-..."
export OPENAI_API_KEY="sk-proj-..."

# Apply changes
source ~/.bashrc
```

**Verify**:
```bash
echo $ANTHROPIC_API_KEY
```

**Reference**: See [[environment-variable#linux-macos|Environment Variables - Linux/macOS]] for complete configuration.

---

### Cross-Environment Considerations

**Important Differences**:

| Aspect | Windows (PowerShell) | WSL (Linux) |
|--------|---------------------|-------------|
| **Path Separator** | `;` (semicolon) | `:` (colon) |
| **Variable Access** | `$env:VAR` | `$VAR` |
| **Line Endings** | CRLF (`\r\n`) | LF (`\n`) |
| **File Permissions** | Windows ACLs | Unix permissions (chmod) |
| **Administrator** | UAC elevation | `sudo` command |

**See**: [[glossary/system-administrator#cross-platform|System Administrator - Cross-Platform]] for detailed comparison.

---

## Security Considerations

### WSL Security Model

**Isolation**:
- WSL2 runs in lightweight VM (isolated from Windows kernel)
- Separate Linux filesystem with Unix permissions
- Network traffic flows through Windows firewall

**Administrator Access**:
- Linux `sudo` in WSL ≠ Windows [[glossary/system-administrator|Administrator]]
- WSL user has `sudo` privileges **inside** Linux environment only
- Cannot modify Windows system files from WSL (except via `/mnt/c/` with Windows permissions)

### Best Practices

1. **Separate Development Environments**
   - Use WSL for Linux-based development
   - Keep Windows and WSL environments distinct

2. **Secure API Keys**
   - Store in WSL `~/.bashrc` or Windows [[environment-variable|environment variables]]
   - Never commit to Git (see [[SECRET_MANAGEMENT_GUIDELINE]])

3. **Regular Updates**
   ```bash
   # Update WSL kernel
   wsl --update

   # Update Linux packages
   sudo apt update && sudo apt upgrade -y
   ```

4. **Backup Important Data**
   - Export WSL distribution:
     ```powershell
     wsl --export Ubuntu C:\Backups\ubuntu-backup.tar
     ```
   - Import on another machine:
     ```powershell
     wsl --import Ubuntu C:\WSL\Ubuntu C:\Backups\ubuntu-backup.tar
     ```

---

## Advanced Topics

### Running Multiple Distributions

```powershell
# Install multiple distributions
wsl --install -d Ubuntu
wsl --install -d Debian
wsl --install -d kali-linux

# Launch specific distribution
wsl -d Debian

# Set default
wsl --set-default Debian
```

### Converting WSL1 to WSL2

**If you have older WSL1 distribution**:

```powershell
# Check version
wsl --list --verbose

# Convert to WSL2
wsl --set-version Ubuntu 2

# Verify
wsl --list --verbose
```

### WSL Command Reference

```powershell
# Essential Commands
wsl --install               # Install WSL and Ubuntu
wsl --update               # Update WSL kernel
wsl --shutdown             # Shut down all distributions
wsl --terminate Ubuntu     # Shut down specific distribution
wsl --unregister Ubuntu    # Remove distribution (deletes data!)
wsl --export Ubuntu backup.tar   # Backup distribution
wsl --import NewUbuntu C:\WSL\NewUbuntu backup.tar  # Restore

# Information
wsl --status               # Show WSL configuration
wsl --version             # Show WSL version
wsl --list --online       # Available distributions
wsl --list --verbose      # Installed distributions
```

---

## Key Takeaways

✅ **You should now understand**:
- WSL2 requires both BIOS virtualization AND Windows features enabled
- Virtual Machine Platform is critical for WSL2 to function
- Restart is mandatory after enabling Windows features
- WSL2 runs actual Linux kernel in lightweight VM
- Administrator privileges needed to enable system features

✅ **You should be able to**:
- Enable Windows virtualization features via PowerShell or GUI
- Install and configure WSL2 with Linux distribution
- Troubleshoot common WSL installation errors
- Verify successful WSL2 installation
- Integrate WSL with Docker Desktop and development tools
- Understand the relationship between Windows and WSL environments

✅ **Security awareness**:
- Understand WSL security isolation model
- Know the difference between Windows Administrator and Linux sudo
- Configure separate environment variables for Windows and WSL
- Properly secure API keys in both environments

📝 **Remember**:
- BIOS virtualization + Windows features = WSL2 working
- Always restart after enabling Windows features
- WSL2 is required for Docker Desktop on Windows
- Store project files in WSL filesystem for best performance
- Keep both Windows and WSL environments updated

---

## Related Concepts

- **[[glossary/abstraction-layer]]** - WSL as abstraction layer hiding virtualization complexity
- **[[glossary/kernel]]** - Understanding kernel drivers and why restart is required
- **[[glossary/system-administrator]]** - Understanding administrator privileges across platforms
- **[[environment-variable]]** - Configuration management in Windows and Linux
- **[[docker-desktop-installation-guide]]** - Docker Desktop WSL2 backend configuration
- **Virtualization technology** - Hardware and software virtualization concepts
- **Linux fundamentals** - Basic Linux command-line skills

---

## Additional Resources

### Official Documentation
- [Microsoft WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [WSL2 Architecture](https://docs.microsoft.com/en-us/windows/wsl/compare-versions)
- [Docker Desktop WSL2 Backend](https://docs.docker.com/desktop/windows/wsl/)

### Troubleshooting Resources
- [WSL GitHub Issues](https://github.com/microsoft/WSL/issues)
- [WSL2 Kernel Releases](https://github.com/microsoft/WSL2-Linux-Kernel/releases)
- [Windows Virtualization Forums](https://techcommunity.microsoft.com/t5/windows-subsystem-for-linux/bd-p/WSL)

### Video Tutorials
- [Microsoft Learn - WSL Setup](https://docs.microsoft.com/en-us/learn/modules/get-started-with-windows-subsystem-for-linux/)
- [Docker Desktop with WSL2](https://www.youtube.com/results?search_query=docker+wsl2+setup)

---

**Last Updated**: 2025-11-17
**Document Type**: Procedural Guide (Step-by-Step)
**Maintained For**: MACA Course - Multi-AI Coding Agent
**Target Audience**: Developers setting up Windows development environment with containerization support

---

## 🔗 Referenced By

This guide is referenced by:
- [[docker-desktop-installation-guide]] - Docker Desktop requires WSL2 backend
- [[glossary/system-administrator]] - Administrator privileges explained
- [[environment-variable]] - Cross-platform environment configuration

**Knowledge Graph Hub**: [[glossary-README|Glossary Hub]]
