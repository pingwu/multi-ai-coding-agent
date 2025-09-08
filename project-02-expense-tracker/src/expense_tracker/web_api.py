#!/usr/bin/env python3
"""
FastAPI Web Layer for Expense Tracker
Provides REST API and WebSocket endpoints for the CrewAI expense processing system
"""

from fastapi import FastAPI, WebSocket, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import asyncio
import uuid
import json
from datetime import datetime, timezone
import os
from pathlib import Path

from expense_tracker.crew import ExpenseTrackerCrew
from expense_tracker.tools import get_csv_handler, add_expense_to_csv

# Initialize FastAPI app
app = FastAPI(
    title="Expense Tracker API",
    description="AI-powered expense tracking with natural language processing using CrewAI",
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
processing_jobs: Dict[str, Dict] = {}
active_connections: Dict[str, WebSocket] = {}

# Performance optimization: Singleton crew instance to avoid re-initialization
_expense_crew_instance: Optional[ExpenseTrackerCrew] = None

def get_expense_crew() -> ExpenseTrackerCrew:
    """Get or create singleton expense crew instance for better performance"""
    global _expense_crew_instance
    if _expense_crew_instance is None:
        _expense_crew_instance = ExpenseTrackerCrew()
    return _expense_crew_instance

class ExpenseRequest(BaseModel):
    description: str
    user_notes: Optional[str] = None

class ExpenseResponse(BaseModel):
    success: bool
    expense_record: Optional[Dict] = None
    error_message: Optional[str] = None
    processing_time: Optional[float] = None

class JobStatus(BaseModel):
    job_id: str
    status: str  # pending, running, completed, error
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[Dict] = None
    error: Optional[str] = None

class ExpenseSummary(BaseModel):
    total_amount: float
    total_expenses: int
    categories: Dict
    date_range: Optional[str] = None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Expense Tracker API is running"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    csv_handler = get_csv_handler()
    file_stats = csv_handler.get_file_stats()
    
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data_storage": file_stats,
        "active_jobs": len(processing_jobs)
    }

@app.post("/expenses", response_model=ExpenseResponse)
async def add_expense(request: ExpenseRequest):
    """
    Process a natural language expense description and add to CSV storage
    
    Example requests:
    - "I spent $25 at Starbucks yesterday for a client meeting"  
    - "Monthly Spotify subscription renewed for $12"
    - "Gas for client visits, $45 at Shell station"
    """
    start_time = datetime.now()
    
    try:
        # Get singleton expense crew instance for better performance
        expense_crew = get_expense_crew()
        
        # Process the expense through AI agents
        processed_record = expense_crew.process_expense(request.description)
        
        # Add user notes if provided
        if request.user_notes:
            processed_record["notes"] = request.user_notes
        
        # Validate and save to CSV
        csv_handler = get_csv_handler()
        validation_result = csv_handler.validate_expense_record(processed_record)
        
        if validation_result["valid"]:
            success = csv_handler.add_expense(validation_result["cleaned_record"])
            
            if success:
                processing_time = (datetime.now() - start_time).total_seconds()
                
                return ExpenseResponse(
                    success=True,
                    expense_record=validation_result["cleaned_record"],
                    processing_time=processing_time
                )
            else:
                raise HTTPException(status_code=500, detail="Failed to save expense to storage")
        else:
            return ExpenseResponse(
                success=False,
                error_message=f"Validation errors: {', '.join(validation_result['errors'])}"
            )
            
    except Exception as e:
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return ExpenseResponse(
            success=False,
            error_message=str(e),
            processing_time=processing_time
        )

@app.get("/expenses")
async def get_expenses(
    limit: Optional[int] = Query(None, description="Maximum number of expenses to return"),
    category: Optional[str] = Query(None, description="Filter by expense category"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)")
):
    """
    Retrieve expenses with optional filtering
    """
    try:
        csv_handler = get_csv_handler()
        
        # Apply filters based on query parameters
        if start_date and end_date:
            filtered_expenses = csv_handler.get_expenses_by_date_range(start_date, end_date)
        elif category:
            filtered_expenses = csv_handler.get_expenses_by_category(category)
        else:
            filtered_expenses = csv_handler.get_all_expenses()
        
        # Apply limit if specified
        if limit:
            filtered_expenses = filtered_expenses[:limit]
        
        return {
            "expenses": filtered_expenses,
            "count": len(filtered_expenses),
            "filters_applied": {
                "category": category,
                "date_range": f"{start_date} to {end_date}" if start_date and end_date else None,
                "limit": limit
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/expenses/search")
async def search_expenses(q: str = Query(..., description="Search query for vendor, description, or purpose")):
    """
    Search expenses by vendor, description, business purpose, or notes
    """
    try:
        csv_handler = get_csv_handler()
        search_results = csv_handler.search_expenses(q)
        
        return {
            "query": q,
            "results": search_results,
            "count": len(search_results)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/expenses/summary", response_model=ExpenseSummary)  
async def get_expense_summary(
    year: Optional[int] = Query(None, description="Year for monthly summary"),
    month: Optional[int] = Query(None, description="Month for summary (1-12)")
):
    """
    Get expense summary with category breakdowns
    """
    try:
        csv_handler = get_csv_handler()
        
        if year and month:
            summary_data = csv_handler.get_monthly_summary(year, month)
            date_range = f"{year}-{month:02d}"
        else:
            # Get all-time summary
            all_expenses = csv_handler.get_all_expenses()
            
            category_totals = {}
            total_amount = 0.0
            
            for expense in all_expenses:
                category = expense.get('category', 'OTHER')
                amount = float(expense.get('amount', 0))
                
                if category not in category_totals:
                    category_totals[category] = {'total': 0.0, 'count': 0}
                
                category_totals[category]['total'] += amount
                category_totals[category]['count'] += 1
                total_amount += amount
            
            summary_data = {
                'total_amount': total_amount,
                'total_expenses': len(all_expenses),
                'categories': category_totals
            }
            date_range = "all-time"
        
        return ExpenseSummary(
            total_amount=summary_data['total_amount'],
            total_expenses=summary_data['total_expenses'],
            categories=summary_data['categories'],
            date_range=date_range
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/expenses/categories")
async def get_categories():
    """
    Get list of expense categories with counts
    """
    try:
        csv_handler = get_csv_handler()
        all_expenses = csv_handler.get_all_expenses()
        
        category_counts = {}
        for expense in all_expenses:
            category = expense.get('category', 'OTHER')
            category_counts[category] = category_counts.get(category, 0) + 1
        
        return {
            "categories": category_counts,
            "total_categories": len(category_counts)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/expenses/process-async")
async def process_expense_async(request: ExpenseRequest, background_tasks: BackgroundTasks):
    """
    Process expense asynchronously and return job ID for status tracking
    """
    job_id = str(uuid.uuid4())
    
    processing_jobs[job_id] = {
        "job_id": job_id,
        "status": "pending", 
        "created_at": datetime.now(timezone.utc),
        "request": request.dict()
    }
    
    # Add background task
    background_tasks.add_task(process_expense_background, job_id, request)
    
    return {"job_id": job_id, "status": "pending"}

@app.get("/jobs/{job_id}")
async def get_job_status(job_id: str):
    """
    Get status of an async expense processing job
    """
    if job_id not in processing_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job_data = processing_jobs[job_id]
    return JobStatus(**job_data)

async def process_expense_background(job_id: str, request: ExpenseRequest):
    """
    Background task for processing expenses asynchronously
    """
    try:
        # Update job status
        processing_jobs[job_id]["status"] = "running"
        processing_jobs[job_id]["started_at"] = datetime.now(timezone.utc)
        
        # Process expense
        expense_crew = get_expense_crew()
        processed_record = expense_crew.process_expense(request.description)
        
        # Add user notes
        if request.user_notes:
            processed_record["notes"] = request.user_notes
        
        # Save to CSV
        csv_handler = get_csv_handler()
        validation_result = csv_handler.validate_expense_record(processed_record)
        
        if validation_result["valid"]:
            success = csv_handler.add_expense(validation_result["cleaned_record"])
            
            if success:
                processing_jobs[job_id]["status"] = "completed"
                processing_jobs[job_id]["result"] = validation_result["cleaned_record"]
            else:
                processing_jobs[job_id]["status"] = "error"
                processing_jobs[job_id]["error"] = "Failed to save expense"
        else:
            processing_jobs[job_id]["status"] = "error"
            processing_jobs[job_id]["error"] = f"Validation failed: {validation_result['errors']}"
        
    except Exception as e:
        processing_jobs[job_id]["status"] = "error"
        processing_jobs[job_id]["error"] = str(e)
    
    finally:
        processing_jobs[job_id]["completed_at"] = datetime.now(timezone.utc)

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """
    WebSocket endpoint for real-time expense processing updates
    """
    await websocket.accept()
    active_connections[client_id] = websocket
    
    try:
        while True:
            # Receive expense description from client
            data = await websocket.receive_text()
            expense_data = json.loads(data)
            
            # Send processing status updates
            await websocket.send_text(json.dumps({
                "status": "processing",
                "message": "Processing your expense with AI agents..."
            }))
            
            try:
                # Process expense
                expense_crew = get_expense_crew()
                processed_record = expense_crew.process_expense(expense_data["description"])
                
                # Save to CSV
                success = add_expense_to_csv(processed_record)
                
                if success:
                    await websocket.send_text(json.dumps({
                        "status": "completed",
                        "message": "Expense processed and saved successfully!",
                        "expense_record": processed_record
                    }))
                else:
                    await websocket.send_text(json.dumps({
                        "status": "error", 
                        "message": "Failed to save expense to storage"
                    }))
                    
            except Exception as e:
                await websocket.send_text(json.dumps({
                    "status": "error",
                    "message": f"Processing error: {str(e)}"
                }))
                
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        if client_id in active_connections:
            del active_connections[client_id]

# Export data endpoints
@app.get("/export/json")
async def export_expenses_json():
    """
    Export all expenses as JSON for external accounting software
    """
    try:
        csv_handler = get_csv_handler()
        json_data = csv_handler.export_to_json()
        
        return {
            "data": json.loads(json_data),
            "export_timestamp": datetime.now(timezone.utc).isoformat(),
            "format": "json"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)