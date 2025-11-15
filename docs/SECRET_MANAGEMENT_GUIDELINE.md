---
type: conceptual-guide
category: architecture
concept: Secure Secret Management
domain: technology
difficulty: fundamental
version: 1.0.0
last_updated: 2025-11-14
tags:
  - conceptual
  - security
  - architecture
  - best-practice
  - secret-management
aliases:
  - secret-management-guideline
  - environment-variable-best-practices
related_concepts:
  - [[twelve-factor-app]]
  - [[cloud-native-security]]
implementations:
  - [[secure-api-key-setup]]
---

# Secure Secret Management: A Guideline for MACA-Course Projects

> **ESSENCE**: This document outlines the official policy for managing secrets like API keys (`OPENAI_API_KEY`, etc.) within the MACA-Course projects. The core principle is to **never store secrets in code or configuration files**. Instead, we will use operating system (OS) environment variables or cloud-provider secret management services.
>
> **KNOWLEDGE GRAPH CONTEXT**:
> - **Prerequisite Understanding**: [[glossary/api-key]], [[understanding-environment-variables]]
> - **Practical Implementations**: [[setting-up-environment-variables]]
> - **Competing Approaches**: [[why-we-dont-use-dotenv-files]]

---

## 🎯 Overview

<details open>
<summary><strong>Click to expand Overview</strong></summary>

### What Is Secure Secret Management?

Secure secret management is the practice of handling sensitive information—such as API keys, database passwords, and other credentials—in a way that minimizes the risk of unauthorized access. For the MACA-Course projects, this means strictly separating our code from our configuration and secrets.

**In simple terms**: Think of your house key. You wouldn't write your address on your keychain. Similarly, we don't store our secret keys inside our code, where they could be accidentally exposed.

**Core Question Answered**: How do we use API keys and other secrets in our applications without hardcoding them or committing them to version control?

---

### The Problem We Are Solving: The Dangers of `.env` Files

While `.env` files are a common way to manage environment variables during development, they introduce significant security risks and operational friction, especially in a collaborative project like MACA.

**Without a strict secret management policy:**
- **Accidental Commits**: Developers might accidentally commit `.env` files containing real secrets to Git, permanently exposing them in the repository's history.
- **Inconsistent Environments**: Each developer has their own `.env` file, leading to the "it works on my machine" problem. There is no single source of truth for configuration.
- **Security Risks in Production**: Using `.env` files in production or CI/CD pipelines is a major security vulnerability. These files can be read by any process running on the same machine.
- **No Audit Trail**: There is no way to track who accessed or changed a secret.

**With our Secure Secret Management Policy:**
- **Zero Secrets in Codebase**: Our Git repository will be completely free of any sensitive credentials.
- **Consistent and Reproducible Environments**: Configuration is managed explicitly through the environment, aligning with the [Twelve-Factor App methodology](https://12factor.net/config).
- **Enhanced Security**: We rely on the robust security models of the underlying operating system or cloud provider to protect our secrets.
- **Clear Separation of Concerns**: Code is for logic. The environment is for configuration.

</details>

---

## 🧠 Core Principles

<details open>
<summary><strong>Click to expand Core Principles</strong></summary>

### Principle 1: The Environment is the Authority

The operating system's environment is the single source of truth for all configuration that varies between deployments (development, testing, production). Our applications will be designed to read their configuration directly from environment variables.

**Why It Matters**: This decouples our application from its deployment environment. We can promote the exact same code from development to production without changing a single line—only the environment needs to be different.

---

### Principle 2: Zero Trust for the Filesystem

We assume that any file in our project directory could be compromised or accidentally committed. Therefore, no file within the project is allowed to contain secrets, not even temporarily.

**Why It Matters**: This simple, unbreakable rule eliminates the most common cause of secret leakage. It forces us to adopt more secure and robust practices from the very beginning.

---

### Principle 3: Developer Experience and Security are Not Opposed

By providing clear, platform-specific instructions, we can make the secure way the easy way. A few minutes of one-time setup for environment variables provides long-term security and operational stability.

**Why It Matters**: Security practices that are too complex or cumbersome are often bypassed. Our goal is to make the secure path as frictionless as possible.

</details>

---

## ❌ The `.env` File is Strictly Forbidden

<details open>
<summary><strong>Click to expand on why we are not using .env files</strong></summary>

To be crystal clear, for all projects within the `MACA-Course`, the use of `.env` files to store secrets is **strictly forbidden**.

- **Do not create `.env` files.**
- **Do not ask for `.env` files.**
- **If you find a `.env` file, please delete it and move the secrets to a secure location.**

This policy is in place to enforce security best practices and to ensure a consistent and secure development workflow for everyone involved in the project. Any `.env.example` files are for documentation purposes only, to show what variables are needed. They should never be copied to a `.env` file.

</details>

---

## 🛠️ Practical Implementation: Setting Your Environment Variables

Now, let's move on to the "how." The following is a procedural guide to setting up your environment variables correctly.

---
type: procedural-guide
category: setup
tool: Environment Variables
platforms:
  - windows
  - macos
  - wsl
difficulty: beginner
time_estimate: 10 minutes
prerequisites:
  - [[glossary/api-key]]
version: 1.0.0
last_updated: 2025-11-14
tags:
  - procedural
  - setup
  - security
  - environment-variables
aliases:
  - how-to-set-environment-variables
  - setup-api-keys
related_concepts:
  - [[secure-secret-management]]
---

# How to Set Environment Variables for MACA-Course Projects

This guide provides step-by-step instructions for setting environment variables like `OPENAI_API_KEY` on your local machine.

<details>
<summary><strong>Click to expand Glossary</strong></summary>

- **Environment Variable**: A variable whose value is set by the operating system. It's a key-value pair that can be accessed by any program running on your machine.
- **Secret**: A piece of sensitive information, like an API key or password.
- **Shell**: The command-line interface you use to interact with your operating system (e.g., PowerShell, bash, zsh).
- **Shell Profile**: A script that runs every time you open a new terminal window (e.g., `.bashrc`, `.zshrc`, PowerShell Profile). This is where we will permanently store your environment variables.

</details>

---

## 🪟 Windows: PowerShell (Recommended)

<details open>
<summary><strong>Click to expand Windows PowerShell Instructions</strong></summary>

We will set the environment variable permanently at the user level. This means you only have to do this once.

### Step 1: Open PowerShell

Press the `Windows Key`, type `PowerShell`, and press `Enter`.

### Step 2: Set the Environment Variable

Use the following command to set your `OPENAI_API_KEY`. Replace `"your_api_key_here"` with your actual key.

```powershell
[System.Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "your_api_key_here", "User")
```

**Why this matters**: This command tells Windows to store the `OPENAI_API_KEY` in a secure location associated with your user account. It will be available in all future PowerShell sessions. The `"User"` flag is important—it ensures the variable is set only for you, not for every user on the machine.

### Step 3: Close and Reopen PowerShell

For the changes to take effect, you must close your current PowerShell window and open a new one.

### Step 4: Verify the Variable is Set

In the new PowerShell window, run this command:

```powershell
$env:OPENAI_API_KEY
```

**Expected Output**:
You should see your API key printed to the screen.

🎯 **Quick Check**: If you see your key, you have successfully set up your environment variable! If you see a blank line, something went wrong. Double-check that you copied the command correctly and that you restarted PowerShell.

</details>

---

## 🍎 macOS & 🐧 WSL (Linux)

<details open>
<summary><strong>Click to expand macOS & WSL/Linux Instructions</strong></summary>

The process for macOS and the Windows Subsystem for Linux (WSL) is nearly identical, as they both use Unix-like shells such as `zsh` (the default for modern macOS) or `bash`.

### Step 1: Identify Your Shell

Open your Terminal (on macOS) or WSL prompt and run:

```bash
echo $SHELL
```

This will tell you if you are using `zsh`, `bash`, or another shell.

### Step 2: Open Your Shell Profile File

Based on the output from Step 1, you will need to edit the correct profile file.

- If you are using **zsh**, run: `nano ~/.zshrc`
- If you are using **bash**, run: `nano ~/.bashrc`

**What we're doing**: `nano` is a simple text editor. We are opening the configuration file for your shell. This file runs every time you open a new terminal.

### Step 3: Add the `export` Command

Scroll to the bottom of the file and add the following line. Replace `"your_api_key_here"` with your actual key.

```bash
export OPENAI_API_KEY="your_api_key_here"
```

**Why this matters**: The `export` command makes the variable available to any programs or scripts you run from your terminal. By adding it to your profile file, it will be set automatically in every new terminal session.

### Step 4: Save and Exit the Editor

- Press `Ctrl + X`.
- Press `Y` to confirm you want to save.
- Press `Enter` to confirm the filename.

### Step 5: "Source" Your Profile to Apply Changes

To apply the changes to your current terminal session, run the appropriate command:

- If you are using **zsh**, run: `source ~/.zshrc`
- If you are using **bash**, run: `source ~/.bashrc`

### Step 6: Verify the Variable is Set

Run this command:

```bash
echo $OPENAI_API_KEY
```

**Expected Output**:
You should see your API key printed to the screen.

🎯 **Quick Check**: If you see your key, you're all set! If not, try opening a brand new terminal window. If it's still not there, carefully repeat the steps, ensuring you've edited and saved the correct file.

</details>

---

## ☁️ Cloud Environments (e.g., Google Cloud, AWS, Azure)

When deploying applications to the cloud, **do not** set environment variables manually. Instead, use the secret management service provided by your cloud provider:

- **Google Cloud**: Use **Secret Manager**.
- **AWS**: Use **AWS Secrets Manager**.
- **Azure**: Use **Azure Key Vault**.

These services provide a secure, auditable, and centralized way to manage secrets for your production applications. Your application code will be configured to fetch the secrets from these services at runtime. Detailed instructions for this will be provided in the deployment guides for each project.
