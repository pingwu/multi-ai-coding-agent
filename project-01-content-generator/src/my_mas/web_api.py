#!/usr/bin/env python3
"""
FastAPI Web Layer for Content Generator
Provides REST API and WebSocket endpoints for the CrewAI content generation system
"""

from fastapi import FastAPI, WebSocket, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
import asyncio
import uuid
import json
from datetime import datetime
import os
from pathlib import Path

from my_mas.crew import ContentGeneratorCrew

# Initialize FastAPI app
app = FastAPI(
    title="Content Generator API",
    description="Multi-agent content generation using CrewAI",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for job status and results
jobs: Dict[str, Dict] = {}
active_connections: Dict[str, WebSocket] = {}

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

@app.post("/api/generate", response_model=Dict[str, str])
async def generate_content(request: ContentRequest, background_tasks: BackgroundTasks):
    """
    Start content generation process
    Returns job_id for tracking progress
    """
    job_id = str(uuid.uuid4())
    
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
        "console_output": []
    }
    
    # Start background task
    background_tasks.add_task(run_content_generation, job_id, request)
    
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

async def run_content_generation(job_id: str, request: ContentRequest):
    """
    Background task to run the CrewAI content generation
    """
    try:
        jobs[job_id]["status"] = "running"
        jobs[job_id]["started_at"] = datetime.now()
        
        await send_console_message(job_id, f"🚀 Starting content generation for: {request.topic}", "info")
        
        # Initialize the CrewAI crew
        await send_console_message(job_id, "📋 Initializing Content Generation Crew...", "info")
        
        # Create crew instance with topic
        inputs = {"topic": request.topic}
        crew = ContentGeneratorCrew()
        
        await send_console_message(job_id, "🔍 Research Agent: Starting comprehensive research...", "info")
        await send_console_message(job_id, f"🔍 Research Agent: Gathering information on '{request.topic}'", "info")
        
        # Run the crew (this is synchronous, so we'll simulate async behavior)
        await send_console_message(job_id, "🎯 Strategy Agent: Developing content framework...", "info")
        await send_console_message(job_id, "📝 Writer Agent: Creating engaging content...", "info")
        
        # Execute the crew
        result = crew.crew().kickoff(inputs=inputs)
        
        await send_console_message(job_id, "✅ Content generation completed successfully!", "success")
        
        # Update job status
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["completed_at"] = datetime.now()
        jobs[job_id]["result"] = str(result)
        
        await send_console_message(job_id, "📄 Generated content is ready for review!", "success")
        
    except Exception as e:
        error_msg = f"Error during content generation: {str(e)}"
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = error_msg
        jobs[job_id]["completed_at"] = datetime.now()
        
        await send_console_message(job_id, f"❌ {error_msg}", "error")

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