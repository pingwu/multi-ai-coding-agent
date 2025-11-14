# Visual Studio Code Installation Guide

A complete guide for installing VS Code and configuring it for use with Claude Code and AI development workflows.

---

## 🚀 Quick Setup for Experienced Users

<details>
<summary><strong>Click to expand Quick Start Guide</strong></summary>

### Official Documentation

- **Main docs**: https://code.visualstudio.com/docs
- **Setup Guide**: https://code.visualstudio.com/docs/setup/setup-overview
- **Windows**: https://code.visualstudio.com/docs/setup/windows
- **macOS**: https://code.visualstudio.com/docs/setup/mac
- **Linux**: https://code.visualstudio.com/docs/setup/linux
- **CLI Reference**: https://code.visualstudio.com/docs/editor/command-line

### Windows 11 Speed Run

```powershell
# 1. Download: https://code.visualstudio.com/download (System Installer)
# 2. Install with "Add to PATH" ✓ checked
# 3. Set default editor: Settings → Default Apps → .txt → VS Code
# 4. Git configuration
git config --global core.editor "code --wait"

# 5. Environment variables
setx EDITOR "code --wait"
setx VISUAL "code --wait"

# 6. Verify installation
code --version
echo %EDITOR%
```

### macOS Speed Run

```bash
# 1. Download: https://code.visualstudio.com/download (Universal build)
# 2. Drag to Applications folder
# 3. Enable shell command: Cmd+Shift+P → "Shell Command: Install 'code'"
# 4. Git configuration
git config --global core.editor "code --wait"

# 5. Environment variables
echo 'export EDITOR="code --wait"' >> ~/.zshrc
echo 'export VISUAL="code --wait"' >> ~/.zshrc
source ~/.zshrc

# 6. Verify installation
code --version
echo $EDITOR
```

### Claude Code Integration Check

```bash
# Test that Ctrl+G opens VS Code:
export EDITOR="code --wait"  # macOS/Linux
# or
setx EDITOR "code --wait"    # Windows

# Restart Claude Code session if needed
```

**Not working?** Check [official troubleshooting](https://code.visualstudio.com/docs/setup/troubleshooting) or jump to the detailed guide below.

</details>

---

## Introduction

Welcome! This guide will help you install Visual Studio Code (VS Code) and set it up to work seamlessly with Claude Code. Don't worry if you've never used a command line or terminal before—we'll walk through every step together.

### What You'll Learn

By the end of this guide, you'll be able to:
- Install VS Code on your computer (Windows 11 or macOS)
- Open VS Code from anywhere using the terminal
- Set VS Code as your default text editor
- Use VS Code with Claude Code's powerful Ctrl+G feature
- Troubleshoot common installation issues

### Time Required

- **Experienced users**: 5-10 minutes (use Quick Start above)
- **First-time installation**: 20-30 minutes (follow detailed guide below)
- **No computer restarts required**

---

## 📑 Table of Contents

**Quick Navigation:**

- [🚀 Quick Setup for Experienced Users](#-quick-setup-for-experienced-users)
- [Introduction](#introduction)
- [📖 Glossary: Terms You'll See](#-glossary-terms-youll-see)
- [Prerequisites](#prerequisites)
  - [System Requirements](#system-requirements)
  - [What to Expect](#what-to-expect)

**Installation Instructions:**

- [Installation Guide](#installation-guide)
- [Windows 11 Installation](#windows-11-installation)
  - [Step 1: Download VS Code](#step-1-download-vs-code)
  - [Step 2: Run the Installer](#step-2-run-the-installer)
  - [Step 3: Installation Options](#step-3-installation-options-important)
  - [Step 4: Verify 'code' Command Works](#step-4-verify-code-command-works)
  - [Step 5: Set VS Code as Default Editor](#step-5-set-vs-code-as-default-editor-system-level)
  - [Step 6: Configure Git to Use VS Code](#step-6-configure-git-to-use-vs-code)
  - [Step 7: Set Environment Variables for Claude Code](#step-7-set-environment-variables-for-claude-code)
- [macOS Installation](#macos-installation)
  - [Step 1: Download VS Code](#step-1-download-vs-code-1)
  - [Step 2: Install VS Code](#step-2-install-vs-code)
  - [Step 3: Enable 'code' Command in Terminal](#step-3-enable-code-command-in-terminal)
  - [Step 4: Verify 'code' Command Works](#step-4-verify-code-command-works-1)
  - [Step 5: Set VS Code as Default Editor](#step-5-set-vs-code-as-default-editor-system-level-1)
  - [Step 6: Configure Git to Use VS Code](#step-6-configure-git-to-use-vs-code-1)
  - [Step 7: Set Environment Variables for Claude Code](#step-7-set-environment-variables-for-claude-code-1)

**Verification & Testing:**

- [Claude Code Integration Verification](#claude-code-integration-verification)
  - [Testing Ctrl+G Integration](#testing-ctrlg-integration)
  - [Manual Testing](#manual-testing)
- [Final Verification Checklist](#final-verification-checklist)

**Help & Support:**

- [Troubleshooting](#troubleshooting)
  - [Troubleshooting Windows](#troubleshooting-windows)
    - ["Code is not recognized" Error](#code-is-not-recognized-as-an-internal-or-external-command)
    - [Ctrl+G Doesn't Open VS Code](#ctrlg-doesnt-open-vs-code-in-claude-code)
    - [Antivirus Blocking Installation](#antivirus-blocking-installation)
  - [Troubleshooting macOS](#troubleshooting-macos)
    - ["Code: command not found" Error](#code-command-not-found)
    - [Cmd+G Doesn't Open VS Code](#cmdg-doesnt-open-vs-code-in-claude-code)
    - [Apple Silicon Specific Issues](#apple-silicon-m1m2m3-specific-issues)
    - [Gatekeeper Warnings](#gatekeeper-warnings)
  - [Troubleshooting Claude Code Integration](#troubleshooting-claude-code-integration)
- [Common Pitfalls Reference](#common-pitfalls-reference)

**Additional Information:**

- [You Did It!](#you-did-it)
  - [What You Can Do Now](#what-you-can-do-now)
  - [Verify Your Success](#verify-your-success)
  - [Next Steps: Learning VS Code](#next-steps-learning-vs-code)
- [Additional Resources](#additional-resources)
  - [Official Documentation Links](#official-documentation-links)
  - [Community Support](#community-support)
  - [Alternative Editors](#alternative-editors)
- [Version History](#version-history)

---

## 📖 Glossary: Terms You'll See

Before we begin, let's clarify some terms you'll encounter:

| Term | What It Means |
|------|---------------|
| **Terminal** | A text-based interface for giving commands to your computer (also called "Command Prompt" on Windows or "Terminal" on Mac) |
| **Shell** | The program that runs inside a terminal and interprets your commands (like PowerShell on Windows or zsh on Mac) |
| **Command Line** | Another name for the terminal—anywhere you type text commands |
| **PATH** | A list of folders your computer checks when you type a command, so it knows where to find programs |
| **Environment Variable** | A setting that tells programs on your computer how to behave (like EDITOR telling programs which text editor to use) |
| **VS Code** | Short for Visual Studio Code, a free code editor made by Microsoft |

📝 **Note**: Don't worry if these terms are confusing now—you'll understand them better as we go through the installation!

---

## Prerequisites

### System Requirements

**Windows 11:**
- Windows 11 (64-bit)
- 1.6 GHz or faster processor
- 1 GB of RAM minimum
- 200 MB of disk space

**macOS:**
- macOS 10.15 (Catalina) or later
- Intel chip or Apple Silicon (M1/M2/M3)
- 200 MB of disk space

📚 **Official System Requirements**: https://code.visualstudio.com/docs/supporting/requirements

### What to Expect

- **Download size**: ~80-120 MB (varies by platform)
- **Installation time**: 3-5 minutes
- **Additional setup**: 5-10 minutes
- **Restarts needed**: None

---

## Installation Guide

Choose your operating system below:

- [Windows 11 Installation](#windows-11-installation)
- [macOS Installation](#macos-installation)

---

## Windows 11 Installation

📚 **Official Windows Guide**: https://code.visualstudio.com/docs/setup/windows

### Step 1: Download VS Code

1. **Open your web browser** and go to: https://code.visualstudio.com/download

2. **Click the big blue button** that says "**Windows**" (it should automatically detect you're on Windows)

   ![Download page showing Windows button]

   📝 **Note**: You want the "System Installer" version (64-bit), which is the default download.

3. **Wait for the download to complete**
   - File name: `VSCodeSetup-x64-{version}.exe`
   - File size: ~90 MB
   - Download time: 1-3 minutes on typical internet speeds

🎯 **Quick Check**: Look in your Downloads folder—you should see a file named something like `VSCodeSetup-x64-1.85.0.exe`

### Step 2: Run the Installer

1. **Find the downloaded file** in your Downloads folder

2. **Double-click the installer file** to start installation

3. **Windows Security might ask "Do you want to allow this app to make changes?"**
   - Click **Yes**
   - This is normal for installing new software

   ⚠️ **Warning**: If your antivirus software blocks the installation, you may need to temporarily disable it or add an exception. VS Code is safe—it's made by Microsoft.

### Step 3: Installation Options (IMPORTANT!)

You'll see several screens during installation. Here's what to do on each:

#### License Agreement
- Read if you'd like, then click **I accept the agreement**
- Click **Next**

#### Select Destination Location
- Default location is fine: `C:\Program Files\Microsoft VS Code`
- Click **Next**

#### Select Start Menu Folder
- Default is fine: "Visual Studio Code"
- Click **Next**

#### Select Additional Tasks (CRITICAL STEP!)

**This is the most important screen!** Make sure to check these boxes:

- ✅ **Add "Open with Code" action to Windows Explorer file context menu**
  - *Why: Lets you right-click any file and open it in VS Code*

- ✅ **Add "Open with Code" action to Windows Explorer directory context menu**
  - *Why: Lets you right-click any folder and open it in VS Code*

- ✅ **Register Code as an editor for supported file types**
  - *Why: Allows VS Code to be your default editor*

- ✅ **Add to PATH (requires shell restart)**
  - **THIS IS CRITICAL!** *Why: Lets you type 'code' in any terminal to open VS Code*

![Installation options with checkboxes]

📝 **Note**: The "Add to PATH" option is essential for Claude Code integration. Make sure this is checked!

Click **Next** when all boxes are checked.

#### Ready to Install
- Review your choices
- Click **Install**
- Wait 1-2 minutes for installation to complete

#### Completing Setup
- ✅ **Check "Launch Visual Studio Code"** if you want to see it right away
- Click **Finish**

🎯 **Quick Check**: VS Code should open automatically if you checked the launch option. You'll see a blue-themed editor with a Welcome tab.

### Step 4: Verify 'code' Command Works

Now let's test if you can open VS Code from the command line:

1. **Open PowerShell or Command Prompt**
   - Press `Windows key + R`
   - Type `powershell` and press Enter
   - A blue or black window will appear with text

2. **Type this command and press Enter:**
   ```powershell
   code --version
   ```

3. **You should see output like:**
   ```
   1.85.0
   0ee08df0cf4527e40edc9aa28f4b5bd38bbff2b2
   x64
   ```

   ✅ **Success!** If you see version numbers, the `code` command is working!

   ❌ **If you see "command not found" or "not recognized":**
   - Close the PowerShell window completely
   - Open a NEW PowerShell window (the PATH update needs a fresh terminal)
   - Try `code --version` again
   - Still not working? See [Troubleshooting](#troubleshooting-windows) below

4. **Test opening VS Code from command line:**
   ```powershell
   code .
   ```
   This should open VS Code in your current folder.

🎯 **Quick Check**: A new VS Code window should open showing your current directory.

### Step 5: Set VS Code as Default Editor (System Level)

Let's make VS Code your default editor for text files:

1. **Open Windows Settings**
   - Press `Windows key + I`
   - Or right-click the Start button and choose "Settings"

2. **Navigate to Default Apps**
   - Click on **Apps** in the left sidebar
   - Click **Default apps**

3. **Set VS Code for text files**
   - Scroll down and click on **Choose default apps by file type**
   - Scroll to find `.txt`
   - Click on the current app (probably Notepad)
   - Select **Visual Studio Code** from the list

4. **Repeat for other file types** (optional but recommended):
   - `.md` (Markdown)
   - `.json`
   - `.xml`
   - `.log`
   - Any other text-based files you work with

📝 **Note**: You can always change this back later if needed.

### Step 6: Configure Git to Use VS Code

📚 **Official CLI Documentation**: https://code.visualstudio.com/docs/editor/command-line

If you have Git installed (used for version control), let's tell it to use VS Code:

1. **Open PowerShell** (Windows key + R, type `powershell`, press Enter)

2. **Run this command:**
   ```powershell
   git config --global core.editor "code --wait"
   ```

3. **Verify the setting:**
   ```powershell
   git config --global core.editor
   ```

   You should see: `code --wait`

📝 **Note**: The `--wait` flag tells Git to wait until you close the VS Code window before continuing. This is important for Git operations like commit messages.

⚠️ **Don't have Git installed?** That's okay! You can skip this step. If you install Git later, come back and run this command.

### Step 7: Set Environment Variables for Claude Code

📚 **Official Terminal Documentation**: https://code.visualstudio.com/docs/terminal/basics

This is the critical step for Claude Code integration:

1. **Open PowerShell as Administrator**
   - Press `Windows key`
   - Type `powershell`
   - Right-click on **Windows PowerShell**
   - Click **Run as administrator**
   - Click **Yes** when Windows asks for permission

2. **Set the EDITOR variable:**
   ```powershell
   setx EDITOR "code --wait"
   ```

   You should see: `SUCCESS: Specified value was saved.`

3. **Set the VISUAL variable:**
   ```powershell
   setx VISUAL "code --wait"
   ```

   You should see: `SUCCESS: Specified value was saved.`

4. **Close PowerShell completely and open a NEW one** (important!)

5. **Verify the environment variables:**
   ```powershell
   echo $env:EDITOR
   echo $env:VISUAL
   ```

   Both should show: `code --wait`

📝 **Why both EDITOR and VISUAL?** Some programs check EDITOR, others check VISUAL. Setting both ensures maximum compatibility.

🎯 **Quick Check**: After setting these variables and restarting Claude Code, pressing Ctrl+G should open VS Code with your prompt.

---

## macOS Installation

📚 **Official macOS Guide**: https://code.visualstudio.com/docs/setup/mac

### Step 1: Download VS Code

1. **Open your web browser** and go to: https://code.visualstudio.com/download

2. **Click the big blue button** that says "**Mac**"

   ![Download page showing Mac button]

   📝 **Note**: The "Universal" build works for both Intel Macs and Apple Silicon (M1/M2/M3).

3. **Wait for the download to complete**
   - File name: `VSCode-darwin-universal.zip`
   - File size: ~120 MB
   - Download time: 1-3 minutes on typical internet speeds

🎯 **Quick Check**: Look in your Downloads folder—you should see a file named `VSCode-darwin-universal.zip` and possibly an unzipped `Visual Studio Code.app`.

### Step 2: Install VS Code

1. **Find the downloaded file** in your Downloads folder
   - It might automatically unzip to show `Visual Studio Code.app`
   - If you see a `.zip` file, double-click it to unzip

2. **Drag the Visual Studio Code.app to your Applications folder**
   - Open a Finder window
   - Click on **Downloads** in the sidebar
   - Find `Visual Studio Code.app`
   - Drag it to **Applications** in the Finder sidebar

   ![Dragging VS Code to Applications]

3. **Open VS Code for the first time**
   - Go to your Applications folder
   - Double-click **Visual Studio Code**

4. **macOS Gatekeeper warning**
   - You might see: "Visual Studio Code is an app downloaded from the Internet. Are you sure you want to open it?"
   - Click **Open**
   - This is normal for apps downloaded from the web

   ⚠️ **If VS Code won't open**: Right-click (or Control-click) on Visual Studio Code.app and choose **Open**, then click **Open** again in the dialog.

🎯 **Quick Check**: VS Code should now be open, showing a Welcome tab with a blue theme.

### Step 3: Enable 'code' Command in Terminal

📚 **Official CLI Documentation**: https://code.visualstudio.com/docs/editor/command-line

This is critical for using VS Code from the command line and with Claude Code:

1. **With VS Code open, press these keys together:**
   - `Cmd + Shift + P` (⌘⇧P)
   - This opens the "Command Palette"

2. **Type:** `shell command`

3. **Click on:** **Shell Command: Install 'code' command in PATH**

   ![Command Palette showing shell command option]

4. **You should see a notification:**
   - "Shell command 'code' successfully installed in PATH"

   ⚠️ **Warning**: If you see an error about permissions, you may need to run VS Code with administrator privileges once. Close VS Code, open Terminal, and run:
   ```bash
   sudo /Applications/Visual\ Studio\ Code.app/Contents/Resources/app/bin/code
   ```
   Then try step 3 again.

### Step 4: Verify 'code' Command Works

Let's test if the `code` command works:

1. **Open Terminal**
   - Press `Cmd + Space` to open Spotlight
   - Type `terminal` and press Enter
   - Or find Terminal in Applications → Utilities

2. **Type this command and press Enter:**
   ```bash
   code --version
   ```

3. **You should see output like:**
   ```
   1.85.0
   0ee08df0cf4527e40edc9aa28f4b5bd38bbff2b2
   arm64
   ```

   ✅ **Success!** If you see version numbers, the `code` command is working!

   ❌ **If you see "command not found":**
   - Go back to Step 3 and try the Command Palette method again
   - Make sure you're using a NEW terminal window (close the old one completely)
   - Still not working? See [Troubleshooting](#troubleshooting-macos) below

4. **Test opening VS Code from command line:**
   ```bash
   code .
   ```
   This should open VS Code in your current folder.

🎯 **Quick Check**: A new VS Code window should open showing your current directory.

### Step 5: Set VS Code as Default Editor (System Level)

Let's make VS Code your default editor for text files:

#### Method 1: Using Finder (Easiest)

1. **Find any text file** (like a .txt file)
   - If you don't have one, create a test file:
     ```bash
     echo "test" > ~/Desktop/test.txt
     ```

2. **Right-click (or Control-click) the file**

3. **Choose "Get Info"** from the menu

4. **Find the "Open with:" section**
   - Click the dropdown menu
   - Select **Visual Studio Code**

5. **Click "Change All..."** button
   - This sets VS Code as default for all files of this type
   - Click **Continue** in the confirmation dialog

6. **Repeat for other file types** you use:
   - `.md` (Markdown files)
   - `.json`
   - `.log`
   - Any other text-based files

#### Method 2: Using duti (Advanced)

If you're comfortable with the command line, you can use `duti`:

```bash
# Install duti using Homebrew (if not already installed)
brew install duti

# Set VS Code as default for text files
duti -s com.microsoft.VSCode public.plain-text all
duti -s com.microsoft.VSCode public.data all
```

📝 **Note**: Method 1 is easier for beginners. Use Method 2 if you're familiar with Homebrew and command-line tools.

### Step 6: Configure Git to Use VS Code

📚 **Official CLI Documentation**: https://code.visualstudio.com/docs/editor/command-line

If you have Git installed, let's tell it to use VS Code:

1. **Open Terminal** (Cmd + Space, type "terminal", press Enter)

2. **Run this command:**
   ```bash
   git config --global core.editor "code --wait"
   ```

3. **Verify the setting:**
   ```bash
   git config --global core.editor
   ```

   You should see: `code --wait`

📝 **Note**: The `--wait` flag tells Git to wait until you close the VS Code window before continuing.

⚠️ **Don't have Git installed?** macOS usually comes with Git, but if you get "command not found", you can install it:
- Visit: https://git-scm.com/download/mac
- Or install via Homebrew: `brew install git`

### Step 7: Set Environment Variables for Claude Code

📚 **Official Terminal Documentation**: https://code.visualstudio.com/docs/terminal/basics

This is the critical step for Claude Code integration:

#### Determine Your Shell

First, let's see which shell you're using:

```bash
echo $SHELL
```

You'll see either:
- `/bin/zsh` → You're using zsh (default on modern macOS)
- `/bin/bash` → You're using bash (older macOS versions)

#### For zsh (Most Common)

1. **Open Terminal**

2. **Add EDITOR and VISUAL to your shell configuration:**
   ```bash
   echo 'export EDITOR="code --wait"' >> ~/.zshrc
   echo 'export VISUAL="code --wait"' >> ~/.zshrc
   ```

3. **Reload your shell configuration:**
   ```bash
   source ~/.zshrc
   ```

4. **Verify the environment variables:**
   ```bash
   echo $EDITOR
   echo $VISUAL
   ```

   Both should show: `code --wait`

#### For bash

1. **Open Terminal**

2. **Add EDITOR and VISUAL to your shell configuration:**
   ```bash
   echo 'export EDITOR="code --wait"' >> ~/.bash_profile
   echo 'export VISUAL="code --wait"' >> ~/.bash_profile
   ```

3. **Reload your shell configuration:**
   ```bash
   source ~/.bash_profile
   ```

4. **Verify the environment variables:**
   ```bash
   echo $EDITOR
   echo $VISUAL
   ```

   Both should show: `code --wait`

📝 **Why both EDITOR and VISUAL?** Different programs check different variables. Setting both ensures maximum compatibility.

🎯 **Quick Check**: After setting these variables and restarting Claude Code, pressing Ctrl+G should open VS Code with your prompt.

---

## Claude Code Integration Verification

Now let's test that everything works with Claude Code!

### Testing Ctrl+G Integration

1. **Make sure Claude Code is running**

2. **Press Ctrl+G** (or Cmd+G on Mac) while in Claude Code

3. **What should happen:**
   - VS Code should open immediately
   - A new file should appear with your prompt
   - You can edit the prompt in VS Code
   - Saving and closing VS Code sends the prompt to Claude

4. **If VS Code doesn't open:**
   - Check that environment variables are set (see steps above)
   - Make sure you've **completely restarted** Claude Code after setting variables
   - Try manually setting EDITOR in your current terminal:
     ```bash
     # macOS/Linux
     export EDITOR="code --wait"

     # Windows PowerShell
     $env:EDITOR = "code --wait"
     ```
   - See [Troubleshooting](#troubleshooting-claude-code-integration) below

### Manual Testing

You can also test VS Code as an editor manually:

**macOS/Linux:**
```bash
EDITOR="code --wait" code temp.txt
```

**Windows PowerShell:**
```powershell
$env:EDITOR = "code --wait"; code temp.txt
```

If VS Code opens `temp.txt` and your terminal waits until you close VS Code, it's working correctly!

---

## Final Verification Checklist

Let's make sure everything is working:

- [ ] **VS Code opens from Start Menu/Applications**
  - Windows: Start Menu → Visual Studio Code
  - Mac: Applications → Visual Studio Code

- [ ] **Typing `code` in terminal opens VS Code**
  ```bash
  code --version
  ```

- [ ] **Typing `code .` opens current directory in VS Code**
  ```bash
  cd ~
  code .
  ```

- [ ] **Ctrl+G in Claude Code opens prompt in VS Code**
  - Press Ctrl+G (or Cmd+G) in Claude Code
  - VS Code should open with prompt

- [ ] **Double-clicking a .txt file opens in VS Code** (if set as default)
  - Create a test file and double-click it
  - VS Code should open the file

✅ **All checked?** Great job! You're ready to use VS Code with Claude Code!

❌ **Something not working?** Check the troubleshooting section below.

---

## Troubleshooting

### Troubleshooting Windows

#### "Code is not recognized as an internal or external command"

**Problem**: The `code` command doesn't work in PowerShell or Command Prompt.

**Solutions:**

1. **Restart your terminal completely**
   - Close ALL PowerShell/Command Prompt windows
   - Open a fresh new window
   - Try `code --version` again

2. **Check if PATH was added during installation**
   - Search for "Environment Variables" in Windows Search
   - Click "Edit the system environment variables"
   - Click "Environment Variables..." button
   - Look in "System variables" for "Path"
   - Double-click "Path" and look for an entry like:
     `C:\Program Files\Microsoft VS Code\bin`
   - **If missing**: Click "New" and add that path manually
   - Click OK on all dialogs
   - Restart terminal and try again

3. **Reinstall VS Code with PATH option**
   - Uninstall VS Code via Settings → Apps
   - Download installer again
   - During installation, make SURE "Add to PATH" is checked
   - Complete installation

4. **Manual PATH fix**
   - Open PowerShell as Administrator
   - Run:
     ```powershell
     [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\Microsoft VS Code\bin", "Machine")
     ```
   - Restart terminal

📚 **Official Troubleshooting**: https://code.visualstudio.com/docs/setup/windows#_installation

#### "Ctrl+G doesn't open VS Code in Claude Code"

**Problem**: You press Ctrl+G but VS Code doesn't open.

**Solutions:**

1. **Verify environment variables are set**
   ```powershell
   echo $env:EDITOR
   echo $env:VISUAL
   ```
   Both should show `code --wait`

2. **If not set, set them again**
   ```powershell
   setx EDITOR "code --wait"
   setx VISUAL "code --wait"
   ```

3. **Completely restart Claude Code**
   - Don't just close the window
   - End the process completely
   - Start Claude Code fresh

4. **Try manually in terminal first**
   ```powershell
   $env:EDITOR = "code --wait"
   code test.txt
   ```
   If this works, the issue is with persistence of environment variables.

#### Antivirus Blocking Installation

**Problem**: Your antivirus software prevents VS Code installation.

**Solutions:**

1. **Temporarily disable antivirus**
   - Disable for 10 minutes
   - Install VS Code
   - Re-enable antivirus

2. **Add exception for VS Code**
   - Add `C:\Program Files\Microsoft VS Code\` to antivirus exceptions
   - Retry installation

3. **Download from official source**
   - Make sure you're downloading from https://code.visualstudio.com/download
   - Verify the file isn't corrupted

### Troubleshooting macOS

#### "Code: command not found"

**Problem**: The `code` command doesn't work in Terminal.

**Solutions:**

1. **Use Command Palette method again**
   - Open VS Code
   - Press `Cmd + Shift + P`
   - Type: `shell command`
   - Click: "Shell Command: Install 'code' command in PATH"

2. **Check if code symlink exists**
   ```bash
   ls -la /usr/local/bin/code
   ```
   If you see "No such file or directory", the symlink wasn't created.

3. **Manually create the symlink**
   ```bash
   sudo rm -f /usr/local/bin/code
   sudo ln -s "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" /usr/local/bin/code
   ```
   Enter your password when prompted.

4. **Verify /usr/local/bin is in PATH**
   ```bash
   echo $PATH
   ```
   You should see `/usr/local/bin` in the output.

   **If missing**, add it:
   ```bash
   echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

5. **Try absolute path**
   ```bash
   /Applications/Visual\ Studio\ Code.app/Contents/Resources/app/bin/code --version
   ```
   If this works, it's a PATH issue.

📚 **Official Troubleshooting**: https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line

#### "Cmd+G doesn't open VS Code in Claude Code"

**Problem**: You press Cmd+G but VS Code doesn't open.

**Solutions:**

1. **Verify environment variables**
   ```bash
   echo $EDITOR
   echo $VISUAL
   ```
   Both should show `code --wait`

2. **Re-add to shell configuration**
   ```bash
   # For zsh (most common)
   echo 'export EDITOR="code --wait"' >> ~/.zshrc
   echo 'export VISUAL="code --wait"' >> ~/.zshrc
   source ~/.zshrc

   # For bash
   echo 'export EDITOR="code --wait"' >> ~/.bash_profile
   echo 'export VISUAL="code --wait"' >> ~/.bash_profile
   source ~/.bash_profile
   ```

3. **Completely restart Claude Code**
   - Quit Claude Code completely (Cmd+Q)
   - Restart from Applications folder

4. **Test manually first**
   ```bash
   EDITOR="code --wait" code test.txt
   ```

#### Apple Silicon (M1/M2/M3) Specific Issues

**Problem**: VS Code runs slowly or won't start on Apple Silicon Macs.

**Solutions:**

1. **Make sure you downloaded Universal build**
   - Check: https://code.visualstudio.com/download
   - Download "Universal" not "Intel chip"

2. **Rosetta 2 might be needed** (rare)
   ```bash
   softwareupdate --install-rosetta
   ```

3. **Check if running under Rosetta**
   - Open Activity Monitor
   - Find "Code"
   - If "Kind" shows "Intel", you're using Intel version
   - Download Universal version for better performance

#### Gatekeeper Warnings

**Problem**: macOS won't let you open VS Code.

**Solutions:**

1. **Standard bypass**
   - Right-click (Control-click) Visual Studio Code.app
   - Choose **Open** from menu
   - Click **Open** in the dialog

2. **System Settings approach**
   - Go to System Settings → Privacy & Security
   - Find message about Visual Studio Code
   - Click **Open Anyway**

3. **Remove quarantine attribute**
   ```bash
   xattr -d com.apple.quarantine "/Applications/Visual Studio Code.app"
   ```

### Troubleshooting Claude Code Integration

#### VS Code Opens But Claude Code Gets Stuck

**Problem**: Pressing Ctrl+G opens VS Code, but Claude Code waits forever.

**Solution:**

Make sure you're using `code --wait` not just `code`:

```bash
# Correct (with --wait)
export EDITOR="code --wait"

# Wrong (without --wait)
export EDITOR="code"  # ❌ Don't use this
```

The `--wait` flag tells VS Code to keep the terminal waiting until you close the file.

#### Multiple VS Code Windows Open

**Problem**: Each Ctrl+G press opens a new VS Code window.

**Solution:**

This is expected behavior. Close the previous prompt file before creating a new one, or configure VS Code to reuse windows:

1. Open VS Code settings (Cmd/Ctrl + ,)
2. Search for "window.openFilesInNewWindow"
3. Set to "off"

#### Environment Variables Don't Persist

**Problem**: Variables work in current terminal but not after restart.

**Windows Solution:**
```powershell
# Use setx (not $env:)
setx EDITOR "code --wait"
setx VISUAL "code --wait"
```

**macOS Solution:**
```bash
# Make sure you're editing the right file
# For zsh (default on new macOS)
echo 'export EDITOR="code --wait"' >> ~/.zshrc

# For bash (older macOS)
echo 'export EDITOR="code --wait"' >> ~/.bash_profile

# Then reload
source ~/.zshrc  # or source ~/.bash_profile
```

---

## You Did It!

🎉 Congratulations! You've successfully installed VS Code and integrated it with Claude Code!

### What You Can Do Now

1. **Use Ctrl+G in Claude Code** to write long prompts in VS Code
2. **Open any project folder** with `code .` from terminal
3. **Edit files from command line** with `code filename.txt`
4. **Set VS Code as your default editor** for all text files

### Verify Your Success

Test these three commands to confirm everything works:

```bash
# 1. Check VS Code is installed
code --version

# 2. Open VS Code in current directory
code .

# 3. Check environment variable
echo $EDITOR  # macOS/Linux
echo %EDITOR% # Windows
```

All three working? Perfect!

### Next Steps: Learning VS Code

Now that VS Code is installed, here are great resources to learn more:

📚 **Official VS Code Resources**

- **Documentation Home**: https://code.visualstudio.com/docs
- **Video Tutorials**: https://code.visualstudio.com/docs/getstarted/introvideos
- **Tips and Tricks**: https://code.visualstudio.com/docs/getstarted/tips-and-tricks
- **Interactive Tutorial**: Built into VS Code (Help → Welcome → Interactive Playground)
- **Keyboard Shortcuts**:
  - Windows: https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf
  - macOS: https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf

**Essential First Steps**:

1. **Take the interactive tutorial** (Help → Welcome → Interactive Playground)
2. **Learn keyboard shortcuts** for your platform
3. **Install useful extensions** (optional):
   - Python (if you code in Python)
   - GitLens (if you use Git)
   - Prettier (for code formatting)
4. **Set up Settings Sync** to backup your configuration: https://code.visualstudio.com/docs/editor/settings-sync

### Additional Configuration

**Customize VS Code**:
- Press `Cmd/Ctrl + ,` to open Settings
- Change theme: Search "Color Theme"
- Adjust font size: Search "Font Size"
- Enable autosave: Search "Auto Save"

**Install Extensions**:
- Click Extensions icon in left sidebar (or `Cmd/Ctrl + Shift + X`)
- Search for extensions by name
- Click Install

---

## Common Pitfalls Reference

Quick reference for the most common issues:

| Problem | Quick Fix |
|---------|-----------|
| **"Code not found"** | 1. Close terminal completely<br>2. Open NEW terminal<br>3. Try again |
| **"Ctrl+G doesn't work"** | 1. Verify: `echo $EDITOR` shows `code --wait`<br>2. Restart Claude Code completely<br>3. Try again |
| **"Accidentally closed installer"** | Just run the installer again—no harm done |
| **"Antivirus blocking"** | Temporarily disable antivirus, or add VS Code to exceptions |
| **"Don't see 'Add to PATH' option"** | You might have User Installer—download System Installer instead |
| **"VS Code opens but hangs"** | Make sure you used `code --wait` (with --wait) |

---

## Additional Resources

### Official Documentation Links

All official Microsoft VS Code documentation:

- **Main Documentation**: https://code.visualstudio.com/docs
- **Setup Overview**: https://code.visualstudio.com/docs/setup/setup-overview
- **Windows Setup**: https://code.visualstudio.com/docs/setup/windows
- **macOS Setup**: https://code.visualstudio.com/docs/setup/mac
- **Linux Setup**: https://code.visualstudio.com/docs/setup/linux
- **Command Line Interface**: https://code.visualstudio.com/docs/editor/command-line
- **Terminal Basics**: https://code.visualstudio.com/docs/terminal/basics
- **System Requirements**: https://code.visualstudio.com/docs/supporting/requirements
- **FAQ**: https://code.visualstudio.com/docs/supporting/faq
- **Troubleshooting**: https://code.visualstudio.com/docs/setup/troubleshooting
- **Alternative Builds**: https://code.visualstudio.com/docs/supporting/downloads
- **Insider Builds**: https://code.visualstudio.com/insiders/

### Community Support

- **Stack Overflow**: Questions tagged [visual-studio-code]
- **VS Code GitHub**: https://github.com/microsoft/vscode
- **Discord Community**: VS Code community server

### Alternative Editors

If VS Code doesn't work for you, Claude Code also supports:
- **Vim/Neovim**: Set `EDITOR=vim`
- **Nano**: Set `EDITOR=nano`
- **Sublime Text**: Set `EDITOR=subl --wait`
- **Any text editor that supports waiting mode**

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-13 | Initial comprehensive guide created |

---

**Questions or Issues?**

If you encounter problems not covered in this guide:
1. Check the [official troubleshooting docs](https://code.visualstudio.com/docs/setup/troubleshooting)
2. Search [Stack Overflow](https://stackoverflow.com/questions/tagged/visual-studio-code)
3. Visit the [VS Code GitHub issues](https://github.com/microsoft/vscode/issues)

**Built for MACA Course students by Claude Agent**

---

*This guide was created to help absolute beginners get started with VS Code and Claude Code integration. We hope it helps you on your journey to becoming an AI-assisted developer!*
