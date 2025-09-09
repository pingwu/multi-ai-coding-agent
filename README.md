# 🤖 Multi-AI Coding Agent Projects

**Production-ready, multi-agent AI systems that you can clone, customize, and deploy in minutes.**

This repository provides a collection of self-contained, professional-grade AI applications built with a modern tech stack.

---

## 🚀 Getting Started

First, ensure you have Docker and Git installed by following the setup guide for your OS:
- [**macOS Setup**](./setup/mac-setup.md)
- [**Windows Setup**](./setup/windows-setup.md)

Once your environment is ready, choose your preferred workflow to launch a project:

| Workflow (Choose One)          | 🤖 AI-Powered (Recommended)                                                                                                                                                           | 💻 Manual Command Line                                                                                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Clone the Repository**    | `git clone https://github.com/pingwu/multi-ai-coding-agent.git`<br>`cd multi-ai-coding-agent`                                                                                          | `git clone https://github.com/pingwu/multi-ai-coding-agent.git`<br>`cd multi-ai-coding-agent`                                                                                          |
| **2. Launch a Project**        | **Use natural language.** Open your AI agent (like Claude Code) and say:<br> `"Start the content generator project"`                                                                    | **Use the command line.** Navigate to a project folder:<br>`cd project-01-content-generator`<br><br>Then run Docker:<br>`docker-compose up --build`                                        |
| **3. Configure API Keys**      | Your AI agent will guide you through setting up your keys securely when needed. Just ask:<br>`"Help me set up my API keys"`                                                              | Manually copy the `.env.example` to `.env` and edit the file to add your keys:<br>`cp .env.example .env`<br>`# Now open .env and add your keys`                                           |
| **Result**                     | A running application accessible at `http://localhost:3000` (frontend) and `http://localhost:8000` (backend), often in **under 5 minutes**.                                              | A running application accessible at `http://localhost:3000` (frontend) and `http://localhost:8000` (backend), often in **under 15 minutes**.                                              |

---

## 📂 The Projects

Each project is a complete, standalone application.

| Project                               | Description                                       | Status          |
| ------------------------------------- | ------------------------------------------------- | --------------- |
| **01-content-generator**              | Multi-agent content creation with a real-time UI. | ✅ **Ready**    |
| **02-expense-tracker**                | Automates business expense categorization.        | ✅ **Ready**    |
| **03-project-analyzer**               | Assesses project risk from Google Sheets data.    | 🗓️ Nov 2025 Release |
| **04-rental-analyzer**                | Analyzes real estate investment opportunities.    | 🗓️ Nov 2025 Release |
| **05-cloud-deployment**               | Guides for deploying these projects to the cloud. | 🗓️ Nov 2025 Release |

---

## 🛠️ Tech Stack

All projects follow a consistent, modern architecture:

-   **Backend:** Python, CrewAI, FastAPI
-   **Frontend:** React, TypeScript
-   **Deployment:** Docker, Docker Compose

---

## 💬 Development Philosophy

Our goal is to democratize AI development. We believe you should be able to build powerful AI systems by describing what you want in plain English. These projects are designed to be understood, customized, and scaled using conversational AI development tools.

For a deeper dive into the architecture and development patterns, see our [**Development Guide (CLAUDE.md)**](./CLAUDE.md).

---
