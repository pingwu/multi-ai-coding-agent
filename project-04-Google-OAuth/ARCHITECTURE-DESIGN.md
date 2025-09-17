# Architecture Design — Project 3: AI Task Tracker

Scope: Public-safe overview for the open-source demo under `local-dev/project-04-task-tracker-for-team`. Internal governance details remain in `/issues`.

## System Overview

Services
- Frontend (React, port 3000): Browser UI, calls API Gateway.
- API Gateway (FastAPI, port 8000): HTTP interface, request validation, forwards to Crew Service.
- Crew Service (FastAPI + CrewAI, port 8001): Parses natural language, reads/writes Google Sheets.

External Dependency
- Google Sheets API (service account credentials mounted read-only at runtime).

## Service Responsibilities
- Frontend
  - Input form for natural language tasks
  - Dashboard retrieving current tasks and simple report
- API Gateway
  - Endpoints: `/api/tasks` (POST, GET), `/api/report`, `/api/config`, `/health`
  - CORS configuration via `ALLOWED_ORIGINS`
  - Logging with optional redaction via `LOG_REDACT_INPUTS`
- Crew Service
  - Endpoints: `/process`, `/tasks`, `/report`, `/config`, `/health`
  - Tools: Google Sheets reader/writer/updater via `gspread`
  - SimpleTaskAgent: heuristic parsing and summary generation

## Data Flow
1) User submits natural language in the Frontend.
2) API Gateway validates and forwards to Crew Service.
3) Crew Service parses intent and either writes a task or updates status in Google Sheet, then returns results.
4) Frontend polls API Gateway to display current tasks and summaries.

## Configuration
- `.env` (template): `GOOGLE_SHEETS_ID`, `OPENAI_API_KEY`, `ALLOWED_ORIGINS`, `LOG_LEVEL`, `LOG_REDACT_INPUTS`, `REACT_APP_API_URL`.
- Credentials: `credentials/gcp-service-account.json` (not committed; mounted read-only).

## Security Notes (Public-safe)
- No secrets in Git; only `.env.example` is committed.
- CORS whitelist defaults to localhost; configurable per environment.
- API logging redacts user content by default.
- Containers run as non-root users.

## Run & Health
- `make up` starts all services via Docker Compose.
- Health endpoints: `GET /health` on API and Crew Service; Frontend served on port 3000.

Created by: Codex Agent
