import React from 'react';
import { ExpenseRecord } from '../App';

interface ExpenseSummaryProps {
  expenses: ExpenseRecord[];
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses }) => {
  // Calculate summary statistics
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalCount = expenses.length;

  // Group by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  // Get current month expenses
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const currentMonthExpenses = expenses.filter(exp => 
    exp.date.startsWith(currentMonth)
  );
  const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'MEALS': '#e74c3c',
      'SOFTWARE': '#3498db',
      'OFFICE_EXPENSE': '#2ecc71',
      'CAR_TRUCK': '#f39c12',
      'TRAVEL': '#9b59b6',
      'OTHER': '#95a5a6'
    };
    return colors[category] || '#95a5a6';
  };

  return (
    <div className="expense-summary">
      <h2>Expense Summary</h2>
      
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Expenses</h3>
            <p className="card-value">{formatCurrency(totalAmount)}</p>
            <p className="card-subtitle">{totalCount} transactions</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <h3>This Month</h3>
            <p className="card-value">{formatCurrency(currentMonthTotal)}</p>
            <p className="card-subtitle">{currentMonthExpenses.length} transactions</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Categories</h3>
            <p className="card-value">{Object.keys(categoryTotals).length}</p>
            <p className="card-subtitle">expense types</p>
          </div>
        </div>
      </div>

      {Object.keys(categoryTotals).length > 0 && (
        <div className="category-breakdown">
          <h3>Breakdown by Category</h3>
          <div className="category-list">
            {Object.entries(categoryTotals)
              .sort(([,a], [,b]) => b - a) // Sort by amount descending
              .map(([category, amount]) => {
                const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
                return (
                  <div key={category} className="category-item">
                    <div className="category-info">
                      <span 
                        className="category-color" 
                        style={{ backgroundColor: getCategoryColor(category) }}
                      ></span>
                      <span className="category-name">
                        {category.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="category-stats">
                      <span className="category-amount">
                        {formatCurrency(amount)}
                      </span>
                      <span className="category-percentage">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;