import React, { useState } from 'react';
import { ExpenseRecord } from '../App';

interface ExpenseListProps {
  expenses: ExpenseRecord[];
  onRefresh: () => Promise<void>;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Get unique categories from expenses
  const categories = Array.from(new Set(expenses.map(exp => exp.category))).sort();

  // Filter expenses based on search and category
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = !searchQuery || 
      expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.business_purpose.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !categoryFilter || expense.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'MEALS': 'badge-meals',
      'SOFTWARE': 'badge-software', 
      'OFFICE_EXPENSE': 'badge-office',
      'CAR_TRUCK': 'badge-vehicle',
      'TRAVEL': 'badge-travel',
      'OTHER': 'badge-other'
    };

    return (
      <span className={`category-badge ${categoryColors[category] || 'badge-other'}`}>
        {category.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="expense-list-container">
      <div className="list-header">
        <h2>Expense Records ({filteredExpenses.length})</h2>
        <button onClick={onRefresh} className="refresh-button">
          🔄 Refresh
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="no-expenses">
          {expenses.length === 0 ? (
            <p>No expenses recorded yet. Add your first expense above!</p>
          ) : (
            <p>No expenses match your search criteria.</p>
          )}
        </div>
      ) : (
        <div className="expense-list">
          {filteredExpenses.map((expense, index) => (
            <div key={`${expense.created_at}-${index}`} className="expense-item">
              <div className="expense-header">
                <div className="expense-vendor">
                  <strong>{expense.vendor}</strong>
                  <span className="expense-date">{formatDate(expense.date)}</span>
                </div>
                <div className="expense-amount">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
              
              <div className="expense-details">
                <p className="expense-description">{expense.description}</p>
                <p className="expense-purpose">
                  <strong>Business Purpose:</strong> {expense.business_purpose}
                </p>
                {expense.notes && (
                  <p className="expense-notes">
                    <strong>Notes:</strong> {expense.notes}
                  </p>
                )}
              </div>
              
              <div className="expense-footer">
                {getCategoryBadge(expense.category)}
                <span className="created-time">
                  Added: {formatDate(expense.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;