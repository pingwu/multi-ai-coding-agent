# macOS Setup Guide

Quick Start (10 minutes)
- Install Docker Desktop and start it
- Install Git and Make (Xcode CLT): `xcode-select --install`
- Clone and run Project 01:
  ```bash
  git clone https://github.com/pingwu/multi-ai-coding-agent.git
  cd multi-ai-coding-agent
  make -C project-01-content-generator up
  ```
- Open: http://localhost:3000 and http://localhost:8000
- If you see API key errors: `cd project-01-content-generator && [ -f .env ] || cp .env.example .env`

Agent vs Commands (from local-dev)

| Task | Natural Language (Claude/agents) | Manual Command (Make) |
| --- | --- | --- |
| Start Project 1 | "Bring up Project 1 environment." | `make -C project-01-content-generator up` |
| Stop Project 2 | "Shut down the expense tracker project." | `make -C project-02-expense-tracker down` |
| Fix API keys | "Create .env from .env.example in Project 1." | `cd project-01-content-generator && [ -f .env ] || cp .env.example .env` |

Details below if you prefer step‑by‑step.

## Prerequisites

- **macOS:** Recent version (Intel or Apple Silicon).
- **Administrator Access:** For installs.
- **Docker Desktop** and **Git** (installed below).
- **Make (GNU Make):** via Xcode CLT or Homebrew.

## Step 1: Install Docker Desktop

Docker is a tool that allows us to run our projects in isolated environments called containers. This ensures that the projects work the same for everyone.

1.  **Download Docker Desktop:**
    -   Go to the [Docker Desktop website](https://www.docker.com/products/docker-desktop).
    -   Click the "Download for Mac" button, choosing the correct version for your Mac's chip (Apple Silicon or Intel).

2.  **Install Docker Desktop:**
    -   Once the download is complete, open your `Downloads` folder and double-click the `Docker.dmg` file.
    -   Drag the Docker icon into your `Applications` folder.
    -   Open Docker from your `Applications` folder and follow the on-screen setup instructions.

3.  **Verify Docker Installation:**
    -   After Docker starts, you'll see a whale icon in your menu bar.
    -   Open the **Terminal** app and run the following command to make sure everything is working:
        ```bash
        docker run hello-world
        ```
    -   You should see a "Hello from Docker!" message.

## Step 2: Install Git

Git is a version control system that we use to manage our code. It often comes pre-installed on macOS.

1.  **Check if Git is installed:**
    -   Open the **Terminal** app and run:
        ```bash
        git --version
        ```
    -   If you see a version number, you can skip to the next step.

2.  **Install Git (if needed):**
    -   If Git is not installed, you can install it with the Xcode Command Line Tools. Run the following command in your terminal and follow the prompts:
        ```bash
        xcode-select --install
        ```

## Step 3: Install Make (if missing)

- Make is used for simple, consistent commands.
- If you installed Xcode Command Line Tools, `make` is included. Verify:
  ```bash
  make -v
  ```
- If not found, install via Homebrew:
  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  brew install make
  ```

## Step 4: Clone the Course Repository

Now that you have the necessary tools, you can download the course projects.

1.  **Open the Terminal app.**
2.  **Navigate to the directory where you want to store the projects.**
3.  **Clone the repository:**
    ```bash
    git clone https://github.com/pingwu/multi-ai-coding-agent.git
    ```
4.  **Navigate into the project directory:**
    ```bash
    cd multi-ai-coding-agent
    ```

## 10‑Minute First Run (Project 01)

1) Ensure Docker Desktop is running.
2) From the local-dev folder, start services with Make:
   ```bash
   make -C project-01-content-generator up
   ```
3) If API keys are required, create `.env` inside the project (see its README or `.env.example`).
4) Verify:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000
5) Run tests (optional):
   ```bash
   make -C project-01-content-generator test-backend
   make -C project-01-content-generator test-frontend
   ```

Notes
- Always run via Docker containers (don’t run Python on the host).
- Check Compose version if needed: `docker compose version`



## Next Steps

You now have all the necessary tools installed on your system.

For an overview of all the projects and the general workflow, please see the [main project README file](../README.md).

When you are ready to run a specific project, use Make from the repository root:
```bash
make -C project-01-content-generator up
```

For advanced setup (e.g., GitHub CLI), see the [Advanced Setup Guide](./advanced-setup.md).

## Troubleshooting

-   If you have any issues with the Docker installation, please refer to the official [Docker Desktop Mac installation guide](https://docs.docker.com/desktop/mac/install/).
