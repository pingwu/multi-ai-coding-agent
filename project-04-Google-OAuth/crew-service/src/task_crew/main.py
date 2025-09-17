#!/usr/bin/env python
"""
Task Crew Main Entry Point
Supports both CLI and HTTP server modes
"""

import sys
import os
from datetime import datetime
from typing import Dict, Any, Optional, List
import logging

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

from task_crew.agents.simple_task_agent import create_simple_task_agent
from task_crew.tools.google_sheets_tools import GoogleSheetsReaderTool, GoogleSheetsWriterTool, GoogleSheetsUpdaterTool

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models
class TaskRequest(BaseModel):
    input: str
    sheet_id: Optional[str] = None

class TaskResponse(BaseModel):
    success: bool
    actions_taken: List[str] = []
    current_tasks: Optional[List[Dict[str, Any]]] = None
    error: Optional[str] = None

class ReportResponse(BaseModel):
    total_tasks: int
    priority_summary: Dict[str, int]
    status_summary: Dict[str, int]
    risk_alerts: List[str]
    recommendations: List[str]
    completion_rate: str
    timestamp: str


class TaskService:
    """Service for processing natural language input and managing Google Sheets tasks."""

    def __init__(self):
        """Initialize the Task Service with agents and tools."""
        self.simple_agent = create_simple_task_agent()
        self.sheets_reader = GoogleSheetsReaderTool()
        self.sheets_writer = GoogleSheetsWriterTool()
        self.sheets_updater = GoogleSheetsUpdaterTool()

    def process_simple_task_input(self, user_input: str, sheet_id: str = None) -> Dict[str, Any]:
        """Process natural language input using simple task agent."""
        try:
            if not user_input or not user_input.strip():
                return {"error": "No input provided"}

            if not sheet_id:
                sheet_id = os.environ.get('GOOGLE_SHEETS_ID')
                if not sheet_id:
                    return {"error": "No Google Sheets ID configured"}

            # Parse the input using simple task agent
            parsed_task = self.simple_agent.parse_simple_task(user_input)

            # Get current tasks to check for existing tasks
            current_tasks = self.sheets_reader._run(sheet_id)
            if isinstance(current_tasks, dict) and "error" in current_tasks:
                return {"error": f"Could not read current tasks: {current_tasks['error']}"}

            result = {"success": True, "user_input": user_input, "actions_taken": []}

            if parsed_task['action'] == 'complete':
                # Try to find and update existing task
                updated = self._update_existing_task(parsed_task['title'], 'COMPLETED', sheet_id)
                if updated:
                    result["actions_taken"].append(f"✅ Marked '{parsed_task['title']}' as COMPLETED")
                else:
                    # Create new completed task
                    write_result = self.sheets_writer._run(
                        title=parsed_task['title'],
                        status='COMPLETED',
                        priority=parsed_task['priority'],
                        category=parsed_task['category'],
                        raw_input=user_input,
                        sheet_id=sheet_id
                    )
                    if write_result.get('success'):
                        result["actions_taken"].append(f"✅ Created completed task: '{parsed_task['title']}'")

            elif parsed_task['action'] == 'update':
                # Try to update existing task
                updated = self._update_existing_task(parsed_task['title'], parsed_task['status'], sheet_id)
                if updated:
                    result["actions_taken"].append(f"🔄 Updated progress on '{parsed_task['title']}'")
                else:
                    result["actions_taken"].append(f"ℹ️ Could not find existing task to update, consider creating a new one")

            else:  # create new task
                write_result = self.sheets_writer._run(
                    title=parsed_task['title'],
                    status=parsed_task['status'],
                    priority=parsed_task['priority'],
                    category=parsed_task['category'],
                    raw_input=user_input,
                    sheet_id=sheet_id
                )
                if write_result.get('success'):
                    result["actions_taken"].append(f"➕ Created new task: '{parsed_task['title']}' ({parsed_task['priority']} priority)")

            # Get updated task list
            updated_tasks = self.sheets_reader._run(sheet_id)
            result["current_tasks"] = updated_tasks if not isinstance(updated_tasks, dict) or "error" not in updated_tasks else []

            return result

        except Exception as e:
            return {"error": f"Processing failed: {str(e)}"}

    def _update_existing_task(self, title_to_find: str, new_status: str, sheet_id: str) -> bool:
        """Helper method to find and update existing tasks by title similarity."""
        try:
            current_tasks = self.sheets_reader._run(sheet_id)
            if isinstance(current_tasks, dict) and "error" in current_tasks:
                return False

            # Find tasks with similar titles
            title_lower = title_to_find.lower()
            for task in current_tasks:
                task_title = str(task.get('title', '')).lower()
                if title_lower in task_title or task_title in title_lower:
                    # Found a match, update it
                    task_id = task.get('task_id', '')
                    if task_id:
                        update_result = self.sheets_updater._run(
                            task_identifier=task_id,
                            status=new_status,
                            sheet_id=sheet_id
                        )
                        return update_result.get('success', False)

            return False
        except Exception:
            return False

    def get_simple_report(self, sheet_id: str = None) -> Dict[str, Any]:
        """Generate a simple priority and risk report for current tasks."""
        try:
            if not sheet_id:
                sheet_id = os.environ.get('GOOGLE_SHEETS_ID')
                if not sheet_id:
                    return {"error": "No Google Sheets ID configured"}

            # Get current tasks
            current_tasks = self.sheets_reader._run(sheet_id)
            if isinstance(current_tasks, dict) and "error" in current_tasks:
                return {"error": f"Could not read tasks: {current_tasks['error']}"}

            # Generate report using simple agent
            report = self.simple_agent.generate_simple_report(current_tasks)
            report['timestamp'] = datetime.now().isoformat()
            report['sheet_id'] = sheet_id

            return report

        except Exception as e:
            return {"error": f"Report generation failed: {str(e)}"}


# Initialize service
task_service = TaskService()

# FastAPI app for HTTP server mode
app = FastAPI(
    title="Task Crew Service",
    description="CrewAI service for intelligent task management",
    version="0.1.0"
)

@app.get("/")
async def root():
    return {
        "message": "Task Crew Service",
        "description": "CrewAI service for intelligent task management with Google Sheets",
        "version": "0.1.0",
        "endpoints": {
            "POST /process": "Process natural language task input",
            "GET /tasks": "Get all tasks from Google Sheets",
            "GET /report": "Get priority and risk report",
            "GET /config": "Check configuration status"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "task-crew",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/process", response_model=TaskResponse)
async def process_task(request: TaskRequest):
    """Process natural language task input."""
    try:
        result = task_service.process_simple_task_input(request.input, request.sheet_id)

        return TaskResponse(
            success=result.get("success", False),
            actions_taken=result.get("actions_taken", []),
            current_tasks=result.get("current_tasks", []),
            error=result.get("error")
        )
    except Exception as e:
        logger.error(f"Error processing task: {str(e)}")
        return TaskResponse(
            success=False,
            error=f"Processing failed: {str(e)}"
        )

@app.get("/tasks")
async def get_all_tasks(sheet_id: Optional[str] = None):
    """Get all tasks from Google Sheets."""
    try:
        if not sheet_id:
            sheet_id = os.environ.get('GOOGLE_SHEETS_ID')
            if not sheet_id:
                raise HTTPException(status_code=400, detail="No Google Sheets ID configured")

        tasks = task_service.sheets_reader._run(sheet_id)

        if isinstance(tasks, dict) and "error" in tasks:
            raise HTTPException(status_code=500, detail=tasks["error"])

        return {
            "tasks": tasks,
            "count": len(tasks),
            "timestamp": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch tasks: {str(e)}")

@app.get("/report", response_model=ReportResponse)
async def get_report(sheet_id: Optional[str] = None):
    """Get priority and risk report."""
    try:
        report = task_service.get_simple_report(sheet_id)

        if "error" in report:
            raise HTTPException(status_code=500, detail=report["error"])

        return ReportResponse(**report)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")

@app.get("/config")
async def get_config():
    """Get configuration status."""
    try:
        return {
            "google_sheets_configured": bool(os.environ.get('GOOGLE_SHEETS_ID')),
            "credentials_configured": os.path.exists("credentials/gcp-service-account.json"),
            "openai_configured": bool(os.environ.get('OPENAI_API_KEY')),
            "sheet_id": os.environ.get('GOOGLE_SHEETS_ID', 'Not configured'),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "error": f"Configuration check failed: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }


def cli():
    """CLI entry point for running task crew locally."""
    inputs = {
        'topic': 'Task Management',
        'current_year': str(datetime.now().year)
    }

    try:
        # Example CLI usage
        user_input = input("Enter task description: ")
        result = task_service.process_simple_task_input(user_input)
        print(f"Result: {result}")
    except Exception as e:
        print(f"An error occurred: {e}")


def serve():
    """HTTP server entry point."""
    uvicorn.run(
        "task_crew.main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "serve":
        serve()
    else:
        cli()