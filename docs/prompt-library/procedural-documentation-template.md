# Prompt Template for Procedural Documentation (HOW-TO Guides)

**USE THIS PROMPT TO GENERATE**: Installation guides, setup instructions, configuration how-tos, step-by-step tutorials

**AUDIENCE**: AI assistants (Claude, ChatGPT, etc.) that will generate complete procedural documentation

**OUTPUT**: Production-ready procedural documentation optimized for:
- Zettelkasten/Obsidian knowledge graphs
- RAG semantic retrieval
- Multi-platform support (Windows, macOS, Linux)
- Progressive disclosure (expert → intermediate → beginner)

---

## Instructions for AI Assistant

When using this prompt template, generate beginner-friendly, step-by-step documentation that assumes zero familiarity with technical concepts. The documentation should feel like a friendly teacher guiding someone who has never performed this type of task before.

**Key Design Principles:**
- Start with a quick reference for experienced users
- Use collapsible sections to reduce visual clutter
- Make it fool-proof with clear success indicators
- Include AI prompting tips for when users get stuck beyond troubleshooting
- Emphasize tool-specific unique features

---

## Documentation Requirements

### 📋 YAML Frontmatter (Required)

Start the generated documentation with complete frontmatter:

```yaml
---
type: procedural-guide
category: [installation | configuration | how-to | setup]
tool: [TOOL_NAME]
platforms:
  - windows
  - macos
  - linux
difficulty: [beginner | intermediate | advanced]
time_estimate: [X minutes]
prerequisites:
  - [[prerequisite-doc-1]]
  - [[prerequisite-doc-2]]
version: 1.0.0
last_updated: [YYYY-MM-DD]
official_docs: [OFFICIAL_DOCS_URL]
tags:
  - procedural
  - installation
  - setup
  - [TOOL_NAME]
  - windows
  - macos
  - linux
  - knowledge-graph
aliases:
  - [TOOL_NAME]-install
  - [TOOL_NAME]-setup
  - how-to-install-[TOOL_NAME]
related_concepts:
  - [[related-concept-1]]
  - [[related-concept-2]]
related_procedures:
  - [[related-procedure-1]]
  - [[related-procedure-2]]
---
```

---

### 🚀 Quick Start Guide (For Experienced Users)

Create a collapsed/expandable section at the very top titled "**Quick Setup for Experienced Users**" containing:

**Official Documentation:**
- Main docs: [URL]
- Setup Guide: [URL]
- Windows Guide: [URL]
- macOS Guide: [URL]
- Linux Guide: [URL]
- Getting Started: [URL]

**Windows 11 Speed Run:**

```powershell
# 1. Install [TOOL_NAME]
[WINDOWS_INSTALL_COMMAND]

# 2. Verify installation
[VERIFICATION_COMMAND]

# 3. Configure environment
[WINDOWS_CONFIG_COMMAND]

# 4. Test basic functionality
[WINDOWS_TEST_COMMAND]
```

**macOS Speed Run:**

```bash
# 1. Install [TOOL_NAME]
[MACOS_INSTALL_COMMAND]

# 2. Verify installation
[VERIFICATION_COMMAND]

# 3. Configure environment
[MACOS_CONFIG_COMMAND]

# 4. Test basic functionality
[MACOS_TEST_COMMAND]
```

**Linux Speed Run:**

```bash
# 1. Install [TOOL_NAME]
[LINUX_INSTALL_COMMAND]

# 2. Verify installation
[VERIFICATION_COMMAND]

# 3. Configure environment
[LINUX_CONFIG_COMMAND]

# 4. Test basic functionality
[LINUX_TEST_COMMAND]
```

**Quick Feature Test:**

```bash
# Test core functionality
[TEST_COMMAND_1]

# Test integration
[TEST_COMMAND_2]
```

**Not working?** Check [official troubleshooting]([URL]) or jump to the detailed guide below.

---

### 📋 Target Audience Definition (for main guide)

- Complete beginners who may have never used similar tools
- Users who don't know technical terminology
- People who need visual cues and explanations for every step

---

### 📑 Structure Requirements

**For BOTH Windows, macOS, AND Linux sections, include:**

1. **Prerequisites Section**
   - System requirements in plain language
   - Required software/accounts
   - Link to official requirements
   - What to expect (time, restarts, etc.)
   - Glossary box explaining key terms with [[links-to-concepts]]

2. **Download/Installation Instructions**
   - Multiple installation methods when available
   - Which method to choose and why
   - Direct installation commands with explanations
   - How to verify download/installation is working
   - Time estimates

3. **Configuration Setup**
   - Environment variables explained
   - PATH configuration per platform
   - Integration with related tools
   - Step-by-step with verification
   - Why each configuration matters

4. **Verify Installation**
   - Version check commands
   - Basic functionality tests
   - Expected output examples
   - What to do if commands don't work

5. **Advanced Configuration** (if applicable)
   - Tool-specific features
   - Integration setup
   - Customization options
   - Performance optimization

6. **Understanding Tool Features**
   - Unique capabilities
   - Key features explained
   - When to use each feature
   - Link to features documentation

7. **Your First Task**
   - Beginner-friendly starter task
   - Step-by-step walkthrough
   - Expected results
   - Next steps

---

### 🔧 Collapsibility Requirements (CRITICAL for User Experience)

**Make ALL major sections collapsible using `<details>` tags:**

1. **Table of Contents**: `<details><summary>Click to expand Table of Contents</summary>`
2. **Glossary**: `<details><summary>Click to expand Glossary</summary>`
3. **Prerequisites**: `<details><summary>Click to expand Prerequisites</summary>`
4. **Windows Installation**: `<details open><summary>Click to expand Windows Installation (7 Steps)</summary>` (open by default)
5. **macOS Installation**: `<details open><summary>Click to expand macOS Installation (7 Steps)</summary>` (open by default)
6. **Linux Installation**: `<details open><summary>Click to expand Linux Installation (7 Steps)</summary>` (open by default)
7. **Advanced Configuration**: `<details><summary>Click to expand Advanced Configuration</summary>`
8. **Understanding Features**: `<details><summary>Click to expand Tool Features</summary>`
9. **Your First Task**: `<details><summary>Click to expand Your First Task</summary>`
10. **Verification Checklist**: `<details><summary>Click to expand Verification Checklist</summary>`
11. **Troubleshooting**: `<details><summary>Click to expand Troubleshooting Guide</summary>`
12. **Still Stuck? AI Help**: `<details><summary>Click to expand AI Help Guide</summary>`
13. **Success Guide**: `<details><summary>Click to expand Success Guide & Next Steps</summary>`
14. **Common Pitfalls**: `<details><summary>Click to expand Common Pitfalls Quick Reference</summary>`
15. **Additional Resources**: `<details><summary>Click to expand Additional Resources</summary>`

**Why this matters:**
- Reduces visual overwhelm for beginners
- Users can focus on their specific platform
- Makes long documents scannable
- Professional, accessible structure

---

### 📚 Glossary Section

Include a prominent glossary with simple explanations:

```markdown
## 📚 Glossary

<details>
<summary><strong>Click to expand Glossary</strong></summary>

**Core Terms:**
- **[TERM_1]**: [Simple explanation]. See [[concept-term-1]] for detailed framework.
- **[TERM_2]**: [Simple explanation]. See [[concept-term-2]] for detailed framework.

**Platform-Specific Terms:**

**Windows:**
- **PowerShell**: [Explanation]
- **PATH Environment Variable**: [Explanation]

**macOS:**
- **Terminal**: [Explanation]
- **Gatekeeper**: [Explanation]

**Linux:**
- **Package Manager**: [Explanation]
- **Permissions**: [Explanation]

**Knowledge Graph Links:**
- For deep dives: [[core-concepts-hub]]
- For troubleshooting: [[troubleshooting-glossary]]

</details>
```

---

### 🪟🍎🐧 Platform-Specific Installation Sections

**CRITICAL**: Create SEPARATE complete sections for each platform (NOT combined).

**Each platform section must have 7 detailed steps minimum:**

**Windows (7 Steps)**:
1. Download [TOOL_NAME]
2. Run Installer
3. Configure Environment Variables
4. Verify Installation
5. Configure [Specific Feature]
6. Integration Testing
7. First Use

**macOS (7 Steps)**:
1. Download [TOOL_NAME]
2. Install Application
3. Handle Gatekeeper Security
4. Enable Command-Line Access
5. Verify Installation
6. Configure [Specific Feature]
7. First Use

**Linux (7 Steps)**:
1. Choose Installation Method
2. Update Package Index
3. Install [TOOL_NAME]
4. Verify Installation
5. Configure Environment
6. Handle Permissions
7. First Use

**Each step must include**:
- **What we're doing**: Brief explanation
- **Why this matters**: Practical benefit
- Numbered sub-steps with commands
- Expected output examples
- 🎯 **Quick Check**: Success indicator
- 📝 **Note**: Important tips
- ⚠️ **Warning**: Common mistakes
- **Troubleshooting**: Links to [[solution-docs]]

---

### 🎯 Formatting Guidelines

- **Quick Start section**: Monospace fonts, compact layout, copy-paste friendly
- **Main guide**: Friendly, encouraging language ("Great! You're making progress!")
- Include "📝 Note" boxes for important tips
- Add "⚠️ Warning" boxes for common mistakes
- Create "🎯 Quick Check" sections after each major step
- Provide "🔧 Troubleshooting" expandable sections
- Use numbered lists with clear sub-steps
- Bold all command names and menu items
- Include commands in `code blocks` with language specified
- Always link to relevant official documentation
- Use [[double-bracket-links]] for knowledge graph connections

---

### 📊 Visual Requirements

- Terminal/PowerShell screenshots showing command execution (describe or note where screenshots would go)
- Success confirmation indicators
- Example command outputs
- Video links for complex workflows (if available)

---

### ✅ Testing Checklist to Include

Create a final verification checklist:

```markdown
## ✅ Verification Checklist

<details>
<summary><strong>Click to expand Verification Checklist</strong></summary>

- [ ] `[VERIFICATION_COMMAND]` shows version number
- [ ] `which [TOOL_COMMAND]` (macOS/Linux) or `Get-Command [TOOL_COMMAND]` (Windows) finds command
- [ ] `[TEST_COMMAND]` executes without errors
- [ ] Environment variable `$[VARIABLE_NAME]` is set correctly
- [ ] [FEATURE_1] works as expected
- [ ] [FEATURE_2] works as expected
- [ ] Integrates with [[related-tool-1]]

</details>
```

---

### 🔧 Troubleshooting Section

Address common scenarios:

```markdown
## 🔧 Troubleshooting

<details>
<summary><strong>Click to expand Troubleshooting Guide</strong></summary>

### "Command Not Found" Errors

**Problem**: `[TOOL_COMMAND]: command not found`

**Diagnosis**:
```bash
# Check if installed
which [TOOL_COMMAND]  # macOS/Linux
Get-Command [TOOL_COMMAND]  # Windows

# Check PATH
echo $PATH  # macOS/Linux
echo $env:Path  # Windows
```

**Solutions**:
1. Verify installation completed - Re-run installation step
2. Check PATH - See platform-specific Step 3
3. Restart terminal - Close and reopen
4. Restart computer - Some installations require full restart

**Related Issues**: [[troubleshooting-command-not-found]]

[Additional troubleshooting scenarios...]

### Platform-Specific Issues

**Windows:**
- [[troubleshooting-windows-path]]
- [[troubleshooting-windows-permissions]]

**macOS:**
- [[troubleshooting-gatekeeper]]
- [[troubleshooting-macos-permissions]]

**Linux:**
- [[troubleshooting-linux-dependencies]]
- [[troubleshooting-linux-permissions]]

</details>
```

---

### 🤖 "Still Stuck? How to Get AI Help" Section (CRITICAL)

After troubleshooting, add a comprehensive section teaching users how to ask AI assistants for help:

```markdown
## 🤖 Still Stuck? AI Help Guide

<details>
<summary><strong>Click to expand AI Help Guide</strong></summary>

### How to Ask for Help Effectively

**❌ Ineffective**: "It doesn't work"
**✅ Effective**: "On Windows 11, after running `[INSTALL_COMMAND]`, I get error `[SPECIFIC_ERROR]` when running `[VERIFICATION_COMMAND]`. I've already tried restarting PowerShell."

**Key Principles**:
1. **Be specific** - Exact commands and exact errors
2. **Include context** - OS, version, what you've tried
3. **Show your work** - Command outputs and error messages
4. **State expectations** - What you expected vs. what happened

### Information to Gather Before Asking

**Windows (PowerShell):**
```powershell
# System information
$PSVersionTable.PSVersion
[Environment]::OSVersion

# Tool information
[VERIFICATION_COMMAND]
Get-Command [TOOL_COMMAND]
echo $env:Path
```

**macOS/Linux (Terminal):**
```bash
# System information
uname -a
sw_vers  # macOS only

# Tool information
[VERIFICATION_COMMAND]
which [TOOL_COMMAND]
echo $PATH
```

### Template for Getting Help

```
## System Information
- Operating System: [Windows 11 / macOS Sonoma / Ubuntu 22.04]
- OS Version: [output]
- Shell/Terminal: [PowerShell / zsh / bash]

## Problem Description
What I'm trying to do: [...]
What I expected: [...]
What actually happened: [...]

## Steps to Reproduce
1. [step]
2. [step]

## Error Messages
\```
[paste exact error]
\```

## What I've Tried
- [x] [attempt 1]
- [x] [attempt 2]
```

### Example Prompts That Work Well

[Include 2-3 real-world example prompts for common scenarios]

### Where to Get AI Help

- Claude Code (Ctrl+G)
- ChatGPT
- Google Gemini
- Stack Overflow
- GitHub Copilot

### Common Mistakes When Asking for Help

**❌ Too vague** vs **✅ Specific** examples
**❌ Missing context** vs **✅ Includes context** examples

</details>
```

---

### 🎉 Success Metrics Section

End with a "You Did It!" section:

```markdown
## 🎉 Success Guide & Next Steps

<details>
<summary><strong>Click to expand Success Guide & Next Steps</strong></summary>

### 🎯 You Did It!

**Congratulations!** You've successfully installed and configured [TOOL_NAME].

### Three Ways to Verify Success

**✅ Test 1: Version Check**
```bash
[VERIFICATION_COMMAND]
# Should display version without errors
```

**✅ Test 2: Basic Functionality**
```bash
[BASIC_TEST_COMMAND]
```

**✅ Test 3: Integration Test**
```bash
[INTEGRATION_TEST_COMMAND]
```

### What You Can Do Now

**Immediate Next Steps:**
1. **[[getting-started-guide]]** - Your first project
2. **[[basic-workflows]]** - Common use cases
3. **[[keyboard-shortcuts]]** - Speed up your workflow

**Skill Building:**
- **Beginner**: [[beginner-tutorial-series]]
- **Intermediate**: [[advanced-features-guide]]
- **Advanced**: [[expert-workflows]]

### Community & Support

**Official Resources:**
- Documentation: [URL]
- Tutorials: [URL]
- Community: [URL]

</details>
```

---

### ⚠️ Common Pitfalls Section

Include a quick-reference table:

```markdown
## ⚠️ Common Pitfalls Quick Reference

<details>
<summary><strong>Click to expand Common Pitfalls</strong></summary>

### Installation Phase

| Pitfall | Symptom | Solution |
|---------|---------|----------|
| **Wrong version downloaded** | Errors on launch | Check architecture: [[verify-system-architecture]] |
| **Skipped "Add to PATH"** | "Command not found" | Re-run installer or [[manual-path-configuration]] |
| **Antivirus blocks installer** | Installation fails | [[temporarily-disable-antivirus]] |

### Configuration Phase

| Pitfall | Symptom | Solution |
|---------|---------|----------|
| **Environment variable typo** | Feature doesn't work | [[verify-environment-variables]] |
| **Wrong shell config file** | Settings don't persist | [[identify-active-shell-profile]] |

[Additional pitfalls...]

</details>
```

---

### 📚 Additional Resources Box

Include a prominent box with official resources:

```markdown
## 📚 Additional Resources

<details>
<summary><strong>Click to expand Additional Resources</strong></summary>

**Official Documentation:**
- Main Documentation: [URL]
- API Reference: [URL]
- Getting Started: [URL]

**Learning Resources:**
- Video Tutorials: [URL]
- Written Guides: [URL]
- Interactive Playground: [URL]

**Community:**
- Forum: [URL]
- Discord: [URL]
- Stack Overflow: [TAG_URL]

**Knowledge Graph Hub:**
- [[core-concepts-hub]] - Theoretical foundations
- [[installation-hub]] - All installation guides
- [[troubleshooting-hub]] - All troubleshooting guides

</details>
```

---

### 📝 Document Metadata

End with metadata:

```markdown
---

## 📝 Document Metadata

**Version**: 1.0.0
**Last Updated**: [YYYY-MM-DD]
**Maintained By**: [MAINTAINER_NAME]
**License**: [LICENSE_TYPE]

**Knowledge Graph Tags**: #procedural #installation #setup #[TOOL_NAME] #multi-platform #knowledge-graph #zettelkasten

**Related Templates**:
- [[conceptual-documentation-template]] - For framework/theory docs
- [[troubleshooting-template]] - For issue resolution guides

**Backlinks**:
- This document is referenced by: [[documentation-hub]]
- This document references: [[zettelkasten-principles]], [[obsidian-best-practices]]

---

**Built with Zettelkasten principles for Obsidian knowledge graphs and RAG-optimized semantic retrieval.**

---

*Documentation created: [YYYY-MM-DD] | Version 1.0.0*
```

---

### 🏗️ Document Structure Flow

```
1. YAML Frontmatter
2. Document Title & Purpose Statement
3. Quick Start (Collapsible) ← Experienced users stop here
4. Table of Contents (Collapsible)
5. Glossary (Collapsible)
6. Prerequisites (Collapsible)
7. Windows Installation (7 Steps) (Collapsible, open by default)
8. macOS Installation (7 Steps) (Collapsible, open by default)
9. Linux Installation (7 Steps) (Collapsible, open by default)
10. Verification Checklist (Collapsible)
11. Advanced Configuration (Collapsible)
12. Understanding Features (Collapsible)
13. Your First Task (Collapsible)
14. Troubleshooting (Collapsible)
15. Still Stuck? AI Help Guide (Collapsible) ← CRITICAL
16. Success Guide & Next Steps (Collapsible)
17. Common Pitfalls Reference (Collapsible)
18. Additional Resources (Collapsible)
19. Document Metadata
```

---

## Key Improvements in This Template

**This template creates professional, beginner-friendly documentation that:**
- ✅ Starts users at their skill level (quick start OR detailed guide)
- ✅ Reduces overwhelm with collapsible sections
- ✅ Separates platforms (Windows, macOS, Linux) completely
- ✅ Explains concepts with links to [[detailed-frameworks]]
- ✅ Teaches AI prompting as a core skill (self-sufficiency)
- ✅ Links extensively for knowledge graph navigation
- ✅ Provides clear success verification at every step
- ✅ Makes complex processes scannable and user-friendly

---

## Reference Examples

**Study these complete examples**:
- `claude-code-installation-prompt.md` - Installation guide pattern
- `vs-code-installation-prompt.md` - Setup guide pattern

Both demonstrate this template structure fully implemented.

---

**Template Version**: 1.0.0
**Created**: 2025-11-14
**Purpose**: Generate production-ready procedural documentation
**Output Format**: Markdown with Obsidian/Zettelkasten optimization
