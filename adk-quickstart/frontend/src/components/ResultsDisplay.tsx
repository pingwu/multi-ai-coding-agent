import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Badge, Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { SessionState } from '../types';

interface ResultsDisplayProps {
  onBackToConsole: (sessionId: string) => void;
  onStartNew: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ onBackToConsole, onStartNew }) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!sessionId) {
        setError('Session id missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/sessions/${sessionId}/results`);
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data: SessionState = await response.json();
        setSession(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load results.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  const copyToClipboard = async () => {
    if (session?.result) {
      try {
        await navigator.clipboard.writeText(session.result);
      } catch (err) {
        console.error('Unable to copy result', err);
      }
    }
  };

  const downloadMarkdown = () => {
    if (!sessionId || !session?.result) {
      return;
    }

    const blob = new Blob([session.result], { type: 'text/markdown' });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = `adk-session-${sessionId}.md`;
    anchor.click();
    URL.revokeObjectURL(href);
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3 text-muted">Preparing your simulated output…</p>
      </div>
    );
  }

  if (!session || !sessionId) {
    return (
      <div className="container py-4">
        <Alert variant="danger">
          <Alert.Heading>Results unavailable</Alert.Heading>
          <p>{error ?? 'No session data was returned.'}</p>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={onStartNew}>
              Start new session
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
            <div>
              <h2>Session Results</h2>
              <Badge bg={session.status === 'error' ? 'danger' : 'success'}>{session.status.toUpperCase()}</Badge>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={() => onBackToConsole(sessionId)}>
                Back to console
              </Button>
              <Button variant="primary" onClick={onStartNew}>
                New simulation
              </Button>
            </div>
          </div>

          <Card className="mb-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Quick actions</span>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" size="sm" onClick={copyToClipboard}>
                  Copy
                </Button>
                <Button variant="outline-success" size="sm" onClick={downloadMarkdown}>
                  Download
                </Button>
              </div>
            </Card.Header>
          </Card>

          {session.result ? (
            <Card className="mb-3">
              <Card.Header className="bg-success text-white">Simulated response</Card.Header>
              <Card.Body>
                <div className="result-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {session.result}
                  </ReactMarkdown>
                </div>
              </Card.Body>
            </Card>
          ) : null}

          {session.error ? (
            <Alert variant="danger">
              <Alert.Heading>Simulation error</Alert.Heading>
              <pre className="mb-0">{session.error}</pre>
            </Alert>
          ) : null}

          <Card className="mb-4">
            <Card.Header>Session metadata</Card.Header>
            <Card.Body className="small text-muted">
              <Row>
                <Col md={6}>
                  <div><strong>App:</strong> {session.app_name}</div>
                  <div><strong>User:</strong> {session.user_id}</div>
                  <div><strong>Prompt present:</strong> {session.prompt ? 'Yes' : 'No'}</div>
                </Col>
                <Col md={6}>
                  <div><strong>Model:</strong> {session.metadata?.model ?? session.config.model}</div>
                  <div><strong>Temperature:</strong> {session.metadata?.temperature ?? session.config.temperature}</div>
                  <div><strong>Max tokens:</strong> {session.metadata?.max_tokens ?? session.config.max_tokens}</div>
                </Col>
              </Row>
              {session.metadata?.token_usage && (
                <Row className="mt-3">
                  <Col md={12}>
                    <div><strong>Token Usage:</strong></div>
                    <div className="ms-2">Input: {session.metadata.token_usage.input_tokens}</div>
                    <div className="ms-2">Output: {session.metadata.token_usage.output_tokens}</div>
                    <div className="ms-2">Total: {session.metadata.token_usage.total_tokens}</div>
                  </Col>
                </Row>
              )}
              {session.metadata?.execution_time_seconds !== undefined && (
                <div className="mt-3">
                  Execution Time: {session.metadata.execution_time_seconds.toFixed(2)}s
                </div>
              )}
              {session.metadata?.api_status && (
                <div className="mt-1">API Status: {session.metadata.api_status}</div>
              )}
              {session.completed_at && (
                <div className="mt-3">Completed: {new Date(session.completed_at).toLocaleString()}</div>
              )}
            </Card.Body>
          </Card>

          <Card bg="light" className="border-0">
            <Card.Body className="small text-muted">
              Switch to real Google ADK responses only when you have a reviewed secrets plan and the stack is
              running on a private network. Refer to the README for the enablement checklist.
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ResultsDisplay;
