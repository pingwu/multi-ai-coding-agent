"""
FastAPI API Gateway Service
Simple HTTP gateway that forwards requests to crew-service for AI processing
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import os
from datetime import datetime
import httpx
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models for request/response
class TaskInputRequest(BaseModel):
    input: str
    sheet_id: Optional[str] = None


class TaskInputResponse(BaseModel):
    success: bool
    user_input: str
    actions_taken: List[str] = []
    current_tasks: Optional[List[Dict[str, Any]]] = None
    error: Optional[str] = None
    timestamp: str


class SimpleReportResponse(BaseModel):
    total_tasks: int
    priority_summary: Dict[str, int]
    status_summary: Dict[str, int]
    risk_alerts: List[str]
    recommendations: List[str]
    completion_rate: str
    timestamp: str


# Initialize FastAPI app
app = FastAPI(
    title="Task Tracker API Gateway",
    description="HTTP gateway for AI-powered task management",
    version="1.0.0"
)

# Configure logging level and redaction
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.getLogger().setLevel(getattr(logging, LOG_LEVEL, logging.INFO))

REDACT_INPUTS = os.getenv("LOG_REDACT_INPUTS", "true").lower() in ("1", "true", "yes")

# Configure CORS (env-driven)
# Use default if env var is missing or empty
raw_origins = os.getenv("ALLOWED_ORIGINS") or "http://localhost:3000,http://localhost:3001"
ALLOWED_ORIGINS = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get crew service URL from environment
CREW_SERVICE_URL = os.getenv("CREW_SERVICE_URL", "http://crew-service:8001")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Task Tracker API Gateway",
        "description": "HTTP gateway for AI-powered task management",
        "services": {
            "crew_service": CREW_SERVICE_URL,
            "status": "running"
        },
        "endpoints": {
            "POST /api/tasks": "Process natural language task input",
            "GET /api/tasks": "Get all tasks from Google Sheets",
            "GET /api/report": "Get priority and risk report",
            "GET /api/config": "Check configuration status"
        },
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    # Check if crew service is available
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{CREW_SERVICE_URL}/health", timeout=5.0)
            crew_healthy = response.status_code == 200
    except:
        crew_healthy = False

    return {
        "status": "healthy",
        "services": {
            "api_gateway": "healthy",
            "crew_service": "healthy" if crew_healthy else "unhealthy"
        },
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/tasks", response_model=TaskInputResponse)
async def process_task_input(request: TaskInputRequest):
    """
    Process natural language input via crew service.
    """
    try:
        if REDACT_INPUTS and LOG_LEVEL != "DEBUG":
            logger.info("Processing task input (content redacted)")
        else:
            logger.debug(f"Processing task input preview: {request.input[:100]}...")

        # Forward request to crew service
        async with httpx.AsyncClient() as client:
            crew_response = await client.post(
                f"{CREW_SERVICE_URL}/process",
                json=request.dict(),
                timeout=60.0  # AI processing can take time
            )

            if crew_response.status_code != 200:
                raise HTTPException(
                    status_code=crew_response.status_code,
                    detail=f"Crew service error: {crew_response.text}"
                )

            result = crew_response.json()

        # Return standardized response
        return TaskInputResponse(
            success=result.get("success", False),
            user_input=request.input,
            actions_taken=result.get("actions_taken", []),
            current_tasks=result.get("current_tasks", [])[:10],  # Limit for performance
            error=result.get("error"),
            timestamp=datetime.now().isoformat()
        )

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Crew service timeout - AI processing took too long"
        )
    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Crew service unavailable - check service status"
        )
    except Exception as e:
        logger.error(f"Error processing task: {str(e)}")
        return TaskInputResponse(
            success=False,
            user_input=request.input,
            error=f"Processing failed: {str(e)}",
            timestamp=datetime.now().isoformat()
        )


@app.get("/api/tasks")
async def get_all_tasks(sheet_id: Optional[str] = None):
    """Get all tasks from Google Sheets via crew service."""
    try:
        params = {"sheet_id": sheet_id} if sheet_id else {}

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{CREW_SERVICE_URL}/tasks",
                params=params,
                timeout=30.0
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Crew service error: {response.text}"
                )

            return response.json()

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request timeout")
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Crew service unavailable")
    except Exception as e:
        logger.error(f"Error fetching tasks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch tasks: {str(e)}")


@app.get("/api/report", response_model=SimpleReportResponse)
async def get_simple_report(sheet_id: Optional[str] = None):
    """Get priority and risk report via crew service."""
    try:
        params = {"sheet_id": sheet_id} if sheet_id else {}

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{CREW_SERVICE_URL}/report",
                params=params,
                timeout=30.0
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Crew service error: {response.text}"
                )

            return SimpleReportResponse(**response.json())

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request timeout")
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Crew service unavailable")
    except Exception as e:
        logger.error(f"Error generating report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")


@app.get("/api/config")
async def get_config():
    """Get configuration status from crew service."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{CREW_SERVICE_URL}/config", timeout=10.0)

            if response.status_code != 200:
                return {
                    "error": "Could not reach crew service",
                    "crew_service_url": CREW_SERVICE_URL,
                    "timestamp": datetime.now().isoformat()
                }

            return response.json()

    except Exception as e:
        return {
            "error": f"Configuration check failed: {str(e)}",
            "crew_service_url": CREW_SERVICE_URL,
            "timestamp": datetime.now().isoformat()
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
