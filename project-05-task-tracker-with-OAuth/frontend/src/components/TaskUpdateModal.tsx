import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types/Task';
import { apiService } from '../services/api';

interface TaskUpdateModalProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: () => void;
}

const TaskUpdateModal: React.FC<TaskUpdateModalProps> = ({ task, onClose, onUpdate }) => {
  const [status, setStatus] = useState<TaskStatus>('NOT_STARTED');
  const [notes, setNotes] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setStatus(task.status);
      setNotes(task.notes || '');
      setUpdateMessage('');
      setError('');
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!updateMessage.trim()) {
      setError('Please provide an update message');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Call the update API
      const updateInput = `Update task "${task.title}" - ${updateMessage}`;

      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ input: updateInput }),
      });

      if (response.ok) {
        onUpdate(); // Refresh dashboard
        onClose(); // Close modal
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update task');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions: TaskStatus[] = [
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETED',
    'BLOCKED',
    'ON_HOLD'
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Update Task</h2>
              <p className="text-blue-100 text-sm">{task.task_id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Task Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-gray-800 mb-2">{task.title}</h3>
            {task.description && (
              <p className="text-gray-600 text-sm mb-2">{task.description}</p>
            )}
            <div className="flex gap-2 text-sm">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {task.category}
              </span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                Priority: {task.priority}
              </span>
            </div>
          </div>

          {/* Update Form */}
          <form onSubmit={handleSubmit}>
            {/* Status Update */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Update Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Update Message */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Update Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={updateMessage}
                onChange={(e) => setUpdateMessage(e.target.value)}
                placeholder="E.g., 'Mark as completed', 'Change status to in progress and set priority to high', 'Add note: waiting for approval'"
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use natural language to describe your update. The AI will process it.
              </p>
            </div>

            {/* Additional Notes */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional context or notes..."
                rows={2}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Current Activity History */}
            {task.last_update_action && (
              <div className="mb-4 bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Last Activity</h4>
                <p className="text-sm text-gray-600">{task.last_update_action}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 text-red-700 p-3 rounded border border-red-200">
                ⚠️ {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? 'Updating...' : 'Update Task'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskUpdateModal;
