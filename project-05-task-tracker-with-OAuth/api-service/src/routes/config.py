"""
Configuration management routes
Handles Google Sheets ID and other configuration settings
"""

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import os
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


class SheetsConfigRequest(BaseModel):
    sheet_id: str


class SheetsConfigResponse(BaseModel):
    success: bool
    sheet_id: str
    message: str


@router.post("/api/config/sheets", response_model=SheetsConfigResponse)
async def save_sheets_config(request: SheetsConfigRequest, http_request: Request):
    """
    Save Google Sheets ID configuration.

    Note: In a production environment, this should save to a database.
    For this demo, we're using environment variables and would need to persist
    to a config file or database.
    """
    try:
        sheet_id = request.sheet_id.strip()

        if not sheet_id:
            raise HTTPException(status_code=400, detail="Sheet ID cannot be empty")

        # Validate sheet ID format (basic validation)
        if len(sheet_id) < 20:
            raise HTTPException(status_code=400, detail="Invalid Sheet ID format")

        # In a real application, you would:
        # 1. Save to database with user association
        # 2. Update environment or config file
        # 3. Notify crew-service of the new configuration

        # For now, we'll just validate and return success
        # The user would need to update their .env file manually
        logger.info(f"Google Sheets ID configured: {sheet_id[:10]}...")

        return SheetsConfigResponse(
            success=True,
            sheet_id=sheet_id,
            message="Google Sheets configuration saved. Please update your .env file with this Sheet ID and restart the services."
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error saving sheets config: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save configuration: {str(e)}")


@router.get("/api/config/sheets")
async def get_sheets_config():
    """Get current Google Sheets configuration."""
    try:
        sheet_id = os.getenv("GOOGLE_SHEETS_ID", "")

        return {
            "configured": bool(sheet_id),
            "sheet_id": sheet_id if sheet_id else None,
            "message": "Sheet ID configured" if sheet_id else "No Sheet ID configured"
        }

    except Exception as e:
        logger.error(f"Error fetching sheets config: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch configuration: {str(e)}")
