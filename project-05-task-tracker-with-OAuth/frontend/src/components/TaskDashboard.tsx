// Dashboard component showing task summary and recent activity

import React, { useState, useEffect } from 'react';
import { DashboardSummary, TaskStatus, TaskCategory, MotivationType, Task } from '../types/Task';
import { apiService } from '../services/api';

interface TaskDashboardProps {
  refreshTrigger: number; // Used to trigger refresh from parent
}

const TaskDashboard: React.FC<TaskDashboardProps> = ({ refreshTrigger }) => {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) {
      setSubmitError('Please enter a task description');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let apiInput: string;

      if (selectedTask) {
        // Update existing task
        apiInput = `Update task "${selectedTask.title}" - ${inputText}`;
      } else {
        // Create new task
        apiInput = inputText;
      }

      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ input: apiInput }),
      });

      if (response.ok) {
        setInputText('');
        setSelectedTask(null);
        await loadDashboard();
      } else {
        const data = await response.json();
        setSubmitError(data.error || 'Failed to process task');
      }
    } catch (err) {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      {/* Two Column Layout: Recent Activities (Left) + Task Detail (Right) */}
      <div className="grid grid-cols-2" style={{ gap: '16px' }}>
        {/* Left Column: Recent Activity */}
        <div className="card">
          <h3>🕒 Recent Activity</h3>
          <p className="text-muted text-sm mb-3">Click any task to view details and update</p>
          {dashboard.recent_tasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
              {dashboard.recent_tasks.map((task) => (
                <div
                  key={task.task_id}
                  onClick={() => setSelectedTask(task)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    border: selectedTask?.task_id === task.task_id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: selectedTask?.task_id === task.task_id ? '#eff6ff' : '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  className="hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
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

        {/* Right Column: Task Input + Detail Panel */}
        <div className="card" style={{ position: 'sticky', top: '20px', maxHeight: '600px', overflowY: 'auto' }}>
          {/* Task Input Section - Always Visible */}
          <div className="mb-4">
            <h3 className="mb-3">
              {selectedTask ? '📝 Update Task' : '➕ Create New Task'}
            </h3>

            <form onSubmit={handleSubmit}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  selectedTask
                    ? 'E.g., "Mark as completed", "Change status to in progress and set priority to high", "Add note: waiting for approval"'
                    : 'E.g., "Create a new task for implementing user authentication with high priority"'
                }
                rows={4}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mb-2"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mb-3">
                {selectedTask
                  ? 'Use natural language to describe your update. The AI will process it.'
                  : 'Describe your task in natural language. AI will extract title, category, priority, etc.'}
              </p>

              {submitError && (
                <div className="mb-3 bg-red-50 text-red-700 p-3 rounded border border-red-200 text-sm">
                  ⚠️ {submitError}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : selectedTask ? 'Update Task' : 'Create Task'}
                </button>
                {selectedTask && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTask(null);
                      setInputText('');
                      setSubmitError(null);
                    }}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Task Detail Section - Only When Task Selected */}
          {selectedTask && (
            <>
              <hr className="my-4 border-gray-200" />

              <h3 className="mb-3">📋 Task Details</h3>

              {/* Task Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-gray-800 text-lg">{selectedTask.title}</h4>
                  <button
                    onClick={() => {
                      setSelectedTask(null);
                      setInputText('');
                      setSubmitError(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {selectedTask.description && (
                  <p className="text-gray-600 text-sm mb-3">{selectedTask.description}</p>
                )}

                <div className="flex gap-2 text-sm flex-wrap">
                  <span className={`badge ${getStatusBadgeClass(selectedTask.status)}`}>
                    {selectedTask.status.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {selectedTask.category}
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                    {selectedTask.priority}
                  </span>
                  {selectedTask.user_email && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      👤 {selectedTask.user_email}
                    </span>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <div className="font-medium">{formatDate(selectedTask.created_date)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Updated:</span>
                    <div className="font-medium">{formatDate(selectedTask.updated_date)}</div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedTask.notes && (
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-700 mb-2">📝 Notes</h5>
                  <div className="bg-yellow-50 rounded-lg p-3 text-sm">
                    {selectedTask.notes}
                  </div>
                </div>
              )}

              {/* Activity History */}
              {selectedTask.last_update_action && (
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-700 mb-2">📜 Last Activity</h5>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                    {selectedTask.last_update_action}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty State - Only When No Task Selected */}
          {!selectedTask && (
            <div className="text-center py-8 border-t border-gray-200 mt-4">
              <div className="text-5xl mb-3">👈</div>
              <h4 className="text-gray-600 mb-2">No task selected</h4>
              <p className="text-gray-500 text-sm">Click on any task from the Recent Activity list to view details and update</p>
            </div>
          )}
        </div>
      </div>

      {/* Refresh Info */}
      <div className="text-center text-muted mt-2" style={{ fontSize: '0.8rem' }}>
        Last updated: {formatDate(dashboard.timestamp)}
      </div>
    </div>
  );
};

export default TaskDashboard;