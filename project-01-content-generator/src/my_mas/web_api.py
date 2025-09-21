#!/usr/bin/env python3
"""
FastAPI Web Layer for Content Generator
Provides REST API and WebSocket endpoints for the CrewAI content generation system
"""

from fastapi import FastAPI, WebSocket, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import asyncio
import uuid
import json
from datetime import datetime
import os
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv

from my_mas.crew import ContentGeneratorCrew
import httpx

# Load .env file without overriding existing environment variables
load_dotenv(override=False)

# Default CORS origin keeps the local dev UI working without exposing wildcard access
DEFAULT_ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]


def _parse_allowed_origins(raw_origins: str) -> List[str]:
    """Return a sanitized list of allowed origins from env configuration."""
    if not raw_origins:
        return DEFAULT_ALLOWED_ORIGINS

    cleaned: List[str] = []
    for candidate in (origin.strip() for origin in raw_origins.split(",")):
        if not candidate:
            continue
        if candidate == "*":
            return ["*"]

        parsed = urlparse(candidate)
        if parsed.scheme in {"http", "https"} and parsed.netloc:
            normalized = f"{parsed.scheme}://{parsed.netloc}"
            cleaned.append(normalized)

    return cleaned or DEFAULT_ALLOWED_ORIGINS

# Initialize FastAPI app
app = FastAPI(
    title="Content Generator API",
    description="Multi-agent content generation using CrewAI",
    version="1.0.0"
)

# Enable CORS for frontend integration
raw_cors_origins = os.environ.get("CORS_ALLOW_ORIGINS")
if raw_cors_origins is None:
    raw_cors_origins = os.environ.get("CORS_ORIGINS", "")

allowed_origins = _parse_allowed_origins(raw_cors_origins)
allow_all_origins = allowed_origins == ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all_origins else allowed_origins,
    allow_credentials=not allow_all_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for job status and results
jobs: Dict[str, Dict] = {}
active_connections: Dict[str, WebSocket] = {}

async def validate_api_keys() -> Dict[str, bool]:
    """Validate available API keys and return their status"""
    validation_results = {
        "openai_valid": False,
        "anthropic_valid": False,
        "demo_mode": False,
    }

    # Refresh environment (without overriding variables that are already set)
    load_dotenv(override=False)
    openai_key = os.environ.get("OPENAI_API_KEY")
    print("DEBUG: OpenAI API key detected" if openai_key else "DEBUG: No OpenAI API key found")

    if openai_key and openai_key not in {"demo-key", "your-openai-api-key-here"}:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    "https://api.openai.com/v1/models",
                    headers={"Authorization": f"Bearer {openai_key}"}
                )
                validation_results["openai_valid"] = response.status_code == 200
                print(f"DEBUG: OpenAI API validation - Status: {response.status_code}, Valid: {validation_results['openai_valid']}")
        except Exception as e:
            validation_results["openai_valid"] = False
            print(f"DEBUG: OpenAI API validation failed with exception: {e}")
    else:
        print(f"DEBUG: OpenAI API key not provided or invalid format")

    # Check Anthropic API key
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
    if anthropic_key and anthropic_key not in {"demo-key", "your-anthropic-api-key-here"}:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "Authorization": f"Bearer {anthropic_key}",
                        "Content-Type": "application/json",
                        "anthropic-version": "2023-06-01"
                    },
                    json={
                        "model": "claude-3-haiku-20240307",
                        "max_tokens": 1,
                        "messages": [{"role": "user", "content": "test"}]
                    }
                )
                validation_results["anthropic_valid"] = response.status_code in [200, 400]  # 400 is expected for this test
        except Exception:
            validation_results["anthropic_valid"] = False

    # Simple demo mode logic: Use demo content only when no valid API keys exist
    validation_results["demo_mode"] = not (validation_results["openai_valid"] or validation_results["anthropic_valid"])

    if validation_results["demo_mode"]:
        print(f"DEBUG: Using demo content - No valid API keys found (OpenAI: {validation_results['openai_valid']}, Anthropic: {validation_results['anthropic_valid']})")
    else:
        print(f"DEBUG: Using live AI - Valid API keys found (OpenAI: {validation_results['openai_valid']}, Anthropic: {validation_results['anthropic_valid']})")

    return validation_results

class ContentRequest(BaseModel):
    topic: str
    agents: Optional[Dict] = None
    tasks: Optional[Dict] = None

class JobStatus(BaseModel):
    job_id: str
    status: str  # pending, running, completed, error
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[str] = None
    error: Optional[str] = None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Content Generator API",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/api/status")
async def api_status():
    """Get API key validation status"""
    validation = await validate_api_keys()
    return {
        "openai_connected": validation["openai_valid"],
        "anthropic_connected": validation["anthropic_valid"],
        "demo_mode": validation["demo_mode"],
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/generate", response_model=Dict[str, str])
async def generate_content(request: ContentRequest, background_tasks: BackgroundTasks):
    """
    Start content generation process
    Returns job_id for tracking progress
    """
    job_id = str(uuid.uuid4())

    # Validate API keys first
    api_validation = await validate_api_keys()

    # Initialize job record
    jobs[job_id] = {
        "job_id": job_id,
        "status": "pending",
        "created_at": datetime.now(),
        "topic": request.topic,
        "agents": request.agents,
        "tasks": request.tasks,
        "result": None,
        "error": None,
        "console_output": [],
        "demo_mode": api_validation["demo_mode"],
        "api_status": api_validation
    }

    # Start background task
    background_tasks.add_task(run_content_generation, job_id, request, api_validation)

    return {"job_id": job_id, "status": "pending"}

@app.get("/api/status/{job_id}", response_model=JobStatus)
async def get_job_status(job_id: str):
    """Get current status of content generation job"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    return JobStatus(
        job_id=job["job_id"],
        status=job["status"],
        created_at=job["created_at"],
        started_at=job.get("started_at"),
        completed_at=job.get("completed_at"),
        result=job.get("result"),
        error=job.get("error")
    )

@app.get("/api/result/{job_id}")
async def get_job_result(job_id: str):
    """Get the generated content result"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail="Job not completed yet")
    
    return {
        "job_id": job_id,
        "topic": job["topic"],
        "result": job["result"],
        "completed_at": job["completed_at"]
    }

@app.websocket("/ws/console/{job_id}")
async def websocket_console(websocket: WebSocket, job_id: str):
    """
    WebSocket endpoint for real-time console output
    """
    await websocket.accept()
    active_connections[job_id] = websocket
    
    try:
        # Send existing console output if any
        if job_id in jobs and jobs[job_id]["console_output"]:
            for message in jobs[job_id]["console_output"]:
                await websocket.send_text(json.dumps(message))
        
        # Keep connection alive and listen for client messages
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=1.0)
                # Handle client messages if needed
            except asyncio.TimeoutError:
                # Send heartbeat to keep connection alive
                await websocket.send_text(json.dumps({
                    "type": "heartbeat",
                    "timestamp": datetime.now().isoformat()
                }))
            except Exception:
                break
                
    except Exception as e:
        print(f"WebSocket error for job {job_id}: {e}")
    finally:
        if job_id in active_connections:
            del active_connections[job_id]

async def send_console_message(job_id: str, message: str, message_type: str = "info"):
    """Send message to console WebSocket if connected"""
    console_msg = {
        "type": message_type,
        "message": message,
        "timestamp": datetime.now().isoformat()
    }
    
    # Store in job record
    if job_id in jobs:
        jobs[job_id]["console_output"].append(console_msg)
    
    # Send to active WebSocket connection
    if job_id in active_connections:
        try:
            await active_connections[job_id].send_text(json.dumps(console_msg))
        except Exception as e:
            print(f"Failed to send WebSocket message: {e}")
            # Remove broken connection
            if job_id in active_connections:
                del active_connections[job_id]

async def run_content_generation(job_id: str, request: ContentRequest, api_validation: Dict[str, bool]):
    """
    Background task to run the CrewAI content generation with improved error handling
    """
    try:
        jobs[job_id]["status"] = "running"
        jobs[job_id]["started_at"] = datetime.now()

        await send_console_message(job_id, f"🚀 Starting content generation for: {request.topic}", "info")

        # Determine mode based on API validation
        demo_mode = api_validation["demo_mode"]

        if demo_mode:
            await send_console_message(job_id, "🤖 Using demo content - No valid API keys found", "warning")
            await run_demo_generation(job_id, request)
        else:
            # Check which API is available
            if api_validation["openai_valid"]:
                await send_console_message(job_id, "✅ OpenAI API key validated - using GPT-4o mini", "info")
            elif api_validation["anthropic_valid"]:
                await send_console_message(job_id, "✅ Anthropic API key validated - using Claude", "info")

            await run_real_generation(job_id, request)

    except Exception as e:
        error_msg = f"Content generation failed: {str(e)}"
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = error_msg
        jobs[job_id]["completed_at"] = datetime.now()

        # Provide helpful error messages
        if "AuthenticationError" in str(e):
            await send_console_message(job_id, "❌ API Authentication Failed", "error")
            await send_console_message(job_id, "💡 Solution: Check your API key or enable demo mode", "warning")
        elif "timeout" in str(e).lower():
            await send_console_message(job_id, "❌ Request Timeout", "error")
            await send_console_message(job_id, "💡 Solution: Try again or check your internet connection", "warning")
        else:
            await send_console_message(job_id, f"❌ {error_msg}", "error")

async def run_demo_generation(job_id: str, request: ContentRequest):
    """Run demo content generation with realistic simulation"""
    await asyncio.sleep(2)
    await send_console_message(job_id, "📋 Initializing Content Generation Crew...", "info")
    await asyncio.sleep(2)

    await send_console_message(job_id, "🔍 Research Agent: Starting comprehensive research...", "info")
    await asyncio.sleep(3)
    await send_console_message(job_id, f"🔍 Research Agent: Gathering information on '{request.topic}'", "info")
    await asyncio.sleep(3)

    await send_console_message(job_id, "🎯 Strategy Agent: Developing content framework...", "info")
    await asyncio.sleep(3)

    await send_console_message(job_id, "📝 Writer Agent: Creating engaging content...", "info")
    await asyncio.sleep(4)

    # Generate realistic demo content
    result = f"""# {request.topic}: A Comprehensive Overview

## Introduction
This is a demonstration of the AI Content Generator system. In actual operation with valid API keys, this would contain comprehensive, research-backed content about {request.topic}.

## Key Points
- Professional content generation using CrewAI multi-agent system
- Powered by GPT-4o mini (cost-effective GPT-4-class model)
- Research → Strategy → Writing workflow
- Real-time progress tracking via WebSocket

## Next Steps
To enable full functionality:
1. Add valid OpenAI API key to .env file
2. Or add valid Anthropic API key for Claude integration
3. Restart the application
4. Generate real AI-powered content!

---
*Generated in Demo Mode - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*"""

    jobs[job_id]["status"] = "completed"
    jobs[job_id]["completed_at"] = datetime.now()
    jobs[job_id]["result"] = result

    await send_console_message(job_id, "✅ Demo content generation completed!", "success")
    await send_console_message(job_id, "📄 Demo content is ready for review!", "success")

async def run_real_generation(job_id: str, request: ContentRequest):
    """Run real content generation with CrewAI"""
    await send_console_message(job_id, "📋 Initializing Content Generation Crew...", "info")

    # Create crew instance with topic
    inputs = {"topic": request.topic}
    crew = ContentGeneratorCrew()

    await send_console_message(job_id, "🔍 Research Agent: Starting comprehensive research...", "info")
    await send_console_message(job_id, f"🔍 Research Agent: Gathering information on '{request.topic}'", "info")

    await send_console_message(job_id, "🎯 Strategy Agent: Developing content framework...", "info")
    await send_console_message(job_id, "📝 Writer Agent: Creating engaging content...", "info")

    # Execute the crew with timeout
    try:
        result = await asyncio.wait_for(
            asyncio.to_thread(crew.crew().kickoff, inputs=inputs),
            timeout=300  # 5 minute timeout
        )

        jobs[job_id]["status"] = "completed"
        jobs[job_id]["completed_at"] = datetime.now()
        jobs[job_id]["result"] = str(result)

        await send_console_message(job_id, "✅ Content generation completed successfully!", "success")
        await send_console_message(job_id, "📄 Generated content is ready for review!", "success")

    except asyncio.TimeoutError:
        raise Exception("Content generation timed out after 5 minutes")

if __name__ == "__main__":
    import uvicorn
    
    # Ensure output directory exists
    Path("generated_content").mkdir(exist_ok=True)
    
    print("🚀 Starting Content Generator API...")
    print("📊 Endpoints available:")
    print("  • POST /api/generate - Start content generation")
    print("  • GET /api/status/{job_id} - Check job status")  
    print("  • GET /api/result/{job_id} - Get generated content")
    print("  • WebSocket /ws/console/{job_id} - Real-time console")
    print("🔗 Open: http://localhost:8000")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
