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

# Install the package in development mode
RUN pip install -e .

# Create output directories
RUN mkdir -p data

# Expose port for web API
EXPOSE 8000

# Health check for FastAPI/uvicorn
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8000/docs || curl -f http://localhost:8000/health || exit 1

# Drop privileges
RUN chown -R app:app /app
USER app

# Default command - run the web API
CMD ["python", "-m", "uvicorn", "expense_tracker.web_api:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
