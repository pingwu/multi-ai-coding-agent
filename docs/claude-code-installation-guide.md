# Claude Code Installation Guide

A complete guide for installing Claude Code and configuring it for AI-assisted development workflows.

---

## 🚀 Quick Setup for Experienced Users

<details>
<summary><strong>Click to expand Quick Start Guide</strong></summary>

### Official Documentation

- **Main docs**: https://docs.anthropic.com/en/docs/claude-code
- **Setup Guide**: https://docs.anthropic.com/en/docs/claude-code/setup
- **Windows Guide**: https://docs.anthropic.com/en/docs/claude-code/setup/windows
- **macOS Guide**: https://docs.anthropic.com/en/docs/claude-code/setup/macos
- **Linux Guide**: https://docs.anthropic.com/en/docs/claude-code/setup/linux
- **Getting Started**: https://docs.anthropic.com/en/docs/claude-code/getting-started

### Windows 11 Speed Run

```powershell
# 1. Install via PowerShell (recommended)
irm https://claude.ai/install.ps1 | iex

# OR install via npm
npm install -g @anthropic-ai/claude-code

# 2. Verify installation
claude --version

# 3. Set up API key
claude auth login
# Follow browser authentication flow

# 4. Test basic command
claude "Hello, can you help me code?"

# 5. Set up editor integration
$env:EDITOR = "code --wait"  # for VS Code
# Make persistent:
[Environment]::SetEnvironmentVariable("EDITOR", "code --wait", "User")

# 6. Test Ctrl+G (long prompt editing)
# Press Ctrl+G in Claude Code session
```

### macOS/Linux Speed Run

```bash
# 1. Install via curl (recommended)
curl -fsSL https://claude.ai/install.sh | sh

# OR install via npm
npm install -g @anthropic-ai/claude-code

# 2. Verify installation
claude --version

# 3. Set up API key
claude auth login
# Follow browser authentication flow

# 4. Test basic command
claude "Hello, can you help me code?"

# 5. Set up editor integration
export EDITOR="code --wait"  # for VS Code
echo 'export EDITOR="code --wait"' >> ~/.zshrc  # persist
source ~/.zshrc

# 6. Test Ctrl+G (long prompt editing)
# Press Ctrl+G in Claude Code session
```

### Quick Feature Test

```bash
# Test project context awareness
cd your-project
claude "analyze this codebase structure"

# Test multi-file editing
claude "refactor the authentication logic across all files"

# Test Ctrl+G for long prompts
# Press Ctrl+G → write detailed prompt in editor → save & close
```

**Not working?** Check [official troubleshooting](https://docs.anthropic.com/en/docs/claude-code/troubleshooting) or jump to the detailed guide below.

</details>

---

## Introduction

Welcome! This guide will help you install Claude Code, Anthropic's AI-powered coding assistant, and set it up for seamless development workflows. Don't worry if you've never used an AI coding tool before—we'll walk through every step together.

### What You'll Learn

By the end of this guide, you'll be able to:
- Install Claude Code on your computer (Windows 11, macOS, or Linux)
- Authenticate with your Anthropic API key
- Use Claude Code for AI-assisted coding
- Set up editor integration for long prompts (Ctrl+G feature)
- Understand Claude Code's unique features
- Troubleshoot common installation issues

### Time Required

- **Experienced users**: 5-10 minutes (use Quick Start above)
- **First-time installation**: 20-30 minutes (follow detailed guide below)
- **No computer restarts required**

---

## 📑 Table of Contents

<details>
<summary><strong>Click to expand Table of Contents</strong></summary>

**Quick Navigation:**

- [🚀 Quick Setup for Experienced Users](#-quick-setup-for-experienced-users)
- [Introduction](#introduction)
- [📖 Glossary: Terms You'll See](#-glossary-terms-youll-see)
- [Prerequisites](#prerequisites)
  - [System Requirements](#system-requirements)
  - [Anthropic Account Setup](#anthropic-account-setup)
  - [What to Expect](#what-to-expect)

**Installation Instructions:**

- [Installation Guide](#installation-guide)
- [Windows 11 Installation](#windows-11-installation)
  - [Method 1: PowerShell Script (Recommended)](#method-1-powershell-script-recommended)
  - [Method 2: npm Installation](#method-2-npm-installation)
  - [Verify Installation](#verify-installation-windows)
- [macOS/Linux Installation](#macoslinux-installation)
  - [Method 1: curl Script (Recommended)](#method-1-curl-script-recommended)
  - [Method 2: npm Installation](#method-2-npm-installation-1)
  - [Verify Installation](#verify-installation-macoslinux)

**Authentication & Setup:**

- [Authentication Setup (CRITICAL)](#authentication-setup-critical)
  - [Understanding API Keys](#understanding-api-keys)
  - [Getting Your API Key](#getting-your-api-key)
  - [Running claude auth login](#running-claude-auth-login)
  - [Troubleshooting Authentication](#troubleshooting-authentication)
- [Editor Integration (Ctrl+G)](#editor-integration-ctrlg)
  - [Windows Setup](#windows-editor-setup)
  - [macOS/Linux Setup](#macoslinux-editor-setup)
  - [Supported Editors](#supported-editors)
- [Understanding Claude Code Features](#understanding-claude-code-features)

**Getting Started:**

- [Your First Claude Code Session](#your-first-claude-code-session)
- [Final Verification Checklist](#final-verification-checklist)

**Help & Support:**

- [Troubleshooting](#troubleshooting)
  - [Troubleshooting Windows](#troubleshooting-windows)
  - [Troubleshooting macOS/Linux](#troubleshooting-macoslinux)
  - [Troubleshooting Authentication](#troubleshooting-authentication-1)
- [Common Pitfalls Reference](#common-pitfalls-reference)
- [Still Stuck? How to Get AI Help](#still-stuck-how-to-get-ai-help)

**Additional Information:**

- [You Did It!](#you-did-it)
- [Additional Resources](#additional-resources)
- [Version History](#version-history)

</details>

---

## 📖 Glossary: Terms You'll See

<details>
<summary><strong>Click to expand Glossary</strong></summary>

Before we begin, let's clarify some terms you'll encounter:

| Term | What It Means |
|------|---------------|
| **Claude Code** | Anthropic's AI coding assistant that runs in your terminal |
| **API Key** | A secret password that lets you access Anthropic's AI services (like a digital key to unlock Claude Code) |
| **Terminal** | A text-based interface for giving commands to your computer (also called "Command Prompt" on Windows or "Terminal" on Mac/Linux) |
| **Shell** | The program that runs inside a terminal and interprets your commands (like PowerShell, zsh, or bash) |
| **Command Line** | Another name for the terminal—anywhere you type text commands |
| **PATH** | A list of folders your computer checks when you type a command, so it knows where to find programs |
| **Environment Variable** | A setting that tells programs on your computer how to behave (like EDITOR telling programs which text editor to use) |
| **npm** | Node Package Manager, a tool for installing JavaScript/Node.js programs (alternative installation method) |
| **Ctrl+G** | Keyboard shortcut in Claude Code that opens your text editor for writing long, complex prompts |

📝 **Note**: Don't worry if these terms are confusing now—you'll understand them better as we go through the installation!

</details>

---

## 🔧 Understanding Environment Variables & PATH

<details>
<summary><strong>Click to expand Environment Variables Guide (IMPORTANT for Beginners)</strong></summary>

This section explains critical concepts you'll need to understand **before** installing Claude Code. These concepts are essential for Python, Data Science, and any command-line development work.

### What Are Environment Variables?

**Simple Explanation**: Environment variables are like sticky notes for your computer programs. They're named settings that tell programs where to find things and how to behave.

**Real-World Analogy**: Think of a cookie recipe that says "use SUGAR_TYPE" instead of specifying "white sugar." The SUGAR_TYPE is an environment variable—you can change it to brown sugar or honey without rewriting the recipe.

**Example**:
Instead of hardcoding in your Python script:
```python
api_key = "sk-ant-api03-xyz123abc456..."  # BAD - exposed in code
```

You use an environment variable:
```python
import os
api_key = os.getenv("ANTHROPIC_API_KEY")  # GOOD - secure
```

---

### Why Environment Variables Matter for You

As a Python coder or Data Science student, environment variables help you:

1. **Keep Secrets Safe**: Store API keys outside your code (never commit keys to GitHub!)
2. **Work Anywhere**: Same code works on your laptop, desktop, and cloud servers
3. **Collaborate Safely**: Share code without sharing your personal API keys
4. **Switch Easily**: Use different settings for development vs production

**Common Variables You'll Use**:

| Variable Name | What It Does | Example Value |
|--------------|--------------|---------------|
| `ANTHROPIC_API_KEY` | Your Claude API key | `sk-ant-api03-...` |
| `OPENAI_API_KEY` | OpenAI API key for GPT | `sk-proj-...` |
| `PATH` | Where to find programs | `C:\Python311;C:\Users\you\.local\bin` |
| `PYTHONPATH` | Where Python finds modules | `C:\MyPythonLibs` |
| `HOME` | Your user home directory | `C:\Users\yourname` |

---

### User vs System Environment Variables (Windows)

Windows has **two types** of environment variables:

#### User Environment Variables (Recommended for You)
- **Who sees them**: Only YOUR user account
- **Permissions needed**: None (you can set these yourself)
- **Safety**: Can't break system-wide programs
- **Best for**: Installing tools just for yourself, API keys, personal settings

#### System Environment Variables
- **Who sees them**: ALL users on the computer
- **Permissions needed**: Administrator rights
- **Safety**: Could affect other users or system programs
- **Best for**: System-wide applications (avoid as a beginner)

**Important**: The PATH variable combines both—System PATH is searched first, then your User PATH is appended.

---

### How to View Environment Variables

#### Method 1: GUI (Easiest for Beginners)

**Step-by-step**:
1. Press `Windows key + R` to open Run dialog
2. Type `sysdm.cpl` and press Enter
3. Click the **Advanced** tab
4. Click **Environment Variables** button
5. You'll see two sections:
   - **Top**: User variables for your account ← Start here
   - **Bottom**: System variables (for all users)

![Environment Variables Window]

**Alternative way**:
1. Press Windows key
2. Type "environment"
3. Click "Edit the system environment variables"
4. Click **Environment Variables** button

#### Method 2: PowerShell (Quick Check)

```powershell
# View ALL environment variables
Get-ChildItem Env:

# View a specific variable
$env:PATH
$env:ANTHROPIC_API_KEY

# View PATH entries one per line (easier to read)
$env:PATH -split ";"

# Check if something is in your PATH
$env:PATH -split ";" | Select-String "Python"
```

#### Method 3: Git Bash (After you install it)

```bash
# View all environment variables
env

# View specific variable
echo $PATH
echo $ANTHROPIC_API_KEY

# View PATH entries one per line
echo $PATH | tr ';' '\n'
```

---

### How to Set Environment Variables

#### Method 1: GUI (Permanent - Best for Beginners)

**To create a new User environment variable** (like for API keys):

1. Open Environment Variables window (see "How to View" above)
2. In the **User variables** section (top half), click **New...**
3. **Variable name**: Type the name (e.g., `ANTHROPIC_API_KEY`)
4. **Variable value**: Paste your value (e.g., your API key)
5. Click **OK** on all windows
6. **CRITICAL**: Close and reopen ALL terminal windows

**To add a directory to your PATH**:

1. Open Environment Variables window
2. In **User variables**, select the **Path** variable
3. Click **Edit...**
4. Click **New**
5. Type or paste the directory path (e.g., `C:\Users\yourname\.local\bin`)
6. Click **OK** on all windows
7. **CRITICAL**: Close and reopen ALL terminals

#### Method 2: PowerShell (Permanent)

```powershell
# Set a new user environment variable
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "your-api-key-here", [EnvironmentVariableTarget]::User)

# Add a directory to your user PATH
[Environment]::SetEnvironmentVariable("PATH", "$env:PATH;C:\Users\yourname\.local\bin", [EnvironmentVariableTarget]::User)

# ⚠️ Remember to close and reopen terminals after this!
```

#### Method 3: PowerShell (Temporary - Current Session Only)

```powershell
# Set for this PowerShell window only (lost when you close it)
$env:ANTHROPIC_API_KEY = "your-api-key-here"
$env:PATH = "$env:PATH;C:\new\directory"
```

**When to use temporary**: Testing, one-time tasks, or when you don't want permanent changes.

---

### Understanding the PATH Variable

**What is PATH?** The most important environment variable you'll use.

**Simple Explanation**: PATH is a list of folders where Windows looks for executable programs when you type a command.

**Analogy**: Imagine PATH as a list of rooms where you keep tools. When you ask for a "hammer," Windows checks each room on the PATH list until it finds one.

#### How PATH Works: Step-by-Step

When you type a command like `python` or `claude`:

1. **Check Current Folder**: Windows first looks in your current directory
2. **Check PATH Folders**: If not found, Windows checks each directory in PATH (left to right)
3. **Run First Match**: When found, Windows runs that program
4. **Error if Not Found**: If not in any PATH folder, you get "command not recognized"

**Example**:

Your PATH is:
```
C:\Windows\System32;C:\Python311;C:\Users\you\.local\bin
```

You type `python`:
1. Check current folder → not found
2. Check `C:\Windows\System32` → not found
3. Check `C:\Python311` → **FOUND** `python.exe` ✓
4. Run it!

#### Viewing Your PATH

**PowerShell (shows all directories in PATH)**:
```powershell
# Hard to read (one long line)
$env:PATH

# Easy to read (one directory per line)
$env:PATH -split ";"
```

**Git Bash**:
```bash
# Easy to read
echo $PATH | tr ';' '\n'
```

#### Why PATH Matters for Claude Code

After installing Claude Code, the installer adds its location to your PATH so you can type `claude` from anywhere:

**Before PATH is updated**:
```powershell
PS C:\Users\you\Documents> claude --version
# Error: 'claude' is not recognized as a command
```

**After PATH is updated**:
```powershell
PS C:\Users\you\Documents> claude --version
# claude version 1.2.3 ✓
```

---

### Environment Variables for API Keys (Security!)

**⚠️ NEVER DO THIS** (Hardcoded API Key - BAD):
```python
# DON'T DO THIS - Anyone who sees this code gets your API key!
api_key = "sk-ant-api03-xyz123abc456..."
client = anthropic.Client(api_key=api_key)
```

**✅ DO THIS** (Environment Variable - GOOD):
```python
# DO THIS - API key stored safely outside your code
import os
api_key = os.getenv("ANTHROPIC_API_KEY")
client = anthropic.Client(api_key=api_key)
```

#### Why This Matters (Real Risks)

**If you hardcode API keys**:
- ❌ Push to GitHub → Your key is public forever (even if you delete it later)
- ❌ Share code → Everyone gets your key
- ❌ Screenshot → Key is visible
- ❌ Someone uses your key → You get charged for their usage

**If you use environment variables**:
- ✅ Code can be shared safely
- ✅ Different keys on different computers
- ✅ Easy to rotate/change keys
- ✅ Keys not in version control

#### Best Practices for API Keys

1. **Never hardcode** API keys in source code
2. **Use environment variables** (Windows) or `.env` files (projects)
3. **Add `.env` to `.gitignore`** (never commit it to Git)
4. **Rotate keys regularly** (change them periodically)
5. **Limit permissions** when creating API keys
6. **Monitor usage** to detect unauthorized access

#### Using .env Files for Projects

For project-specific API keys, use `.env` files:

**Step 1**: Install python-dotenv
```bash
pip install python-dotenv
```

**Step 2**: Create `.env` file in your project
```
# .env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
OPENAI_API_KEY=sk-proj-your-other-key-here
```

**Step 3**: Add `.env` to `.gitignore`
```
# .gitignore
.env
*.env
```

**Step 4**: Use in your Python code
```python
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access them
api_key = os.getenv("ANTHROPIC_API_KEY")
print(f"API key loaded: {api_key[:10]}...")  # Print first 10 chars only
```

---

### Common Issues for Beginners

#### Issue 1: "Changes don't take effect"

**Problem**: You set an environment variable but programs don't see it.

**Cause**: Existing terminal windows don't automatically reload environment variables.

**Solution**:
- Close ALL terminal windows (PowerShell, Git Bash, VS Code terminals)
- Open a brand new terminal
- Check again: `$env:VARNAME` (PowerShell) or `echo $VARNAME` (Git Bash)

#### Issue 2: "Command not found" after installation

**Problem**: You installed a program (like Python or Claude Code) but Windows says it's not recognized.

**Diagnosis**:
```powershell
# Check if the directory is in your PATH
$env:PATH -split ";" | Select-String "Python"
$env:PATH -split ";" | Select-String "local"
```

**Solutions**:
1. Verify the program actually installed (find the `.exe` file)
2. Add that directory to your PATH (see "How to Set" above)
3. Close and reopen terminals
4. If still not working, restart your computer

#### Issue 3: "PATH is too long"

**Problem**: Windows has limits on PATH length (though increased in Windows 10+).

**Solution**:
- Remove unused directories from PATH
- Keep only what you actually use
- Use shorter directory names when possible

#### Issue 4: "Which Python/program is running?"

**Problem**: You have multiple versions installed and don't know which one is being used.

**Check which one**:
```powershell
# PowerShell
Get-Command python | Select-Object Source
Get-Command claude | Select-Object Source

# Shows full path to the executable being used
```

```bash
# Git Bash
which python
which claude
```

---

### Quick Reference for Beginners

#### View Environment Variable
```powershell
# PowerShell
$env:VARIABLE_NAME

# Git Bash
echo $VARIABLE_NAME
```

#### Set Temporarily (Current Session)
```powershell
# PowerShell
$env:VARIABLE_NAME = "value"

# Git Bash
export VARIABLE_NAME="value"
```

#### Set Permanently
1. Press `Windows + R`
2. Type `sysdm.cpl` and press Enter
3. Advanced → Environment Variables
4. Add or edit in User variables section
5. **Close and reopen all terminals**

#### Check PATH
```powershell
# PowerShell - one directory per line
$env:PATH -split ";"

# Git Bash
echo $PATH | tr ';' '\n'
```

#### Check if directory is in PATH
```powershell
# PowerShell
$env:PATH -split ";" | Select-String "directory-name"

# Git Bash
echo $PATH | grep "directory-name"
```

---

### Key Takeaways

✅ **You should now understand**:
- Environment variables are settings that programs use
- User variables are safer for beginners than System variables
- PATH tells Windows where to find programs
- API keys should NEVER be hardcoded in code
- Changes require closing and reopening terminals
- `.env` files are good for project-specific settings

✅ **You should be able to**:
- View environment variables using GUI or command line
- Set User environment variables using the GUI
- Add a directory to your PATH
- Understand why `claude` works after installation
- Store API keys securely

📝 **Remember**:
- Always close and reopen terminals after changing environment variables
- Use User variables (not System) as a beginner
- Never commit API keys to Git
- PATH contains directories, not file paths

</details>

---

## Prerequisites

<details>
<summary><strong>Click to expand Prerequisites</strong></summary>

### System Requirements

**Windows 11:**
- Windows 11 (64-bit) or Windows 10
- PowerShell 5.1 or later (included by default)
- Internet connection for authentication
- **Git for Windows (REQUIRED)** - Includes Git Bash terminal
  - Download from: https://git-scm.com/download/win
  - Why required: Claude Code needs Unix-like shell environment (Git Bash provides this)
  - Alternative: WSL (Windows Subsystem for Linux) if you prefer Linux environment
- **GitHub CLI (Optional but Recommended)** - Makes GitHub operations easier
  - Download from: https://cli.github.com/
  - What it does: Create PRs, issues, and manage repositories from command line
  - When to install: If you frequently work with GitHub repositories
  - Not required for: Basic Claude Code functionality
- Optional: Node.js 16+ (only if using npm installation method)

**macOS:**
- macOS 10.15 (Catalina) or later
- Terminal (included by default)
- curl (included by default)
- Internet connection for authentication
- Optional: Node.js 16+ (only if using npm installation method)

**Linux:**
- Most modern distributions (Ubuntu 20.04+, Fedora 34+, Debian 11+, etc.)
- bash or zsh shell
- curl (usually pre-installed)
- Internet connection for authentication
- Optional: Node.js 16+ (only if using npm installation method)

📚 **Official System Requirements**: https://docs.anthropic.com/en/docs/claude-code/requirements

### Anthropic Account Setup

**You'll need an Anthropic account to use Claude Code:**

1. **Create an account**: Visit https://console.anthropic.com/
2. **Verify your email**: Check your inbox for verification email
3. **Set up billing** (if using Claude Code extensively):
   - Claude Code uses Anthropic's API
   - Free tier available for testing
   - See pricing at https://console.anthropic.com/settings/billing

📝 **Note**: You don't need to pre-purchase anything—Claude Code will walk you through authentication during setup.

### What to Expect

- **Download size**: ~10-50 MB (varies by installation method)
- **Installation time**: 2-5 minutes
- **Authentication time**: 2-3 minutes
- **Total setup time**: 5-10 minutes
- **Restarts needed**: None

</details>

---

## Installation Guide

Choose your operating system below:

- [Windows 11 Installation](#windows-11-installation)
- [macOS/Linux Installation](#macoslinux-installation)

---

## Windows 11 Installation

<details open>
<summary><strong>Click to expand Windows 11 Installation</strong></summary>

📚 **Official Windows Guide**: https://docs.anthropic.com/en/docs/claude-code/setup/windows

⚠️ **IMPORTANT: Install Git Bash First!**

Before installing Claude Code, you **MUST** install Git for Windows (which includes Git Bash):

1. **Download**: https://git-scm.com/download/win
2. **Install**: Run the installer and accept all defaults
3. **Verify**: Open Git Bash and type `git --version`

**Why Git Bash is required**:
- Claude Code needs a Unix-like shell environment on Windows
- Git Bash provides Linux/Unix commands that Claude Code relies on
- Most tutorials assume Unix-style commands
- Alternative: Use WSL (Windows Subsystem for Linux) instead

**Can I skip Git Bash?** No, Claude Code will not work properly on Windows without either Git Bash or WSL.

---

### Choosing an Installation Method

You have two options for installing Claude Code on Windows:

1. **PowerShell Script (Recommended)** - Easiest, fastest, automatic setup
2. **npm Installation** - If you already have Node.js and prefer npm

📝 **Recommendation**: Use the PowerShell script method unless you specifically need npm.

---

### Method 1: PowerShell Script (Recommended)

#### Step 1: Open PowerShell

1. **Press `Windows key`** on your keyboard
2. **Type** `powershell`
3. **Right-click** on **Windows PowerShell**
4. **Click** "**Run as administrator**"
5. **Click** "**Yes**" when Windows asks for permission

   ![PowerShell as Administrator]

   ⚠️ **Warning**: You need administrator privileges for the installation. If you don't have admin rights, use the npm method instead or ask your IT administrator.

#### Step 2: Run the Installation Command

1. **Copy this command**:
   ```powershell
   irm https://claude.ai/install.ps1 | iex
   ```

2. **Paste it into PowerShell** (right-click to paste, or press Ctrl+V)

3. **Press Enter**

4. **Wait for the installation to complete** (1-2 minutes)

   You'll see output like:
   ```
   Downloading Claude Code...
   Installing Claude Code...
   ✓ Claude Code installed successfully
   ```

🎯 **Quick Check**: You should see "Claude Code installed successfully" at the end.

#### Step 3: Verify Installation (Windows)

1. **Close the PowerShell window completely**

2. **Open a NEW PowerShell window** (you don't need admin rights this time):
   - Press `Windows key`
   - Type `powershell`
   - Press Enter

3. **Type this command and press Enter:**
   ```powershell
   claude --version
   ```

4. **You should see output like:**
   ```
   claude-code version 1.2.3
   ```

   ✅ **Success!** If you see a version number, Claude Code is installed!

   ❌ **If you see "command not found" or "not recognized":**
   - Close PowerShell COMPLETELY
   - Open a NEW PowerShell window
   - Try `claude --version` again
   - Still not working? See [Troubleshooting Windows](#troubleshooting-windows) below

---

#### Understanding Where Claude Code Gets Installed

**For beginners**: Let's understand what just happened and where Claude Code lives on your computer.

**Installation Location**:
```
C:\Users\<YourUsername>\.local\bin\claude.exe
```

**Example** (if your username is "student"):
```
C:\Users\student\.local\bin\claude.exe
```

**What is the `.local` folder?**
- The dot (`.`) makes it a hidden folder (won't show in normal file explorer)
- It's a standard location for user-specific programs on Windows
- Similar to how Linux/Mac users store personal programs

**Installation Scope: User-Level vs System-Level**

Claude Code installs at the **User level**, which means:

✅ **User-Level Installation (What Claude Code Does)**:
- Installed only for YOUR user account
- No administrator rights needed
- Doesn't affect other users on the computer
- Located in: `C:\Users\<YourUsername>\...`
- Added to your User PATH (not System PATH)

❌ **System-Level Installation (What Claude Code Does NOT Do)**:
- NOT installed for all users
- NOT in `C:\Program Files\`
- NOT in System PATH

**Why This Matters for You**:

1. **No Admin Rights Needed**: You can install Claude Code even on school/work computers where you're not an administrator
2. **Personal Configuration**: Your API keys and settings are private to your account
3. **Easy Removal**: If you want to uninstall, just delete the `.local` folder
4. **Won't Break Other Users**: Your installation doesn't affect other people using the same computer

**How the PATH Got Updated**:

The PowerShell installer did this:
1. Created the folder: `C:\Users\<YourUsername>\.local\bin\`
2. Downloaded `claude.exe` into that folder
3. Added that folder to your **User PATH** environment variable
4. Now Windows knows where to find `claude` when you type it

**Verifying the Installation Location**:

**PowerShell**:
```powershell
# See where claude.exe actually is
Get-Command claude | Select-Object Source

# Output will be:
# C:\Users\<YourUsername>\.local\bin\claude.exe
```

**Git Bash** (after you install Git):
```bash
# See where claude is located
which claude

# Output will be:
# /c/Users/<YourUsername>/.local/bin/claude.exe
```

**Checking Your PATH Was Updated**:

```powershell
# View your User PATH (one directory per line)
$env:PATH -split ";" | Select-String "\.local"

# You should see:
# C:\Users\<YourUsername>\.local\bin
```

**What If I Want to See the Actual Files?**

1. Open File Explorer
2. In the address bar, type: `%USERPROFILE%\.local\bin` and press Enter
3. You'll see `claude.exe` and related files

Or use PowerShell:
```powershell
# List files in the installation directory
Get-ChildItem "$env:USERPROFILE\.local\bin"
```

---

### Method 2: npm Installation

**Prerequisites**: You need Node.js installed. Check with `node --version`. If not installed, get it from https://nodejs.org/

#### Step 1: Open PowerShell

1. **Press `Windows key`**
2. **Type** `powershell`
3. **Press Enter** (no admin rights needed for npm method)

#### Step 2: Install Claude Code via npm

1. **Run this command:**
   ```powershell
   npm install -g @anthropic-ai/claude-code
   ```

2. **Wait for installation** (2-3 minutes, depending on internet speed)

   You'll see output like:
   ```
   added 15 packages in 45s
   ```

3. **Verify installation:**
   ```powershell
   claude --version
   ```

   You should see the version number.

📝 **Note**: The npm method requires you to update Claude Code manually with `npm update -g @anthropic-ai/claude-code`.

---

**Installation complete! Now skip to [Authentication Setup](#authentication-setup-critical)**

</details>

---

## macOS/Linux Installation

<details open>
<summary><strong>Click to expand macOS/Linux Installation</strong></summary>

📚 **Official macOS Guide**: https://docs.anthropic.com/en/docs/claude-code/setup/macos
📚 **Official Linux Guide**: https://docs.anthropic.com/en/docs/claude-code/setup/linux

### Choosing an Installation Method

You have two options for installing Claude Code:

1. **curl Script (Recommended)** - Easiest, fastest, automatic setup
2. **npm Installation** - If you already have Node.js and prefer npm

📝 **Recommendation**: Use the curl script method unless you specifically need npm.

---

### Method 1: curl Script (Recommended)

#### Step 1: Open Terminal

**macOS:**
1. **Press `Cmd + Space`** to open Spotlight
2. **Type** `terminal`
3. **Press Enter**

**Linux:**
- Use your distribution's terminal (usually Ctrl+Alt+T or search for "Terminal" in applications)

#### Step 2: Run the Installation Command

1. **Copy this command**:
   ```bash
   curl -fsSL https://claude.ai/install.sh | sh
   ```

2. **Paste it into Terminal** (Cmd+V on Mac, Ctrl+Shift+V on Linux)

3. **Press Enter**

4. **Enter your password** if prompted (your typing won't show—this is normal)

5. **Wait for the installation to complete** (1-2 minutes)

   You'll see output like:
   ```
   Downloading Claude Code...
   Installing Claude Code...
   ✓ Claude Code installed successfully
   ```

🎯 **Quick Check**: You should see "Claude Code installed successfully" at the end.

#### Step 3: Verify Installation (macOS/Linux)

1. **In the same Terminal window, type:**
   ```bash
   claude --version
   ```

2. **You should see output like:**
   ```
   claude-code version 1.2.3
   ```

   ✅ **Success!** If you see a version number, Claude Code is installed!

   ❌ **If you see "command not found":**
   - Close Terminal COMPLETELY
   - Open a NEW Terminal window
   - Try `claude --version` again
   - Still not working? See [Troubleshooting macOS/Linux](#troubleshooting-macoslinux) below

---

### Method 2: npm Installation

**Prerequisites**: You need Node.js installed. Check with `node --version`. If not installed:
- **macOS**: Use Homebrew: `brew install node` or download from https://nodejs.org/
- **Linux**: Use your package manager: `sudo apt install nodejs npm` (Ubuntu/Debian) or check https://nodejs.org/

#### Step 1: Open Terminal

(Same as Method 1 above)

#### Step 2: Install Claude Code via npm

1. **Run this command:**
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. **Wait for installation** (2-3 minutes, depending on internet speed)

   You'll see output like:
   ```
   added 15 packages in 45s
   ```

3. **If you get permission errors, try with sudo:**
   ```bash
   sudo npm install -g @anthropic-ai/claude-code
   ```

4. **Verify installation:**
   ```bash
   claude --version
   ```

   You should see the version number.

📝 **Note**: The npm method requires you to update Claude Code manually with `npm update -g @anthropic-ai/claude-code`.

---

**Installation complete! Continue to [Authentication Setup](#authentication-setup-critical)**

</details>

---

## Authentication Setup (CRITICAL)

<details open>
<summary><strong>Click to expand Authentication Setup</strong></summary>

📚 **Official Authentication Guide**: https://docs.anthropic.com/en/docs/claude-code/authentication

This is the **most important step**. Without authentication, Claude Code cannot access Anthropic's AI services.

### Understanding API Keys

**What is an API key?**

Think of an API key like a digital password that lets Claude Code talk to Anthropic's servers. It's how Anthropic knows:
- Who you are
- Which account to bill
- How much you can use Claude Code

🔒 **Security Note**: Your API key is sensitive information. Never share it publicly, commit it to Git, or post it online.

---

### Getting Your API Key

You don't need to manually copy an API key—the `claude auth login` command will handle this automatically via your browser!

**How it works:**
1. You run `claude auth login`
2. Your browser opens to Anthropic's website
3. You log in to your Anthropic account
4. Anthropic sends the API key directly to Claude Code securely
5. Claude Code saves it for future use

---

### Running claude auth login

#### Step 1: Start Authentication

1. **Open your terminal** (PowerShell on Windows, Terminal on Mac/Linux)

2. **Type this command and press Enter:**
   ```bash
   claude auth login
   ```

3. **You'll see a message like:**
   ```
   Opening browser for authentication...
   Waiting for authentication to complete...
   ```

4. **Your default web browser should open automatically** to https://console.anthropic.com/login

   ![Browser opens for authentication]

   ⚠️ **If the browser doesn't open automatically:**
   - Copy the URL shown in the terminal
   - Manually open your browser
   - Paste the URL and press Enter

#### Step 2: Log In to Anthropic

1. **On the Anthropic website, log in using:**
   - Your email and password, OR
   - Google account, OR
   - GitHub account

   ![Anthropic login page]

2. **If you don't have an account, click "Sign Up"** and create one:
   - Enter your email
   - Verify your email (check inbox)
   - Complete account setup

#### Step 3: Authorize Claude Code

1. **After logging in, you'll see a page asking:**
   ```
   "Claude Code wants to access your account"

   This will allow Claude Code to:
   - Make API requests on your behalf
   - Access your usage and billing information

   [Cancel]  [Authorize]
   ```

2. **Click "Authorize"**

   ![Authorization confirmation page]

3. **You'll see a success message:**
   ```
   ✓ Authentication successful!
   You can close this browser window.
   ```

4. **Switch back to your terminal**—you should see:
   ```
   ✓ Authentication successful!
   API key stored securely.
   ```

🎯 **Quick Check**: If you see "Authentication successful!" in your terminal, you're done!

#### Step 4: Verify Authentication

**Test that authentication worked:**

```bash
claude "Hello! Can you help me with coding?"
```

**Expected output:**
```
Claude Code is ready! Hello! I'd be happy to help you with coding. What would you
like to work on? I can assist with writing new code, debugging existing code,
explaining concepts, and much more.
```

✅ **Success!** If Claude responds, authentication is complete!

❌ **If you see "authentication failed" or "invalid API key"**, see [Troubleshooting Authentication](#troubleshooting-authentication-1) below.

---

### Where Are Credentials Stored?

For your information, Claude Code stores your API key securely:

**Windows:**
- `%USERPROFILE%\.claude\credentials`

**macOS/Linux:**
- `~/.claude/credentials`

🔒 **Security**: These files are readable only by your user account. Never share these files or their contents.

</details>

---

## Editor Integration (Ctrl+G)

<details>
<summary><strong>Click to expand Editor Integration Setup</strong></summary>

📚 **Official Editor Integration Guide**: https://docs.anthropic.com/en/docs/claude-code/editor-integration

### What is Ctrl+G?

**Ctrl+G** is Claude Code's killer feature. When you press it during a Claude Code session:
- Your configured text editor opens
- You can write a long, detailed prompt
- When you save and close the editor, the prompt is sent to Claude

**Why this matters:**
- Write complex, multi-paragraph prompts comfortably
- Use your familiar editor with syntax highlighting
- Edit and refine prompts before sending
- Much better than typing long prompts in the terminal

---

### Windows Editor Setup

#### Step 1: Choose Your Editor

Pick your favorite editor and set the `EDITOR` environment variable:

**For VS Code (most popular):**
```powershell
[Environment]::SetEnvironmentVariable("EDITOR", "code --wait", "User")
```

**For Notepad (simplest):**
```powershell
[Environment]::SetEnvironmentVariable("EDITOR", "notepad", "User")
```

**For Sublime Text:**
```powershell
[Environment]::SetEnvironmentVariable("EDITOR", "subl --wait", "User")
```

**For Vim:**
```powershell
[Environment]::SetEnvironmentVariable("EDITOR", "vim", "User")
```

📝 **Note**: The `--wait` flag tells VS Code/Sublime to wait until you close the file before returning control to Claude Code. This is critical!

#### Step 2: Verify the Variable

1. **Close PowerShell completely**
2. **Open a NEW PowerShell window**
3. **Run:**
   ```powershell
   echo $env:EDITOR
   ```

4. **You should see:**
   ```
   code --wait
   ```
   (or whatever editor you chose)

#### Step 3: Test Ctrl+G

1. **Start a Claude Code session:**
   ```powershell
   claude
   ```

2. **Press Ctrl+G**

3. **Your editor should open with an empty file**

4. **Type a test prompt:**
   ```
   Hello Claude! This is a test of the Ctrl+G feature.
   Please respond if you receive this message.
   ```

5. **Save the file and close the editor**

6. **Claude should respond to your prompt!**

✅ **Success!** If your editor opened and Claude responded, Ctrl+G works!

---

### macOS/Linux Editor Setup

#### Step 1: Choose Your Editor

Pick your favorite editor and add it to your shell configuration:

**For zsh (default on modern macOS):**

**VS Code:**
```bash
echo 'export EDITOR="code --wait"' >> ~/.zshrc
source ~/.zshrc
```

**Vim:**
```bash
echo 'export EDITOR="vim"' >> ~/.zshrc
source ~/.zshrc
```

**nano:**
```bash
echo 'export EDITOR="nano"' >> ~/.zshrc
source ~/.zshrc
```

**Sublime Text:**
```bash
echo 'export EDITOR="subl --wait"' >> ~/.zshrc
source ~/.zshrc
```

**For bash (older systems):**

Replace `~/.zshrc` with `~/.bash_profile` in the commands above.

📝 **Note**: The `--wait` flag tells VS Code/Sublime to wait until you close the file. This is critical!

#### Step 2: Verify the Variable

```bash
echo $EDITOR
```

You should see:
```
code --wait
```
(or whatever editor you chose)

#### Step 3: Test Ctrl+G

1. **Start a Claude Code session:**
   ```bash
   claude
   ```

2. **Press Ctrl+G** (or Cmd+G on macOS)

3. **Your editor should open with an empty file**

4. **Type a test prompt:**
   ```
   Hello Claude! This is a test of the Ctrl+G feature.
   Please respond if you receive this message.
   ```

5. **Save the file and close the editor**

6. **Claude should respond to your prompt!**

✅ **Success!** If your editor opened and Claude responded, Ctrl+G works!

---

### Supported Editors

Claude Code's Ctrl+G works with any editor that can:
- Be launched from the command line
- Wait for the file to be closed (with `--wait` flag)

**Popular choices:**
- VS Code: `EDITOR="code --wait"`
- Sublime Text: `EDITOR="subl --wait"`
- Vim: `EDITOR="vim"`
- Emacs: `EDITOR="emacs"`
- nano: `EDITOR="nano"`
- Notepad (Windows): `EDITOR="notepad"`

</details>

---

## Understanding Claude Code Features

<details>
<summary><strong>Click to expand Claude Code Features</strong></summary>

📚 **Official Features Documentation**: https://docs.anthropic.com/en/docs/claude-code/features

Now that Claude Code is installed, let's understand what makes it powerful:

### 1. Project Context Awareness

**What it does:**
- Claude Code automatically reads files in your current directory
- It understands your project structure
- It can suggest changes across multiple files

**Example:**
```bash
cd /path/to/your/project
claude "analyze the architecture of this codebase"
```

Claude will read your files and provide insights about:
- Code structure
- Dependencies
- Patterns and best practices
- Potential improvements

---

### 2. Multi-File Editing

**What it does:**
- Claude can modify multiple files in a single response
- Changes are shown as diffs before applying
- You can review and accept/reject changes

**Example:**
```bash
claude "refactor the authentication logic to use JWT tokens across all files"
```

Claude will:
1. Identify all files that need changes
2. Show you diffs for each file
3. Wait for your approval
4. Apply changes when you confirm

---

### 3. Interactive Chat Mode

**What it does:**
- Have ongoing conversations with Claude
- Ask follow-up questions
- Iterate on solutions

**Example session:**
```
$ claude
Claude Code> help me optimize this SQL query
[Claude provides optimization suggestions]

Claude Code> how would that perform with 1 million rows?
[Claude explains performance implications]

Claude Code> show me the updated query
[Claude provides optimized version]
```

---

### 4. Ctrl+G for Long Prompts

**What it does:**
- Opens your text editor for complex prompts
- Better than typing in terminal
- Use your familiar editor features

**When to use it:**
- Writing detailed requirements
- Providing multiple code examples
- Creating complex refactoring instructions

**Example:**
Press Ctrl+G and write:
```
I need help refactoring our user authentication system. Here's the current approach:

[paste current code]

Requirements:
1. Use JWT tokens instead of sessions
2. Add refresh token support
3. Implement role-based access control
4. Maintain backward compatibility
5. Add comprehensive tests

Please analyze the current code and suggest a migration plan.
```

---

### 5. Diff Preview

**What it does:**
- Before changing files, Claude shows you exactly what will change
- You can review line-by-line diffs
- Accept or reject changes

**Example output:**
```diff
File: src/auth.js
- const session = require('express-session')
+ const jwt = require('jsonwebtoken')

File: src/routes/login.js
- req.session.userId = user.id
+ const token = jwt.sign({ userId: user.id }, SECRET)
+ res.cookie('token', token, { httpOnly: true })
```

You'll be prompted: `Apply these changes? (yes/no)`

---

### 6. Command Reference

**Built-in commands:**
- `/help` - Show available commands
- `/clear` - Clear the screen
- `/exit` or Ctrl+D - Exit Claude Code session
- `/undo` - Undo last file changes
- `/diff` - Show pending diffs again

---

### 7. Smart Context Management

**What it does:**
- Claude automatically includes relevant files in context
- Focuses on files most relevant to your request
- Manages token limits efficiently

**Example:**
If you ask about "authentication", Claude will prioritize:
- Files with "auth" in the name
- Recently modified files
- Files in common authentication directories

</details>

---

## Your First Claude Code Session

<details>
<summary><strong>Click to expand Your First Session Guide</strong></summary>

Let's walk through a complete Claude Code session step-by-step!

### Step 1: Navigate to a Project

```bash
# Navigate to your project directory
cd /path/to/your/project

# Or create a test project
mkdir claude-test
cd claude-test
```

### Step 2: Start Claude Code

```bash
claude
```

You'll see:
```
Claude Code v1.2.3
Ready to assist with your coding! Type /help for commands or start asking questions.

Claude Code>
```

### Step 3: Try Basic Prompts

**Ask for help understanding code:**
```
Claude Code> what files are in this project?
```

**Create a new file:**
```
Claude Code> create a simple Express.js server with a /health endpoint
```

**Get explanations:**
```
Claude Code> explain how JWT authentication works
```

### Step 4: Use Ctrl+G for Complex Requests

**Press Ctrl+G** (or Cmd+G on Mac) and write:
```
I'm building a REST API for a todo application. Please create:

1. A basic Express.js server setup
2. Todo model with:
   - id, title, description, completed, createdAt
3. CRUD endpoints:
   - GET /todos (list all)
   - GET /todos/:id (get one)
   - POST /todos (create)
   - PUT /todos/:id (update)
   - DELETE /todos/:id (delete)
4. Basic error handling
5. Input validation

Structure the code with proper separation of concerns.
```

**Save and close your editor.** Claude will process your request and generate the files!

### Step 5: Review and Apply Changes

Claude will show you:
```
I'll create the following files:

File: server.js
[shows content]

File: models/todo.js
[shows content]

File: routes/todos.js
[shows content]

Apply these changes? (yes/no/edit)
```

**Type `yes` and press Enter** to apply changes.

### Step 6: Iterate

```
Claude Code> add input validation for the POST endpoint
```

Claude will show a diff and you can review before applying.

### Step 7: Exit

When done:
```
Claude Code> /exit
```

Or press **Ctrl+D**.

🎉 **Congratulations!** You've completed your first Claude Code session!

</details>

---

## Final Verification Checklist

<details>
<summary><strong>Click to expand Verification Checklist</strong></summary>

Let's make sure everything is working:

- [ ] **`claude --version` shows version number**
  - Open terminal and run `claude --version`
  - Should show: `claude-code version X.X.X`

- [ ] **`claude auth status` shows authenticated**
  - Run `claude auth status`
  - Should show: `✓ Authenticated as [your-email]`

- [ ] **Basic prompt works**
  - Run `claude "hello"`
  - Should get a friendly response from Claude

- [ ] **Ctrl+G opens your editor**
  - Run `claude` to start a session
  - Press Ctrl+G (or Cmd+G on Mac)
  - Your configured editor should open

- [ ] **Claude Code can read project files**
  - Navigate to a project directory
  - Run `claude "what files are in this project?"`
  - Claude should list your files

- [ ] **Diff preview works**
  - Ask Claude to modify a file
  - Should see diff preview before applying

- [ ] **Help command works**
  - In a Claude Code session, type `/help`
  - Should see list of available commands

✅ **All checked?** Great job! You're ready to use Claude Code!

❌ **Something not working?** Check the troubleshooting section below.

</details>

---

## Troubleshooting

<details>
<summary><strong>Click to expand Troubleshooting Guide (All Platforms)</strong></summary>

### Troubleshooting Windows

#### "claude is not recognized as a command"

**Problem**: Windows can't find the `claude` command.

**Solutions:**

1. **Restart PowerShell completely**
   - Close ALL PowerShell windows
   - Open a NEW PowerShell window
   - Try `claude --version` again

2. **Check if PATH was updated**
   - Run: `$env:PATH -split ';' | Select-String 'claude'`
   - Should see a path containing "claude"
   - If not found, reinstall Claude Code

3. **Try full path**
   - Run: `Get-Command claude`
   - Note the full path shown
   - Try running: `C:\Users\YourName\AppData\Local\Programs\claude\claude.exe --version`
   - If this works, PATH wasn't updated correctly

4. **Reinstall using npm method**
   - Uninstall: `npm uninstall -g @anthropic-ai/claude-code`
   - Reinstall: `npm install -g @anthropic-ai/claude-code`

---

### Troubleshooting macOS/Linux

#### "claude: command not found"

**Problem**: The shell can't find the `claude` command.

**Solutions:**

1. **Check installation location**
   ```bash
   which claude
   ```
   If nothing appears, Claude Code isn't in PATH.

2. **Verify installation**
   ```bash
   ls -la ~/.local/bin/claude  # or
   ls -la /usr/local/bin/claude
   ```

3. **Add to PATH manually**

   **For zsh:**
   ```bash
   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

   **For bash:**
   ```bash
   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bash_profile
   source ~/.bash_profile
   ```

4. **Reinstall**
   ```bash
   curl -fsSL https://claude.ai/install.sh | sh
   ```

---

### Troubleshooting Authentication

#### "Authentication failed" or "Invalid API key"

**Problem**: Claude Code can't authenticate with Anthropic's servers.

**Solutions:**

1. **Try authentication again**
   ```bash
   claude auth logout
   claude auth login
   ```

2. **Check Anthropic account status**
   - Visit https://console.anthropic.com/
   - Make sure you're logged in
   - Check if your account is active
   - Verify billing settings (if required)

3. **Clear credentials and re-authenticate**

   **Windows:**
   ```powershell
   Remove-Item -Force "$env:USERPROFILE\.claude\credentials"
   claude auth login
   ```

   **macOS/Linux:**
   ```bash
   rm -f ~/.claude/credentials
   claude auth login
   ```

4. **Check network/firewall**
   - Ensure you can access https://api.anthropic.com
   - Check if corporate firewall blocks API access
   - Try from different network

5. **Verify account limits**
   - Visit https://console.anthropic.com/settings/limits
   - Check if you've hit API rate limits
   - Verify billing is set up correctly

---

### "Ctrl+G doesn't open my editor"

**Problem**: Pressing Ctrl+G does nothing or shows an error.

**Solutions:**

1. **Check EDITOR variable is set**

   **Windows:**
   ```powershell
   echo $env:EDITOR
   ```

   **macOS/Linux:**
   ```bash
   echo $EDITOR
   ```

   Should show something like `code --wait`

2. **Verify editor is in PATH**

   **Test if editor command works:**
   ```bash
   code --version  # for VS Code
   vim --version   # for Vim
   ```

3. **Reset EDITOR variable**

   **Windows:**
   ```powershell
   [Environment]::SetEnvironmentVariable("EDITOR", "notepad", "User")
   ```

   **macOS/Linux:**
   ```bash
   export EDITOR="nano"
   echo 'export EDITOR="nano"' >> ~/.zshrc
   source ~/.zshrc
   ```

   Try with a simple editor first (Notepad/nano) to verify Ctrl+G works.

4. **Restart Claude Code session**
   - Exit Claude Code completely (Ctrl+D or `/exit`)
   - Start a new session: `claude`
   - Try Ctrl+G again

---

### "npm install fails with permission errors"

**Problem**: npm can't install Claude Code globally due to permissions.

**Solutions:**

1. **Use npm with sudo (Linux/macOS only)**
   ```bash
   sudo npm install -g @anthropic-ai/claude-code
   ```

2. **Configure npm to use a different directory (recommended)**

   **Create a directory for global packages:**
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   ```

   **Add to PATH:**

   **zsh:**
   ```bash
   echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

   **bash:**
   ```bash
   echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bash_profile
   source ~/.bash_profile
   ```

   **Now install without sudo:**
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

3. **Use the curl/PowerShell installation method instead**
   - This avoids npm entirely
   - See installation sections above

</details>

---

## Common Pitfalls Reference

<details>
<summary><strong>Click to expand Common Pitfalls Quick Reference</strong></summary>

Quick reference for the most common issues:

| Problem | Quick Fix |
|---------|-----------|
| **"Command not found"** | 1. Close terminal completely<br>2. Open NEW terminal<br>3. Try again |
| **"Authentication failed"** | 1. Run `claude auth logout`<br>2. Run `claude auth login`<br>3. Follow browser flow |
| **"Ctrl+G doesn't work"** | 1. Verify: `echo $EDITOR` shows editor<br>2. Set: `export EDITOR="nano"`<br>3. Restart Claude session |
| **"Can't read project files"** | Make sure you're IN the project directory: `cd /path/to/project` |
| **"npm permission errors"** | Use curl/PowerShell install method instead, or configure npm directory |
| **"Which install method?"** | PowerShell/curl (recommended) unless you specifically need npm |

</details>

---

## Still Stuck? How to Get AI Help

<details>
<summary><strong>Click to expand AI Prompting Tips</strong></summary>

If you've tried everything in the troubleshooting guide and you're still stuck, here's how to get help from AI assistants:

### 🎯 How to Ask for Help Effectively

**1. Describe Your Exact Situation**

Instead of: *"Claude Code doesn't work"*

Try: *"I'm on Windows 11. I installed Claude Code via PowerShell script successfully, but when I type 'claude --version' in PowerShell, I get 'command not found' error. I've restarted PowerShell three times and tried opening a new admin PowerShell window."*

**2. Include What You've Already Tried**

*"I've already tried:*
- *Reinstalling Claude Code with the PowerShell script*
- *Restarting PowerShell completely*
- *Running `$env:PATH -split ';'` to check PATH*
- *The PATH doesn't show any claude directory"*

**3. Share Error Messages Word-for-Word**

Copy and paste the exact error:
```
PS C:\Users\YourName> claude --version
claude : The term 'claude' is not recognized as the name of a cmdlet, function,
script file, or operable program.
```

**4. Mention Your Setup Details**

- Operating System and version (Windows 11, macOS Sonoma 14.2, Ubuntu 22.04)
- Installation method used (PowerShell script, curl script, npm)
- Node.js version if using npm (`node --version`)
- Shell type (PowerShell, zsh, bash)

### 📝 Example Prompts That Work Well

**For Installation Issues:**
```
"I'm installing Claude Code on macOS Ventura using the curl script method.
I ran 'curl -fsSL https://claude.ai/install.sh | sh' and it completed with
'installed successfully' message. However, when I run 'claude --version' I get
'command not found'. I've closed and reopened Terminal twice.

Output of 'which claude': (empty, nothing)
Output of 'echo $PATH': /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

What should I check next?"
```

**For Authentication Problems:**
```
"I'm trying to authenticate Claude Code on Windows 11. When I run 'claude auth login',
my browser opens to Anthropic's website, I successfully log in and click 'Authorize',
the browser shows 'Authentication successful', but when I switch back to PowerShell,
it shows 'Error: authentication failed - invalid response'.

I've tried:
- Logging out and back in on Anthropic's website
- Running 'claude auth logout' then 'claude auth login' again
- Using a different browser (Chrome instead of Edge)

How can I fix this authentication issue?"
```

**For Editor Integration Issues:**
```
"I'm on macOS with zsh shell and VS Code installed. I ran:
echo 'export EDITOR=\"code --wait\"' >> ~/.zshrc
source ~/.zshrc

When I check: echo $EDITOR shows 'code --wait' correctly.
When I check: code --version shows VS Code is installed and in PATH.

However, when I start a Claude Code session with 'claude' and press Ctrl+G
(actually Cmd+G on Mac), nothing happens. No editor opens, no error message.

What else should I verify for the Ctrl+G feature?"
```

### 🔍 Information to Gather Before Asking

Run these commands and include the output in your question:

**Windows PowerShell:**
```powershell
# System information
$PSVersionTable.PSVersion
node --version  # if using npm
npm --version  # if using npm

# Claude Code information
claude --version
where.exe claude

# Environment variables
echo $env:EDITOR
echo $env:PATH | Select-String "claude"
```

**macOS/Linux Terminal:**
```bash
# System information
uname -a
node --version  # if using npm
npm --version  # if using npm
echo $SHELL

# Claude Code information
claude --version
which claude
ls -la ~/.local/bin/claude  # or /usr/local/bin/claude

# Environment variables
echo $EDITOR
echo $PATH | grep -i claude

# Authentication status
claude auth status
```

### 💡 Template for Getting Help

Copy this template and fill in your details:

```
**Operating System:** [Windows 11 / macOS Sonoma 14.2 / Ubuntu 22.04]
**Installation Method:** [PowerShell script / curl script / npm]
**Node.js Version:** [if using npm: node --version output]
**Claude Code Version:** [claude --version output, or "not working"]
**Shell/Terminal:** [PowerShell / zsh / bash]

**Problem Description:**
[Describe exactly what's not working]

**What I've Tried:**
1. [First thing you tried]
2. [Second thing you tried]
3. [Third thing you tried]

**Error Messages:**
```
[Paste exact error messages here]
```

**Command Outputs:**
```
[Paste diagnostic command outputs here]
```

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]
```

### 🤖 Where to Get Help

- **Claude Code itself**: Start a session and ask! `claude "help me troubleshoot installation"`
- **ChatGPT**: https://chat.openai.com - paste the template above
- **Google Gemini**: https://gemini.google.com - paste your detailed question
- **Anthropic Discord**: Official Anthropic community (check docs for invite link)
- **Stack Overflow**: Search first, then ask with [claude-code] tag
- **GitHub Discussions**: https://github.com/anthropics/claude-code/discussions

### 🚨 Common Mistakes When Asking for Help

❌ **"It doesn't work"** - Too vague
✅ **"When I press Ctrl+G in Claude Code on Windows 11, VS Code doesn't open, but 'code --version' works fine in PowerShell"**

❌ **"I get an error"** - Need details
✅ **"I get 'authentication failed - invalid API key' when running 'claude auth status' after successfully completing browser authentication flow on macOS"**

❌ **"Help please!"** - No context
✅ **"I followed Step 3 of the Windows installation guide (PowerShell script method). The install completed successfully, but 'claude --version' returns 'command not found'. Output of 'where.exe claude': (nothing). Do I need to manually add to PATH?"**

### 💪 You've Got This!

Remember:
- AI assistants (including Claude Code itself!) can help with installation issues
- The more specific your question, the better the answer
- Include what you've already tried - it saves time
- Error messages are valuable - always include them
- It's okay to ask follow-up questions if the first answer doesn't solve it

</details>

---

## You Did It!

<details>
<summary><strong>Click to expand Success Guide & Next Steps</strong></summary>

🎉 Congratulations! You've successfully installed Claude Code and set up AI-assisted development!

### What You Can Do Now

1. **Use Claude Code for AI-assisted coding**
   - Navigate to any project: `cd /path/to/project`
   - Start a session: `claude`
   - Ask for help: `claude "explain this codebase"`

2. **Use Ctrl+G for complex prompts**
   - Press Ctrl+G (or Cmd+G) in any Claude session
   - Write detailed prompts in your editor
   - Save and close to send

3. **Let Claude modify multiple files**
   - Ask for refactoring across your codebase
   - Review diffs before applying
   - Iterate on changes interactively

4. **Explore Claude Code commands**
   - Type `/help` in a session to see all commands
   - Use `/clear` to clear the screen
   - Use `/undo` to revert changes

### Verify Your Success

Test these three things to confirm everything works:

```bash
# 1. Check Claude Code is installed
claude --version

# 2. Test authentication
claude auth status

# 3. Start an interactive session
claude "hello, let's code together!"
```

All three working? Perfect!

### Next Steps: Learning Claude Code

Now that Claude Code is installed, here are great resources to learn more:

**📚 Official Claude Code Resources:**

- **Documentation Home**: https://docs.anthropic.com/en/docs/claude-code
- **Getting Started Guide**: https://docs.anthropic.com/en/docs/claude-code/getting-started
- **Video Tutorials**: https://docs.anthropic.com/en/docs/claude-code/tutorials
- **Best Practices**: https://docs.anthropic.com/en/docs/claude-code/best-practices
- **Command Reference**: https://docs.anthropic.com/en/docs/claude-code/commands
- **Tips and Tricks**: https://docs.anthropic.com/en/docs/claude-code/tips
- **FAQ**: https://docs.anthropic.com/en/docs/claude-code/faq

**Essential First Steps:**

1. **Read the Getting Started guide** (link above)
2. **Try the interactive tutorial** (run `claude tutorial`)
3. **Practice with Ctrl+G** on small projects first
4. **Learn the built-in commands** (`/help` command)
5. **Understand the diff workflow** (review before applying)

### First Project Ideas

Try Claude Code on these beginner-friendly projects:

1. **Analyze an existing project**
   ```bash
   cd /path/to/your/project
   claude "analyze this codebase and suggest improvements"
   ```

2. **Create a simple API**
   ```bash
   mkdir todo-api && cd todo-api
   claude "create a REST API for a todo app with Express"
   ```

3. **Refactor legacy code**
   ```bash
   cd /path/to/legacy-project
   claude "help me refactor this to use modern JavaScript"
   ```

4. **Debug an issue**
   ```bash
   claude "I'm getting this error: [paste error]. Help me debug it"
   ```

5. **Write tests**
   ```bash
   claude "write unit tests for the authentication module"
   ```

### Additional Configuration

**Customize Claude Code:**

**Set default model (if you have access to multiple):**
```bash
claude config set model claude-3-opus-20240229
```

**Set context window preferences:**
```bash
claude config set max-tokens 100000
```

**Configure diff display:**
```bash
claude config set diff-style unified
```

**View all settings:**
```bash
claude config list
```

</details>

---

## Additional Resources

<details>
<summary><strong>Click to expand Additional Resources</strong></summary>

### Official Documentation Links

All official Anthropic Claude Code documentation:

- **Main Documentation**: https://docs.anthropic.com/en/docs/claude-code
- **Setup Overview**: https://docs.anthropic.com/en/docs/claude-code/setup
- **Getting Started**: https://docs.anthropic.com/en/docs/claude-code/getting-started
- **Windows Setup**: https://docs.anthropic.com/en/docs/claude-code/setup/windows
- **macOS Setup**: https://docs.anthropic.com/en/docs/claude-code/setup/macos
- **Linux Setup**: https://docs.anthropic.com/en/docs/claude-code/setup/linux
- **Authentication**: https://docs.anthropic.com/en/docs/claude-code/authentication
- **Editor Integration**: https://docs.anthropic.com/en/docs/claude-code/editor-integration
- **Command Reference**: https://docs.anthropic.com/en/docs/claude-code/commands
- **Best Practices**: https://docs.anthropic.com/en/docs/claude-code/best-practices
- **API Documentation**: https://docs.anthropic.com/en/api
- **FAQ**: https://docs.anthropic.com/en/docs/claude-code/faq
- **Troubleshooting**: https://docs.anthropic.com/en/docs/claude-code/troubleshooting

### Community Support

- **Anthropic Discord**: Official community server (check docs for invite)
- **GitHub Discussions**: https://github.com/anthropics/claude-code/discussions
- **Stack Overflow**: Questions tagged [claude-code]
- **Reddit**: r/ClaudeAI community

### Related Tools

Claude Code works great with these tools:

- **VS Code**: Your editor for Ctrl+G - https://code.visualstudio.com/
- **Git**: Version control for your AI-assisted changes - https://git-scm.com/
- **Docker**: For containerized development - https://www.docker.com/
- **GitHub Copilot**: Complementary AI coding tool - https://github.com/features/copilot

### Alternative AI Coding Tools

If you want to explore other AI coding assistants:

- **GitHub Copilot**: AI pair programmer in your IDE
- **Cursor**: AI-powered code editor
- **Tabnine**: AI code completion
- **Amazon CodeWhisperer**: AWS's AI coding companion
- **Codeium**: Free AI code completion

</details>

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-14 | Initial comprehensive guide created with collapsible sections and AI help |

---

**Questions or Issues?**

If you encounter problems not covered in this guide:
1. Check the [official troubleshooting docs](https://docs.anthropic.com/en/docs/claude-code/troubleshooting)
2. Search [GitHub Discussions](https://github.com/anthropics/claude-code/discussions)
3. Ask in the Anthropic Discord community
4. Use the "Still Stuck? How to Get AI Help" section above

**Built for MACA Course students by Claude Agent**

---

*This guide was created to help beginners get started with Claude Code and AI-assisted development. Welcome to the future of coding!*
