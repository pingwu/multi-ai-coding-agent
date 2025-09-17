// Component for showing processing results and feedback

import React from 'react';
import { TaskInputResponse } from '../types/Task';

interface ProcessingFeedbackProps {
  response: TaskInputResponse | null;
  error: string | null;
  onClear: () => void;
}

const ProcessingFeedback: React.FC<ProcessingFeedbackProps> = ({ 
  response, 
  error, 
  onClear 
}) => {
  if (!response && !error) {
    return null;
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (error) {
    return (
      <div className="card fade-in" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h3 className="text-error">⚠️ Processing Error</h3>
            <p>{error}</p>
          </div>
          <button className="btn btn-secondary" onClick={onClear} style={{ marginLeft: '12px' }}>
            ✕
          </button>
        </div>
      </div>
    );
  }

  if (response) {
    return (
      <div className="card fade-in" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h3 className="text-success">✅ Tasks Updated Successfully</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <p><strong>Your Input:</strong></p>
              <div style={{ 
                backgroundColor: '#white', 
                padding: '12px', 
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                fontStyle: 'italic'
              }}>
                "{response.user_input}"
              </div>
            </div>

            {response.processing_result && (
              <div style={{ marginBottom: '16px' }}>
                <p><strong>AI Processing Result:</strong></p>
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '12px', 
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap'
                }}>
                  {response.processing_result}
                </div>
              </div>
            )}

            {response.current_tasks && response.current_tasks.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <p><strong>Current Tasks in Google Sheets:</strong></p>
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '12px', 
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {response.current_tasks.slice(0, 5).map((task, index) => (
                    <div key={task.task_id || index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '6px 0',
                      borderBottom: index < Math.min(response.current_tasks!.length, 5) - 1 ? '1px solid #f3f4f6' : 'none'
                    }}>
                      <span style={{ flex: 1 }}>{task.title}</span>
                      <span className={`badge badge-${
                        task.status === 'COMPLETED' ? 'success' :
                        task.status === 'IN_PROGRESS' ? 'info' :
                        task.status === 'BLOCKED' ? 'error' : 'default'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                  {response.current_tasks.length > 5 && (
                    <div className="text-muted text-center mt-2" style={{ fontSize: '0.8rem' }}>
                      ... and {response.current_tasks.length - 5} more tasks
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-muted" style={{ fontSize: '0.8rem' }}>
              Processed at: {formatDate(response.timestamp)}
            </div>
          </div>
          
          <button className="btn btn-secondary" onClick={onClear} style={{ marginLeft: '12px' }}>
            ✕
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ProcessingFeedback;