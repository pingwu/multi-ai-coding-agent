import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';

export interface ExpenseRecord {
  date: string;
  amount: number;
  vendor: string;
  category: string;
  description: string;
  business_purpose: string;
  notes: string;
  created_at: string;
}

export interface ExpenseRequest {
  description: string;
  user_notes?: string;
}

export interface ExpenseResponse {
  success: boolean;
  expense_record?: ExpenseRecord;
  error_message?: string;
  processing_time?: number;
}

function App() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Load expenses on component mount
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const response = await fetch('http://localhost:8000/expenses');
      const data = await response.json();
      setExpenses(data.expenses || []);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const handleAddExpense = async (request: ExpenseRequest) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      const result: ExpenseResponse = await response.json();
      
      if (result.success && result.expense_record) {
        // Add new expense to the list
        setExpenses(prev => [...prev, result.expense_record!]);
      } else {
        alert(`Error: ${result.error_message || 'Failed to process expense'}`);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Network error - please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>💰 AI Expense Tracker</h1>
        <p>Natural Language Business Expense Processing</p>
      </header>

      <main className="App-main">
        <div className="expense-container">
          <div className="expense-input">
            <ExpenseForm 
              onAddExpense={handleAddExpense}
              isLoading={loading}
            />
          </div>
          
          <div className="expense-content">
            <ExpenseSummary expenses={expenses} />
            <ExpenseList 
              expenses={expenses} 
              onRefresh={loadExpenses}
            />
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>Powered by CrewAI • FastAPI • Natural Language Processing</p>
      </footer>
    </div>
  );
}

export default App;