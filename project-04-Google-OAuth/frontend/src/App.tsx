import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TaskInput from './components/TaskInput';
import TaskDashboard from './components/TaskDashboard';
import TaskBreakdown from './components/TaskBreakdown';
import ProcessingFeedback from './components/ProcessingFeedback';
import ConfigStatus from './components/ConfigStatus';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';
import { AuthProvider, useAuth } from './services/AuthContext';
import { TaskInputResponse, TaskBreakdownResponse } from './types/Task';

const MainApp: React.FC = () => {
  const [lastResponse, setLastResponse] = useState<TaskInputResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dashboardRefresh, setDashboardRefresh] = useState(0);
  const [currentView, setCurrentView] = useState<'input' | 'breakdown'>('input');

  const handleTaskProcessed = (response: TaskInputResponse) => {
    setLastResponse(response);
    setError(null);
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
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Project Analyzer Team Edition</h1>
          <p className="text-gray-600 mb-4">
            AI-powered project intelligence: from natural language to structured analysis
          </p>
          
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

        {currentView === 'breakdown' ? (
          <TaskBreakdown onBreakdownComplete={handleBreakdownComplete} />
        ) : (
          <>
            <ConfigStatus />
            <ProcessingFeedback 
              response={lastResponse}
              error={error}
              onClear={clearFeedback}
            />
            <div className="grid grid-cols-1">
              <TaskInput 
                onTaskProcessed={handleTaskProcessed}
                onError={handleError}
              />
              <TaskDashboard refreshTrigger={dashboardRefresh} />
            </div>
          </>
        )}

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

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    if (!isLoading && location.pathname === '/' && !isAuthenticated) {
      checkAuth();
    }
  }, [location.pathname, isAuthenticated, isLoading, checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600 text-sm">Checking session...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/welcome"
        element={isAuthenticated ? <WelcomePage /> : <Navigate to="/login" />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <MainApp /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
