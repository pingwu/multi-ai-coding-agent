FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (add curl for healthchecks)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN addgroup --system app && adduser --system --ingroup app --home /app app

# Copy requirements first for better caching
COPY pyproject.toml ./

# Install dependencies
RUN pip install --no-cache-dir pip setuptools wheel

# Copy source code
COPY . .

# Install the package with dev extras (includes pytest for container tests)
RUN pip install -e .[dev]

# Create output directories and CrewAI directories with proper structure
RUN mkdir -p generated_content
RUN mkdir -p /app/.local/share/app
RUN mkdir -p /app/.local/share/crewai/credentials

# Expose port for web API
EXPOSE 8000

# Health check for FastAPI/uvicorn
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8000/docs || curl -f http://localhost:8000/health || exit 1

# Drop privileges - change ownership after creating directories
RUN chown -R app:app /app
USER app

# Default command - run the web API
CMD ["python", "-m", "uvicorn", "my_mas.web_api:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
