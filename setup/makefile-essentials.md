# Makefile Essentials (WSL/macOS/Linux)

This guide shows how to use Makefiles in the multi-ai-coding-agent repository to run Docker tasks quickly and consistently.

## Why Makefiles?
- Shortcuts for common Docker workflows: `make up`, `make logs`, `make test-backend`.
- Consistent across shells and coding agents (Codex, Claude, Gemini).
- No custom scripts: wraps `docker compose` directly.

## Install & Verify
- WSL2 (Ubuntu): `sudo apt update && sudo apt install -y make`
- macOS: install Xcode Command Line Tools (`xcode-select --install`) or `brew install make`
- Check: `make -v` (should show GNU Make)

## Using Make from the Parent Folder
- Start services (Content Generator): `make -C project-01-content-generator up`
- Run backend tests (Expense Tracker): `make -C project-02-expense-tracker test-backend`
- View logs: `make -C project-01-content-generator logs`
- Stop: `make -C project-01-content-generator down`

## Common Targets (both projects)
- `up` — start backend + frontend
- `down` — stop and remove containers
- `logs` — follow logs for both services
- `test-backend` — run pytest in backend container
- `test-frontend` — run CRA/Jest tests in frontend container
- `rebuild` — rebuild images with no cache
- `sh-backend` / `sh-frontend` — open a shell in the container

## New Project Checklist
1) Copy an existing project folder to `project-<nn>-<slug>/`.
2) Update `docker-compose.yml` service names and ports.
3) Edit `pyproject.toml` `[project]` and `[project.scripts]` to match your module.
4) In `Makefile`, set `BACKEND := <your-backend-service>`.
5) Run `make up`, then `make logs` to verify.

## Troubleshooting
- “make: command not found”: install Make (see above).
- Spaces in paths: use quotes when `cd`’ing; `make -C` handles spaces safely.
- Permission issues on WSL: run Docker Desktop, ensure WSL integration is enabled.
- Stale containers: `make down && make rebuild`.

## Tips for Coding Agents
- Prefer `make -C <project> <target>` to keep runs deterministic.
- For tests in CI/agents, use `make test-backend` and `make test-frontend` inside each project.
