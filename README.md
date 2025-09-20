# 🤖 Multi-AI Coding Agent Projects

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/pingwu/multi-ai-coding-agent)](https://github.com/pingwu/multi-ai-coding-agent/commits)
[![Docker Compose](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](#)

**Production-ready, multi-agent AI systems that you can clone, customize, and deploy in minutes.**

This repository provides a collection of self-contained, professional-grade AI applications built with a modern tech stack. It is designed for students, developers, and entrepreneurs who want to build and deploy AI solutions efficiently.

## 🚀 Getting Started

For a complete setup guide, please see the **[Quick Start Guide](./setup/quick-start.md)**.

## 🎯 Core Objectives

*   **Natural Language AI Development**: Extend and customize AI projects through conversational development.
*   **Enterprise-Ready & Developer-Friendly**: Built with a vendor-agnostic, enterprise architecture from day one, ensuring no lock-in and a developer-friendly experience.
*   **Business Value-Driven Workflow**: Enables a forward-deployed engineer workflow, allowing for rapid prototyping and iteration to solve real-world business problems.

## Workflow Overview

The diagram below illustrates the development workflow, from initial setup to running an application.

```mermaid
graph TD
    subgraph "Setup"
        A[Start Here] --> B["[Install AI Coding Environment](./setup/quick-start.md)"];
    end

    subgraph "Project Initiation"
        B --> C{Clone Project};
        C --> D["Start AI Coding Agent (e.g., Claude Code)"];
    end

    subgraph "Explore & Understand"
        D --> E{Test Existing Projects};
        E --> F["Update API Keys"];
        F --> G["Run Project (e.g., Content Generator)"];
        G --> H["Understand Tech Stack & Architecture"];
        H --> E;
    end

    subgraph "Iterative Development Cycle"
        D --> I{Create New Project};
        I --> J["Copy Existing Project (e.g., 'copy project 1 to project_new')"];
        J --> K["Define Requirements (PRD)"];
        K --> L["Modify Use Case using Natural Language (e.g., 'change to market research tool')"];
        L --> M{Cross-check with other AI Agents};
        M --> N["Test & Refine"];
        N --> L;
    end

    subgraph "Goal"
        N --> O["Contribute to<br>Containerized Best Practices"];
    end

    H --> I;
```

## 📂 The Projects

Each project is a complete, standalone application.

| Project                  | Description                                       | Status               |
| ------------------------ | ------------------------------------------------- | -------------------- |
| **[01-content-generator](./project-01-content-generator/)** | Multi-agent content creation with a real-time UI. | ✅ **Ready**          |
| **[02-expense-tracker](./project-02-expense-tracker/)**   | Automates business expense categorization.        | ✅ **Ready**          |
| **[03-task-tracker](./project-03-task-tracker/)**      | Natural-language task logging to Google Sheets.   | ✅ **Ready**         |
| **[04-Google-OAuth](./project-04-Google-OAuth/)**      | Team task tracker with Google OAuth integration.  | ✅ **Ready** |
| **[adk-quickstart](./adk-quickstart/)**       | Containerized Google ADK with custom chat frontend. | ✅ **Ready** |
| **05-cloud-deployment**  | Guides for deploying these projects to the cloud. | 🗓️ Nov 2025 Release |

For more details, see the README file within each project folder.

## 🤝 Contributing

We welcome contributions! Please see our [**Contributing Guidelines**](https://github.com/pingwu/multi-ai-coding-agent/blob/main/CONTRIBUTING.md) and [**Code of Conduct**](https://github.com/pingwu/multi-ai-coding-agent/blob/main/CODE_OF_CONDUCT.md).

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.