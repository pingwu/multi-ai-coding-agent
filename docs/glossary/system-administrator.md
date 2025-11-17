---
type: concept
category: glossary
subcategory: system-configuration
tags:
  - security
  - permissions
  - cross-platform
  - windows
  - linux
  - macos
related_concepts:
  - environment-variables
  - security
  - user-accounts
difficulty: beginner
version: 1.0.0
last_updated: 2025-11-17
---

# System Administrator - Understanding Elevated Privileges Across Platforms

> **Quick Summary**: A system administrator (or "admin") is a user account with elevated privileges to modify system-level settings, install software, and configure security. Different operating systems implement administrator access differently.

---

## Table of Contents

- [What is a System Administrator?](#what-is-a-system-administrator)
- [Why Administrator Privileges Exist](#why-administrator-privileges-exist)
- [Windows Administrator Access](#windows-administrator-access)
- [Linux and macOS Administrator Access](#linux-and-macos-administrator-access)
- [Cross-Platform Comparison](#cross-platform-comparison)
- [When You Need Administrator Access](#when-you-need-administrator-access)
- [Security Best Practices](#security-best-practices)
- [Common Scenarios for Developers](#common-scenarios-for-developers)
- [Troubleshooting Permission Issues](#troubleshooting-permission-issues)

---

## What is a System Administrator?

### Definition

**System Administrator** (often shortened to "admin" or "sysadmin") refers to:

1. **A person** who manages computer systems and networks
2. **A user account type** with elevated privileges to modify system settings
3. **A security role** with authority to configure hardware, software, and access controls

**In development context**, when documentation says "run as administrator" or "requires admin privileges," it means using an account with **elevated permissions** to modify system-level configurations.

### Administrator vs Standard User

**Standard User Account**:
- Can run applications
- Can modify own files and settings
- **Cannot** install system-wide software
- **Cannot** modify system files or [[environment-variable|system environment variables]]
- **Cannot** configure hardware drivers
- **Cannot** modify other users' files

**Administrator Account**:
- All standard user capabilities PLUS:
- ✅ Install software for all users
- ✅ Modify system files and registry (Windows)
- ✅ Configure system-wide [[environment-variable|environment variables]]
- ✅ Install hardware drivers
- ✅ Modify security settings
- ✅ Manage other user accounts

**Analogy**: Think of administrator access like a master key that can open any door in a building, while standard users have keys only to their own rooms.

---

## Why Administrator Privileges Exist

### Security Protection

**Principle of Least Privilege**:
- Users should have **minimum** permissions needed to do their work
- Limits damage from:
  - Malware infections
  - Accidental system modifications
  - Unauthorized access

**Protection Mechanisms**:
```
Standard User (Day-to-Day Work)
    ↓ Attempts system change
Security Prompt (UAC/sudo)
    ↓ User confirms with password
Administrator Access Granted (Temporarily)
    ↓ Change completed
Returns to Standard User Mode
```

### Real-World Example

**Without Administrator Protection**:
```python
# Malicious script runs automatically
import os
os.system("del C:\\Windows\\System32\\*")  # DISASTER - Could delete critical files
```

**With Administrator Protection**:
```
❌ Access Denied: You need administrator privileges
User must explicitly authorize dangerous operations
```

---

## Windows Administrator Access

### Windows User Account Control (UAC)

**UAC** is Windows' security feature that prompts for administrator approval when making system changes.

#### How UAC Works

**Standard Flow**:
1. You attempt system-level operation (e.g., install software)
2. **UAC prompt appears**: "Do you want to allow this app to make changes?"
3. You click **"Yes"** (if admin) or enter admin password (if standard user)
4. Operation proceeds with elevated privileges
5. Privileges automatically return to normal after operation completes

**Example UAC Scenarios**:
- Installing software (`.exe`, `.msi` installers)
- Modifying files in `C:\Windows\` or `C:\Program Files\`
- Changing system-wide [[environment-variable|environment variables]]
- Enabling Windows features (like [[wsl-setup-guide|WSL virtualization]])
- Running PowerShell commands that modify system configuration

### Running Programs as Administrator

#### Method 1: Right-Click Context Menu

**For Applications**:
1. Right-click the program icon or `.exe` file
2. Select **"Run as administrator"**
3. Click **"Yes"** on UAC prompt

**For PowerShell/Command Prompt**:
1. Press `Windows Key`
2. Type `PowerShell` or `cmd`
3. **Right-click** the result
4. Select **"Run as administrator"**
5. Click **"Yes"** on UAC prompt

#### Method 2: Keyboard Shortcut

**Quick Launch as Administrator**:
1. Press `Windows Key`
2. Type application name
3. Press **`Ctrl + Shift + Enter`** (instead of just Enter)
4. Confirm UAC prompt

#### Method 3: Always Run as Administrator

**Permanent Setting** (for specific application):
1. Right-click application shortcut
2. Select **Properties**
3. Go to **Compatibility** tab
4. Check **"Run this program as an administrator"**
5. Click **OK**

**⚠️ Warning**: Only do this for trusted applications you frequently use with admin rights.

### Windows Administrator Account Types

**Built-in Administrator Account**:
- Disabled by default in Windows 10/11 for security
- Has full unrestricted access (no UAC prompts)
- **Not recommended** for daily use

**User Account in Administrators Group**:
- Normal user account with administrator privileges
- **UAC prompts still appear** (important security feature)
- **Recommended** approach for development work

**Checking Your Account Type**:
```powershell
# PowerShell - Check if you're an administrator
net user %username% | findstr /B /C:"Local Group Memberships"

# Expected output for admin:
# Local Group Memberships      *Administrators       *Users
```

### Administrator-Only Operations in Windows

**System Configuration**:
- Installing/uninstalling software system-wide
- Modifying Windows Registry (`HKEY_LOCAL_MACHINE`)
- Changing system-wide [[environment-variable|environment variables]]
- Enabling Windows features (Control Panel → Programs → Turn Windows features on or off)
- Installing device drivers

**File System Access**:
- Modifying files in `C:\Windows\`
- Modifying files in `C:\Program Files\` or `C:\Program Files (x86)\`
- Changing NTFS permissions on system files
- Taking ownership of files from other users

**PowerShell/CMD System Commands**:
```powershell
# These require administrator privileges:
dism.exe /online /enable-feature ...   # Enable Windows features
bcdedit /set ...                        # Boot configuration
netsh ...                               # Network configuration
sc.exe create ...                       # Service creation
```

---

## Linux and macOS Administrator Access

### The `sudo` Command

**`sudo`** = "**s**uper**u**ser **do**" - Execute command as administrator (root user).

**How sudo Works**:
```bash
# Standard user cannot modify system files
rm /etc/important-config
# Error: Permission denied

# With sudo - Administrator privileges granted
sudo rm /etc/important-config
# [sudo] password for username: [type your password]
# File deleted (if password correct)
```

### Linux/macOS Permission Model

**Users and Groups**:
```
root (UID 0)
    ↓ Superuser account
    ↓ Can do ANYTHING
    ↓
Standard Users (UID 1000+)
    ↓ Limited permissions
    ↓ Can modify own files only
    ↓
sudo-enabled users (in "wheel" or "sudo" group)
    ↓ Can use sudo for admin tasks
```

**File Permissions** (Unix):
```bash
# Example file listing
-rw-r--r-- 1 user user     123 Jan 17 10:00 myfile.txt
-rwxr-xr-x 1 root root    4567 Jan 17 10:00 /usr/bin/python3
drwxr-xr-x 2 root root    4096 Jan 17 10:00 /etc/

# Permission breakdown:
# - rw- r-- r--
#   ↓   ↓   ↓
#  Owner Group Others
```

### Using `sudo` Effectively

#### Basic `sudo` Commands

```bash
# Run single command with administrator privileges
sudo apt update                    # Update package lists (Ubuntu/Debian)
sudo yum update                    # Update packages (RedHat/CentOS)
sudo systemctl restart nginx       # Restart system service

# Edit system configuration file
sudo nano /etc/ssh/sshd_config
sudo vim /etc/hosts

# Install software system-wide
sudo apt install docker.io         # Ubuntu/Debian
sudo brew install docker           # macOS with Homebrew
```

#### Common `sudo` Patterns

**Chain commands with `sudo`**:
```bash
# Only first command runs as root - WRONG
sudo apt update && apt upgrade
# Error: Permission denied on second command

# Both commands run as root - CORRECT
sudo apt update && sudo apt upgrade

# Alternative - run shell as root for multiple commands
sudo sh -c 'apt update && apt upgrade'
```

**Preserving Environment Variables**:
```bash
# Environment variables lost with sudo
sudo echo $HOME
# Output: /root (not your home directory)

# Preserve environment variables
sudo -E echo $HOME
# Output: /home/yourusername
```

**Running as Specific User**:
```bash
# Run command as specific user
sudo -u postgres psql               # Run psql as postgres user
sudo -u www-data touch /var/www/file # Create file as web server user
```

#### `sudo` Configuration

**Checking sudo Access**:
```bash
# Check if you can use sudo
sudo -v
# [sudo] password for username: [type password]

# Check what you can do with sudo
sudo -l
```

**Password Timeout**:
- After entering password, `sudo` remembers for **15 minutes** (default)
- No re-authentication needed during this window
- Security trade-off: convenience vs. protection

**Configuring sudo** (Advanced):
```bash
# Edit sudo configuration (DANGEROUS - syntax errors can lock you out)
sudo visudo

# Example: Allow user to run specific command without password
username ALL=(ALL) NOPASSWD: /usr/bin/docker
```

### macOS Administrator Access

**macOS uses Unix permissions** (like Linux) **+ GUI authentication dialogs**.

**GUI Authentication**:
- Installing applications from `.dmg` or `.pkg` files
- Modifying System Preferences
- Installing Xcode command-line tools

**Terminal `sudo` Access**:
```bash
# macOS uses sudo like Linux
sudo brew install python
sudo chmod +x /usr/local/bin/script.sh

# macOS-specific: Install Xcode tools
sudo xcode-select --install
```

**macOS Administrator Account**:
- First user created during macOS setup is administrator
- Can use `sudo` in Terminal
- Can authorize system changes in GUI

**Checking macOS Admin Status**:
```
System Preferences → Users & Groups
→ Your account should show "Admin" under name
```

---

## Cross-Platform Comparison

### Administrator Access Comparison Table

| Feature | Windows | Linux | macOS |
|---------|---------|-------|-------|
| **Admin Prompt** | UAC dialog (GUI) | `sudo` command | Both GUI + `sudo` |
| **Password Required** | Yes (UAC) | Yes (first time, then 15min timeout) | Yes (GUI and `sudo`) |
| **Temporary Elevation** | Per-operation | Per-command (with timeout) | Per-operation/command |
| **Root Account Access** | Not recommended | Possible but discouraged | Disabled by default |
| **Environment Variable Scope** | System vs User | System (`/etc/environment`) vs User (`~/.bashrc`) | System vs User |
| **Package Installation** | Requires admin | `sudo apt install` | `sudo brew install` or GUI |

### Task-Specific Cross-Platform Guide

#### Installing Software

**Windows**:
```powershell
# Run installer as administrator
Right-click setup.exe → Run as administrator

# Or PowerShell with admin rights
Start-Process setup.exe -Verb RunAs
```

**Linux**:
```bash
# Debian/Ubuntu
sudo apt install package-name

# RedHat/CentOS
sudo yum install package-name

# Arch Linux
sudo pacman -S package-name
```

**macOS**:
```bash
# Homebrew (recommended)
brew install package-name

# Or install .pkg file (GUI prompts for password)
```

#### Modifying System-Wide [[environment-variable|Environment Variables]]

**Windows**:
```powershell
# Requires administrator privileges
# GUI: sysdm.cpl → Advanced → Environment Variables → System variables

# PowerShell (as administrator)
[Environment]::SetEnvironmentVariable("VAR_NAME", "value", [EnvironmentVariableTarget]::Machine)
```

**Linux**:
```bash
# System-wide environment variables (requires sudo)
sudo nano /etc/environment
# Add: VAR_NAME="value"

# Or for all users' shells
sudo nano /etc/profile.d/custom-vars.sh
# Add: export VAR_NAME="value"
```

**macOS**:
```bash
# System-wide (requires sudo)
sudo nano /etc/paths
# Or /etc/launchd.conf for environment variables

# User-specific (no sudo needed)
nano ~/.zshrc  # macOS Catalina+
# Add: export VAR_NAME="value"
```

**See**: [[environment-variable]] for complete cross-platform environment variable guide.

#### Enabling Virtualization Features

**Windows** ([[wsl-setup-guide|WSL Setup]]):
```powershell
# Requires administrator - enables system features
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

**Linux**:
```bash
# Check virtualization support
egrep -c '(vmx|svm)' /proc/cpuinfo
# Non-zero = virtualization supported

# Enable KVM (Kernel Virtual Machine) - requires sudo
sudo modprobe kvm
sudo modprobe kvm_intel  # Or kvm_amd for AMD
```

**macOS**:
```bash
# macOS virtualization enabled by default on modern Macs
# Docker Desktop and VMs use macOS Hypervisor framework
```

---

## When You Need Administrator Access

### Development Scenarios Requiring Admin Rights

#### 1. Installing Development Tools

**Examples**:
- Python, Node.js, Java SDKs
- Docker Desktop
- Git
- Visual Studio Code (system-wide installation)
- Package managers (Chocolatey on Windows, Homebrew on macOS)

**Why**:
- Install to system directories (accessible by all users)
- Add to system PATH
- Install drivers or system services

#### 2. Configuring System Features

**Windows**:
- Enabling [[wsl-setup-guide|WSL (Windows Subsystem for Linux)]]
- Enabling Hyper-V for virtualization
- Modifying Windows Firewall rules
- Installing device drivers

**Linux**:
- Installing system packages (`sudo apt install`)
- Managing system services (`sudo systemctl`)
- Modifying network configuration
- Installing kernel modules

#### 3. Docker and Container Development

**All Platforms**:
- Installing Docker Desktop (initial setup requires admin)
- Configuring Docker daemon settings
- Managing container networking

**Linux-Specific**:
```bash
# Adding user to docker group (avoids needing sudo for docker commands)
sudo usermod -aG docker $USER
# Logout/login required for group change to take effect
```

#### 4. Setting System-Wide [[environment-variable|Environment Variables]]

**When You Need System-Wide Variables**:
- API keys used by system services
- Paths required by all users
- Configuration for system-wide applications

**When User Variables Are Sufficient**:
- Your personal API keys (Anthropic, OpenAI)
- Development paths specific to your projects
- Personal tool configuration

**See**: [[environment-variable#user-vs-system|Environment Variables - User vs System]]

---

## Security Best Practices

### Principle of Least Privilege

**Golden Rule**: Only use administrator privileges when absolutely necessary.

**Good Practices**:
- ✅ Use standard user account for daily work
- ✅ Only elevate when installing/configuring system components
- ✅ Review what you're authorizing before clicking "Yes" on UAC
- ✅ Use user-level [[environment-variable|environment variables]] when possible
- ✅ Question applications that always request admin rights

**Bad Practices**:
- ❌ Running with administrator account all the time
- ❌ Disabling UAC or sudo password prompts
- ❌ Blindly clicking "Yes" on permission prompts
- ❌ Running unknown scripts with `sudo` or as administrator
- ❌ Storing admin credentials in scripts

### Protecting Against Malicious Software

**Administrator Access = Malware Can Do Anything**:

**Scenario 1: Standard User (Protected)**:
```python
# Malicious script tries to delete system files
os.system("rm -rf /etc/*")
# ❌ Permission denied - limited damage
```

**Scenario 2: Administrator/Root (Disaster)**:
```bash
# Same malicious script with sudo
sudo rm -rf /etc/*
# ✅ Executes successfully - SYSTEM DESTROYED
```

**Defense Strategy**:
1. **Never** run untrusted scripts with `sudo` or as administrator
2. **Review** what commands actually do before elevating privileges
3. **Use** anti-malware software
4. **Keep** your system and software updated

### Safe `sudo` Usage (Linux/macOS)

**Before running `sudo`**:
1. **Understand what the command does**
   ```bash
   # BAD - Don't blindly copy-paste
   curl https://unknown-site.com/script.sh | sudo bash

   # GOOD - Review first
   curl https://unknown-site.com/script.sh -o script.sh
   cat script.sh  # READ IT FIRST
   # If safe:
   sudo bash script.sh
   ```

2. **Verify package sources**
   ```bash
   # GOOD - Official repositories
   sudo apt install package-name

   # RISKY - Unknown PPA
   sudo add-apt-repository ppa:unknown/source
   sudo apt install package-name
   ```

3. **Use specific privileges**
   ```bash
   # LESS RISKY - Run as specific user
   sudo -u www-data touch /var/www/file

   # MORE RISKY - Full root access
   sudo -i  # Opens root shell - be very careful
   ```

### Safe Administrator Usage (Windows)

**Before clicking "Yes" on UAC**:
1. **Check the publisher** - Is it a trusted company?
2. **Verify the program name** - Does it match what you intended to run?
3. **Question unexpected prompts** - Did you initiate this action?

**Example UAC Dialog Review**:
```
✅ SAFE:
Publisher: Microsoft Corporation
Program: Windows Update

⚠️ SUSPICIOUS:
Publisher: Unknown
Program: svchost32.exe (note: not the real svchost.exe)

❌ DANGEROUS:
Publisher: Unknown
Program: get-rich-quick.exe
```

---

## Common Scenarios for Developers

### Scenario 1: "Permission Denied" Installing Python Package

**Problem**:
```bash
pip install some-package
# Error: Permission denied
```

**Solution**:

**GOOD - User-level installation (no admin needed)**:
```bash
# Install for current user only
pip install --user some-package

# Or use virtual environment (best practice)
python -m venv myenv
source myenv/bin/activate  # Linux/macOS
myenv\Scripts\activate     # Windows
pip install some-package
```

**AVOID - System-wide installation**:
```bash
# Requires administrator/sudo
sudo pip install some-package  # Linux/macOS
# Or run PowerShell as administrator (Windows)

# ⚠️ Not recommended - pollutes system Python
```

### Scenario 2: Cannot Modify `/usr/local/` on macOS/Linux

**Problem**:
```bash
mkdir /usr/local/myapp
# Error: Permission denied
```

**Solution**:
```bash
# Use sudo for system directories
sudo mkdir /usr/local/myapp
sudo chown $USER:$USER /usr/local/myapp
# Now you own it and can modify without sudo
```

**Better Alternative**:
```bash
# Use user directory instead (no sudo needed)
mkdir ~/Applications/myapp
# Or
mkdir ~/.local/bin
```

### Scenario 3: Docker "Permission Denied" on Linux

**Problem**:
```bash
docker run hello-world
# Error: Permission denied while trying to connect to the Docker daemon socket
```

**Solution**:
```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Logout and login again (or run)
newgrp docker

# Now docker works without sudo
docker run hello-world
```

### Scenario 4: Setting [[environment-variable|Environment Variables]] for Development

**Scenario**: Setting up [[glossary/api-key|API keys]] for development.

**RECOMMENDED - User Environment Variables**:

**Windows**:
```powershell
# No administrator needed - User variables
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "your-key", [EnvironmentVariableTarget]::User)
```

**Linux/macOS**:
```bash
# No sudo needed - User profile
echo 'export ANTHROPIC_API_KEY="your-key"' >> ~/.bashrc
source ~/.bashrc
```

**NOT RECOMMENDED - System Variables** (requires admin):
- Only needed if system services require the variable
- See [[environment-variable#user-vs-system|Environment Variables - User vs System]]

---

## Troubleshooting Permission Issues

### Diagnosing Permission Problems

#### Step 1: Identify the Operation

**Ask**:
- What am I trying to do?
- Is it modifying system files?
- Is it installing software system-wide?
- Is it changing system configuration?

#### Step 2: Check Your Current Privileges

**Windows**:
```powershell
# Check if PowerShell is running as administrator
whoami /groups | findstr "S-1-16-12288"
# If found → Running as administrator
# If not found → Standard user
```

**Linux/macOS**:
```bash
# Check if you can use sudo
sudo -v
# If asks for password → You have sudo access
# If "not in sudoers file" → No sudo access

# Check current user
whoami
# If "root" → Running as root (be careful!)
# If your username → Standard user
```

### Common Error Messages and Solutions

#### "Access is denied" (Windows)

**Cause**: Attempting to modify system files or settings without administrator privileges.

**Solutions**:
1. **Run PowerShell/CMD as administrator**
2. **Run the program as administrator** (right-click → Run as administrator)
3. **Check if you need system-wide access** or if user-level is sufficient

#### "Permission denied" (Linux/macOS)

**Cause**: Attempting to modify files/directories you don't own or system locations.

**Solutions**:
```bash
# Check file ownership
ls -la /path/to/file

# If you should own it - change ownership (requires sudo)
sudo chown $USER:$USER /path/to/file

# If it's a system file - use sudo
sudo nano /etc/config-file

# If it's in your home directory - check permissions
chmod u+w ~/myfile  # Add write permission for yourself
```

#### "You are not in the sudoers file" (Linux/macOS)

**Cause**: Your user account doesn't have sudo privileges.

**Solution**:
```bash
# Another administrator must add you to sudo group

# Ubuntu/Debian (run by existing admin)
sudo usermod -aG sudo username

# RedHat/CentOS (run by existing admin)
sudo usermod -aG wheel username

# Logout and login for changes to take effect
```

#### UAC Prompt Shows "Unknown Publisher" (Windows)

**Cause**: Application not digitally signed by recognized authority.

**Assessment**:
- ✅ If you compiled it yourself or it's from trusted source → Proceed
- ⚠️ If downloaded from internet → Verify source carefully
- ❌ If unexpected or suspicious → Cancel and investigate

---

## Key Takeaways

✅ **You should now understand**:
- Administrator = elevated privileges to modify system-level settings
- Windows uses UAC (User Account Control) for security prompts
- Linux/macOS use `sudo` command for administrator operations
- Principle of least privilege: only elevate when necessary
- User-level configuration preferred over system-level when possible

✅ **You should be able to**:
- Run programs as administrator on Windows (multiple methods)
- Use `sudo` command on Linux/macOS correctly
- Distinguish when administrator access is actually required
- Configure [[environment-variable|environment variables]] at appropriate scope (user vs system)
- Troubleshoot common permission errors across platforms
- Apply security best practices for elevated privileges

✅ **Security awareness**:
- Never blindly approve UAC prompts or run unknown `sudo` commands
- Use administrator privileges only when absolutely necessary
- Understand the risk: admin access = full system control
- Review what you're authorizing before granting permissions
- Keep admin credentials secure

📝 **Remember**:
- Standard user for daily work, administrator only when needed
- Question applications that always require admin rights
- Read scripts before running with `sudo` or as administrator
- User-level [[environment-variable|environment variables]] sufficient for most development
- Different platforms implement administrator access differently

---

## Related Concepts

- **[[environment-variable]]** - User vs System environment variables explained
- **[[wsl-setup-guide]]** - Example requiring administrator access to enable Windows features
- **[[glossary/api-key]]** - Securing credentials with proper permissions
- **[[SECRET_MANAGEMENT_GUIDELINE]]** - Production security best practices
- **User Access Control (UAC)** - Windows security architecture
- **Unix Permissions** - File system security on Linux/macOS
- **Docker permissions** - Running containers without root

---

## Additional Resources

### Official Documentation
- [Windows User Account Control](https://docs.microsoft.com/en-us/windows/security/identity-protection/user-account-control/)
- [Linux sudo Manual](https://www.sudo.ws/man/sudo.man.html)
- [macOS User Management](https://support.apple.com/guide/mac-help/set-up-users-mtusr001/mac)

### Security Best Practices
- [Principle of Least Privilege (NIST)](https://csrc.nist.gov/glossary/term/least_privilege)
- [OWASP Access Control](https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control)
- [CIS Benchmark - User Account Management](https://www.cisecurity.org/cis-benchmarks/)

### Troubleshooting
- [Windows Permission Troubleshooting](https://docs.microsoft.com/en-us/troubleshoot/windows-server/identity/)
- [Linux File Permissions Guide](https://www.linux.com/training-tutorials/understanding-linux-file-permissions/)
- [macOS Permissions Repair](https://support.apple.com/en-us/HT203087)

---

**Last Updated**: 2025-11-17
**Document Type**: Conceptual (Zettelkasten)
**Maintained For**: MACA Course - Multi-AI Coding Agent
**Target Audience**: Developers learning cross-platform system administration concepts

---

## 🔗 Referenced By

This glossary entry is referenced by:
- [[wsl-setup-guide]] - WSL setup requires administrator access to enable Windows features
- [[environment-variable]] - Explains when system vs user environment variables require admin access
- [[docker-desktop-installation-guide]] - Docker installation requires administrator privileges

**Knowledge Graph Hub**: [[glossary-README|Glossary Hub]]
