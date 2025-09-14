# 🤖 Multi-AI Coding Agent Projects

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/pingwu/multi-ai-coding-agent)](https://github.com/pingwu/multi-ai-coding-agent/commits)
[![Docker Compose](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](#)
[![Makefile](https://img.shields.io/badge/Build-Makefile-informational)](setup/makefile-essentials.md)
[![CI](https://img.shields.io/badge/CI-setup_pending-lightgrey)](#)

Start Here (2 minutes)

Prerequisite: Start Docker Desktop (verify with `docker info`).

| Task                     | 🤖 AI-Powered                                         | 💻 Manual Command Line                          |
| ------------------------ | ----------------------------------------------------- | ----------------------------------------------- |
| Start Project 1          | "Bring up Project 1 (content generator) environment." | `make -C project-01-content-generator up`       |
| Fix API keys (if errors) | "Create .env from .env.example in Project 1."         | `cd project-01-content-generator && [ -f .env ] |
| Stop Expense Tracker     | "Shut down the expense tracker project."              | `make -C project-02-expense-tracker down`       |

Then open: http://localhost:3000 (frontend) and http://localhost:8000 (backend)

**Production-ready, multi-agent AI systems that you can clone, customize, and deploy in minutes.**

This repository provides a collection of self-contained, professional-grade AI applications built with a modern tech stack.

Workflow Options:
1. 🤖 AI-Powered (Recommended: using coding agents like Claude code, Codex, or Gemini cli )
2. Or 💻 Manual Command Line:


---

## 🚀 Getting Started

First, ensure you have Docker and Git installed by following the setup guide for your OS:
- [**macOS Setup**](./setup/mac-setup.md)
- [**Windows Setup**](./setup/windows-setup.md)
- [**Makefile Essentials**](./setup/makefile-essentials.md)

Once your environment is ready, launch a project:

| Workflow (Choose One)       | 🤖 AI-Powered (Recommended)                                                                                        | 💻 Manual Command Line                                                                                              |     |                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | --- | --------------------- |
| **1. Clone the Repository** | `git clone https://github.com/pingwu/multi-ai-coding-agent.git`<br>`cd multi-ai-coding-agent`                      | `git clone https://github.com/pingwu/multi-ai-coding-agent.git`<br>`cd multi-ai-coding-agent`                       |     |                       |
| **2. Launch a Project**     | In Claude/agent, say:<br>`Bring up Project 1` or `Start the content generator project`                             | From the repo root: `make -C project-01-content-generator up`                                                       |     |                       |
| **3. Configure API Keys**   | Ask:<br>`Help me set up my API keys`                                                                               | If missing, create `.env` in the project:<br>`cd project-01-content-generator && [ -f .env ]                        |     | cp .env.example .env` |
| **Result**                  | App at `http://localhost:3000` (frontend) and `http://localhost:8000` (backend), typically in **under 5 minutes**. | App at `http://localhost:3000` (frontend) and `http://localhost:8000` (backend), typically in **under 15 minutes**. |     |                       |

---

## 📚 Table of Contents

- [Getting Started](#getting-started)
- [Agent vs Commands](#agent-vs-commands-cheatsheet)
- [Projects](#the-projects)
- [Repo Structure](#repo-structure)
- [Tech Stack](#tech-stack)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## ⚡ Agent vs Commands Cheatsheet

| Task                    | 🤖 AI-Powered Natural Language (via Coding agents) | 💻 Manual Command Line                               |
| ----------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| Start Project 1         | "Bring up Project 1 environment."                  | `make -C project-01-content-generator up`            |
| Start Project 2         | "Start the expense tracker project."               | `make -C project-02-expense-tracker up`              |
| Stop Project 1          | "Shut down Project 1."                             | `make -C project-01-content-generator down`          |
| Stop Project 2          | "Shut down the expense tracker project."           | `make -C project-02-expense-tracker down`            |
| Backend tests (Proj 1)  | "Run backend tests for Project 1."                 | `make -C project-01-content-generator test-backend`  |
| Frontend tests (Proj 1) | "Run frontend tests for Project 1."                | `make -C project-01-content-generator test-frontend` |
| Rebuild images (Proj 2) | "Rebuild images in Project 2."                     | `make -C project-02-expense-tracker rebuild`         |
| Follow logs (Proj 1)    | "Show logs for Project 1 until I say stop."        | `make -C project-01-content-generator logs`          |

## 📂 The Projects

Each project is a complete, standalone application.

| Project                  | Description                                       | Status               |
| ------------------------ | ------------------------------------------------- | -------------------- |
| **01-content-generator** | Multi-agent content creation with a real-time UI. | ✅ **Ready**          |
| **02-expense-tracker**   | Automates business expense categorization.        | ✅ **Ready**          |
| **03-task-tracker**      | Natural-language task logging to Google Sheets.   | ✅ Demo-Ready         |
| **04-rental-analyzer**   | Analyzes real estate investment opportunities.    | 🗓️ Nov 2025 Release |
| **05-cloud-deployment**  | Guides for deploying these projects to the cloud. | 🗓️ Nov 2025 Release |

---

### Project READMEs

- Project 01 — Content Generator: [project-01-content-generator/README.md](project-01-content-generator/README.md)
- Project 02 — Expense Tracker: [project-02-expense-tracker/README.md](CSTU%20Course/MAS/2025%20Nov%20Class/local-dev/project-02-expense-tracker/README.md)
- Project 03 — Task Tracker: [project-03-task-tracker/README.md](project-03-task-tracker/README.md)

## 🗂️ Repo Structure

```
multi-ai-coding-agent/
├── README.md
├── CLAUDE.md
├── AGENTS.md
├── LICENSE
├── setup/
│   ├── mac-setup.md
│   ├── windows-setup.md
│   ├── quick-start.md
│   └── troubleshooting.md
├── project-01-content-generator/
├── project-02-expense-tracker/
├── project-03-task-tracker/
├── project-04-rental-analyzer/
└── project-05-cloud-deployment/
```

## 🛠️ Tech Stack

All projects follow a consistent, modern architecture:

-   **Backend:** Python, CrewAI, FastAPI
-   **Frontend:** React, TypeScript
-   **Deployment:** Docker, Docker Compose

---

## 🧰 Troubleshooting

See common fixes and tips in `setup/troubleshooting.md`.

- Bind mounts and live updates: When editing files in bind-mounted folders (e.g., Project 2's `./data` mapped to `/app/data`), changes are reflected immediately in running containers. Refresh the UI or rerun the request to see updates. If changes don't appear, restart that project's containers.

## 💬 Development Philosophy

Our goal is to democratize AI development. We believe you should be able to build powerful AI systems by describing what you want in plain English. These projects are designed to be understood, customized, and scaled using conversational AI development tools.

For a deeper dive into the architecture and development patterns, see our [**Development Guide (CLAUDE.md)**](./CLAUDE.md).

---

## 🤝 Contributing

- PRs welcome. Keep them small and focused.
- Follow Conventional Commits (`feat:`, `fix:`, `docs:`, etc.).
- Use Docker + Make targets; do not run Python on the host.
- For larger changes, open an issue first to discuss direction.
- Code of Conduct: contact ping@ping-ai.com for any concerns.

### Git Hooks (Secret Guardrails)
- Enable repo-managed hooks to prevent accidental secret commits:
  - `git config core.hooksPath .githooks`
- What it blocks by default:
  - Any `.env` files (`.env`, `.env.*`)
  - Any `credentials/*.json` (e.g., Google service accounts)
  - Private key files (`*.pem`, `*.key`)
  - Staged content containing markers like `OPENAI_API_KEY=`, `service_account`, or `private_key`
- To bypass (not recommended), set `HOOK_BYPASS=1` for a single commit.

## 📄 License

Licensed under the MIT License — see `LICENSE` for details.

## 📫 Contact

For questions or support, email: ping@ping-ai.com
Visit https://ping-ai.com to subscribe my newsletter about Multi-AI-Coding Agents
