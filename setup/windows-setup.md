# Windows Setup Guide

Quick Start (10 minutes, WSL2)
1) Install Docker Desktop and enable WSL integration (Settings → Resources → WSL Integration)
2) Open Ubuntu (WSL), install Make:
   ```bash
   sudo apt update && sudo apt install -y make
   ```
3) Clone and run Project 01 from your Windows drive:
   ```bash
   cd /mnt/c/MASProjects
   git clone https://github.com/pingwu/multi-ai-coding-agent.git
   cd multi-ai-coding-agent
   make -C project-01-content-generator up
   ```
4) Open: http://localhost:3000 and http://localhost:8000
5) If you see API key errors: `cd project-01-content-generator && [ -f .env ] || cp .env.example .env`

See detailed steps below if needed.

Agent vs Commands

| Task | Natural Language (Claude/agents) | Manual Command (Make) |
| --- | --- | --- |
| Start Project 1 | "Bring up Project 1 environment." | `make -C project-01-content-generator up` |
| Stop Project 2 | "Shut down the expense tracker project." | `make -C project-02-expense-tracker down` |
| Fix API keys | "Create .env from .env.example in Project 1." | `cd project-01-content-generator && [ -f .env ] || cp .env.example .env` |

## Prerequisites

- **Windows 10 or 11:** You'll need a recent version of Windows.
- **Administrator Access:** Some installation steps may require administrator privileges.

## Step 1: Install Docker Desktop with WSL 2

Docker is a tool that allows us to run our projects in isolated environments called containers. This ensures that the projects work the same for everyone.

1.  **Download Docker Desktop:**
    -   Go to the [Docker Desktop website](https://www.docker.com/products/docker-desktop).
    -   Click the "Download for Windows" button.

2.  **Install Docker Desktop:**
    -   Once the download is complete, open your `Downloads` folder and double-click the `Docker Desktop Installer.exe` file.
    -   Follow the on-screen instructions.
    -   When prompted, make sure the **"Use WSL 2 instead of Hyper-V"** option is selected.
    -   Your computer may need to restart to complete the installation.

3.  **Install WSL 2 (if needed):**
    -   Docker may prompt you to install the Windows Subsystem for Linux (WSL) 2. If it does, follow the instructions.
    -   If you need to install it manually, open **PowerShell as an Administrator** and run the following command:
        ```powershell
        wsl --install
        ```
    -   Restart your computer after the installation is complete.

4.  **Enable WSL Integration in Docker Desktop:**
    -   Open Docker Desktop → Settings → Resources → WSL Integration.
    -   Enable integration for your Linux distro (e.g., Ubuntu).

5.  **Verify Docker Installation:**
    -   After restart, Docker Desktop should start automatically (whale icon in tray).
    -   In a terminal (PowerShell or Ubuntu), run:
        ```powershell
        docker run hello-world
        docker compose version
        ```
    -   You should see "Hello from Docker!" and a Compose version.

## Step 2: Install Git

Git is a version control system that we use to manage our code.

1.  **Check if Git is installed:**
    -   Open PowerShell or Command Prompt and run:
        ```powershell
        git --version
        ```
    -   If you see a version number, you can skip to the next step.

2.  **Download and Install Git:**
    -   If Git is not installed, download it from the [official Git website](https://git-scm.com/download/win).
    -   Run the installer and use the default settings.

## Step 3: Install Make inside WSL (Ubuntu)

We recommend running commands from the Ubuntu (WSL) terminal.

1. Open Ubuntu (WSL) from the Start menu.
2. Install Make:
   ```bash
   sudo apt update && sudo apt install -y make
   make -v
   ```

## Step 4: Clone the Course Repository

Now that you have the necessary tools, you can download the course projects.

1.  Open Ubuntu (WSL) terminal.
2.  Navigate to your Windows drive (example path shown):
    ```bash
    cd /mnt/c/MASProjects
    ```
3.  Clone the repository:
    ```bash
    git clone https://github.com/pingwu/multi-ai-coding-agent.git
    ```
4.  Go to the repository root:
    ```bash
    cd multi-ai-coding-agent
    ```

## 10‑Minute First Run (Project 01)

1) Ensure Docker Desktop is running and WSL integration is enabled.
2) Start services with Make from the repository root:
   ```bash
   make -C project-01-content-generator up
   ```
3) If API keys are required, create `.env` inside the project (see `.env.example`).
4) Verify:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000
5) Tests (optional):
   ```bash
   make -C project-01-content-generator test-backend
   make -C project-01-content-generator test-frontend
   ```

## Next Steps

You now have all the necessary tools installed on your system.

For an overview and commands, see the [README](../README.md) and [Makefile Essentials](./makefile-essentials.md).

For advanced setup, see the [Advanced Setup Guide](./advanced-setup.md).

### Troubleshooting

- "make: command not found" in Ubuntu: `sudo apt install make`.
- Docker not visible inside WSL: enable WSL integration in Docker Desktop, then restart Docker and WSL (`wsl --shutdown`).
- Slow file IO: using `/mnt/c` is acceptable for class; for speed, you can clone into your WSL home and still access via Windows.
- Port conflicts (3000/8000): stop other apps or adjust ports in `docker-compose.yml`.
- Install issues: see [Docker Desktop Windows guide](https://docs.docker.com/desktop/windows/install/) and [Microsoft WSL guide](https://learn.microsoft.com/windows/wsl/install).
