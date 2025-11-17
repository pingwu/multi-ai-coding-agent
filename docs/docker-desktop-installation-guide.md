# Docker Desktop Installation Guide

**Target Audience**: Developers training for DevOps/Platform Engineering roles
**Skill Level**: Beginner to Intermediate
**Time Required**: 20-30 minutes (Windows with WSL 2), 10-15 minutes (macOS)

---

## What You'll Learn

This guide covers production-grade Docker Desktop setup for containerized application development. You'll learn:

- **Container Runtime Configuration**: Install Docker Engine with Desktop UI for local development
- **Platform-Specific Requirements**: WSL 2 integration (Windows) or HyperKit/VirtualBox (macOS)
- **Production Workflow Preparation**: Set up environment for CI/CD pipeline development
- **Resource Management**: Configure CPU, memory, and storage for container workloads
- **Security Posture**: Understand isolation boundaries and credential management

**Why Docker Desktop Matters for DevOps**:
- **Local-to-Production Parity**: Develop with same container runtime used in cloud deployments
- **Infrastructure as Code**: Learn Dockerfile and docker-compose.yml patterns
- **Microservices Architecture**: Build multi-container applications locally
- **CI/CD Integration**: Test pipeline configurations before cloud deployment

---

<details>
<summary><strong>📋 Table of Contents</strong> (click to expand)</summary>

- [Quick Setup for Experienced Users](#quick-setup-for-experienced-users)
- [Introduction](#introduction)
- [Glossary](#glossary)
- [Prerequisites](#prerequisites)
  - [Windows Requirements](#windows-requirements)
  - [macOS Requirements](#macos-requirements)
- [Installation Guide](#installation-guide)
  - [Windows Installation](#windows-installation)
  - [macOS Installation](#macos-installation)
- [Verification](#verification)
- [Post-Installation Configuration](#post-installation-configuration)
- [Troubleshooting](#troubleshooting)
  - [Windows-Specific Issues](#windows-specific-issues)
  - [macOS-Specific Issues](#macos-specific-issues)
- [Still Stuck? How to Get AI Help](#still-stuck-how-to-get-ai-help)
- [Success! What's Next?](#success-whats-next)
- [Common Pitfalls Quick Reference](#common-pitfalls-quick-reference)
- [Additional Resources](#additional-resources)
- [Version History](#version-history)

</details>

---

## Quick Setup for Experienced Users

<details>
<summary><strong>⚡ Speed Run Commands</strong> (click to expand)</summary>

### Windows (PowerShell as Administrator)

```powershell
# 1. Enable WSL 2 (requires reboot)
wsl --install

# 2. Reboot system
Restart-Computer

# 3. After reboot, verify WSL 2
wsl --list --verbose

# 4. Download Docker Desktop
Start-Process "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"

# 5. Install Docker Desktop (follow GUI prompts)
# Ensure "Use WSL 2 instead of Hyper-V" is checked

# 6. Verify installation
docker --version
docker run hello-world
docker compose version
```

### macOS (Homebrew)

```bash
# 1. Install via Homebrew
brew install --cask docker

# 2. Start Docker Desktop
open /Applications/Docker.app

# 3. Verify installation
docker --version
docker run hello-world
docker compose version
```

### macOS (Manual Download)

```bash
# 1. Download installer
# Intel: https://desktop.docker.com/mac/main/amd64/Docker.dmg
# Apple Silicon: https://desktop.docker.com/mac/main/arm64/Docker.dmg

# 2. Install Docker.app to /Applications
# 3. Start Docker Desktop from Applications
# 4. Verify in terminal

docker --version
docker run hello-world
```

**⚠️ Critical Production Notes**:
- **Windows**: WSL 2 is mandatory for performance (10x faster I/O than Hyper-V)
- **macOS Apple Silicon**: Uses Rosetta 2 for x86 container emulation (performance impact)
- **Resource Limits**: Default 2GB RAM insufficient for multi-container apps - allocate 4-8GB
- **Security**: Docker Desktop runs with elevated privileges - review [security model](https://docs.docker.com/desktop/security/)

</details>

---

## Introduction

**Docker Desktop** provides a production-grade container runtime for local development with:

- **Docker Engine**: Container runtime (same as production servers)
- **Docker CLI**: Command-line interface for container management
- **Docker Compose**: Multi-container orchestration tool
- **Kubernetes**: Optional local cluster for K8s development
- **Desktop UI**: Visual container/image/volume management

### Why Container-Based Development?

**Production Imperative**: Modern cloud deployments use containers (Docker, Kubernetes, ECS, Cloud Run). Developing with containers ensures:

1. **Environment Parity**: "Works on my machine" → "Works everywhere"
2. **Dependency Isolation**: Each project gets isolated runtime environment
3. **Infrastructure as Code**: Dockerfiles define reproducible build processes
4. **CI/CD Readiness**: Same artifacts used in development and production
5. **Microservices Architecture**: Learn service mesh patterns locally

### Docker Desktop vs Docker Engine (Production Considerations)

| Feature | Docker Desktop | Docker Engine (Linux Server) |
|---------|----------------|------------------------------|
| **Use Case** | Local development | Production deployments |
| **Platform** | Windows, macOS | Linux only |
| **VM Layer** | WSL 2 (Win), HyperKit (Mac) | Native kernel |
| **Performance** | 70-90% native | 100% native |
| **GUI** | Desktop UI included | CLI only |
| **Licensing** | Free (personal use), Paid (enterprise) | Open source (Apache 2.0) |

**DevOps Career Path**: Learn Docker Desktop locally → Deploy Docker Engine in cloud (ECS, GKE, AKS).

---

## Glossary

<details>
<summary><strong>📖 Container Technology Terms</strong> (click to expand)</summary>

### Core Concepts

**Container**
Isolated process running with own filesystem, network, and resource limits. Unlike VMs, shares host OS kernel (lightweight, fast startup).

**Image**
Read-only template containing application code, runtime, libraries, and dependencies. Built from Dockerfile instructions.

**Dockerfile**
Text file with instructions to build Docker image. Equivalent to build script in infrastructure as code.

**Docker Compose**
Tool for defining multi-container applications via YAML configuration (`docker-compose.yml`). Used for local development, replaced by Kubernetes in production.

**Registry**
Repository for Docker images. DockerHub (public), Amazon ECR, Google Artifact Registry, Azure Container Registry (private).

### Platform-Specific

**WSL 2 (Windows Subsystem for Linux 2)**
Full Linux kernel running on Windows via lightweight VM. Required for Docker Desktop on Windows (provides native Linux container support).

**Hyper-V**
Microsoft's hypervisor for virtualization. Legacy Docker Desktop backend (slower than WSL 2).

**HyperKit (macOS)**
Lightweight hypervisor for macOS. Docker Desktop uses this to run Linux VM for containers.

**Rosetta 2 (macOS Apple Silicon)**
Emulation layer for running x86_64 containers on ARM64 Macs. Performance overhead ~20-30%.

### Resource Management

**Volume**
Persistent storage mechanism for containers. Data survives container deletion. Managed by Docker Engine.

**Network**
Virtual network for container communication. Docker provides bridge, host, overlay network drivers.

**Resource Limits**
CPU, memory, disk I/O constraints applied to containers. Configured via Docker Desktop settings or docker-compose.yml.

### Production Concepts

**Container Runtime**
Low-level software that runs containers (containerd, CRI-O). Docker Desktop includes containerd.

**Orchestration**
Automated deployment, scaling, and management of containerized applications (Kubernetes, Docker Swarm, ECS).

**Image Layers**
Dockerfile instructions create layers cached for fast rebuilds. Layering strategy affects build time and image size.

</details>

---

## Prerequisites

### System Requirements Overview

| Platform | Minimum Requirements | Recommended for Production-Like Development |
|----------|---------------------|---------------------------------------------|
| **Windows** | Windows 10 Pro/Enterprise 64-bit (build 19041+) | Windows 11 Pro with 16GB RAM |
| **macOS** | macOS 11 Big Sur or later | macOS 13+ with Apple Silicon or Intel i5+ |
| **RAM** | 4GB | 8-16GB (multi-container workloads) |
| **Disk Space** | 10GB free | 50GB+ (images, volumes, build cache) |

---

### Windows Requirements

#### Critical Prerequisites

**Operating System**:
- ✅ **Windows 10 Pro, Enterprise, or Education** (build 19041 or later)
- ✅ **Windows 11 Pro or Enterprise**
- ❌ **Windows 10 Home** (lacks Hyper-V, but WSL 2 works with limitations)

**Why Pro/Enterprise Required**:
- Hyper-V support (legacy backend)
- Windows Containers support (optional)
- Group Policy management (enterprise deployments)

**WSL 2 (Mandatory)**:
- Linux kernel integration for native container performance
- 10x faster I/O than Hyper-V backend
- Full syscall compatibility with Linux containers

**Hardware Requirements**:
- **Virtualization**: Must be enabled in BIOS (Intel VT-x / AMD-V)
- **64-bit processor**: x86_64 architecture
- **RAM**: 4GB minimum, 8GB+ recommended
- **Disk**: 10GB free space minimum

#### Check Your System

**PowerShell (Run as Administrator)**:

```powershell
# Check Windows version and build
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"

# Check if virtualization enabled
Get-ComputerInfo | Select-Object HyperVRequirementVirtualizationFirmwareEnabled

# Check WSL status
wsl --status

# Check available RAM
Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property capacity -Sum | ForEach-Object {[math]::round($_.sum / 1GB, 2)}
```

**Expected Output**:
```
OS Name: Microsoft Windows 11 Pro
OS Version: 10.0.22621 Build 22621

HyperVRequirementVirtualizationFirmwareEnabled: True

Default Version: 2

RAM: 16.00 GB
```

**If Virtualization Disabled**:
1. Reboot into BIOS/UEFI (usually F2, DEL, or F12 during startup)
2. Find "Virtualization Technology" (Intel VT-x) or "SVM Mode" (AMD-V)
3. Enable setting
4. Save and exit BIOS

---

### macOS Requirements

#### Critical Prerequisites

**Operating System**:
- ✅ **macOS 11 (Big Sur) or later**
- ✅ **macOS 13 (Ventura) recommended** for Apple Silicon optimization

**Hardware**:
- **Apple Silicon (M1/M2/M3)**: Native ARM64 support with Rosetta 2 for x86 emulation
- **Intel Processor**: Core i5 or better recommended
- **RAM**: 4GB minimum, 8GB+ recommended
- **Disk**: 10GB free space minimum

**Performance Considerations**:

| Mac Type | Native Containers | Emulated Containers (x86_64) |
|----------|-------------------|------------------------------|
| **Apple Silicon** | ARM64 (100% performance) | x86_64 via Rosetta 2 (70-80% performance) |
| **Intel** | x86_64 (100% performance) | ARM64 not supported |

**Why This Matters**:
- Most Docker images on DockerHub are x86_64 (built for Intel/AMD)
- Apple Silicon Macs can run x86_64 containers via Rosetta 2 (performance penalty)
- DevOps best practice: Build multi-arch images (`docker buildx`) for ARM64 + x86_64

#### Check Your System

**Terminal**:

```bash
# Check macOS version
sw_vers

# Check processor architecture
uname -m
# Output: "arm64" (Apple Silicon) or "x86_64" (Intel)

# Check available RAM
sysctl hw.memsize | awk '{print $2 / 1024 / 1024 / 1024 " GB"}'

# Check available disk space
df -h /
```

**Expected Output (Apple Silicon)**:
```
ProductName:        macOS
ProductVersion:     13.5.2
BuildVersion:       22G91

arm64

16 GB

Filesystem     Size   Used  Avail Capacity
/dev/disk3s1  460Gi  200Gi  260Gi    44%
```

**Rosetta 2 Installation (Apple Silicon Only)**:

Docker Desktop automatically prompts for Rosetta 2 installation, but you can install manually:

```bash
softwareupdate --install-rosetta --agree-to-license
```

---

## Installation Guide

### Windows Installation

**⚠️ CRITICAL: Complete WSL 2 setup BEFORE installing Docker Desktop**

#### Step 1: Enable WSL 2

**Open PowerShell as Administrator** (Right-click Start → Windows PowerShell (Admin))

```powershell
# Install WSL 2 with default Ubuntu distribution
wsl --install
```

**What This Does**:
- Enables Windows Subsystem for Linux feature
- Enables Virtual Machine Platform feature
- Downloads and installs Linux kernel
- Installs Ubuntu 22.04 LTS (default distribution)
- Sets WSL 2 as default version

**Expected Output**:
```
Installing: Windows Subsystem for Linux
Installing: Virtual Machine Platform
Installing: Ubuntu
The requested operation is successful. Changes will not be effective until the system is rebooted.
```

**⚠️ REBOOT REQUIRED**: Restart your computer before continuing.

---

#### Step 2: Verify WSL 2 Installation (After Reboot)

**Open PowerShell** (administrator not required this time)

```powershell
# Check WSL version and distributions
wsl --list --verbose
```

**Expected Output**:
```
  NAME      STATE           VERSION
* Ubuntu    Stopped         2
```

**Version Column MUST show "2"**. If it shows "1", upgrade:

```powershell
wsl --set-version Ubuntu 2
```

**Test WSL 2**:

```powershell
# Launch Ubuntu shell
wsl

# Inside WSL, check kernel version
uname -a
# Expected: Linux version 5.15+ (WSL 2 kernel)

# Exit WSL
exit
```

---

#### Step 3: Download Docker Desktop

**Option A: Direct Download (Recommended)**

1. Visit: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Click **"Download for Windows"**
3. Wait for `Docker Desktop Installer.exe` download (~500MB)

**Option B: Command-Line Download (PowerShell)**

```powershell
# Download installer to Downloads folder
Invoke-WebRequest -Uri "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe" -OutFile "$env:USERPROFILE\Downloads\DockerDesktopInstaller.exe"
```

---

#### Step 4: Install Docker Desktop

**Run Installer**:

```powershell
# Start installer
Start-Process "$env:USERPROFILE\Downloads\DockerDesktopInstaller.exe"
```

**Or double-click** `Docker Desktop Installer.exe` in Downloads folder.

**Installation Options** (Configuration Screen):

```
[✓] Use WSL 2 instead of Hyper-V (recommended)
    ↳ CRITICAL: Must be checked for performance

[✓] Add shortcut to desktop
    ↳ Optional convenience
```

**⚠️ DO NOT uncheck "Use WSL 2 instead of Hyper-V"** - this enables native Linux container support.

**Installation Progress**:
- Unpacking files: 2-3 minutes
- Installing components: 1-2 minutes
- Configuring WSL 2 integration: 30 seconds

**Completion Prompt**:
```
Installation succeeded
[ ] Start Docker Desktop when Windows starts
[Close and restart]
```

**Recommended**: Check "Start Docker Desktop when Windows starts" for automatic startup.

Click **"Close and restart"** - Docker Desktop will launch after Windows restarts.

---

#### Step 5: Initial Docker Desktop Setup

**After Reboot**, Docker Desktop launches automatically (or start manually from Start Menu).

**First Launch Screens**:

1. **Service Agreement** → Click "Accept"
2. **Survey (Optional)** → Click "Skip" or answer
3. **Docker Desktop Tutorial** → Recommended for first-time users (5 minutes)

**Docker Desktop Startup**:

Status indicator (bottom-left corner):
```
🟡 Starting... (30-60 seconds)
🟢 Docker Desktop is running (Ready)
```

**Wait for green status** before continuing.

---

#### Step 6: Enable WSL 2 Integration (Per-Distribution)

**Docker Desktop → Settings (gear icon) → Resources → WSL Integration**

```
[✓] Enable integration with my default WSL distro (Ubuntu)

[✓] Ubuntu
[ ] Other distributions (if installed)
```

**Click "Apply & Restart"**

**Why This Matters**:
- Makes `docker` command available inside WSL Ubuntu shell
- Allows running Docker from native Linux environment
- Best practice for DevOps workflows (Linux-first development)

---

#### Step 7: Verify Installation

**Open PowerShell** (or Windows Terminal)

```powershell
# Check Docker version
docker --version

# Expected output
Docker version 24.0.7, build afdd53b

# Check Docker Compose version
docker compose version

# Expected output
Docker Compose version v2.23.0-desktop.1

# Test Docker functionality
docker run hello-world
```

**Expected "hello-world" Output**:

```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:4f53e2564790c8e7856ec08e384732aa38dc43c52f02952483e3f003afbf23db
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image.
 4. The Docker daemon streamed that output to the Docker client.
 5. The Docker client sent it to your terminal.

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

**Verify WSL 2 Integration**:

```powershell
# Launch WSL Ubuntu
wsl

# Inside WSL, check Docker
docker --version
docker run hello-world

# Exit WSL
exit
```

**✅ Success Indicators**:
- `docker --version` shows version 24.0+
- `docker compose version` shows v2.20+
- `docker run hello-world` completes without errors
- Docker commands work in both PowerShell and WSL

---

### macOS Installation

**Choose Installation Method**:

- **Homebrew** (Recommended for developers)
- **Manual Download** (Recommended for simplicity)

---

#### Method 1: Homebrew Installation (Developers)

**Prerequisites**: Homebrew package manager installed
([Install Homebrew](https://brew.sh/): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`)

**Step 1: Install Docker Desktop via Homebrew**

```bash
# Install Docker Desktop cask
brew install --cask docker
```

**What This Does**:
- Downloads Docker Desktop DMG (~800MB)
- Installs Docker.app to `/Applications/`
- Creates symlinks for `docker` CLI in `/usr/local/bin/`

**Installation Progress**:
```
==> Downloading https://desktop.docker.com/mac/main/arm64/Docker.dmg (Apple Silicon)
######################################################################## 100.0%
==> Installing Cask docker
==> Moving App 'Docker.app' to '/Applications/Docker.app'
🍺 docker was successfully installed!
```

**Step 2: Start Docker Desktop**

```bash
# Launch Docker Desktop application
open /Applications/Docker.app
```

**Or**: Open Finder → Applications → Docker (double-click)

**First Launch**:
1. **Privileged Helper Tool Installation** → Enter macOS password → Click "Install"
2. **Service Agreement** → Click "Accept"
3. **Survey (Optional)** → Click "Skip"

**Wait for Docker Engine to Start** (menu bar shows whale icon):
```
🟡 Docker Desktop is starting... (30-60 seconds)
🟢 Docker Desktop is running
```

**Step 3: Verify Installation**

```bash
# Check Docker version
docker --version
# Expected: Docker version 24.0.7, build afdd53b

# Check Docker Compose version
docker compose version
# Expected: Docker Compose version v2.23.0-desktop.1

# Test Docker functionality
docker run hello-world
```

**Expected Output**: Same "Hello from Docker!" message as Windows (see Windows Step 7).

---

#### Method 2: Manual Download Installation

**Step 1: Download Docker Desktop**

**Choose Installer Based on Mac Processor**:

```bash
# Check your Mac processor type
uname -m
```

**Output Interpretation**:
- `arm64` → Apple Silicon (M1/M2/M3) → Download ARM64 installer
- `x86_64` → Intel processor → Download AMD64 installer

**Download Links**:

- **Apple Silicon (M1/M2/M3)**: [Docker Desktop for Mac (ARM64)](https://desktop.docker.com/mac/main/arm64/Docker.dmg)
- **Intel Mac**: [Docker Desktop for Mac (AMD64)](https://desktop.docker.com/mac/main/amd64/Docker.dmg)

**Or use command-line**:

```bash
# Apple Silicon
curl -o ~/Downloads/Docker.dmg https://desktop.docker.com/mac/main/arm64/Docker.dmg

# Intel Mac
curl -o ~/Downloads/Docker.dmg https://desktop.docker.com/mac/main/amd64/Docker.dmg
```

---

**Step 2: Install Docker.app**

1. **Open** `Docker.dmg` from Downloads folder (double-click)
2. **Drag** Docker whale icon → Applications folder
3. **Eject** Docker.dmg (right-click → Eject)

**Step 3: Start Docker Desktop**

**Finder** → Applications → Docker (double-click)

**First Launch Security Prompt**:
```
"Docker.app" is an app downloaded from the internet.
Are you sure you want to open it?

[Cancel] [Open]
```

Click **"Open"**

**Privileged Helper Installation**:
```
Docker Desktop requires privileged access to install networking components.

[Enter macOS password]
[Install]
```

Enter password → Click "Install"

**Service Agreement** → Click "Accept"

**Wait for Engine Startup**:

Menu bar (top-right) shows Docker whale icon:
```
🟡 Docker Desktop is starting...
   ↓ (30-60 seconds)
🟢 Docker Desktop is running
```

---

**Step 4: Verify Installation**

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker compose version

# Test Docker functionality
docker run hello-world
```

**Expected Outputs**: Same as Homebrew installation method.

---

#### Step 5: Rosetta 2 Installation (Apple Silicon Only)

**If you see this prompt when running containers**:

```
The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8)
```

**Install Rosetta 2**:

```bash
softwareupdate --install-rosetta --agree-to-license
```

**Why This Happens**:
- Many Docker images on DockerHub are x86_64 (Intel/AMD) only
- Apple Silicon Macs are ARM64 architecture
- Rosetta 2 translates x86_64 instructions to ARM64

**Performance Impact**:
- Native ARM64 images: 100% performance
- Emulated x86_64 images: ~70-80% performance
- Build multi-arch images with `docker buildx` for production

---

## Verification

**Complete Verification Checklist** (Run on both Windows and macOS)

### Basic Verification

```bash
# 1. Docker CLI installed and accessible
docker --version

# Expected: Docker version 24.0+ or later

# 2. Docker Compose v2 available
docker compose version

# Expected: Docker Compose version v2.20+ or later

# 3. Docker daemon running
docker info
```

**Expected `docker info` Output (Key Sections)**:

```
Server:
 Server Version: 24.0.7
 Storage Driver: overlay2
 Logging Driver: json-file
 Cgroup Driver: cgroupfs
 Kernel Version: 5.15.90.1-microsoft-standard-WSL2 (Windows)
                 6.4.16-linuxkit (macOS)
 Operating System: Docker Desktop
 OSType: linux
 Architecture: x86_64 (Intel) or aarch64 (Apple Silicon)
 CPUs: 8
 Total Memory: 7.664GiB
```

---

### Functional Verification

**Test 1: Pull and Run Container**

```bash
# Pull official Nginx image
docker pull nginx:latest

# Expected output
latest: Pulling from library/nginx
a803e7c4b030: Pull complete
...
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest
```

**Test 2: Run Container with Port Mapping**

```bash
# Run Nginx web server on port 8080
docker run -d -p 8080:80 --name test-nginx nginx:latest

# Verify container running
docker ps
```

**Expected `docker ps` Output**:

```
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS                  NAMES
a1b2c3d4e5f6   nginx:latest   "/docker-entrypoint.…"   10 seconds ago   Up 8 seconds    0.0.0.0:8080->80/tcp   test-nginx
```

**Test 3: Access Running Container**

**Browser**: Navigate to [http://localhost:8080](http://localhost:8080)

**Expected**: "Welcome to nginx!" page

**Or command-line**:

```bash
curl http://localhost:8080

# Expected HTML output
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

**Test 4: Stop and Remove Container**

```bash
# Stop container
docker stop test-nginx

# Remove container
docker rm test-nginx

# Verify removal
docker ps -a | grep test-nginx
# Expected: No output (container removed)
```

---

### Docker Compose Verification

**Test Multi-Container Application**

**Create test directory**:

```bash
mkdir -p ~/docker-compose-test
cd ~/docker-compose-test
```

**Create `docker-compose.yml`**:

```yaml
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

**Run Compose stack**:

```bash
# Start services in detached mode
docker compose up -d

# Expected output
[+] Running 3/3
 ✔ Network docker-compose-test_default    Created
 ✔ Container docker-compose-test-redis-1  Started
 ✔ Container docker-compose-test-web-1    Started

# Verify both containers running
docker compose ps
```

**Expected Output**:

```
NAME                           IMAGE          COMMAND                  STATUS         PORTS
docker-compose-test-redis-1    redis:alpine   "docker-entrypoint.s…"   Up 10 seconds  0.0.0.0:6379->6379/tcp
docker-compose-test-web-1      nginx:latest   "/docker-entrypoint.…"   Up 10 seconds  0.0.0.0:8080->80/tcp
```

**Cleanup**:

```bash
# Stop and remove containers, networks
docker compose down

# Remove test directory
cd ~
rm -rf ~/docker-compose-test
```

---

### Resource Verification

**Check Docker Resource Allocation**

```bash
# View Docker system resource usage
docker system df
```

**Expected Output**:

```
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          3         1         500MB     350MB (70%)
Containers      1         1         50MB      0B (0%)
Local Volumes   0         0         0B        0B
Build Cache     10        0         1.2GB     1.2GB
```

**Interpretation**:
- **Images**: Downloaded Docker images (nginx, redis, hello-world)
- **Containers**: Running or stopped containers
- **Volumes**: Persistent data storage
- **Build Cache**: Cached layers from image builds

---

### Performance Verification (Optional)

**Test I/O Performance**

```bash
# Write test (Linux container)
docker run --rm -v ${PWD}:/data alpine sh -c "dd if=/dev/zero of=/data/testfile bs=1M count=100 oflag=direct"

# Expected output (Windows WSL 2)
100+0 records in
100+0 records out
104857600 bytes (105 MB) copied, 0.5-1.5s, 70-200 MB/s

# Expected output (macOS)
100+0 records in
100+0 records out
104857600 bytes (105 MB) copied, 0.8-2.0s, 50-130 MB/s

# Clean up
rm testfile
```

**Performance Benchmarks**:

| Platform | Expected Write Speed | Notes |
|----------|---------------------|-------|
| **Windows WSL 2** | 100-200 MB/s | Native Linux I/O performance |
| **macOS Apple Silicon** | 80-150 MB/s | VirtioFS filesystem overhead |
| **macOS Intel** | 50-100 MB/s | Older hypervisor technology |

---

## Post-Installation Configuration

### Resource Allocation

**Docker Desktop → Settings → Resources**

**Recommended Settings (8GB RAM System)**:

```
CPUs: 4 cores (50% of total)
Memory: 4 GB (50% of total)
Swap: 1 GB
Disk image size: 60 GB
```

**Recommended Settings (16GB+ RAM System)**:

```
CPUs: 6-8 cores
Memory: 8 GB
Swap: 2 GB
Disk image size: 100 GB
```

**Why This Matters**:
- **Multi-Container Apps**: Running database + backend + frontend requires 4GB+ memory
- **Build Performance**: More CPUs = faster parallel builds
- **Disk Space**: Docker images accumulate quickly (clean with `docker system prune`)

**Apply Changes**: Click "Apply & Restart"

---

### File Sharing (macOS Only)

**Docker Desktop → Settings → Resources → File Sharing**

**Default Allowed Directories**:
```
/Users
/Volumes
/private
/tmp
```

**Why This Matters**:
- Docker containers can only mount volumes from allowed directories
- Most projects in `/Users/<username>/` work by default
- External drives require adding `/Volumes` permission

**Add Custom Directory** (if needed):

1. Click **"+"** button
2. Navigate to directory
3. Click **"Apply & Restart"**

---

### Docker Hub Authentication (Optional)

**Why Authenticate**:
- **Rate Limits**: Anonymous pulls limited to 100 images/6 hours
- **Authenticated Users**: 200 images/6 hours (free account)
- **Private Repositories**: Access your private images

**Create Account**: [https://hub.docker.com/signup](https://hub.docker.com/signup)

**Login via CLI**:

```bash
docker login

# Enter username and password
Username: your-dockerhub-username
Password:
Login Succeeded
```

**Or via Docker Desktop**:

Docker Desktop → Sign In (top-right) → Enter credentials

---

### Enable Kubernetes (Optional)

**For Kubernetes Learning/Development**

**Docker Desktop → Settings → Kubernetes**

```
[✓] Enable Kubernetes
```

**Click "Apply & Restart"** (takes 2-5 minutes to install Kubernetes cluster)

**Verify**:

```bash
kubectl version --client

# Expected output
Client Version: v1.28.2
```

**⚠️ Resource Impact**:
- Kubernetes adds ~2GB memory overhead
- Only enable if learning Kubernetes
- Production K8s uses cloud clusters (GKE, EKS, AKS)

---

### Security Hardening

**Production-Minded Security Settings**

**Docker Desktop → Settings → General**

```
[ ] Send usage statistics
    ↳ Disable for privacy

[✓] Use Docker Compose V2
    ↳ Modern compose with better security
```

**Docker Desktop → Settings → Docker Engine** (Advanced)

**Edit `daemon.json` for security hardening**:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "userns-remap": "default"
}
```

**Configuration Explanation**:

- **log-driver**: Structured logging (JSON format)
- **max-size/max-file**: Prevent disk fill from logs (10MB × 3 files = 30MB max)
- **userns-remap**: Map container root to unprivileged host user (security isolation)

**Click "Apply & Restart"**

**⚠️ User Namespace Remapping Impact**:
- Improves security (container root ≠ host root)
- May break containers requiring privileged access
- Recommended for production-like environments

---

## Troubleshooting

### Windows-Specific Issues

#### Issue 1: "WSL 2 installation is incomplete"

**Symptoms**:
```
WSL 2 installation is incomplete.
The WSL 2 Linux kernel is now installed using a separate MSI update package.
```

**Solution**:

```powershell
# Download and install WSL 2 kernel update
Start-Process "https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi"

# After installation, set WSL 2 as default
wsl --set-default-version 2
```

**Verify**:

```powershell
wsl --status
# Expected: Default Version: 2
```

---

#### Issue 2: "Virtualization is disabled"

**Symptoms**:
```
Hardware assisted virtualization and data execution protection must be enabled in the BIOS.
```

**Solution**:

1. **Reboot** computer
2. **Enter BIOS/UEFI** (press F2, DEL, or F12 during startup)
3. **Navigate** to Advanced → CPU Configuration
4. **Enable** "Intel Virtualization Technology" (Intel VT-x) or "SVM Mode" (AMD-V)
5. **Save** and exit BIOS

**Verify After Reboot**:

```powershell
Get-ComputerInfo | Select-Object HyperVRequirementVirtualizationFirmwareEnabled

# Expected: True
```

---

#### Issue 3: "Docker daemon not responding"

**Symptoms**:
```powershell
docker ps
# error during connect: This error may indicate that the docker daemon is not running
```

**Solution 1: Restart Docker Desktop**

```powershell
# Stop Docker Desktop
Stop-Process -Name "Docker Desktop" -Force

# Wait 10 seconds
Start-Sleep -Seconds 10

# Start Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

**Solution 2: Check Docker Desktop Service**

```powershell
# Open Services
services.msc

# Find "Docker Desktop Service"
# Right-click → Restart
```

**Solution 3: Reset Docker to Factory Defaults**

Docker Desktop → Troubleshoot (bug icon) → Reset to factory defaults → Reset

**⚠️ Warning**: This deletes all containers, images, and volumes.

---

#### Issue 4: "Port already in use"

**Symptoms**:
```
Error starting userland proxy: listen tcp 0.0.0.0:8080: bind: address already in use.
```

**Solution: Find and Kill Process Using Port**

```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Example output
TCP    0.0.0.0:8080    0.0.0.0:0    LISTENING    12345

# Kill process by PID (12345 in example)
taskkill /PID 12345 /F

# Or stop specific service
Stop-Process -Name "node" -Force  # If Node.js using port
Stop-Process -Name "nginx" -Force # If Nginx using port
```

---

#### Issue 5: WSL 2 Integration Not Working

**Symptoms**:
```bash
wsl
docker --version
# bash: docker: command not found
```

**Solution**:

**Docker Desktop → Settings → Resources → WSL Integration**

```
[✓] Enable integration with my default WSL distro

[✓] Ubuntu
[✓] Any other distributions
```

**Click "Apply & Restart"**

**Verify in WSL**:

```bash
wsl
which docker
# Expected: /usr/bin/docker

docker --version
# Expected: Docker version 24.0.7
```

---

### macOS-Specific Issues

#### Issue 1: "Docker.app cannot be opened"

**Symptoms**:
```
"Docker.app" cannot be opened because the developer cannot be verified.
macOS cannot verify that this app is free from malware.
```

**Solution**:

```bash
# Remove quarantine attribute
xattr -d com.apple.quarantine /Applications/Docker.app

# Or via System Settings
# System Settings → Privacy & Security → Security
# Click "Open Anyway" next to Docker.app warning
```

---

#### Issue 2: Slow File Sync (macOS)

**Symptoms**:
- Container builds take 10x longer than Linux
- Volume mounts have high latency

**Root Cause**: VirtioFS filesystem synchronization overhead (macOS hypervisor limitation)

**Solution 1: Use Named Volumes Instead of Bind Mounts**

**Slow (Bind Mount)**:
```yaml
services:
  app:
    volumes:
      - ./code:/app  # Syncs macOS filesystem into container
```

**Fast (Named Volume)**:
```yaml
services:
  app:
    volumes:
      - app-data:/app  # Docker-managed volume (no sync overhead)

volumes:
  app-data:
```

**Performance Difference**:
- Bind mount: ~50 MB/s
- Named volume: ~500 MB/s (10x faster)

**Solution 2: Enable VirtioFS (Experimental)**

**Docker Desktop → Settings → General**

```
[✓] Enable VirtioFS accelerated directory sharing
```

**Click "Apply & Restart"**

**Expected Improvement**: 2-3x faster file sync

---

#### Issue 3: "Docker Desktop requires privileged access"

**Symptoms**:
Every Docker Desktop launch prompts for password.

**Root Cause**: Privileged helper tool not installed correctly.

**Solution**:

```bash
# Remove privileged helper
sudo rm -rf /Library/PrivilegedHelperTools/com.docker.*

# Reinstall Docker Desktop
# Finder → Applications → Docker → Move to Trash
# Re-download and install Docker Desktop
# Authorize privileged helper installation ONCE
```

---

#### Issue 4: Rosetta 2 "Exec Format Error"

**Symptoms (Apple Silicon)**:
```bash
docker run --platform linux/amd64 ubuntu
# exec /bin/bash: exec format error
```

**Root Cause**: Rosetta 2 not installed.

**Solution**:

```bash
# Install Rosetta 2
softwareupdate --install-rosetta --agree-to-license

# Restart Docker Desktop
# Docker Desktop → Quit Docker Desktop
# Relaunch from Applications

# Verify
docker run --platform linux/amd64 ubuntu uname -m
# Expected: x86_64 (emulated)
```

---

#### Issue 5: Kubernetes Won't Start

**Symptoms**:
```
Kubernetes is starting...
[Never completes]
```

**Solution 1: Reset Kubernetes Cluster**

**Docker Desktop → Settings → Kubernetes**

Click **"Reset Kubernetes Cluster"** → Confirm

Wait 3-5 minutes for re-initialization.

**Solution 2: Increase Resources**

**Docker Desktop → Settings → Resources**

Kubernetes requires:
- Minimum 2GB RAM (recommended 4GB)
- Minimum 2 CPUs (recommended 4 CPUs)

**Solution 3: Disable and Re-enable**

```
[ ] Enable Kubernetes  # Uncheck
Click "Apply & Restart"

[✓] Enable Kubernetes  # Re-check
Click "Apply & Restart"
```

---

### Cross-Platform Issues

#### Issue 1: "Cannot connect to Docker daemon"

**Symptoms**:
```bash
docker ps
# Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Solution**:

**Check Docker Desktop Running**:

- **Windows**: Look for Docker whale icon in system tray (bottom-right)
- **macOS**: Look for Docker whale icon in menu bar (top-right)

**Status Indicators**:
- 🟢 Green: Docker running (Ready)
- 🟡 Yellow: Docker starting (Wait 30-60 seconds)
- ⚪ Gray: Docker stopped (Launch Docker Desktop)

**If Stopped**: Launch Docker Desktop from Start Menu (Windows) or Applications (macOS)

---

#### Issue 2: "Permission denied" on docker.sock

**Symptoms (Linux-only or WSL without Docker Desktop)**:
```bash
docker ps
# permission denied while trying to connect to the Docker daemon socket
```

**Solution**:

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again
# Or refresh group membership
newgrp docker

# Verify
docker ps
```

**⚠️ Not applicable to**:
- Docker Desktop on Windows (uses named pipes, not socket)
- Docker Desktop on macOS (user permissions managed by Desktop)

---

#### Issue 3: Disk Space Full

**Symptoms**:
```bash
docker pull nginx
# no space left on device
```

**Solution: Clean Docker System**

```bash
# View disk usage
docker system df

# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused (aggressive cleanup)
docker system prune -a --volumes

# Expected reclamation: 5-50GB depending on usage
```

**Scheduled Cleanup (Recommended)**:

```bash
# Weekly cleanup cron job (Linux/macOS)
crontab -e

# Add this line (runs every Sunday at 2 AM)
0 2 * * 0 docker system prune -af --volumes > /dev/null 2>&1
```

---

#### Issue 4: "Client version too old"

**Symptoms**:
```bash
docker ps
# Error response from daemon: client version 1.41 is too old. Minimum supported API version is 1.43
```

**Root Cause**: Docker CLI version older than Docker Engine version.

**Solution: Update Docker Desktop**

**Windows**:

Docker Desktop → Check for Updates (gear icon) → Update and Restart

**macOS (Homebrew)**:

```bash
brew upgrade --cask docker
```

**macOS (Manual)**:

Download latest Docker Desktop from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)

---

## Still Stuck? How to Get AI Help

### Effective Troubleshooting Prompt Template

**When asking AI assistants (Claude, ChatGPT, etc.) for Docker Desktop help:**

```
I'm trying to [what you're attempting] on Docker Desktop.

My system:
- OS: [Windows 11 Pro / macOS 13 Ventura]
- Processor: [Intel i7 / Apple M1 / AMD Ryzen]
- Docker Desktop Version: [run `docker --version`]
- WSL Version (Windows only): [run `wsl --status`]

What I did:
1. [First step you took]
2. [Second step]
3. [Third step]

Error message (exact text):
```
[Paste complete error message here]
```

Output of diagnostic commands:
```
docker info
docker version
```
[Paste output here]

Expected behavior: [What should happen]
Actual behavior: [What actually happened]

What I've tried:
- [Solution 1 attempted]
- [Solution 2 attempted]

Help me understand:
1. What's causing this error?
2. What's the correct fix?
3. How do I prevent this in the future?
```

---

### Common Diagnostic Commands

**Collect System Information**:

```bash
# Docker version details
docker version

# Docker system information
docker info

# Docker Desktop settings (Windows)
Get-Content "$env:APPDATA\Docker\settings.json"

# Docker Desktop settings (macOS)
cat ~/Library/Group\ Containers/group.com.docker/settings.json

# Docker logs (Windows)
Get-Content "$env:LOCALAPPDATA\Docker\log.txt" -Tail 50

# Docker logs (macOS)
tail -50 ~/Library/Containers/com.docker.docker/Data/log/vm/console-ring
```

---

### Example AI Prompt (Windows WSL 2 Issue)

```
I'm trying to run Docker containers on Windows 11 Pro with Docker Desktop.

My system:
- OS: Windows 11 Pro (Build 22621)
- Processor: Intel Core i7-12700K
- Docker Desktop Version: 4.25.0
- WSL Version: WSL 2

What I did:
1. Installed Docker Desktop
2. Enabled "Use WSL 2 instead of Hyper-V" during installation
3. Restarted computer
4. Ran `docker run hello-world`

Error message:
```
docker: error during connect: This error may indicate that the docker daemon is not running.: Post "http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.24/containers/create": open //./pipe/docker_engine: The system cannot find the file specified.
```

Output of diagnostic commands:
```
docker version
# Client version shows, Server section shows error "Cannot connect to the Docker daemon"

wsl --list --verbose
  NAME      STATE           VERSION
* Ubuntu    Stopped         2
```

Expected behavior: Docker container runs and shows "Hello from Docker!" message
Actual behavior: Error about Docker daemon not running

What I've tried:
- Restarted Docker Desktop (no change)
- Verified WSL 2 installed (`wsl --status` shows version 2)

Help me understand:
1. Why can't Docker find the daemon despite Docker Desktop running?
2. Should Ubuntu be "Running" instead of "Stopped"?
3. Is this a WSL integration issue?
```

---

## Success! What's Next?

**✅ You now have a production-ready Docker development environment.**

### Immediate Next Steps

#### 1. Learn Docker Fundamentals

**Run Official Docker Tutorial**:

```bash
docker run -d -p 80:80 docker/getting-started
```

**Open browser**: [http://localhost](http://localhost)

**What You'll Learn** (30-minute interactive tutorial):
- Container lifecycle (create, start, stop, remove)
- Building images from Dockerfiles
- Multi-container apps with Docker Compose
- Volume management for persistent data

---

#### 2. Build Your First Containerized Application

**Recommended Learning Path**:

**Project 1: Simple Python API** (1-2 hours)

```bash
# Create project directory
mkdir ~/my-docker-api
cd ~/my-docker-api

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py .

CMD ["python", "app.py"]
EOF

# Create requirements.txt
cat > requirements.txt << 'EOF'
flask==3.0.0
EOF

# Create app.py
cat > app.py << 'EOF'
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return {'message': 'Hello from Docker!'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF

# Build image
docker build -t my-api .

# Run container
docker run -d -p 5000:5000 --name api my-api

# Test
curl http://localhost:5000
# Expected: {"message":"Hello from Docker!"}
```

**Learning Outcomes**:
- Dockerfile syntax and best practices
- Image building and layering
- Port mapping for network access
- Container lifecycle management

---

**Project 2: Multi-Container Application** (2-3 hours)

**Create Docker Compose stack** (Web frontend + Redis backend):

```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - REDIS_HOST=redis
    depends_on:
      - redis

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

**Learning Outcomes**:
- Service orchestration with Docker Compose
- Inter-container networking
- Environment variable configuration
- Dependency management

---

#### 3. Production Best Practices

**Essential Learning Topics**:

**Security**:
- [ ] Never run containers as root (use `USER` directive in Dockerfile)
- [ ] Scan images for vulnerabilities (`docker scout cves <image>`)
- [ ] Use official base images only
- [ ] Implement secrets management (not environment variables for sensitive data)

**Performance**:
- [ ] Multi-stage builds to reduce image size
- [ ] Layer caching strategies for fast builds
- [ ] Resource limits (`--memory`, `--cpus` flags)
- [ ] Volume management for I/O-intensive workloads

**Observability**:
- [ ] Structured logging (JSON format)
- [ ] Health checks (`HEALTHCHECK` in Dockerfile)
- [ ] Metrics collection (Prometheus exporters)
- [ ] Distributed tracing (OpenTelemetry)

---

#### 4. Advanced Topics (Next Weeks/Months)

**Container Orchestration**:
- **Kubernetes**: Local cluster with Docker Desktop → Minikube → Cloud K8s (GKE, EKS, AKS)
- **Docker Swarm**: Simple orchestration for small-scale deployments
- **Nomad**: HashiCorp's alternative orchestrator

**CI/CD Integration**:
- **GitHub Actions**: Build and push images on commit
- **GitLab CI**: Docker-in-Docker pipelines
- **Jenkins**: Dockerized build agents

**Cloud Deployment**:
- **Google Cloud Run**: Serverless container platform (easiest)
- **AWS ECS/Fargate**: Managed container orchestration
- **Azure Container Instances**: Serverless containers
- **DigitalOcean App Platform**: Simple PaaS for containers

---

### Recommended Learning Resources

**Official Docker Documentation**:
- [Get Started Guide](https://docs.docker.com/get-started/) - 6-hour comprehensive course
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) - Production patterns
- [Docker Compose Documentation](https://docs.docker.com/compose/) - Multi-container apps

**Hands-On Practice**:
- [Play with Docker](https://labs.play-with-docker.com/) - Free browser-based Docker playground
- [Docker Labs](https://github.com/docker/labs) - Community-contributed tutorials
- [Awesome Docker](https://github.com/veggiemonk/awesome-docker) - Curated resources

**Production Security**:
- [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker) - Security hardening checklist

---

### Career Development Path

**DevOps/Platform Engineering Career Progression**:

**Level 1: Foundation (1-3 months)**
- ✅ Docker Desktop installed and verified (You are here!)
- Docker fundamentals (images, containers, volumes, networks)
- Dockerfile authoring and best practices
- Docker Compose for local development

**Level 2: Intermediate (3-6 months)**
- Container orchestration basics (Kubernetes fundamentals)
- CI/CD pipeline integration (GitHub Actions, GitLab CI)
- Cloud deployment (Google Cloud Run, AWS ECS)
- Monitoring and logging (Prometheus, Grafana, ELK stack)

**Level 3: Advanced (6-12 months)**
- Kubernetes cluster management (GKE, EKS, AKS)
- Service mesh architecture (Istio, Linkerd)
- GitOps workflows (ArgoCD, Flux)
- Infrastructure as Code (Terraform, Pulumi)

**Level 4: Expert (12+ months)**
- Multi-cloud orchestration strategies
- Platform engineering (internal developer platforms)
- SRE practices (SLOs, error budgets, incident response)
- Capacity planning and cost optimization

**Certifications** (Optional but valuable for career acceleration):
- Docker Certified Associate (DCA)
- Certified Kubernetes Administrator (CKA)
- Certified Kubernetes Application Developer (CKAD)
- AWS Certified DevOps Engineer
- Google Cloud Professional Cloud DevOps Engineer

---

### Project Ideas for Portfolio

**Beginner Projects** (demonstrate fundamentals):
1. **Personal Blog** (Dockerized WordPress + MySQL)
2. **REST API** (Python Flask/FastAPI + PostgreSQL)
3. **Static Site Generator** (Hugo/Jekyll with Nginx)

**Intermediate Projects** (demonstrate orchestration):
1. **Microservices E-commerce** (Product catalog + Cart + Payment services)
2. **Real-time Chat Application** (WebSocket backend + Redis pub/sub)
3. **CI/CD Pipeline** (Automated testing and deployment)

**Advanced Projects** (demonstrate production readiness):
1. **Kubernetes Cluster** (Self-hosted with monitoring stack)
2. **Multi-Region Deployment** (Load balancing across cloud providers)
3. **Internal Developer Platform** (Backstage + ArgoCD + Vault)

**Share Your Work**:
- GitHub repositories with comprehensive READMEs
- Technical blog posts explaining design decisions
- Conference talks or local meetup presentations
- Open source contributions to Docker ecosystem

---

## Common Pitfalls Quick Reference

| Problem | Symptom | Solution |
|---------|---------|----------|
| **Forgot to start Docker Desktop** | `Cannot connect to Docker daemon` | Launch Docker Desktop, wait for green status |
| **WSL 2 not installed (Windows)** | `WSL 2 installation incomplete` | Run `wsl --install`, reboot |
| **Virtualization disabled (Windows)** | `Hardware virtualization must be enabled` | Enable Intel VT-x / AMD-V in BIOS |
| **Rosetta 2 missing (macOS Apple Silicon)** | `exec format error` when running x86 images | `softwareupdate --install-rosetta` |
| **Insufficient resources** | Containers crash or OOM (Out of Memory) | Increase RAM in Docker Desktop settings (8GB recommended) |
| **Disk space full** | `no space left on device` | Run `docker system prune -a --volumes` |
| **Port conflict** | `address already in use` | Find and kill process: `netstat -ano` (Windows), `lsof -i :PORT` (macOS) |
| **Slow file sync (macOS)** | Builds take 10x longer than expected | Use named volumes instead of bind mounts |
| **WSL integration disabled (Windows)** | `docker: command not found` in WSL shell | Enable WSL integration in Docker Desktop settings |
| **Outdated Docker version** | `client version too old` | Update Docker Desktop via settings or Homebrew |

---

## Additional Resources

### Official Documentation

- **Docker Docs**: [https://docs.docker.com/](https://docs.docker.com/)
- **Docker Desktop**: [https://docs.docker.com/desktop/](https://docs.docker.com/desktop/)
- **Docker Hub**: [https://hub.docker.com/](https://hub.docker.com/) - Official image registry
- **Docker Compose**: [https://docs.docker.com/compose/](https://docs.docker.com/compose/)

### Platform-Specific Resources

**Windows**:
- [WSL 2 Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [Docker Desktop WSL 2 Backend](https://docs.docker.com/desktop/windows/wsl/)
- [Windows Container Fundamentals](https://docs.microsoft.com/en-us/virtualization/windowscontainers/)

**macOS**:
- [Docker Desktop for Mac](https://docs.docker.com/desktop/mac/install/)
- [Apple Silicon Considerations](https://docs.docker.com/desktop/mac/apple-silicon/)
- [File Sharing Performance](https://docs.docker.com/desktop/mac/troubleshoot/#known-issues)

### Community Resources

- **Docker Community Slack**: [https://dockr.ly/slack](https://dockr.ly/slack)
- **Stack Overflow**: [docker] and [docker-compose] tags
- **Reddit**: r/docker, r/devops
- **Docker Blog**: [https://www.docker.com/blog/](https://www.docker.com/blog/)

### Security Resources

- **Docker Security Documentation**: [https://docs.docker.com/engine/security/](https://docs.docker.com/engine/security/)
- **OWASP Docker Security**: [https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- **Snyk Container Security**: [https://snyk.io/learn/container-security/](https://snyk.io/learn/container-security/)
- **Aqua Security Blog**: [https://blog.aquasec.com/](https://blog.aquasec.com/)

### Tools and Utilities

**Container Management**:
- **Portainer**: Web UI for Docker management ([https://www.portainer.io/](https://www.portainer.io/))
- **Lazydocker**: Terminal UI for Docker ([https://github.com/jesseduffield/lazydocker](https://github.com/jesseduffield/lazydocker))
- **Dive**: Image layer analysis tool ([https://github.com/wagoodman/dive](https://github.com/wagoodman/dive))

**Security Scanning**:
- **Docker Scout**: Built-in vulnerability scanner (`docker scout`)
- **Trivy**: Open source security scanner ([https://github.com/aquasecurity/trivy](https://github.com/aquasecurity/trivy))
- **Grype**: Vulnerability scanner for container images ([https://github.com/anchore/grype](https://github.com/anchore/grype))

**Development Tools**:
- **Skaffold**: Continuous development for Kubernetes ([https://skaffold.dev/](https://skaffold.dev/))
- **Tilt**: Multi-service development environment ([https://tilt.dev/](https://tilt.dev/))
- **DevSpace**: Developer tool for Kubernetes ([https://devspace.sh/](https://devspace.sh/))

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-16 | Initial release - Docker Desktop 24.0.7 installation guide |

**Maintained By**: Claude Agent (MACA-Course Documentation Team)
**Target Docker Desktop Version**: 24.0+ (Windows), 24.0+ (macOS)
**Last Verified**: 2025-11-16

---

**Related Documentation**:
- [[claude-code-installation-guide]] - Claude Code AI assistant installation
- [[environment-variable]] - Environment variables and PATH fundamentals
- [[vscode-installation-guide]] - VS Code IDE installation

---

**Feedback**: Found an issue or have suggestions? Open an issue on the course GitHub repository or contact the course maintainers.
