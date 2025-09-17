FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN addgroup --system app && adduser --system --ingroup app --home /app app

# Copy requirements file first for better caching
# Copy project metadata and source
COPY pyproject.toml .
COPY src/ ./src/

# Install project via pyproject (single source of truth)
RUN pip install --no-cache-dir .

# Create credentials directory
RUN mkdir -p credentials

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

# Adjust ownership and drop privileges
RUN chown -R app:app /app
USER app

# Set PYTHONPATH and run the HTTP server
ENV PYTHONPATH="/app/src"
CMD ["python", "-m", "task_crew.main", "serve"]
