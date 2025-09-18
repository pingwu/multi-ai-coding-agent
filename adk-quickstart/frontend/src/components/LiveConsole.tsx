import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Badge, Button, Card, Col, Row } from 'react-bootstrap';
import ProgressStepper from './ProgressStepper';
import { SessionState } from '../types';

interface LiveConsoleProps {
  onBack: () => void;
  onViewResults: (sessionId: string) => void;
}

interface WebSocketMessage {
  type: 'log' | 'status' | 'error';
  message?: string;
  status?: Partial<SessionState>;
}

const determineStep = (status?: string): number => {
  switch (status) {
    case 'completed':
      return 3;
    case 'running':
      return 2;
    case 'error':
      return 2;
    default:
      return 1;
  }
};

const statusVariant = (status?: string): string => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'running':
      return 'warning';
    case 'error':
      return 'danger';
    default:
      return 'secondary';
  }
};

const LiveConsole: React.FC<LiveConsoleProps> = ({ onBack, onViewResults }) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionState | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('A session id is required to view console output.');
      return;
    }

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}/status`);
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data: SessionState = await response.json();
        setSession(data);
        setLogs(data.logs || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load session status.';
        setError(message);
      }
    };

    const openSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL?.replace(/\/$/, '');
      const target = baseUrl
        ? baseUrl.replace(/^http/, protocol === 'wss:' ? 'wss' : 'ws')
        : `${protocol}//${window.location.host}`;
      const ws = new WebSocket(`${target}/ws/sessions/${sessionId}`);
      socketRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const payload: WebSocketMessage = JSON.parse(event.data);
          if (payload.type === 'log' && typeof payload.message === 'string') {
            const message = payload.message;
            setLogs((current) => [...current, message]);
          }
          if (payload.type === 'status' && payload.status) {
            setSession((current) =>
              current ? { ...current, ...payload.status } : ({ ...payload.status } as SessionState)
            );
          }
          if (payload.type === 'error' && payload.message) {
            setError(payload.message);
          }
        } catch (parseError) {
          console.error('Unable to parse WebSocket payload', parseError);
        }
      };

      ws.onerror = () => {
        setConnected(false);
        setError('Live connection interrupted — attempting to reconnect.');
      };

      ws.onclose = () => {
        setConnected(false);
      };
    };

    fetchStatus();
    openSocket();

    return () => {
      socketRef.current?.close();
    };
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!sessionId) {
    return null;
  }

  return (
    <div className="container">
      <Row className="justify-content-center">
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
            <div>
              <h2 className="mb-1">Live Console</h2>
              <div className="d-flex gap-3 align-items-center">
                <Badge bg={statusVariant(session?.status)}>{session?.status?.toUpperCase() ?? 'UNKNOWN'}</Badge>
                <Badge bg={connected ? 'success' : 'secondary'}>{connected ? 'Connected' : 'Offline'}</Badge>
                <small className="text-muted">Session {sessionId}</small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={onBack}>
                Back to form
              </Button>
              <Button
                variant="primary"
                onClick={() => onViewResults(sessionId)}
                disabled={session?.status !== 'completed'}
              >
                View results
              </Button>
            </div>
          </div>

          <Card className="mb-3">
            <Card.Body>
              <ProgressStepper
                currentStep={determineStep(session?.status)}
                steps={[
                  { label: 'Queued', description: 'Session created' },
                  { label: 'Running', description: 'Simulated workflow executing' },
                  { label: 'Completed', description: 'Results available' },
                ]}
              />
            </Card.Body>
          </Card>

          {error && (
            <Alert variant="warning" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white d-flex justify-content-between">
              <span>Console output</span>
              <small>Redacted for compliance — safe for demos</small>
            </Card.Header>
            <Card.Body className="bg-dark">
              <div className="console-output">
                {logs.length === 0 ? <div className="text-muted">Waiting for execution logs…</div> : null}
                {logs.map((entry, index) => (
                  <div key={`${index}-${entry}`} className="console-line">
                    {entry}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </Card.Body>
          </Card>

          {session && (
            <Card className="mt-3">
              <Card.Body className="small text-muted">
                <Row>
                  <Col md={6}>
                    <div><strong>App:</strong> {session.app_name}</div>
                    <div><strong>User:</strong> {session.user_id}</div>
                    <div><strong>Created:</strong> {new Date(session.created_at).toLocaleString()}</div>
                  </Col>
                  <Col md={6}>
                    {session.started_at && <div><strong>Started:</strong> {new Date(session.started_at).toLocaleString()}</div>}
                    {session.completed_at && (
                      <div><strong>Completed:</strong> {new Date(session.completed_at).toLocaleString()}</div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default LiveConsole;
