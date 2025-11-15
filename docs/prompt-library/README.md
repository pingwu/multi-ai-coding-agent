# MACA Course Documentation Templates

**Purpose**: Master prompt templates for generating production-ready course documentation

**Created**: 2025-11-14
**Maintained By**: MACA Course Team

---

## Available Templates

### 1. **Procedural Documentation Template (HOW)**
**File**: `procedural-documentation-template.md`
**Size**: ~19KB
**Use For**: Installation guides, setup instructions, how-to tutorials, configuration guides

**Key Features**:
- Multi-platform support (Windows, macOS, Linux)
- Progressive disclosure (Quick Start → Detailed Steps)
- Zettelkasten structure with [[double-bracket-links]]
- AI Help Guide section (teaching self-sufficiency)
- Collapsible sections for reduced visual clutter
- RAG-optimized for semantic retrieval

**Reference Examples**:
- `claude-code-installation-prompt.md`
- `vs-code-installation-prompt.md`

---

### 2. **Conceptual Documentation Template (WHY)**
**File**: `conceptual-documentation-template.md`
**Size**: ~29KB
**Use For**: Frameworks, methodologies, theories, decision guides, architecture explanations

**Key Features**:
- "When to use / When NOT to use" decision frameworks
- Trade-offs and alternatives comparison
- Mental models and analogies
- Real-world examples and case studies
- Success metrics and validation
- Links to [[procedural-implementations]]

**Use Cases**:
- Docker architecture concepts
- Multi-agent frameworks
- Decision-making methodologies
- Teaching philosophy and pedagogy

---

## Documentation Philosophy

### Zettelkasten Principles
- **Atomic notes**: One concept per document
- **Bidirectional links**: [[concept]] ↔ [[implementation]]
- **Progressive complexity**: Simple → Advanced
- **Knowledge graph**: Obsidian-compatible

### RAG Optimization
- **Semantic chunking**: Natural topic boundaries
- **Context preservation**: Each section self-contained
- **Metadata rich**: YAML frontmatter for filtering
- **Hierarchical structure**: Clear topic organization

### Multi-Audience Design
- **Quick Start**: Experts (collapsed by default)
- **Table of Contents**: Navigators (with [[links]])
- **Detailed Steps**: Beginners (step-by-step with verification)

---

## Usage Workflow

### For Procedural Documentation (Installation/Setup/How-To)

1. Open `procedural-documentation-template.md`
2. Copy the prompt template
3. Provide to AI assistant (Claude, ChatGPT) with:
   - Tool/process name
   - Official documentation URLs
   - Installation commands per platform
   - Configuration requirements
4. AI generates complete procedural guide
5. Review and customize

### For Conceptual Documentation (Frameworks/Theory/Why)

1. Open `conceptual-documentation-template.md`
2. Copy the prompt template
3. Provide to AI assistant with:
   - Concept/framework name
   - Core principles
   - Use cases and anti-patterns
   - Related concepts
4. AI generates complete conceptual guide
5. Review and customize

---

## Quality Standards

### Must Include

**Procedural Docs**:
- [ ] YAML frontmatter with metadata
- [ ] Quick Start section (collapsed)
- [ ] Separate Windows/macOS/Linux sections
- [ ] Verification steps with expected outputs
- [ ] Troubleshooting with [[links]]
- [ ] AI Help Guide section
- [ ] [[Double-bracket-links]] throughout
- [ ] Collapsible `<details>` tags

**Conceptual Docs**:
- [ ] YAML frontmatter with metadata
- [ ] "When to use / When NOT to use" sections
- [ ] Trade-offs and alternatives
- [ ] Real-world examples
- [ ] Links to [[procedural-implementations]]
- [ ] Mental models and analogies
- [ ] Success metrics
- [ ] [[Double-bracket-links]] throughout

---

## File Organization

```
prompt-library/
├── README.md (this file)
├── procedural-documentation-template.md
├── conceptual-documentation-template.md
├── claude-code-installation-prompt.md (reference example)
└── vs-code-installation-prompt.md (reference example)
```

---

## Knowledge Graph Integration

**Hub Architecture**:
- Conceptual docs link to procedural implementations
- Procedural docs link to conceptual explanations
- Both link to troubleshooting guides
- All use [[double-brackets]] for Obsidian

**Tags**:
- `#procedural` - How-to guides
- `#conceptual` - Framework/theory docs
- `#installation` - Setup guides
- `#knowledge-graph` - Zettelkasten structure
- `#zettelkasten` - Atomic notes
- `#template` - Master templates

---

## Contributing

When creating new documentation:
1. Choose appropriate template (procedural vs conceptual)
2. Follow all sections in template
3. Include [[double-bracket-links]] extensively
4. Use collapsible sections as specified
5. Test all commands/examples
6. Review against quality checklist

---

## Version History

- **v1.0.0** (2025-11-14): Initial release
  - Procedural documentation template
  - Conceptual documentation template
  - Reference examples (Claude Code, VS Code)

---

**Maintained with Zettelkasten principles for Obsidian knowledge graphs and RAG-optimized semantic retrieval.**
