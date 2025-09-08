import React, { useState } from 'react';
import { ExpenseRequest } from '../App';

interface ExpenseFormProps {
  onAddExpense: (request: ExpenseRequest) => Promise<void>;
  isLoading: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, isLoading }) => {
  const [description, setDescription] = useState('');
  const [userNotes, setUserNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      alert('Please enter an expense description');
      return;
    }

    await onAddExpense({
      description: description.trim(),
      user_notes: userNotes.trim() || undefined
    });

    // Clear form on successful submission
    setDescription('');
    setUserNotes('');
  };

  const exampleExpenses = [
    "Coffee meeting with client for $8.50 at Starbucks yesterday",
    "Monthly Spotify subscription renewed for $12",
    "Gas for client visits, $45 at Shell station",
    "Office supplies from Staples $25 for printer paper",
    "Lunch at Thai restaurant $18 for business meeting"
  ];

  return (
    <div className="expense-form-container">
      <h2>Add New Expense</h2>
      <p className="form-description">
        Describe your expense in natural language. Our AI will automatically extract 
        the amount, vendor, date, and categorize it for IRS compliance.
      </p>

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="description">Expense Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Coffee meeting with client for $8.50 at Starbucks yesterday"
            rows={3}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="userNotes">Additional Notes (Optional)</label>
          <input
            id="userNotes"
            type="text"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="Any additional context or notes"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !description.trim()}
          className={`submit-button ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? '🤖 Processing with AI...' : '💰 Add Expense'}
        </button>
      </form>

      <div className="examples-section">
        <h3>Example Expenses</h3>
        <div className="examples-list">
          {exampleExpenses.map((example, index) => (
            <button
              key={index}
              type="button"
              className="example-button"
              onClick={() => setDescription(example)}
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;