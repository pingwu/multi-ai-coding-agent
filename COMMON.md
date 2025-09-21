# COMMON.md — Shared Multi-Agent Guidance

## Repository Context & Privacy
- Dual-purpose workspace: internal course development plus public-safe demos in `local-dev/`. Keep teaching materials, pricing, strategy, and `/issues/` internal; only mirror demo-safe assets to the public repo.
- Respect directory scopes: files beneath `local-dev/` must remain publishable; never surface `/issues/` or internal docs outside their private scope.
- Documentation updates default to Markdown for clarity and consistency.

## Multi-Agent Collaboration
- Read this file first, then your agent-specific guide (`AGENTS.md`, `CLAUDE.md`, or `GEMINI.md`) for role nuances.
- Coordinate through the user and leave room for other agents to contribute. Surface trade-offs, security concerns, and open questions for human review.
- Identity matters: sign shared artifacts, issues, and commits with your agent name.
- Roles summary:

| Agent        | Primary Focus Areas |
|--------------|---------------------|
| Codex Agent  | Precise code changes, automation, security/governance enforcement |
| Claude Agent | Natural-language workflows, Docker-first scaffolding, public-safe docs |
| Gemini Agent | Cross-checks, alternative approaches, performance & risk analysis |

## Work Management & Issues
- Use the `/issues/` directory for active tracking. `TODO` is deprecated (2025-07-02).
- Include metadata (project, type, severity, status, visibility) and sign entries as your agent (e.g., “Codex Agent”).
- Record security, compliance, and governance risks in issues and extract lessons learned to the knowledge graph when they close.

## Security, Compliance, and Risk Baseline

### Secret Management Policy (All Projects)
- Export keys and secrets via environment variables whenever possible; create local `.env` files only when absolutely required and keep them out of version control.
- Version `.env.example` templates with placeholder values only; never commit live credentials or tokens.
- If a secret is exposed, rotate it immediately and document the incident and remediation steps in `/issues/`.

- Keep real credentials out of the repository and avoid echoing them in logs or chat transcripts.
- Harden containers: prefer non-root users, keep health checks, use minimal base images, and pin versions/digests where practical.
- Maintain dependency governance with a single lock/source of truth per service.
- Keep network/io boundaries configurable (e.g., CORS origins via env), defaulting to localhost for dev. Avoid logging raw user inputs; add redaction toggles for debugging scenarios.
- Minimize exposure of PII and sensitive data; redact when storage is unavoidable.

## Development Conventions
- Operate Docker-first via project `Makefile` targets (`make up`, `make logs`, `make status`, etc.); avoid installing host-level dependencies.
- Preserve minimal diffs and avoid reformatting unrelated code. Keep files ASCII unless a project already requires Unicode.
- Prefer `rg`/`rg --files` for repository searches and set explicit working directories when running commands.
- Plan transparently: share multi-step plans for non-trivial tasks and update progress as steps finish.

## Testing & Validation
- Add or update targeted tests when behaviour changes; keep them close to the affected service (`backend/tests/`, `frontend/src/__tests__/`).
- Run available Makefile or containerized test targets before delivering major changes and document any manual verification steps.

## Commit & Attribution Guidelines
- Use Conventional Commit prefixes and keep changes scoped.
- When an agent contributes to a commit, append the appropriate trailers:
  - Codex Agent: `🤖 Generated with [Codex CLI](https://platform.openai.com/)` and `Co-Authored-By: Codex Agent <noreply@openai.com>`
  - Claude Agent: `🤖 Generated with [Claude Code](https://claude.ai/code)` and `Co-Authored-By: Claude <noreply@anthropic.com>`
  - Gemini Agent: `🤖 Generated with [Gemini CLI](https://ai.google.dev/)` and `Co-Authored-By: Gemini Agent <noreply@google.com>`
- Preserve existing trailers when amending collaborative commits.

## Reference Documents
- `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md` — agent-specific workflows built on this shared baseline.
- `AI-AGENT-COORDINATION-STRATEGY.md`, `CLAUDE.md`, `GEMINI.md` — additional coordination context.
- `issues/README.md` — structure for the internal issue tracker.
