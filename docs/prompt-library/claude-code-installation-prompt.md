# Prompt for Claude Code Installation Documentation

Create a beginner-friendly, step-by-step installation guide for Claude Code that assumes zero familiarity with command-line interfaces or AI coding assistants. The documentation should feel like a friendly teacher guiding someone who has never used an AI development tool before.

**Key Design Principles:**
- Start with a quick reference for experienced users
- Use collapsible sections to reduce visual clutter
- Make it fool-proof with clear success indicators
- Include AI prompting tips for when users get stuck beyond troubleshooting
- Emphasize Claude Code's unique features (Ctrl+G, multi-file editing, project context)

## Documentation Requirements:

### 🚀 Quick Start Guide (For Experienced Users)

Create a collapsed/expandable section at the very top titled "**Quick Setup for Experienced Users**" containing:

**Official Documentation:**

- Main docs: https://docs.anthropic.com/en/docs/claude-code
- Setup Guide: https://docs.anthropic.com/en/docs/claude-code/setup
- Windows Guide: https://docs.anthropic.com/en/docs/claude-code/setup/windows
- macOS Guide: https://docs.anthropic.com/en/docs/claude-code/setup/macos
- Linux Guide: https://docs.anthropic.com/en/docs/claude-code/setup/linux
- Getting Started: https://docs.anthropic.com/en/docs/claude-code/getting-started

**Windows 11 Speed Run:**

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
# or $env:EDITOR = "notepad"

# 6. Test Ctrl+G (long prompt editing)
# Press Ctrl+G in Claude Code session
```

**macOS/Linux Speed Run:**

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

**Quick Feature Test:**

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

---

### Target Audience Definition (for main guide)

- Complete beginners who may have never used AI coding tools
- Developers new to command-line AI assistants
- Users who don't know what an "API key" or "environment variable" means
- People who need visual cues and explanations for every step

### Structure Requirements:

**For BOTH Windows 11 and macOS/Linux sections, include:**

1. **Prerequisites Section**
    - System requirements in plain language
    - Node.js requirements (if installing via npm)
    - Internet connection for authentication
    - Anthropic API account setup
    - Link to official requirements: https://docs.anthropic.com/en/docs/claude-code/requirements
    - What to expect during installation (time required, restarts needed)
    - Glossary box explaining: API Key, Environment Variable, Terminal, Shell, PATH, EDITOR

2. **Download/Installation Instructions**
    - Two installation methods: PowerShell/curl (recommended) vs npm
    - Which method to choose and why
    - Direct installation commands with explanations
    - How to verify download is working
    - Installation time estimates
    - Note about Anthropic account requirement

3. **Authentication Setup (CRITICAL)**
    - What is an API key and why it's needed
    - How to get an Anthropic API key
    - `claude auth login` command walkthrough
    - Browser authentication flow step-by-step
    - Screenshot for authentication success
    - Where credentials are stored
    - Security best practices (don't share API key)
    - Troubleshooting authentication failures

4. **Verify Installation**
    - `claude --version` command
    - `claude "test prompt"` basic test
    - Expected output screenshots
    - What to do if commands don't work

5. **Setting Up Editor Integration (Ctrl+G Feature)**
    - Official CLI integration docs: https://docs.anthropic.com/en/docs/claude-code/editor-integration
    - Explain WHAT Ctrl+G does: "Edit long prompts in your favorite editor"
    - Include a "Why this matters" box
    - Platform-specific instructions:
        - **Windows**: PowerShell environment variables
        - **macOS/Linux**: Shell configuration (.zshrc or .bash_profile)
    - Support for multiple editors:
        - VS Code: `EDITOR="code --wait"`
        - Vim: `EDITOR="vim"`
        - Nano: `EDITOR="nano"`
        - Sublime: `EDITOR="subl --wait"`
    - Verification steps with expected behavior
    - Common issues and solutions

6. **Understanding Claude Code Features**
    - Project context awareness (reads your codebase)
    - Multi-file editing capabilities
    - Ctrl+G for long prompts
    - Interactive chat mode
    - Diff preview before applying changes
    - Link to features documentation: https://docs.anthropic.com/en/docs/claude-code/features

7. **Your First Claude Code Session**
    - Starting a session in a project directory
    - Basic prompts to try
    - How to exit (Ctrl+D or `/exit`)
    - How to view help (`/help` command)
    - How to clear screen (`/clear` command)
    - Understanding Claude's responses

### Collapsibility Requirements (CRITICAL for User Experience):

**Make ALL major sections collapsible using `<details>` tags to reduce visual clutter:**

1. **Table of Contents**: `<details><summary>Click to expand Table of Contents</summary>`
2. **Glossary**: `<details><summary>Click to expand Glossary</summary>`
3. **Prerequisites**: `<details><summary>Click to expand Prerequisites</summary>`
4. **Windows Installation**: `<details open><summary>Click to expand Windows 11 Installation</summary>` (open by default)
5. **macOS/Linux Installation**: `<details open><summary>Click to expand macOS/Linux Installation</summary>` (open by default)
6. **Authentication Setup**: `<details open><summary>Click to expand Authentication Setup (CRITICAL)</summary>` (open by default)
7. **Editor Integration (Ctrl+G)**: `<details><summary>Click to expand Editor Integration Setup</summary>`
8. **Understanding Features**: `<details><summary>Click to expand Claude Code Features</summary>`
9. **Your First Session**: `<details><summary>Click to expand Your First Claude Code Session</summary>`
10. **Verification Checklist**: `<details><summary>Click to expand Verification Checklist</summary>`
11. **Troubleshooting**: `<details><summary>Click to expand Troubleshooting Guide</summary>`
12. **You Did It!**: `<details><summary>Click to expand Success Guide & Next Steps</summary>`
13. **Common Pitfalls**: `<details><summary>Click to expand Common Pitfalls Quick Reference</summary>`
14. **Additional Resources**: `<details><summary>Click to expand Additional Resources</summary>`

**Why this matters:**
- Reduces visual overwhelm for beginners
- Users can focus on their specific platform
- Makes long document scannable
- Professional, fool-proof structure

### Additional Resources Box

Include a prominent box with official resources:

**📚 Official Claude Code Resources:**

- **Documentation Home**: https://docs.anthropic.com/en/docs/claude-code
- **Getting Started Guide**: https://docs.anthropic.com/en/docs/claude-code/getting-started
- **Video Tutorials**: https://docs.anthropic.com/en/docs/claude-code/tutorials
- **Command Reference**: https://docs.anthropic.com/en/docs/claude-code/commands
- **Best Practices**: https://docs.anthropic.com/en/docs/claude-code/best-practices
- **Keyboard Shortcuts**:
  - Ctrl+G: Open editor for long prompts
  - Ctrl+D: Exit Claude Code session
  - Ctrl+C: Cancel current operation
- **API Documentation**: https://docs.anthropic.com/en/api
- **FAQ**: https://docs.anthropic.com/en/docs/claude-code/faq
- **Troubleshooting**: https://docs.anthropic.com/en/docs/claude-code/troubleshooting

### Formatting Guidelines:

- **Quick Start section**: Use monospace fonts, compact layout, copy-paste friendly
- **Main guide**: Use friendly, encouraging language ("Great! You're making progress!")
- Include "📝 Note" boxes for important tips
- Add "⚠️ Warning" boxes for common mistakes (especially API key security)
- Create "🎯 Quick Check" sections after each major step
- Provide "🔧 Troubleshooting" expandable sections
- Use numbered lists with clear sub-steps
- Bold all command names and menu items
- Include terminal commands in `code blocks`
- Always link to relevant official documentation sections
- Emphasize API key security throughout

### Visual Requirements:

- Terminal screenshots showing command execution
- Browser authentication flow screenshots
- Success confirmation screenshots
- Example Claude Code session screenshots
- Diff preview examples
- Video links for complex workflows (if available)

### Testing Checklist to Include:

Create a final verification checklist:

- [ ]  `claude --version` shows version number
- [ ]  `claude auth status` shows authenticated
- [ ]  `claude "hello"` responds with greeting
- [ ]  Ctrl+G opens your configured editor
- [ ]  Claude Code can read project files
- [ ]  Claude Code can suggest multi-file edits
- [ ]  `/help` command shows available commands

### Common Pitfalls Section:

Address these specific scenarios:

- "I see 'command not found' when typing 'claude'"
- "Authentication fails with 'invalid API key'"
- "Ctrl+G doesn't open my editor"
- "Claude Code says it can't read my files"
- "npm install fails with permission errors"
- "Which installation method should I use?"
- "How do I update Claude Code to latest version?"

Link to official troubleshooting for each issue when available.

### "Still Stuck? How to Get AI Help" Section (CRITICAL):

After troubleshooting, add a comprehensive section teaching users how to ask AI assistants for help:

**Section Structure:**

1. **How to Ask for Help Effectively**
   - Describe exact situation with command outputs
   - Include what installation method you used
   - Share error messages word-for-word
   - Mention OS, Node version, and claude version

2. **Example Prompts That Work Well**
   - For installation issues
   - For authentication problems
   - For editor integration issues
   - For API key problems

3. **Information to Gather Before Asking**
   - Diagnostic commands:
     ```bash
     claude --version
     node --version  # if using npm
     npm --version  # if using npm
     claude auth status
     echo $EDITOR  # macOS/Linux
     echo $env:EDITOR  # Windows
     which claude  # macOS/Linux
     where.exe claude  # Windows
     ```

4. **Template for Getting Help**
   ```
   Operating System: [Windows 11 / macOS Sonoma / Ubuntu 22.04]
   Installation Method: [PowerShell script / npm / curl]
   Node Version: [if using npm]
   Claude Version: [output of claude --version]
   Shell/Terminal: [PowerShell / zsh / bash]

   Problem Description: [...]
   What I've Tried: [...]
   Error Messages: [...]
   Command Outputs: [...]
   Expected Behavior: [...]
   Actual Behavior: [...]
   ```

5. **Where to Get Help**
   - Claude Code documentation
   - Anthropic Discord community
   - GitHub Discussions
   - Stack Overflow with [claude-code] tag
   - Other AI assistants (ChatGPT, Gemini) using the template above

6. **Common Mistakes When Asking for Help**
   - ❌ "Claude Code doesn't work" vs ✅ "claude --version shows 'command not found' on Windows 11 after npm install"
   - ❌ "Authentication error" vs ✅ "claude auth login opens browser but shows 'API key invalid' after I paste my key from dashboard"
   - ❌ "Ctrl+G broken" vs ✅ "Pressing Ctrl+G in Claude Code on macOS with EDITOR='code --wait' does nothing, VS Code doesn't open"

**Why this section matters:**
- Teaches self-sufficiency with AI tools (meta!)
- Reduces support burden
- Empowers users to solve novel problems
- Core skill for modern AI-assisted development

### Platform-Specific Considerations:

**Windows 11:**

- PowerShell vs Command Prompt (recommend PowerShell)
- Windows Security warnings
- PATH configuration
- PowerShell execution policy
- npm global install location
- Windows Defender issues

**macOS:**

- Homebrew alternative (if available)
- Gatekeeper security warnings
- zsh vs bash shell differences
- Apple Silicon (M1/M2/M3) considerations
- npm global install permissions
- System Integrity Protection

**Linux:**

- Distribution-specific package managers
- Snap/Flatpak alternatives (if available)
- Shell configuration files (.bashrc vs .zshrc)
- Permission issues with npm global installs
- sudo usage considerations

### Success Metrics:

End with a "You Did It!" section that confirms:

- Three ways to verify successful installation
- What they can do now with Claude Code
- Next steps for learning Claude Code workflows
- First project ideas to try
- Link to best practices guide
- Link to advanced features documentation

### Document Structure Flow:

```
1. Quick Start with Official Docs (Collapsible) ← Experienced users stop here
2. Introduction & What You'll Learn
3. Table of Contents (Collapsible)
4. Glossary (Collapsible)
5. Prerequisites (Collapsible)
6. Windows 11 Installation (Collapsible, open by default)
7. macOS/Linux Installation (Collapsible, open by default)
8. Authentication Setup (Collapsible, open by default) ← CRITICAL
9. Verify Installation (Collapsible)
10. Editor Integration (Ctrl+G) (Collapsible)
11. Understanding Claude Code Features (Collapsible)
12. Your First Session (Collapsible)
13. Final Verification Checklist (Collapsible)
14. Troubleshooting (Collapsible) - All platforms
15. Still Stuck? How to Get AI Help (Collapsible) ← NEW & CRITICAL
16. You Did It! Success Guide (Collapsible)
17. Common Pitfalls Reference (Collapsible)
18. Additional Resources (Collapsible)
19. Version History
```

---

## Key Improvements in This Template

**This enhanced prompt creates professional, beginner-friendly documentation that:**
- ✅ Starts users at their skill level (quick start OR detailed guide)
- ✅ Reduces overwhelm with collapsible sections
- ✅ Emphasizes critical authentication step
- ✅ Explains unique Claude Code features (Ctrl+G, project context, multi-file editing)
- ✅ Teaches AI prompting as a core skill (self-sufficiency)
- ✅ Links to all official Anthropic documentation
- ✅ Provides clear success verification at every step
- ✅ Covers all three major platforms (Windows, macOS, Linux)
- ✅ Addresses API key security and best practices
- ✅ Makes complex installation process scannable and user-friendly

**Why this structure works for Claude Code:**
- Collapsible sections = less visual clutter for tool-specific content
- AI help section = teaches modern AI development workflow (meta!)
- Authentication emphasis = prevents #1 user issue
- Editor integration = unlocks Ctrl+G superpower
- Feature overview = helps users understand what makes Claude Code unique
- Fool-proof design = clear success indicators for complex multi-step process
- Official docs integration = builds trust and provides deep-dive resources

**Unique Claude Code Considerations:**
- API key setup is more complex than typical CLI tools
- Ctrl+G editor integration is a killer feature worth emphasizing
- Project context awareness needs explanation
- Multi-file editing capabilities set it apart
- Interactive chat mode is different from traditional code tools
- Security best practices for API keys are critical
