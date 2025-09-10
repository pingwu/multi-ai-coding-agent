.PHONY: help up down restart logs ps test-backend test-frontend rebuild sh-backend sh-frontend doctor

BACKEND := expense-tracker
FRONTEND := frontend

help:
	@echo "Targets: up, down, restart, logs, ps, test-backend, test-frontend, rebuild, sh-backend, sh-frontend, doctor"

up:
	docker compose up -d $(BACKEND) $(FRONTEND)

down:
	docker compose down

restart: down up

logs:
	docker compose logs -f $(BACKEND) $(FRONTEND)

ps:
	docker compose ps

test-backend:
	docker compose run --rm $(BACKEND) pytest -q

test-frontend:
	docker compose run --rm $(FRONTEND) npm test -- --watchAll=false

rebuild:
	docker compose build --no-cache

sh-backend:
	docker compose run --rm $(BACKEND) bash || docker compose run --rm $(BACKEND) sh

sh-frontend:
	docker compose run --rm $(FRONTEND) sh

doctor:
	@echo "==> Checking prerequisites for Project 02 (expense-tracker)"
	@command -v docker >/dev/null 2>&1 || { echo "ERROR: Docker not found. Install Docker Desktop."; exit 1; }
	@docker info >/dev/null 2>&1 || { echo "ERROR: Docker engine not running. Start Docker Desktop (whale icon) and retry."; exit 1; }
	@docker compose version >/dev/null 2>&1 || { echo "ERROR: 'docker compose' not available. Update Docker Desktop to a Compose v2 build."; exit 1; }
	@command -v make >/dev/null 2>&1 || { echo "WARN: make not found in PATH"; }
	@[ -f .env ] && echo "OK: .env present" || echo "NOTE: .env missing (defaults/demo mode may be used)"
	@echo "==> docker compose services:" && docker compose config --services || true
	@echo "==> Done"
