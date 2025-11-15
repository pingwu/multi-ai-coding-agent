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
  - [[api-key]]
  - [[secure-secret-management]]
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

This guide provides step-by-step instructions for setting environment variables like `OPENAI_API_KEY` on your local machine. Following this guide is a critical step in keeping our projects secure.

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

🎯 **Quick Check**: If you're all set, you'll see your key! If not, try opening a brand new terminal window. If it's still not there, carefully repeat the steps, ensuring you've edited and saved the correct file.

</details>

---

## 🔗 Referenced By

This glossary entry is referenced by:
- [[../SECRET_MANAGEMENT_GUIDELINE]] - Best practices for using environment variables
- [[../claude-code-installation-guide]] - Editor integration with EDITOR variable
- [[../vscode-installation-guide]] - Setting up the EDITOR environment variable
- [[api-key]] - Related concept: storing API keys securely

**Knowledge Graph Hub**: [[../glossary/README|Glossary Hub]]

