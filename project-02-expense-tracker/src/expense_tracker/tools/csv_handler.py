#!/usr/bin/env python3
"""
CSV Handler for Expense Tracker
Manages expense data storage and retrieval in CSV format
"""

import csv
import pandas as pd
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime, timezone
import json
import os

class ExpenseCSVHandler:
    """Handles CSV operations for expense tracking data"""
    
    def __init__(self, data_dir: str = "/app/data"):
        self.data_dir = Path(data_dir)
        self.expenses_file = self.data_dir / "expenses.csv"
        self.subscriptions_file = self.data_dir / "subscriptions.csv"
        
        # Ensure data directory exists
        self.data_dir.mkdir(exist_ok=True)
        
        # CSV schema for expenses
        self.expense_headers = [
            "date", "amount", "vendor", "category", "description", 
            "business_purpose", "notes", "created_at"
        ]
        
        # Initialize CSV files if they don't exist
        self._initialize_csv_files()
    
    def _initialize_csv_files(self):
        """Initialize CSV files with headers if they don't exist"""
        if not self.expenses_file.exists():
            with open(self.expenses_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(self.expense_headers)
    
    def add_expense(self, expense_record: Dict) -> bool:
        """
        Add a new expense record to the CSV file
        
        Args:
            expense_record: Dictionary containing expense data
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Ensure all required fields are present
            csv_record = {
                "date": expense_record.get("date", ""),
                "amount": expense_record.get("amount", 0.0),
                "vendor": expense_record.get("vendor", ""),
                "category": expense_record.get("category", "OTHER"),
                "description": expense_record.get("description", ""),
                "business_purpose": expense_record.get("business_purpose", ""),
                "notes": expense_record.get("notes", ""),
                "created_at": expense_record.get("created_at", datetime.now(timezone.utc).isoformat())
            }
            
            # Append to CSV file
            with open(self.expenses_file, 'a', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=self.expense_headers)
                writer.writerow(csv_record)
            
            return True
            
        except Exception as e:
            print(f"Error adding expense to CSV: {e}")
            return False
    
    def get_all_expenses(self) -> List[Dict]:
        """
        Retrieve all expense records from CSV
        
        Returns:
            List of expense dictionaries
        """
        try:
            if not self.expenses_file.exists():
                return []
            
            expenses = []
            with open(self.expenses_file, 'r', newline='', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # Convert amount to float
                    if row['amount']:
                        row['amount'] = float(row['amount'])
                    expenses.append(row)
            
            return expenses
            
        except Exception as e:
            print(f"Error reading expenses from CSV: {e}")
            return []
    
    def get_expenses_by_date_range(self, start_date: str, end_date: str) -> List[Dict]:
        """
        Get expenses within a date range
        
        Args:
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            
        Returns:
            List of expense dictionaries within date range
        """
        all_expenses = self.get_all_expenses()
        filtered_expenses = []
        
        for expense in all_expenses:
            expense_date = expense.get('date', '')
            if start_date <= expense_date <= end_date:
                filtered_expenses.append(expense)
        
        return filtered_expenses
    
    def get_expenses_by_category(self, category: str) -> List[Dict]:
        """
        Get all expenses for a specific category
        
        Args:
            category: Expense category (e.g., "MEALS", "OFFICE_EXPENSE")
            
        Returns:
            List of expense dictionaries for the category
        """
        all_expenses = self.get_all_expenses()
        return [exp for exp in all_expenses if exp.get('category', '').upper() == category.upper()]
    
    def get_monthly_summary(self, year: int, month: int) -> Dict:
        """
        Get monthly expense summary by category
        
        Args:
            year: Year (e.g., 2024)
            month: Month (1-12)
            
        Returns:
            Dictionary with category totals and overall summary
        """
        # Create date range for the month
        start_date = f"{year}-{month:02d}-01"
        if month == 12:
            end_date = f"{year+1}-01-01"
        else:
            end_date = f"{year}-{month+1:02d}-01"
        
        expenses = self.get_expenses_by_date_range(start_date, end_date)
        
        # Group by category
        category_totals = {}
        total_amount = 0.0
        
        for expense in expenses:
            category = expense.get('category', 'OTHER')
            amount = expense.get('amount', 0.0)
            
            if category not in category_totals:
                category_totals[category] = {'total': 0.0, 'count': 0, 'expenses': []}
            
            category_totals[category]['total'] += amount
            category_totals[category]['count'] += 1
            category_totals[category]['expenses'].append(expense)
            total_amount += amount
        
        return {
            'year': year,
            'month': month,
            'total_amount': total_amount,
            'total_expenses': len(expenses),
            'categories': category_totals
        }
    
    def search_expenses(self, query: str) -> List[Dict]:
        """
        Search expenses by vendor, description, or business purpose
        
        Args:
            query: Search query string
            
        Returns:
            List of matching expense dictionaries
        """
        all_expenses = self.get_all_expenses()
        query_lower = query.lower()
        
        matching_expenses = []
        for expense in all_expenses:
            # Search in vendor, description, business_purpose, and notes
            searchable_fields = [
                expense.get('vendor', ''),
                expense.get('description', ''),
                expense.get('business_purpose', ''),
                expense.get('notes', '')
            ]
            
            if any(query_lower in field.lower() for field in searchable_fields):
                matching_expenses.append(expense)
        
        return matching_expenses
    
    def export_to_json(self, output_file: Optional[str] = None) -> str:
        """
        Export all expenses to JSON format
        
        Args:
            output_file: Optional output file path
            
        Returns:
            JSON string of all expenses
        """
        expenses = self.get_all_expenses()
        
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(expenses, f, indent=2, default=str)
            return f"Expenses exported to {output_file}"
        else:
            return json.dumps(expenses, indent=2, default=str)
    
    def get_file_stats(self) -> Dict:
        """
        Get statistics about the CSV file
        
        Returns:
            Dictionary with file statistics
        """
        if not self.expenses_file.exists():
            return {"exists": False}
        
        expenses = self.get_all_expenses()
        file_size = self.expenses_file.stat().st_size
        
        return {
            "exists": True,
            "file_path": str(self.expenses_file),
            "file_size_bytes": file_size,
            "total_records": len(expenses),
            "last_modified": datetime.fromtimestamp(self.expenses_file.stat().st_mtime).isoformat()
        }
    
    def validate_expense_record(self, record: Dict) -> Dict:
        """
        Validate an expense record before adding to CSV
        
        Args:
            record: Expense record dictionary
            
        Returns:
            Dictionary with validation results and cleaned record
        """
        validation_result = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "cleaned_record": record.copy()
        }
        
        # Required fields validation
        required_fields = ["amount", "vendor", "date"]
        for field in required_fields:
            if not record.get(field):
                validation_result["valid"] = False
                validation_result["errors"].append(f"Missing required field: {field}")
        
        # Amount validation
        try:
            amount = float(record.get("amount", 0))
            if amount <= 0:
                validation_result["warnings"].append("Amount should be greater than 0")
            validation_result["cleaned_record"]["amount"] = amount
        except (ValueError, TypeError):
            validation_result["valid"] = False
            validation_result["errors"].append("Amount must be a valid number")
        
        # Date format validation (basic)
        date_str = record.get("date", "")
        if date_str and len(date_str) < 8:  # Basic length check
            validation_result["warnings"].append("Date format may be invalid (expected YYYY-MM-DD)")
        
        return validation_result

# Convenience functions for easy import
def get_csv_handler() -> ExpenseCSVHandler:
    """Get a CSV handler instance"""
    return ExpenseCSVHandler()

def add_expense_to_csv(expense_record: Dict) -> bool:
    """Quick function to add an expense to CSV"""
    handler = get_csv_handler()
    return handler.add_expense(expense_record)

def get_all_expenses_from_csv() -> List[Dict]:
    """Quick function to get all expenses from CSV"""
    handler = get_csv_handler()
    return handler.get_all_expenses()