import React, { useState } from 'react';
import './App.css';
import ContentForm from './components/ContentForm';
import LiveConsole from './components/LiveConsole';
import ResultsDisplay from './components/ResultsDisplay';
import { BrowserRouter as Router, Switch, Route, useHistory, useParams } from 'react-router-dom';
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

function App() {
  const history = useHistory(); // Hook for navigation

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
      history.push(`/console/${result.job_id}`); // Navigate to console route
      // No need to poll from App.tsx, LiveConsole will handle it
    } catch (error) {
      console.error('Error starting generation:', error);
    }
  };

  const handleBackToForm = () => {
    history.push('/'); // Navigate back to form
  };

  return (
    <Router> {/* Wrap with Router */}
      <div className="App">
        <header className="App-header">
          <h1>🤖 AI Content Generator</h1>
          <p>Multi-Agent Content Creation with CrewAI</p>
        </header>

        <main className="App-main">
          <Switch> {/* Use Switch to render only one Route */}
            <Route path="/" exact>
              <ContentForm onStartGeneration={handleStartGeneration} />
            </Route>
            <Route path="/console/:jobId">
              <LiveConsole 
                onBack={handleBackToForm}
              />
            </Route>
            <Route path="/results/:jobId">
              <ResultsDisplay 
                onBack={handleBackToForm}
                onGenerateNew={handleBackToForm}
              />
            </Route>
            <Route path="/reports/:jobId"> {/* New route for ReportView */}
              <ReportView /> {/* This component will fetch its own data */}
            </Route>
          </Switch>
        </main>

        <footer className="App-footer">
          <p>Powered by CrewAI • FastAPI • TypeScript</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;