import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { AgentRequest } from '../types';

interface AgentFormProps {
  onStartAgent: (request: AgentRequest) => Promise<void>;
}

const AgentForm: React.FC<AgentFormProps> = ({ onStartAgent }) => {
  const [appName, setAppName] = useState('demo-app');
  const [userId, setUserId] = useState('sample-user');
  const [prompt, setPrompt] = useState('Draft a friendly welcome message for a new user onboarding flow.');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(800);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onStartAgent({
        appName,
        userId,
        prompt,
        config: {
          model,
          temperature,
          maxTokens,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to start simulated run.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <Row className="justify-content-center">
        <Col lg={7} md={9} sm={12}>
          <Card className="shadow-sm border-0 mb-3">
            <Card.Header className="bg-primary text-white">
              <h2 className="h5 mb-0">Configure a Safe ADK Simulation</h2>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} id="adk-agent-form">
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="appName">
                      <Form.Label>App Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={appName}
                        onChange={(event) => setAppName(event.target.value)}
                        required
                      />
                      <Form.Text muted>Used for tagging the session; avoid secrets.</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="userId">
                      <Form.Label>User Identifier</Form.Label>
                      <Form.Control
                        type="text"
                        value={userId}
                        onChange={(event) => setUserId(event.target.value)}
                        required
                      />
                      <Form.Text muted>Use pseudonymous IDs for compliance.</Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 mt-1">
                  <Col md={4}>
                    <Form.Group controlId="model">
                      <Form.Label>Model</Form.Label>
                      <Form.Select value={model} onChange={(event) => setModel(event.target.value)}>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                        <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="temperature">
                      <Form.Label>Temperature</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        min={0}
                        max={2}
                        value={temperature}
                        onChange={(event) => setTemperature(Number(event.target.value))}
                      />
                      <Form.Text muted>0.0 – 2.0</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="maxTokens">
                      <Form.Label>Max Tokens</Form.Label>
                      <Form.Control
                        type="number"
                        min={64}
                        max={8192}
                        value={maxTokens}
                        onChange={(event) => setMaxTokens(Number(event.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mt-3" controlId="prompt">
                  <Form.Label>Prompt</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    required
                  />
                  <Form.Text muted>Keep prompts free of personal data to stay GDPR/CCPA friendly.</Form.Text>
                </Form.Group>

                <div className="d-grid mt-4">
                  <Button type="submit" size="lg" disabled={isSubmitting} variant="primary">
                    {isSubmitting ? 'Starting simulation…' : 'Run ADK Simulation'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="border-info border-2">
            <Card.Header className="bg-info text-white">
              <h3 className="h6 mb-0">Governance Guardrails</h3>
            </Card.Header>
            <Card.Body className="small text-muted">
              <ul className="mb-0">
                <li>No secrets are sent to the backend; everything runs in-memory.</li>
                <li>Logs redact common identifiers before streaming to the console.</li>
                <li>Swap in a hardened ADK backend when you are ready for production traffic.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AgentForm;
