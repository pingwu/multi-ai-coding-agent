import React, { useState, useEffect, useRef } from 'react';
import { JobStatus } from '../App';
import { useParams, useHistory } from 'react-router-dom'; // Added useParams, useHistory

interface LiveConsoleProps {
  onBack: () => void;
}

interface ConsoleMessage {
  type: 'info' | 'success' | 'error' | 'heartbeat';
  message: string;
  timestamp: string;
}

const LiveConsole: React.FC<LiveConsoleProps> = ({ onBack }) => {
  const { jobId } = useParams<{ jobId: string }>();
  const history = useHistory();

  console.log('LiveConsole mounted. Job ID:', jobId); // Added log

  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!jobId) {
      console.log('Polling useEffect: No jobId, returning.'); // Added log
      return;
    }

    const pollJobStatus = async () => {
      const poll = async () => {
        console.log('Polling for job status for Job ID:', jobId); // Added log
        try {
          const response = await fetch(`/api/status/${jobId}`);
          const status: JobStatus = await response.json();
          setJobStatus(status);
          console.log('Received job status:', status); // Added log
          
          if (status.status === 'completed') {
            history.push(`/results/${jobId}`);
            return; // Stop polling
          } else if (status.status === 'error') {
            return; // Stop polling on error
          }
          
          setTimeout(poll, 2000);
        } catch (error) {
          console.error('Error polling status:', error);
        }
      };
      poll();
    };

    pollJobStatus();
  }, [jobId, history]);

  useEffect(() => {
    if (!jobId) {
      console.log('WebSocket useEffect: No jobId, returning.'); // Added log
      return;
    }

    console.log('Connecting WebSocket for Job ID:', jobId); // Added log
    const wsUrl = `ws://${window.location.host}/ws/console/${jobId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const message: ConsoleMessage = JSON.parse(event.data);
        // Filter out heartbeat messages from display
        if (message.type !== 'heartbeat') {
          setMessages(prev => [...prev, message]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWsStatus('disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsStatus('disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [jobId]);

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'info': return '🔵';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '📝';
    }
  };

  const getStatusDisplay = () => {
    if (!jobStatus) return 'Unknown';
    
    const statusIcons = {
      pending: '⏳',
      running: '🔄',
      completed: '✅',
      error: '❌',
      loading: '⏳' // Added loading status icon
    };

    return `${statusIcons[jobStatus.status]} ${jobStatus.status.charAt(0).toUpperCase() + jobStatus.status.slice(1)}`;
  };

  return (
    <div className="live-console">
      <div className="console-header">
        <div className="console-title">
          <h2>🖥️ Live Console</h2>
          <div className="status-info">
            <div className="job-status">
              Job Status: <span className={`status ${jobStatus?.status}`}>{getStatusDisplay()}</span>
            </div>
            <div className="ws-status">
              WebSocket: <span className={`status ${wsStatus}`}>
                {wsStatus === 'connecting' && '🔄 Connecting...'}
                {wsStatus === 'connected' && '🟢 Connected'}
                {wsStatus === 'disconnected' && '🔴 Disconnected'}
              </span>
            </div>
          </div>
        </div>
        <button onClick={onBack} className="button secondary">
          ← Back to Form
        </button>
      </div>

      <div className="console-body">
        <div className="console-messages">
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>🔄 Waiting for console output...</p>
              {wsStatus === 'connected' && <p>WebSocket connected. Messages will appear here.</p>}
              {wsStatus === 'disconnected' && <p>⚠️ WebSocket disconnected. Trying to reconnect...</p>}
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`console-message ${message.type}`}>
                <span className="message-icon">{getMessageIcon(message.type)}</span>
                <span className="message-timestamp">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
                <span className="message-text">{message.message}</span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {jobStatus?.status === 'completed' && (
          <div className="completion-notice">
            <div className="completion-message">
              <h3>🎉 Content Generation Complete!</h3>
              <p>Your content has been generated successfully. Click below to view the results.</p>
              <button 
                onClick={() => history.push(`/results/${jobId}`)} // Navigate to results route
                className="button"
              >
                📄 View Results
              </button>
            </div>
          </div>
        )}

        {jobStatus?.status === 'error' && (
          <div className="error-notice">
            <div className="error-message">
              <h3>❌ Generation Error</h3>
              <p>There was an error during content generation:</p>
              <code>{jobStatus.error}</code>
              <button onClick={onBack} className="button secondary">
                ← Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="console-footer">
        <div className="progress-info">
          {jobStatus && (
            <>
              <div>Job ID: <code>{jobId}</code></div>
              {jobStatus.started_at && (
                <div>Started: {new Date(jobStatus.started_at).toLocaleTimeString()}</div>
              )}
              {jobStatus.completed_at && (
                <div>Completed: {new Date(jobStatus.completed_at).toLocaleTimeString()}</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveConsole;