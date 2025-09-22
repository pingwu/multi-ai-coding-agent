import React, { useState, useEffect } from 'react';
import { HierarchicalTask, TaskBreakdownResponse, NaturalLanguageRequest } from '../types/Task';

interface TaskBreakdownProps {
  onBreakdownComplete?: (result: TaskBreakdownResponse) => void;
}

const TaskBreakdown: React.FC<TaskBreakdownProps> = ({ onBreakdownComplete }) => {
  const BREAKDOWN_ENABLED = process.env.REACT_APP_ENABLE_BREAKDOWN === 'true';
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TaskBreakdownResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [createTasksResult, setCreateTasksResult] = useState<string | null>(null);

  const handleBreakdown = async () => {
    if (!BREAKDOWN_ENABLED) {
      setError('Task breakdown feature is disabled in this demo build.');
      return;
    }
    if (!inputText.trim()) {
      setError('Please enter some project ideas to break down');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress('Starting task breakdown...');

    try {
      const request: NaturalLanguageRequest = {
        text: inputText.trim(),
        breakdown_type: 'full'
      };

      const response = await fetch('/api/breakdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Breakdown failed');
      }

      const breakdownResult: TaskBreakdownResponse = await response.json();
      setResult(breakdownResult);
      setProgress('');
      
      if (onBreakdownComplete) {
        onBreakdownComplete(breakdownResult);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setProgress('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateTasks = async () => {
    if (!BREAKDOWN_ENABLED) {
      setError('Task breakdown feature is disabled in this demo build.');
      return;
    }
    if (!result || !result.hierarchy) {
      setError('No task breakdown available to create tasks from');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCreateTasksResult(null);
    setProgress('Creating tasks in Google Sheets...');

    try {
      const response = await fetch('/api/breakdown/create-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result.hierarchy),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Task creation failed');
      }

      const createResult = await response.json();
      
      const summary = `✅ Successfully processed ${createResult.total_processed} tasks!\n` +
                     `📝 Created: ${createResult.created_tasks.length} new tasks\n` +
                     `🔄 Updated: ${createResult.updated_tasks.length} existing tasks`;
      
      setCreateTasksResult(summary);
      setProgress('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tasks');
      setProgress('');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderHierarchicalTask = (task: HierarchicalTask, index: number): React.ReactNode => {
    const getTaskIcon = (type: string, level: number) => {
      switch (type) {
        case 'epic':
          return '🎯';
        case 'feature':
          return '🔧';
        case 'task':
          return '✅';
        default:
          return '📋';
      }
    };

    const getIndentClass = (level: number) => {
      return `ml-${Math.max(0, level - 1) * 6}`;
    };

    return (
      <div key={index} className={`mb-2 ${getIndentClass(task.level)}`}>
        <div className="flex items-center space-x-2 p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors">
          <span className="text-lg">{getTaskIcon(task.type, task.level)}</span>
          <div className="flex-1">
            <span className="font-medium text-gray-800">{task.title}</span>
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
            </span>
            {task.estimated_effort && (
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                {task.estimated_effort}h
              </span>
            )}
            {task.priority && (
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                {task.priority}
              </span>
            )}
          </div>
        </div>
        
        {task.children && task.children.length > 0 && (
          <div className="mt-2">
            {task.children.map((child, childIndex) => 
              renderHierarchicalTask(child, childIndex)
            )}
          </div>
        )}
      </div>
    );
  };

  const sampleText = `We need to build a user authentication system with login and registration. Also need to create a dashboard for users to view their profile. The dashboard should show recent activity and allow profile editing. We also need admin functionality to manage users. Don't forget about password reset functionality. Need to implement OAuth integration with Google and Facebook. Security testing and penetration testing should be done.`;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🧠 Intelligent Task Breakdown
        </h2>
        <p className="text-gray-600">
          Enter your project ideas in natural language and AI will organize them into a hierarchical structure.
        </p>
        {!BREAKDOWN_ENABLED && (
          <p className="text-sm text-gray-500 mt-2">
            Note: This feature is disabled in the Task Tracker demo. Use the Task Management tab instead.
          </p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="taskInput" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your project ideas in natural language:
        </label>
        <textarea
          id="taskInput"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder={sampleText}
          disabled={isProcessing}
        />
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            {inputText.length}/5000 characters
          </span>
          <button
            onClick={() => setInputText(sampleText)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
            disabled={isProcessing}
          >
            Use sample text
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {progress && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 text-sm">{progress}</p>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={handleBreakdown}
          disabled={isProcessing || !inputText.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing & Organizing Tasks...
            </span>
          ) : (
            '🔍 Analyze & Organize Tasks'
          )}
        </button>
        
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">
            💡 Include any project ideas, features, or tasks - AI will organize them automatically
          </span>
        </div>
      </div>

      {result && (
        <div className="border-t pt-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              📋 Organized Project Structure
            </h3>
            <div className="text-sm text-gray-600 space-x-4">
              <span>Tasks: {result.hierarchy.total_tasks}</span>
              <span>Confidence: {Math.round(result.hierarchy.breakdown_confidence * 100)}%</span>
              <span>Time: {result.hierarchy.processing_time_seconds.toFixed(1)}s</span>
            </div>
          </div>

          {result.hierarchy.epics.length > 0 ? (
            <div className="space-y-4">
              {result.hierarchy.epics.map((epic, index) => 
                renderHierarchicalTask(epic, index)
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No tasks were identified from the input text.</p>
              <p className="text-sm mt-2">Try including more specific action words like "build", "create", "implement", etc.</p>
            </div>
          )}

          {result.suggestions && result.suggestions.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h4 className="font-medium text-green-800 mb-2">💡 Suggestions:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.warnings && result.warnings.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Warnings:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {result.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {createTasksResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h4 className="font-medium text-green-800 mb-2">🎉 Tasks Created Successfully!</h4>
              <pre className="text-sm text-green-700 whitespace-pre-line">{createTasksResult}</pre>
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => handleCreateTasks()}
              disabled={isProcessing}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              📝 Create Tasks in Google Sheets
            </button>
            <button
              onClick={() => console.log('Continue to Risk Analysis')}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              📊 Continue to Risk Analysis
            </button>
            <button
              onClick={() => setResult(null)}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              ✏️ Edit Structure
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBreakdown;
