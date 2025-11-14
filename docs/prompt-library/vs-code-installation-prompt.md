# Prompt for Visual Studio Code Installation Documentation

Create a beginner-friendly, step-by-step installation guide for Visual Studio Code that assumes zero familiarity with command-line interfaces. The documentation should feel like a friendly teacher guiding someone who has never opened a terminal before.

**Key Design Principles:**
- Start with a quick reference for experienced users
- Use collapsible sections to reduce visual clutter
- Make it fool-proof with clear success indicators
- Include AI prompting tips for when users get stuck beyond troubleshooting

## Documentation Requirements:

### 🚀 Quick Start Guide (For Experienced Users)

Create a collapsed/expandable section at the very top titled "**Quick Setup for Experienced Users**" containing:

**Official Documentation:**

- Main docs: [https://code.visualstudio.com/docs](https://code.visualstudio.com/docs)
- Setup Guide: [https://code.visualstudio.com/docs/setup/setup-overview](https://code.visualstudio.com/docs/setup/setup-overview)
- Windows: [https://code.visualstudio.com/docs/setup/windows](https://code.visualstudio.com/docs/setup/windows)
- macOS: [https://code.visualstudio.com/docs/setup/mac](https://code.visualstudio.com/docs/setup/mac)
- Linux: [https://code.visualstudio.com/docs/setup/linux](https://code.visualstudio.com/docs/setup/linux)
- CLI Reference: [https://code.visualstudio.com/docs/editor/command-line](https://code.visualstudio.com/docs/editor/command-line)

**Windows 11 Speed Run:**

```
1. Download: https://code.visualstudio.com/download (System Installer)
2. Install with "Add to PATH" ✓ checked
3. Set default editor: Settings → Default Apps → .txt → VS Code
4. Git: git config --global core.editor "code --wait"
5. Environment: setx EDITOR "code --wait" && setx VISUAL "code --wait"
6. Verify: code --version && echo %EDITOR%
```

**macOS Speed Run:**

```
1. Download: https://code.visualstudio.com/download (Universal build)
2. Drag to Applications folder
3. Enable shell: Cmd+Shift+P → "Shell Command: Install 'code'"
4. Git: git config --global core.editor "code --wait"
5. Environment: echo 'export EDITOR="code --wait"' >> ~/.zshrc && source ~/.zshrc
6. Verify: code --version && echo $EDITOR
```

**Claude Code Integration Check:**

```
# Test Ctrl+G opens VS Code with:
export EDITOR="code --wait"  # or use 'setx' on Windows
# Restart Claude Code session if needed
```

Include a note: "**Not working?** Check [official troubleshooting](https://code.visualstudio.com/docs/setup/troubleshooting) or jump to the detailed guide below"

---

### Target Audience Definition (for main guide)

- Complete beginners who may have never installed development software
- Users who don't know what a "terminal," "shell," or "command line" means
- People who need visual cues and explanations for every step

### Structure Requirements:

**For BOTH Windows 11 and macOS sections, include:**

1. **Prerequisites Section**
    - System requirements in plain language
    - Link to official system requirements: [https://code.visualstudio.com/docs/supporting/requirements](https://code.visualstudio.com/docs/supporting/requirements)
    - What to expect during installation (time required, restarts needed)
    - Glossary box explaining: Terminal, Shell, Command Line, PATH, Environment Variable
2. **Download Instructions**
    - Direct URL to official download page: [https://code.visualstudio.com/download](https://code.visualstudio.com/download)
    - Alternative official builds page: [https://code.visualstudio.com/docs/supporting/downloads](https://code.visualstudio.com/docs/supporting/downloads)
    - Screenshot showing which button to click
    - How to verify they're downloading the correct version
    - File size expectations and download time estimates
    - Note about Insider builds: [https://code.visualstudio.com/insiders/](https://code.visualstudio.com/insiders/)
3. **Installation Process**
    - Link to platform-specific official guide at the top of each section
    - Screenshot for EVERY dialog box they'll encounter
    - Explain what each option means in simple terms
    - Highlight recommended settings with reasoning
    - Include "What if something goes wrong?" troubleshooting boxes
4. **Enabling 'code' Command in Terminal**
    - Official CLI documentation: [https://code.visualstudio.com/docs/editor/command-line](https://code.visualstudio.com/docs/editor/command-line)
    - First explain WHAT this enables: "Type 'code' anywhere to open VS Code"
    - Include a "Why this matters" box explaining the convenience
    - Platform-specific instructions:
        - **Windows**: How to add to PATH during installation (checkbox method)
        - **macOS**: Command Palette method (Cmd+Shift+P → "Shell Command: Install 'code' command")
    - Verification steps with expected output screenshots
    - Common issues and solutions (permission errors, PATH not updating)
5. **Setting VS Code as Default Editor**
    - Link to official integrated terminal docs: [https://code.visualstudio.com/docs/terminal/basics](https://code.visualstudio.com/docs/terminal/basics)
    - Explain what "default editor" means with real examples
    - System-level configuration:
        - **Windows**: Settings → Default Apps approach
        - **macOS**: File association and Info panel method
    - Git configuration: `git config --global core.editor "code --wait"`
    - Environment variable setup:
        - Show how to set EDITOR and VISUAL variables
        - Explain persistence across terminal sessions
6. **Claude Code Integration Verification**
    - Step-by-step test of Ctrl+G functionality
    - What should happen when it works correctly
    - Troubleshooting if VS Code doesn't open
    - Alternative: How to manually set `EDITOR=code` for Claude Code session

### Additional Resources Box

Include a prominent box with official resources:

**📚 Official VS Code Resources:**

- **Documentation Home**: [https://code.visualstudio.com/docs](https://code.visualstudio.com/docs)
- **Video Tutorials**: [https://code.visualstudio.com/docs/getstarted/introvideos](https://code.visualstudio.com/docs/getstarted/introvideos)
- **Tips and Tricks**: [https://code.visualstudio.com/docs/getstarted/tips-and-tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)
- **Keyboard Shortcuts**:
    - Windows: [https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)
    - macOS: [https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf)
- **Settings Sync**: [https://code.visualstudio.com/docs/editor/settings-sync](https://code.visualstudio.com/docs/editor/settings-sync)
- **FAQ**: [https://code.visualstudio.com/docs/supporting/faq](https://code.visualstudio.com/docs/supporting/faq)
- **Troubleshooting**: [https://code.visualstudio.com/docs/setup/troubleshooting](https://code.visualstudio.com/docs/setup/troubleshooting)

### Formatting Guidelines:

- **Quick Start section**: Use monospace fonts, compact layout, copy-paste friendly
- **Main guide**: Use friendly, encouraging language ("Great job getting this far!")
- Include "📝 Note" boxes for important tips
- Add "⚠️ Warning" boxes for common mistakes
- Create "🎯 Quick Check" sections after each major step
- Provide "🔧 Troubleshooting" expandable sections
- Use numbered lists with clear sub-steps
- Bold all button names and menu items
- Include keyboard shortcuts in `code blocks`
- Always link to relevant official documentation sections

### Collapsibility Requirements (CRITICAL for User Experience):

**Make ALL major sections collapsible using `<details>` tags to reduce visual clutter:**

1. **Table of Contents**: `<details><summary>Click to expand Table of Contents</summary>`
2. **Glossary**: `<details><summary>Click to expand Glossary</summary>`
3. **Prerequisites**: `<details><summary>Click to expand Prerequisites</summary>`
4. **Windows Installation**: `<details open><summary>Click to expand Windows 11 Installation (7 Steps)</summary>` (open by default)
5. **macOS Installation**: `<details open><summary>Click to expand macOS Installation (7 Steps)</summary>` (open by default)
6. **Claude Code Integration**: `<details><summary>Click to expand Claude Code Integration Testing</summary>`
7. **Verification Checklist**: `<details><summary>Click to expand Verification Checklist</summary>`
8. **Troubleshooting**: `<details><summary>Click to expand Troubleshooting Guide (Windows & macOS)</summary>`
9. **You Did It!**: `<details><summary>Click to expand Success Guide & Next Steps</summary>`
10. **Common Pitfalls**: `<details><summary>Click to expand Common Pitfalls Quick Reference</summary>`
11. **Additional Resources**: `<details><summary>Click to expand Additional Resources</summary>`

**Why this matters:**
- Reduces visual overwhelm for beginners
- Users can focus on their specific platform (Windows OR macOS)
- Makes 1000+ line document scannable
- Professional, fool-proof structure

### Visual Requirements:

- Annotated screenshots with arrows pointing to specific buttons
- Before/after terminal output examples
- Success confirmation screenshots
- Video links for complex sections (if available)

### Testing Checklist to Include:

Create a final verification checklist:

- [ ]  VS Code opens from Start Menu/Applications
- [ ]  Typing `code` in terminal opens VS Code
- [ ]  Typing `code .` opens current directory in VS Code
- [ ]  Ctrl+G in Claude Code opens prompt in VS Code
- [ ]  Double-clicking a .txt file opens in VS Code (if set as default)

### Common Pitfalls Section:

Address these specific scenarios:

- "I see 'command not found' when typing 'code'"
- "VS Code opens but not when I press Ctrl+G"
- "I accidentally closed the installer"
- "My antivirus is blocking the installation"
- "I don't see the option to add to PATH"

Link to official troubleshooting for each issue when available.

### "Still Stuck? How to Get AI Help" Section (CRITICAL):

After troubleshooting, add a comprehensive section teaching users how to ask AI assistants for help:

**Section Structure:**

1. **How to Ask for Help Effectively**
   - Describe exact situation (not vague "doesn't work")
   - Include what you've already tried
   - Share error messages word-for-word
   - Mention OS and version

2. **Example Prompts That Work Well**
   - For installation issues
   - For environment variable problems
   - For troubleshooting beyond the guide

3. **Information to Gather Before Asking**
   - Diagnostic commands for Windows (PowerShell)
   - Diagnostic commands for macOS (Terminal)
   - System information to include

4. **Template for Getting Help**
   ```
   Operating System: [...]
   Chip Architecture: [...]
   Shell/Terminal: [...]
   Problem Description: [...]
   What I've Tried: [...]
   Error Messages: [...]
   Command Outputs: [...]
   Expected Behavior: [...]
   Actual Behavior: [...]
   ```

5. **Where to Get AI Help**
   - Claude Code (Ctrl+G)
   - ChatGPT
   - Google Gemini
   - Stack Overflow
   - VS Code GitHub

6. **Common Mistakes When Asking for Help**
   - ❌ "It doesn't work" vs ✅ Specific description
   - ❌ "I get an error" vs ✅ Exact error message
   - ❌ "Help please!" vs ✅ Detailed context

**Why this section matters:**
- Teaches self-sufficiency with AI tools
- Reduces support burden
- Empowers users to solve novel problems
- Core skill for AI-assisted development

### Platform-Specific Considerations:

**Windows 11:**

- Official Windows setup: [https://code.visualstudio.com/docs/setup/windows](https://code.visualstudio.com/docs/setup/windows)
- PowerShell vs Command Prompt differences
- Windows Security notifications
- User Account Control prompts
- Microsoft Store version vs standalone installer

**macOS:**

- Official macOS setup: [https://code.visualstudio.com/docs/setup/mac](https://code.visualstudio.com/docs/setup/mac)
- Apple Silicon (M1/M2) vs Intel considerations
- Gatekeeper security warnings
- Rosetta 2 requirements (if applicable)
- zsh vs bash shell differences

### Success Metrics:

End with a "You Did It!" section that confirms:

- Three ways to verify successful installation
- What they can do now that VS Code is installed
- Next steps for learning VS Code basics
- Link to VS Code's built-in interactive tutorial: [https://code.visualstudio.com/docs/getstarted/userinterface](https://code.visualstudio.com/docs/getstarted/userinterface)

### Document Structure Flow:

```
1. Quick Start with Official Docs (Collapsible) ← Experienced users stop here
2. Introduction & What You'll Learn
3. Table of Contents (Collapsible)
4. Glossary (Collapsible)
5. Prerequisites (Collapsible)
6. Windows 11 Installation (Collapsible, open by default) - 7 Steps
7. macOS Installation (Collapsible, open by default) - 7 Steps
8. Claude Code Integration Verification (Collapsible)
9. Final Verification Checklist (Collapsible)
10. Troubleshooting (Collapsible) - Windows & macOS
11. Still Stuck? How to Get AI Help (Collapsible) ← NEW & CRITICAL
12. You Did It! Success Guide (Collapsible)
13. Common Pitfalls Reference (Collapsible)
14. Additional Resources (Collapsible)
15. Version History
```

---

## Key Improvements in This Template

**This enhanced prompt creates professional, beginner-friendly documentation that:**
- ✅ Starts users at their skill level (quick start OR detailed guide)
- ✅ Reduces overwhelm with collapsible sections
- ✅ Teaches AI prompting as a core skill (self-sufficiency)
- ✅ Links to all official documentation
- ✅ Provides clear success verification at every step
- ✅ Makes 1000+ line docs scannable and user-friendly
- ✅ Template-ready for other tools (Claude Code, Docker, Git, Node.js, etc.)

**Why this structure works:**
- Collapsible sections = less visual clutter
- AI help section = teaches modern development skills
- Fool-proof design = clear success indicators
- Official docs integration = credibility and completeness