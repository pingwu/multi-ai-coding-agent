// Main task input component for natural language processing

import React, { useState } from 'react';
import { TaskInputRequest, TaskInputResponse, PreviewResponse } from '../types/Task';
import { apiService } from '../services/api';

interface TaskInputProps {
  onTaskProcessed: (response: TaskInputResponse) => void;
  onError: (error: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onTaskProcessed, onError }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);

  const examples = [
    "Finished the API documentation, starting user auth tests",
    "Code review meeting with Sarah tomorrow at 2pm",
    "Working on payment system integration",
    "Deployed search feature to staging, found bug in filters",
    "Need to research React performance optimization techniques"
  ];

  const handlePreview = async () => {
    if (!input.trim()) return;

    try {
      const previewResponse = await apiService.previewTaskInput({ input });
      setPreview(previewResponse);
      setShowPreview(true);
    } catch (error) {
      onError(`Failed to generate preview: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      onError('Please enter a task description');
      return;
    }

    setIsProcessing(true);
    setShowPreview(false);

    try {
      const request: TaskInputRequest = { input: input.trim() };
      const response = await apiService.processTaskInput(request);
      
      if (response.success) {
        onTaskProcessed(response);
        setInput(''); // Clear input on success
      } else {
        onError(response.error || 'Failed to process task');
      }
    } catch (error) {
      onError(`Error processing task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    setShowPreview(false);
  };

  return (
    <div className="card">
      <h2>🧠 What's on your mind?</h2>
      <p className="subtitle">
        Describe your work progress in natural language, and AI will update your Google Sheets automatically.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="label" htmlFor="task-input">
            Task Update
          </label>
          <textarea
            id="task-input"
            className="textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What did you work on? What's next?

Examples:
• Finished the user authentication module
• Starting code review for payment system  
• Meeting with team tomorrow at 2pm
• Deployed search feature to staging"
            rows={6}
            disabled={isProcessing}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isProcessing || !input.trim()}
          >
            {isProcessing ? (
              <>
                <div className="spinner" />
                Processing...
              </>
            ) : (
              <>
                📝 Update Tasks
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePreview}
            disabled={isProcessing || !input.trim()}
          >
            👁️ Preview
          </button>
        </div>
      </form>

      {/* Preview Section */}
      {showPreview && preview && (
        <div className="card mt-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h3>🔍 Preview</h3>
          <p><strong>Input:</strong> "{preview.input}"</p>
          
          {preview.predicted_actions.length > 0 ? (
            <div>
              <p><strong>Predicted Actions:</strong></p>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                {preview.predicted_actions.map((action, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>
                    <span className={`badge badge-${action.confidence === 'high' ? 'success' : action.confidence === 'medium' ? 'warning' : 'default'}`}>
                      {action.confidence}
                    </span>{' '}
                    {action.action === 'update_status' ? 'Update status to' : 'Create new task'}{' '}
                    <strong>{action.status || action.category}</strong>{' '}
                    (detected: "{action.detected_phrase}")
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted">
              {preview.requires_ai_processing 
                ? 'Will require AI processing to determine actions'
                : 'No obvious actions detected'}
            </p>
          )}
        </div>
      )}

      {/* Examples Section */}
      <div className="mt-4">
        <h3>💡 Try These Examples</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {examples.map((example, index) => (
            <button
              key={index}
              type="button"
              className="btn btn-secondary"
              onClick={() => handleExampleClick(example)}
              disabled={isProcessing}
              style={{ 
                textAlign: 'left', 
                fontSize: '0.9rem',
                padding: '8px 12px',
                fontStyle: 'italic'
              }}
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskInput;