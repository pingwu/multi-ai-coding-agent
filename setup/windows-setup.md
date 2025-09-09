# Windows Setup Guide

Welcome! This guide will walk you through setting up your Windows computer for our course. We'll install the necessary tools to run the projects.

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

4.  **Verify Docker Installation:**
    -   After your computer restarts, Docker Desktop should start automatically. You'll see a whale icon in your system tray when it's running.
    -   Open PowerShell or Command Prompt and run the following command to make sure everything is working:
        ```powershell
        docker run hello-world
        ```
    -   You should see a "Hello from Docker!" message.

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

## Step 3: Clone the Course Repository

Now that you have the necessary tools, you can download the course projects.

1.  **Open PowerShell or Command Prompt.**
2.  **Navigate to the directory where you want to store the projects.**
3.  **Clone the repository:**
    ```powershell
    git clone https://github.com/pingwu/multi-ai-coding-agent.git
    ```
4.  **Navigate into the project directory:**
    ```powershell
    cd <repository-name>
    ```

## Next Steps

You now have all the necessary tools installed on your system.

For an overview of all the projects and the general workflow, please see the [main project README file](../README.md).

When you are ready to run a specific project, navigate to its directory (e.g., `project-01-content-generator/`) and follow the instructions in its local `README.md` file.

For advanced setup, see the [Advanced Setup Guide](./advanced-setup.md).

### Troubleshooting

-   If you have any issues with the Docker installation, please refer to the official [Docker Desktop Windows installation guide](https://docs.docker.com/desktop/windows/install/).
-   For WSL 2 issues, see the [Microsoft WSL installation guide](https://docs.microsoft.com/en-us/windows/wsl/install).
