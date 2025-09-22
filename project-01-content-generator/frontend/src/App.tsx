import React, { useState, useEffect } from 'react';
import './App.css';
import ContentForm from './components/ContentForm';
import LiveConsole from './components/LiveConsole';
import ResultsDisplay from './components/ResultsDisplay';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import ReportView from './components/ReportView';

export interface ContentRequest {
  topic: string;
  agents?: {
    researcher: { role: string; goal: string; backstory: string };
    strategist: { role: string; goal: string; backstory: string };
    writer: { role: string; goal: string; backstory: string };
  };
  tasks?: {
    research: string;
    strategy: string;
    writing: string;
  };
}

export interface JobStatus {
  job_id: string;
  status: 'pending' | 'running' | 'completed' | 'error' | 'loading';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  result?: string;
  error?: string;
}

export interface ApiStatus {
  openai_connected: boolean;
  anthropic_connected: boolean;
  demo_mode: boolean;
  timestamp: string;
}

const AppContent: React.FC = () => {
  const history = useHistory();
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);

  useEffect(() => {
    const fetchApiStatus = async () => {
      try {
        const response = await fetch('/api/status');
        const status = await response.json();
        setApiStatus(status);
      } catch (error) {
        console.error('Error fetching API status:', error);
      }
    };

    fetchApiStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(fetchApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStartGeneration = async (request: ContentRequest) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      const result = await response.json();
      history.push(`/console/${result.job_id}`);
    } catch (error) {
      console.error('Error starting generation:', error);
    }
  };

  const handleBackToForm = () => {
    history.push('/');
  };

  const renderApiStatus = () => {
    if (!apiStatus) return null;

    return (
      <div className="api-status">
        <div className="status-item">
          <span className={`status-dot ${apiStatus.openai_connected ? 'connected' : 'disconnected'}`}></span>
          OpenAI: {apiStatus.openai_connected ? 'Connected' : 'Disconnected'}
        </div>
        <div className="status-item">
          <span className={`status-dot ${apiStatus.anthropic_connected ? 'connected' : 'disconnected'}`}></span>
          Anthropic: {apiStatus.anthropic_connected ? 'Connected' : 'Disconnected'}
        </div>
        {apiStatus.demo_mode && (
          <div className="status-item demo-mode">
            🤖 Demo Mode Active
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-text">
            <h1>🤖 AI Content Generator</h1>
            <p>Multi-Agent Content Creation with CrewAI</p>
          </div>
          {renderApiStatus()}
        </div>
      </header>

      <main className="App-main">
        <Switch>
          <Route path="/" exact>
            <ContentForm onStartGeneration={handleStartGeneration} />
          </Route>
          <Route path="/console/:jobId">
            <LiveConsole onBack={handleBackToForm} />
          </Route>
          <Route path="/results/:jobId">
            <ResultsDisplay onBack={handleBackToForm} onGenerateNew={handleBackToForm} />
          </Route>
          <Route path="/reports/:jobId">
            <ReportView />
          </Route>
        </Switch>
      </main>

      <footer className="App-footer">
        <p>Powered by CrewAI • FastAPI • TypeScript</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;