# Repository Guidelines

## Project Structure & Module Organization
Keep each project in its own `project-<nn>-<slug>/` directory; examples include `project-01-content-generator/` and `project-03-task-tracker/`. Backend and frontend code live inside those project folders following the starter layout (backend `app/` or `src/`, frontend `frontend/` when present). Tests sit alongside their services (`backend/tests/`, `frontend/src/__tests__/`). Shared setup utilities and agent docs (`setup/`, `CLAUDE.md`, `GEMINI.md`) remain at the repo root; avoid editing the `*-INTERNAL/` references unless instructed.

## Build, Test, and Development Commands
Development happens in Docker via the top-level `Makefile`. Typical flows: `make -C project-01-content-generator up` to start services, `make -C project-02-expense-tracker logs` to tail containers, and `make -C project-03-project-analyzer down` to stop everything. Use `make rebuild` inside a project when dependencies change. Never run Python or Node commands directly on the host—run them through these Make targets so environments stay consistent.

## Coding Style & Naming Conventions
Follow expressive, intention-revealing names. Python modules use 4-space indentation, `snake_case` functions, `PascalCase` classes, and type hints where practical; format with Black/Ruff when configured. JavaScript/TypeScript files use 2 spaces, `camelCase` symbols, `PascalCase` React components, and Prettier/ESLint defaults from each project. Keep new files ASCII unless a project already uses Unicode.

## Testing Guidelines
Adopt TDD: add a failing test before implementation, commit once it passes. Run backend suites with `make -C <project> test-backend`, frontend checks with `make -C <project> test-frontend`. Name tests to describe behaviour (e.g., `test_generates_content_preview`). Target the existing coverage gate in each project and add fixtures beside the tests that use them.

## Commit & Pull Request Guidelines
Use Conventional Commits such as `feat: add expense aggregation API` or `fix: correct generator prompt`. Keep PRs focused, include context, logs or screenshots when UI changes, and link to tracking issues where available. Rebase or merge from `main` frequently to avoid drift and ensure CI stays green before requesting review.

## Security & Configuration Tips
Copy `.env.example` files before running services, keep real credentials out of version control, and rotate secrets immediately if exposed. Default CORS targets `http://localhost`; adjust only through Compose or env vars. Prefer non-root containers, redact user input from logs unless a debug flag is set, and sanitise any sample data before sharing.

— Codex Agent
