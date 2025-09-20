.PHONY: help up down restart logs ps rebuild sh-backend sh-frontend doctor

PROJECT_NAME := adk-quickstart

help:
	@echo "ADK Quickstart - Containerized Google ADK Development"
	@echo ""
	@echo "📋 Available commands:"
	@echo "  make up          - Start all services (frontend + backend)"
	@echo "  make down        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make logs        - View logs from all services"
	@echo "  make ps          - Show service status"
	@echo "  make rebuild     - Rebuild images without cache"
	@echo "  make sh-backend  - Open shell in backend container"
	@echo "  make sh-frontend - Open shell in frontend container"
	@echo "  make doctor      - Check prerequisites"

up:
	@echo "🚀 Starting $(PROJECT_NAME) containers..."
	@if [ ! -f .env ]; then \
		echo "⚠️  Creating .env from template..."; \
		cp .env.example .env; \
		echo "📝 Please edit .env with your configuration"; \
	fi
	docker compose up --build -d
	@echo "✅ All services started!"
	@echo ""
	@echo "🌐 Access points:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:8080"

down:
	@echo "🛑 Stopping $(PROJECT_NAME) containers..."
	docker compose down
	@echo "✅ All services stopped"

restart: down up

logs:
	@echo "📋 Viewing logs from all services (Ctrl+C to exit)..."
	docker compose logs -f

ps:
	@echo "🐳 Service status:"
	docker compose ps

rebuild:
	@echo "🔄 Rebuilding images without cache..."
	docker compose build --no-cache
	@echo "✅ Rebuild complete!"

sh-backend:
	@echo "🐚 Opening shell in backend container..."
	docker compose exec backend bash || docker compose exec backend sh

sh-frontend:
	@echo "🐚 Opening shell in frontend container..."
	docker compose exec frontend sh

doctor:
	@echo "==> Checking prerequisites for ADK Quickstart"
	@command -v docker >/dev/null 2>&1 || { echo "ERROR: Docker not found. Install Docker Desktop."; exit 1; }
	@docker info >/dev/null 2>&1 || { echo "ERROR: Docker engine not running. Start Docker Desktop and retry."; exit 1; }
	@docker compose version >/dev/null 2>&1 || { echo "ERROR: 'docker compose' not available. Update Docker Desktop to a Compose v2 build."; exit 1; }
	@command -v make >/dev/null 2>&1 || { echo "WARN: make not found in PATH"; }
	@[ -f .env ] && echo "OK: .env present" || echo "NOTE: .env missing (defaults/demo mode may be used)"
	@echo "==> docker compose services:" && docker compose config --services || true
	@echo "==> Done"
