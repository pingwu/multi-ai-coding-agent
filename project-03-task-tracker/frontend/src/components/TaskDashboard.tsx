// Dashboard component showing task summary and recent activity

import React, { useState, useEffect } from 'react';
import { DashboardSummary, TaskStatus, TaskCategory, MotivationType } from '../types/Task';
import { apiService } from '../services/api';

interface TaskDashboardProps {
  refreshTrigger: number; // Used to trigger refresh from parent
}

const TaskDashboard: React.FC<TaskDashboardProps> = ({ refreshTrigger }) => {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [refreshTrigger]); // Refresh when trigger changes

  const getStatusBadgeClass = (status: TaskStatus): string => {
    switch (status) {
      case 'COMPLETED':
        return 'badge-success';
      case 'IN_PROGRESS':
        return 'badge-info';
      case 'BLOCKED':
        return 'badge-error';
      case 'ON_HOLD':
        return 'badge-warning';
      default:
        return 'badge-default';
    }
  };

  const getCategoryIcon = (category: TaskCategory): string => {
    switch (category) {
      case 'DEVELOPMENT':
        return '💻';
      case 'MEETING':
        return '🤝';
      case 'DOCUMENTATION':
        return '📝';
      case 'RESEARCH':
        return '🔍';
      case 'TESTING':
        return '🧪';
      case 'DEPLOYMENT':
        return '🚀';
      case 'PLANNING':
        return '📋';
      case 'REVIEW':
        return '👀';
      default:
        return '📌';
    }
  };

  const getMotivationBadgeClass = (motivation: MotivationType): string => {
    switch (motivation) {
      case 'INTRINSIC':
        return 'badge-success';
      case 'EXTRINSIC':
        return 'badge-warning';
      case 'MIXED':
        return 'badge-info';
      default:
        return 'badge-default';
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <div className="loading">
          <div className="spinner" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-error">
          <h3>⚠️ Dashboard Error</h3>
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={loadDashboard}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="card text-center">
        <h3>📊 No Data Available</h3>
        <p className="text-muted">Start adding tasks to see your dashboard</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-3 mb-4">
        <div className="card text-center">
          <h3 className="text-success">{dashboard.total_tasks}</h3>
          <p className="text-muted">Total Tasks</p>
        </div>
        <div className="card text-center">
          <h3 className="text-info">{dashboard.active_tasks}</h3>
          <p className="text-muted">In Progress</p>
        </div>
        <div className="card text-center">
          <h3 className="text-success">{dashboard.completed_tasks}</h3>
          <p className="text-muted">Completed</p>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {/* Status Breakdown */}
        <div className="card">
          <h3>📊 By Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(dashboard.by_status || {}).map(([status, count]) => (
              count > 0 && (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${getStatusBadgeClass(status as TaskStatus)}`}>
                    {status.replace('_', ' ')}
                  </span>
                  <strong>{count}</strong>
                </div>
              )
            ))}
          </div>
          {Object.values(dashboard.by_status || {}).every(count => count === 0) && (
            <p className="text-muted">No tasks yet</p>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <h3>🏷️ By Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(dashboard.by_category || {}).map(([category, count]) => (
              count > 0 && (
                <div key={category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{getCategoryIcon(category as TaskCategory)}</span>
                    <span>{category.replace('_', ' ')}</span>
                  </span>
                  <strong>{count}</strong>
                </div>
              )
            ))}
          </div>
          {Object.values(dashboard.by_category || {}).every(count => count === 0) && (
            <p className="text-muted">No tasks yet</p>
          )}
        </div>

        {/* Motivation Breakdown */}
        <div className="card">
          <h3>🔥 By Motivation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(dashboard.by_motivation || {}).map(([motivation, count]) => (
              count > 0 && (
                <div key={motivation} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${getMotivationBadgeClass(motivation as MotivationType)}`}>
                    {motivation.replace('_', ' ')}
                  </span>
                  <strong>{count}</strong>
                </div>
              )
            ))}
          </div>
          {Object.values(dashboard.by_motivation || {}).every(count => count === 0) && (
            <p className="text-muted">No tasks yet</p>
          )}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <h3>🕒 Recent Activity</h3>
        {dashboard.recent_tasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dashboard.recent_tasks.map((task) => (
              <div 
                key={task.task_id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#fafafa'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span>{getCategoryIcon(task.category)}</span>
                    <strong>{task.title}</strong>
                    <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  {task.last_update_message && (
                    <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
                      {task.last_update_message}
                    </p>
                  )}
                </div>
                <div className="text-muted" style={{ fontSize: '0.8rem', textAlign: 'right' }}>
                  <div>Updated:</div>
                  <div>{formatDate(task.updated_date)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No recent tasks</p>
        )}
      </div>

      {/* Refresh Info */}
      <div className="text-center text-muted mt-2" style={{ fontSize: '0.8rem' }}>
        Last updated: {formatDate(dashboard.timestamp)}
      </div>
    </div>
  );
};

export default TaskDashboard;