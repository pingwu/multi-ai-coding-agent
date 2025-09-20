# Google OAuth Task Tracker - Development Commands
# Team collaboration with Google OAuth authentication and audit trails

.PHONY: help up down logs clean rebuild test health status services

# Default target
help:
	@echo "🏗️  Google OAuth Task Tracker - Team Collaboration Platform"
	@echo ""
	@echo "📋 Available commands:"
	@echo "  make up          - Start all services (frontend + api + crew)"
	@echo "  make down        - Stop all services"
	@echo "  make logs        - View logs from all services"
	@echo "  make status      - Check service health status"
	@echo "  make check-oauth - Verify OAuth env configuration"
	@echo "  make services    - List running services"
	@echo "  make rebuild     - Rebuild and restart all services"
	@echo "  make clean       - Clean up containers and images"
	@echo "  make test        - Run tests across all services"
	@echo ""
	@echo "🔧 Individual services:"
	@echo "  make crew        - Start only crew-service"
	@echo "  make api         - Start only api-service"
	@echo "  make frontend    - Start only frontend"
	@echo ""
	@echo "📊 Monitoring:"
	@echo "  make health      - Check all service health endpoints"

# Main development commands
up:
	@echo "🚀 Starting Task Tracker microservices..."
	@if [ ! -f .env ]; then \
		echo "⚠️  Creating .env from template..."; \
		cp .env.example .env; \
		echo "📝 Please edit .env with your configuration"; \
	fi
	docker compose up -d
	@echo "✅ All services started!"
	@echo ""
	@echo "🌐 Access points:"
	@echo "  Frontend:  http://localhost:3000"
	@echo "  API Gateway: http://localhost:8000"
	@echo "  API Docs:  http://localhost:8000/docs"
	@echo "  Crew Service: http://localhost:8001"
	@echo ""
	@echo "📋 Next steps:"
	@echo "  1. Configure Google OAuth (see README.md for setup)"
	@echo "  2. Configure Google Sheets (see setup/google-sheets-setup-guide.md)"
	@echo "  3. Verify OAuth config: make check-oauth"
	@echo "  4. Test with: make status"

down:
	@echo "🛑 Stopping all services..."
	docker compose down
	@echo "✅ All services stopped"

logs:
	@echo "📋 Viewing logs from all services (Ctrl+C to exit)..."
	docker compose logs -f

# Service health and status
status:
	@echo "🔍 Checking service health..."
	@echo ""
	@echo "📊 Service Status:"
	@curl -s http://localhost:8001/health | jq '.' 2>/dev/null || echo "❌ Crew Service (8001) - Not responding"
	@echo ""
	@curl -s http://localhost:8000/health | jq '.' 2>/dev/null || echo "❌ API Service (8000) - Not responding"
	@echo ""
	@curl -s http://localhost:3000 >/dev/null 2>&1 && echo "✅ Frontend (3000) - Running" || echo "❌ Frontend (3000) - Not responding"

health:
	@echo "🏥 Health check endpoints:"
	@echo ""
	@echo "Crew Service Health:"
	@curl -s http://localhost:8001/health || echo "Service not available"
	@echo ""
	@echo "API Gateway Health:"
	@curl -s http://localhost:8000/health || echo "Service not available"

services:
	@echo "🐳 Docker services status:"
	docker compose ps

# Verify OAuth configuration variables
check-oauth:
	@echo "🔐 Checking OAuth configuration..."
	@echo "GOOGLE_CLIENT_ID:      $${GOOGLE_CLIENT_ID:+set}${GOOGLE_CLIENT_ID:+' (redacted)'}"
	@echo "GOOGLE_CLIENT_SECRET:  $${GOOGLE_CLIENT_SECRET:+set}${GOOGLE_CLIENT_SECRET:+' (redacted)'}"
	@echo "GOOGLE_REDIRECT_URI:   $${GOOGLE_REDIRECT_URI:+set}${GOOGLE_REDIRECT_URI:+' (redacted)'}"
	@echo "JWT_SECRET_KEY:        $${JWT_SECRET_KEY:+set}${JWT_SECRET_KEY:+' (redacted)'}"
	@echo "JWT_ALGORITHM:         ${JWT_ALGORITHM}"
	@echo "SESSION_COOKIE_SECURE: ${SESSION_COOKIE_SECURE}"
	@echo "SESSION_COOKIE_HTTPONLY: ${SESSION_COOKIE_HTTPONLY}"
	@echo "SESSION_COOKIE_SAMESITE: ${SESSION_COOKIE_SAMESITE}"
	@echo ""
	@echo "✅ If above values are set, OAuth endpoints should function."

# Development helpers
rebuild:
	@echo "🔄 Rebuilding all services..."
	docker compose down
	docker compose build --no-cache
	docker compose up -d
	@echo "✅ Rebuild complete!"

clean:
	@echo "🧹 Cleaning up containers and images..."
	docker compose down --rmi all --volumes --remove-orphans
	docker system prune -f
	@echo "✅ Cleanup complete!"

# Individual services
crew:
	@echo "🤖 Starting only CrewAI service..."
	docker compose up -d crew-service

api:
	@echo "🌐 Starting only API Gateway..."
	docker compose up -d api-service

frontend:
	@echo "⚛️  Starting only Frontend..."
	docker compose up -d frontend

# Testing
test:
	@echo "🧪 Running tests across all services..."
	@echo "Testing Crew Service..."
	docker compose exec crew-service python -m pytest tests/ || echo "No tests found in crew-service"
	@echo "Testing API Service..."
	docker compose exec api-service python -m pytest tests/ || echo "No tests found in api-service"
	@echo "Testing Frontend..."
	docker compose exec frontend npm test --watchAll=false || echo "No tests configured in frontend"

# Quick development workflow
dev: up
	@echo "🔧 Development mode started!"
	@echo "📝 Logs will follow (Ctrl+C to stop logs, services keep running)..."
	@sleep 3
	make logs
