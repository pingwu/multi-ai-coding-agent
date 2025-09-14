// Main App component for Google Sheets Task Tracker

import React, { useState } from 'react';
import TaskInput from './components/TaskInput';
import TaskDashboard from './components/TaskDashboard';
import TaskBreakdown from './components/TaskBreakdown';
import ProcessingFeedback from './components/ProcessingFeedback';
import ConfigStatus from './components/ConfigStatus';
import { TaskInputResponse, TaskBreakdownResponse } from './types/Task';

function App() {
  const [lastResponse, setLastResponse] = useState<TaskInputResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dashboardRefresh, setDashboardRefresh] = useState(0);
  const [currentView, setCurrentView] = useState<'input' | 'breakdown'>('input');

  const handleTaskProcessed = (response: TaskInputResponse) => {
    setLastResponse(response);
    setError(null);
    // Trigger dashboard refresh
    setDashboardRefresh(prev => prev + 1);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setLastResponse(null);
  };

  const clearFeedback = () => {
    setLastResponse(null);
    setError(null);
  };

  const handleBreakdownComplete = (result: TaskBreakdownResponse) => {
    console.log('Task breakdown completed:', result);
    // Could switch to analysis view or show success message
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Project Analyzer</h1>
          <p className="text-gray-600 mb-4">
            AI-powered project intelligence: from natural language to structured analysis
          </p>
          
          {/* Navigation Tabs */}
          <div className="flex justify-center space-x-1 bg-white rounded-lg p-1 inline-flex">
            <button
              onClick={() => setCurrentView('breakdown')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'breakdown'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              🧠 Task Breakdown
            </button>
            <button
              onClick={() => setCurrentView('input')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'input'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              📝 Task Management
            </button>
          </div>
        </header>

        {/* Main Content */}
        {currentView === 'breakdown' ? (
          <TaskBreakdown onBreakdownComplete={handleBreakdownComplete} />
        ) : (
          <>
            {/* Configuration Status */}
            <ConfigStatus />

            {/* Processing Feedback */}
            <ProcessingFeedback 
              response={lastResponse}
              error={error}
              onClear={clearFeedback}
            />

            {/* Main Interface */}
            <div className="grid grid-cols-1">
              {/* Task Input */}
              <TaskInput 
                onTaskProcessed={handleTaskProcessed}
                onError={handleError}
              />

              {/* Dashboard */}
              <TaskDashboard refreshTrigger={dashboardRefresh} />
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="text-center text-gray-500 mt-8 text-sm">
          <p>
            🤖 Powered by CrewAI • 📊 Intelligent Task Analysis • 
            🚀 Built for <a 
              href="https://github.com/pingwu/multi-ai-coding-agent" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Multi-AI Coding Agent
            </a>
          </p>
          <p className="mt-2 text-xs">
            Natural language processing • Hierarchical task breakdown • AI-powered project intelligence
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
