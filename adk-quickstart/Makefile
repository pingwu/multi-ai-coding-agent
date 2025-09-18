PROJECT_NAME := adk-quickstart

up:
	@echo "Starting $(PROJECT_NAME) containers..."
	docker compose up --build

up-detached:
	@echo "Starting $(PROJECT_NAME) containers in detached mode..."
	docker compose up --build -d

stop:
	@echo "Stopping $(PROJECT_NAME) containers..."
	docker compose down

logs:
	docker compose logs -f

rebuild:
	@echo "Rebuilding images without cache..."
	docker compose build --no-cache

.PHONY: up up-detached stop logs rebuild
