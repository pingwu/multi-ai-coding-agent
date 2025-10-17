"""
Google Sheets Tools for CrewAI
Enhanced version based on gprojectplan reference with read/write capabilities
"""

from crewai.tools import BaseTool
import gspread
from google.oauth2.service_account import Credentials
import os
import json
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
import uuid


class GoogleSheetsReaderTool(BaseTool):
    """Tool that reads all tasks from a Google Sheet."""
    
    name: str = "Google Sheets Task Reader"
    description: str = "Reads all task data from a Google Sheet and returns as structured data."

    def _run(self, sheet_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Fetch all task data from the specified Google Sheet.
        
        Args:
            sheet_id (str): The ID of the Google Sheet to fetch data from.
            
        Returns:
            list: All tasks from the Google Sheet as a list of dictionaries.
        """
        try:
            # Get credentials path from environment or use default
            credentials_path = os.environ.get(
                'GOOGLE_APPLICATION_CREDENTIALS', 
                'credentials/gcp-service-account.json'
            )
            
            # Define the scope for Google Sheets and Drive access
            SCOPES = [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ]

            # Load credentials from service account file
            credentials = Credentials.from_service_account_file(
                credentials_path, 
                scopes=SCOPES
            )

            # Authorize the gspread client
            client = gspread.authorize(credentials)

            # Use provided sheet_id or get from environment
            if not sheet_id:
                sheet_id = os.environ.get('GOOGLE_SHEETS_ID')
                if not sheet_id:
                    return {"error": "No Google Sheets ID provided"}

            # Open the Google Sheet
            spreadsheet = client.open_by_key(sheet_id)
            worksheet = spreadsheet.sheet1

            # Get all values as raw data to avoid header issues
            try:
                all_values = worksheet.get_all_values()
                if len(all_values) <= 1:
                    return []
                
                # Use first row as headers, skip empty ones
                headers = [h.strip() for h in all_values[0]]
                tasks = []
                
                # Convert each row to a dictionary
                for row in all_values[1:]:  # Skip header row
                    if any(cell.strip() for cell in row):  # Skip empty rows
                        task = {}
                        for i, value in enumerate(row):
                            if i < len(headers) and headers[i]:
                                task[headers[i]] = value.strip()
                        tasks.append(task)
                
                all_tasks = tasks
            except Exception as e:
                print(f"Error reading sheet values: {e}")
                # Fallback to get_all_records
                try:
                    all_tasks = worksheet.get_all_records()
                except Exception as fallback_error:
                    print(f"Fallback also failed: {fallback_error}")
                    return []
            
            return all_tasks
            
        except Exception as e:
            print(f"Error reading Google Sheet: {e}")
            return {"error": f"Failed to read Google Sheet: {str(e)}"}


class GoogleSheetsWriterTool(BaseTool):
    """Tool that writes new tasks to a Google Sheet."""
    
    name: str = "Google Sheets Task Writer"
    description: str = "Adds new tasks to a Google Sheet with structured data."


    def _run(self,
             title: str,
             description: str = "",
             status: str = "NOT_STARTED",
             category: str = "GENERAL",
             priority: str = "MEDIUM",
             due_date: str = "",
             notes: str = "",
             raw_input: str = "",
             motivation_type: str = "MIXED",
             parent_item_id: str = "",
             last_update_message: str = "",
             user_email: str = "",
             sheet_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Add a new task to the Google Sheet.

        Args:
            title (str): Task title
            description (str): Detailed task description
            status (str): Task status (NOT_STARTED, IN_PROGRESS, COMPLETED, BLOCKED)
            category (str): Task category (DEVELOPMENT, MEETING, DOCUMENTATION, etc.)
            priority (str): Task priority (LOW, MEDIUM, HIGH, CRITICAL)
            due_date (str): Due date in ISO format (optional)
            notes (str): Additional notes about the task
            raw_input (str): Original user input that generated this task
            motivation_type (str): The user's motivation for the task (INTRINSIC, EXTRINSIC, MIXED)
            parent_item_id (str): The ID of the parent task (optional)
            last_update_message (str): A brief message about the last update
            user_email (str): Email address of the user who created this task
            sheet_id (str): Google Sheet ID (optional, uses env var if not provided)

        Returns:
            dict: Result of the operation with task_id and success status.
        """
        try:
            # Get credentials path from environment or use default
            credentials_path = os.environ.get(
                'GOOGLE_APPLICATION_CREDENTIALS', 
                'credentials/gcp-service-account.json'
            )
            
            # Define the scope
            SCOPES = [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ]

            # Load credentials
            credentials = Credentials.from_service_account_file(
                credentials_path, 
                scopes=SCOPES
            )

            # Authorize the client
            client = gspread.authorize(credentials)

            # Use provided sheet_id or get from environment
            if not sheet_id:
                sheet_id = os.environ.get('GOOGLE_SHEETS_ID')
                if not sheet_id:
                    return {"error": "No Google Sheets ID provided"}

            # Open the Google Sheet
            spreadsheet = client.open_by_key(sheet_id)
            worksheet = spreadsheet.sheet1

            # Generate unique task ID
            task_id = f"task_{str(uuid.uuid4())[:8]}"
            
            # Get current timestamp
            current_time = datetime.now().isoformat()

            # Format the last update action with timestamp, avoiding raw inputs unless enabled
            store_raw = os.getenv('AUDIT_STORE_RAW_INPUT', 'false').strip().lower() in ('1','true','yes','on')
            if store_raw and raw_input:
                timestamped_action = f"[{current_time}] {raw_input}"
            else:
                timestamped_action = f"[{current_time}] Task created"
            
            # Prepare row data matching the schema:
            # A: task_id, B: title, C: description, D: status, E: category, F: priority,
            # G: created_date, H: updated_date, I: due_date, J: notes, K: last_update_action,
            # L: motivation_type, M: parent_item_id, N: last_updated_date, O: last_update_message, P: user_email
            row_data = [
                task_id,
                title,
                description,
                status,
                category,
                priority,
                current_time,  # created_date
                current_time,  # updated_date
                due_date,
                notes,
                timestamped_action,  # last_update_action with timestamp
                motivation_type,
                parent_item_id,
                current_time,
                last_update_message,
                user_email  # user who created the task
            ]

            # Append the new row
            worksheet.append_row(row_data)
            
            return {
                "success": True,
                "task_id": task_id,
                "title": title,
                "status": status,
                "message": f"Task '{title}' added successfully"
            }
            
        except Exception as e:
            print(f"Error writing to Google Sheet: {e}")
            return {"error": f"Failed to write to Google Sheet: {str(e)}"}


class GoogleSheetsUpdaterTool(BaseTool):
    """Tool that updates existing tasks in a Google Sheet."""
    
    name: str = "Google Sheets Task Updater"
    description: str = "Updates existing task status, notes, or other fields in a Google Sheet."


    def _run(self,
             task_identifier: str,
             status: Optional[str] = None,
             notes: Optional[str] = None,
             due_date: Optional[str] = None,
             priority: Optional[str] = None,
             update_action: Optional[str] = None,
             motivation_type: Optional[str] = None,
             parent_item_id: Optional[str] = None,
             last_update_message: Optional[str] = None,
             user_email: Optional[str] = None,
             sheet_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Update an existing task in the Google Sheet.

        Args:
            task_identifier (str): Task ID or title to find and update
            status (str): New status (optional)
            notes (str): Updated notes (optional)
            due_date (str): Updated due date (optional)
            priority (str): Updated priority (optional)
            update_action (str): Description of the update action (optional)
            motivation_type (str): The user's motivation for the task (INTRINSIC, EXTRINSIC, MIXED)
            parent_item_id (str): The ID of the parent task (optional)
            last_update_message (str): A brief message about the last update
            user_email (str): Email address of the user who updated this task
            sheet_id (str): Google Sheet ID (optional)

        Returns:
            dict: Result of the update operation.
        """
        try:
            # Get credentials path from environment or use default
            credentials_path = os.environ.get(
                'GOOGLE_APPLICATION_CREDENTIALS', 
                'credentials/gcp-service-account.json'
            )
            
            # Define the scope
            SCOPES = [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ]

            # Load credentials
            credentials = Credentials.from_service_account_file(
                credentials_path, 
                scopes=SCOPES
            )

            # Authorize the client
            client = gspread.authorize(credentials)

            # Use provided sheet_id or get from environment
            if not sheet_id:
                sheet_id = os.environ.get('GOOGLE_SHEETS_ID')
                if not sheet_id:
                    return {"error": "No Google Sheets ID provided"}

            # Open the Google Sheet
            spreadsheet = client.open_by_key(sheet_id)
            worksheet = spreadsheet.sheet1

            # Define expected headers to handle duplicate/empty header issues
            # Based on the writer tool schema (A through P columns)
            expected_headers = [
                'task_id', 'title', 'description', 'status', 'category', 'priority',
                'created_date', 'updated_date', 'due_date', 'notes',
                'last_update_action', 'motivation_type', 'parent_item_id',
                'last_updated_date', 'last_update_message', 'user_email'
            ]
            
            # Get all data to find the task
            try:
                all_data = worksheet.get_all_records(expected_headers=expected_headers)
            except Exception:
                all_data = worksheet.get_all_records()
            
            # Find the task by ID or title
            task_row = None
            row_number = None
            
            for i, task in enumerate(all_data):
                if (task.get('task_id') == task_identifier or 
                    task.get('title', '').lower() == task_identifier.lower()):
                    task_row = task
                    row_number = i + 2  # +2 because enumerate starts at 0 and sheet has header
                    break
            
            if not task_row:
                return {"error": f"Task '{task_identifier}' not found"}

            # Update fields if provided
            updates = {}
            if status:
                worksheet.update_cell(row_number, 4, status)  # Column D: status
                updates['status'] = status

            if notes:
                worksheet.update_cell(row_number, 10, notes)  # Column J: notes
                updates['notes'] = notes

            if due_date:
                worksheet.update_cell(row_number, 9, due_date)  # Column I: due_date
                updates['due_date'] = due_date

            if priority:
                worksheet.update_cell(row_number, 6, priority)  # Column F: priority
                updates['priority'] = priority

            if motivation_type:
                worksheet.update_cell(row_number, 12, motivation_type) # Column L: motivation_type
                updates['motivation_type'] = motivation_type

            if parent_item_id:
                worksheet.update_cell(row_number, 13, parent_item_id) # Column M: parent_item_id
                updates['parent_item_id'] = parent_item_id

            if last_update_message:
                worksheet.update_cell(row_number, 15, last_update_message) # Column O: last_update_message
                updates['last_update_message'] = last_update_message

            # Always update the timestamp
            current_time = datetime.now().isoformat()
            worksheet.update_cell(row_number, 8, current_time)  # Column H: updated_date
            worksheet.update_cell(row_number, 14, current_time) # Column N: last_updated_date
            updates['updated_date'] = current_time
            updates['last_updated_date'] = current_time

            # Update last_update_action if provided
            if update_action:
                timestamped_action = f"[{current_time}] {update_action}"
                worksheet.update_cell(row_number, 11, timestamped_action)  # Column K: last_update_action
                updates['last_update_action'] = timestamped_action

            # Update user_email if provided (track who made the update)
            if user_email:
                worksheet.update_cell(row_number, 16, user_email)  # Column P: user_email
                updates['user_email'] = user_email

            return {
                "success": True,
                "task_id": task_row.get('task_id'),
                "title": task_row.get('title'),
                "updates": updates,
                "message": f"Task '{task_row.get('title')}' updated successfully"
            }
            
        except Exception as e:
            print(f"Error updating Google Sheet: {e}")
            return {"error": f"Failed to update Google Sheet: {str(e)}"}


class GoogleSheetsTaskFinderTool(BaseTool):
    """Tool that finds specific tasks in a Google Sheet by various criteria."""
    
    name: str = "Google Sheets Task Finder"
    description: str = "Finds and returns specific tasks from a Google Sheet based on search criteria."


    def _run(self, 
             search_term: str,
             search_field: str = "title",
             sheet_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Find tasks in the Google Sheet that match the search criteria.
        
        Args:
            search_term (str): Term to search for
            search_field (str): Field to search in (title, status, category, etc.)
            sheet_id (str): Google Sheet ID (optional)
            
        Returns:
            list: Matching tasks as list of dictionaries.
        """
        try:
            # Get credentials path from environment or use default
            credentials_path = os.environ.get(
                'GOOGLE_APPLICATION_CREDENTIALS', 
                'credentials/gcp-service-account.json'
            )
            
            # Define the scope
            SCOPES = [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ]

            # Load credentials
            credentials = Credentials.from_service_account_file(
                credentials_path, 
                scopes=SCOPES
            )

            # Authorize the client
            client = gspread.authorize(credentials)

            # Use provided sheet_id or get from environment
            if not sheet_id:
                sheet_id = os.environ.get('GOOGLE_SHEETS_ID')
                if not sheet_id:
                    return {"error": "No Google Sheets ID provided"}

            # Open the Google Sheet
            spreadsheet = client.open_by_key(sheet_id)
            worksheet = spreadsheet.sheet1

            # Define expected headers to handle duplicate/empty header issues
            # Based on the writer tool schema (A through P columns)
            expected_headers = [
                'task_id', 'title', 'description', 'status', 'category', 'priority',
                'created_date', 'updated_date', 'due_date', 'notes',
                'last_update_action', 'motivation_type', 'parent_item_id',
                'last_updated_date', 'last_update_message', 'user_email'
            ]
            
            # Get all task records
            try:
                all_tasks = worksheet.get_all_records(expected_headers=expected_headers)
            except Exception:
                all_tasks = worksheet.get_all_records()
            
            # Filter tasks based on search criteria
            matching_tasks = []
            search_term_lower = search_term.lower()
            
            for task in all_tasks:
                field_value = str(task.get(search_field, '')).lower()
                if search_term_lower in field_value:
                    matching_tasks.append(task)
            
            return matching_tasks
            
        except Exception as e:
            print(f"Error searching Google Sheet: {e}")
            return {"error": f"Failed to search Google Sheet: {str(e)}"}


class PersonalKnowledgeBaseTool(BaseTool):
    """Tool that searches the user's entire task history for relevant context."""
    
    name: str = "Personal Knowledge Base Search"
    description: str = "Searches all existing tasks for a given query to find contextually relevant information, themes, or related tasks. Use this to understand a user's history with a topic."


    def _run(self, query: str, sheet_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Search all tasks in the Google Sheet for a query term across multiple fields.
        
        Args:
            query (str): The term to search for.
            sheet_id (str): The ID of the Google Sheet to search.
            
        Returns:
            list: A list of tasks that match the query.
        """
        try:
            # This reuses the connection logic from the ReaderTool for simplicity
            reader = GoogleSheetsReaderTool()
            all_tasks = reader._run(sheet_id)
            
            if isinstance(all_tasks, dict) and "error" in all_tasks:
                return all_tasks

            matching_tasks = []
            query_lower = query.lower()
            
            for task in all_tasks:
                # Search in title, notes, and raw_input for the query
                title = str(task.get('title', '')).lower()
                notes = str(task.get('notes', '')).lower()
                raw_input = str(task.get('raw_input', '')).lower()
                
                if (query_lower in title or 
                    query_lower in notes or 
                    query_lower in raw_input):
                    matching_tasks.append(task)
            
            return matching_tasks
            
        except Exception as e:
            print(f"Error searching knowledge base: {e}")
            return {"error": f"Failed to search knowledge base: {str(e)}"}


# Helper function to initialize all tools
def get_google_sheets_tools():
    """
    Returns a list of all Google Sheets tools for use with CrewAI agents.
    Tools will automatically read credentials and sheet ID from environment variables.
        
    Returns:
        list: List of initialized Google Sheets tools
    """
    return [
        GoogleSheetsReaderTool(),
        GoogleSheetsWriterTool(),
        GoogleSheetsUpdaterTool(),
        GoogleSheetsTaskFinderTool(),
        PersonalKnowledgeBaseTool()
    ]
