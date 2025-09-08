# Troubleshooting Guide

This guide provides solutions to common issues you might encounter while working with this project.

## Docker Environment Issues

**Problem:** `docker-compose` commands fail with errors like `Network ... Resource is still in use` or containers fail to start with `Module not found` errors even when the files exist.

**Solution:** This can happen if the Docker environment is in a bad state. Here are a few steps to resolve this:

1.  **Ensure Docker Desktop is running:** The Docker engine must be running for any `docker` or `docker-compose` commands to work. On Windows and macOS, this is typically managed by the Docker Desktop application.
2.  **Restart Docker Desktop:** If you encounter persistent issues with networks or containers, restarting Docker Desktop can often resolve them.
3.  **Reboot your machine:** In some cases, a full reboot of your machine may be necessary to reset the Docker environment completely.
4.  **Rebuild the images:** If you are still having issues, especially after adding new files, a full rebuild of the images can help. Use the command `docker-compose up --build --no-cache -d`.

## Python Dependencies

**Problem**: `ImportError: No module named 'crewai'`

**Solution**: Ensure you're using the latest version:
```bash
pip install --upgrade crewai[tools]>=0.177.0
```

## Frontend Issues

**Problem**: The frontend fails to start with `Module not found` errors, even after creating missing files.

**Solution**: This can be caused by a stale Docker volume. Try rebuilding the frontend image from scratch:
```bash
docker-compose up --build --no-cache -d frontend
```

## API and Agent Issues

**Problem**: `WebSocket connection failed`

**Solution**: Check that the backend is running on port 8000:
```bash
curl http://localhost:8000/
```

**Problem**: `Agent execution timeout` or `Search failed`

**Solution**: Check API key configuration:
```bash
# Verify .env file contains valid keys
cat .env | grep OPENAI_API_KEY
cat .env | grep SERPER_API_KEY
```

**Problem**: `SerperDevTool authentication failed`

**Solution**: Get a FREE Serper API key:
1. Visit https://serper.dev/
2. Sign up for a free account (100 searches/month)
3. Copy your API key
4. Add to your .env file: `SERPER_API_KEY=your-key-here`
