FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY pyproject.toml ./

# Install dependencies
RUN pip install --no-cache-dir pip setuptools wheel

# Copy source code
COPY . .

# Install the package in development mode
RUN pip install -e .

# Create output directories
RUN mkdir -p generated_content

# Expose port for web API
EXPOSE 8000

# Default command - run the web API
CMD ["python", "-m", "uvicorn", "my_mas.web_api:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]