# Local-Dev Repository Guidelines

## Scope & Structure
- This folder is the classroom workspace for new projects. Existing examples: `project-01-content-generator/`, `project-02-expense-tracker/`.
- New projects should follow: `project-<nn>-<slug>/` (e.g., `project-03-project-analyzer`).

## Docker-First Quickstart
- Enter a project and use Makefile shortcuts (WSL/macOS/Linux):
  - Content Generator: `cd project-01-content-generator && make up`
  - Expense Tracker: `cd project-02-expense-tracker && make up`
- Common targets: `make logs`, `make test-backend`, `make test-frontend`, `make down`, `make rebuild`.
- Never run Python on the host; use containers for everything.

### From the Parent Folder (recommended)
- You can run targets without `cd` using `make -C <project> <target>`:
  - Start services: `make -C project-01-content-generator up`
  - Run tests: `make -C project-02-expense-tracker test-backend`
  - View logs: `make -C project-01-content-generator logs`

### Prerequisites
- Windows (WSL2), macOS, or Linux with Docker Desktop/Engine installed.
- `make` available in your shell (WSL has it via Ubuntu; macOS via Xcode CLT or Homebrew).

## Start a New Project
- Copy a starter (01 or 02), rename folder to `project-<nn>-<slug>/`.
- Update Docker Compose service names (`<backend>`, `frontend`) and ports if needed.
- Backend: edit `pyproject.toml` `[project]` and `[project.scripts]` to match your module/package name.
- Frontend: keep CRA structure; update API URL in compose or `.env`.
- Copy the `Makefile` and set `BACKEND := <your-backend-service>`.
- Verify: `make up` then open logs and hit the API/UI.

## TDD, Testing, and Tools
- TDD: write a failing test, implement, refactor.
- Backend: pytest via `make test-backend`. Frontend: CRA/Jest via `make test-frontend`.
- Formatting/Linting (when configured): Python (Black/Ruff), JS/TS (Prettier/ESLint).

## Style & Naming
- Expressive, intention-revealing names; avoid single-letter variables except indices. Code should read like prose.
- Python: 4 spaces, `snake_case` functions, `PascalCase` classes; type hints where practical.
- JS/TS: 2 spaces, `camelCase` for vars/functions, `PascalCase` components.

## Commits, PRs, Branching
- Conventional Commits: `feat:`, `fix:`, `docs:`, etc.
- PRs: small, focused, include brief context/screenshots/logs when helpful.
- Branch from `main`, keep merges frequent.

## Secrets & Agents
- Use sample `.env` files in each project; do not commit real keys.
- Coding agents (Codex CLI, Claude, Gemini, etc.) should use Makefile targets and Docker commands for deterministic runs.
