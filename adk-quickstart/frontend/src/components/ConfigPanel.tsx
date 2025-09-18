import React, { useState } from 'react';
import { Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { ChatSession, ChatConfig } from '../types/chat';

interface ConfigPanelProps {
  config: ChatSession;
  onUpdateConfig: (config: Partial<ChatConfig>) => void;
  onClose: () => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onUpdateConfig,
  onClose
}) => {
  const [tempConfig, setTempConfig] = useState({
    model: config.config.model,
    temperature: config.config.temperature,
    maxTokens: config.config.maxTokens,
    appName: config.appName,
    userId: config.userId,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setTempConfig(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdateConfig(tempConfig);
    setHasChanges(false);
  };

  const handleReset = () => {
    setTempConfig({
      model: config.config.model,
      temperature: config.config.temperature,
      maxTokens: config.config.maxTokens,
      appName: config.appName,
      userId: config.userId,
    });
    setHasChanges(false);
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h6 className="mb-0">⚙️ Chat Configuration</h6>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onClose}
          className="border-0"
        >
          ✕
        </Button>
      </Card.Header>

      <Card.Body className="overflow-auto">
        {hasChanges && (
          <Alert variant="info" className="small mb-3">
            💡 Changes will apply to new messages
          </Alert>
        )}

        {/* Model Configuration */}
        <Form.Group className="mb-3">
          <Form.Label className="small fw-semibold">Model</Form.Label>
          <Form.Select
            size="sm"
            value={tempConfig.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
          >
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite</option>
          </Form.Select>
          <Form.Text muted className="small">
            Choose the AI model for responses
          </Form.Text>
        </Form.Group>

        {/* Temperature */}
        <Form.Group className="mb-3">
          <Form.Label className="small fw-semibold">
            Temperature: {tempConfig.temperature}
          </Form.Label>
          <Form.Range
            min={0}
            max={2}
            step={0.1}
            value={tempConfig.temperature}
            onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
          />
          <div className="d-flex justify-content-between">
            <small className="text-muted">Focused</small>
            <small className="text-muted">Creative</small>
          </div>
        </Form.Group>

        {/* Max Tokens */}
        <Form.Group className="mb-3">
          <Form.Label className="small fw-semibold">Max Tokens</Form.Label>
          <Form.Control
            type="number"
            size="sm"
            min={64}
            max={8192}
            value={tempConfig.maxTokens}
            onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
          />
          <Form.Text muted className="small">
            Maximum response length (64-8192)
          </Form.Text>
        </Form.Group>

        <hr className="my-3" />

        {/* Session Information */}
        <Form.Group className="mb-3">
          <Form.Label className="small fw-semibold">App Name</Form.Label>
          <Form.Control
            type="text"
            size="sm"
            value={tempConfig.appName}
            onChange={(e) => handleInputChange('appName', e.target.value)}
          />
          <Form.Text muted className="small">
            Used for session tagging
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="small fw-semibold">User ID</Form.Label>
          <Form.Control
            type="text"
            size="sm"
            value={tempConfig.userId}
            onChange={(e) => handleInputChange('userId', e.target.value)}
          />
          <Form.Text muted className="small">
            Pseudonymous identifier for compliance
          </Form.Text>
        </Form.Group>

        {/* Connection Status */}
        <div className="mb-3">
          <small className="fw-semibold text-muted d-block mb-2">Status</small>
          <div className="d-flex flex-wrap gap-1">
            <Badge
              bg={config.isConnected ? 'success' : 'secondary'}
              className="small"
            >
              {config.isConnected ? '🟢 Connected' : '⚪ Offline'}
            </Badge>
            {config.id && (
              <Badge bg="light" text="dark" className="small">
                Session: {config.id.slice(0, 8)}...
              </Badge>
            )}
          </div>
        </div>

        <hr className="my-3" />

        {/* Security Notice */}
        <div className="p-2 bg-light border rounded small">
          <div className="fw-semibold text-muted mb-1">🔒 Privacy</div>
          <ul className="small text-muted mb-0 ps-3">
            <li>No data persisted beyond session</li>
            <li>Logs sanitized for compliance</li>
            <li>Safe for local demos</li>
          </ul>
        </div>
      </Card.Body>

      {hasChanges && (
        <Card.Footer className="bg-light">
          <div className="d-flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              className="flex-grow-1"
            >
              💾 Save Changes
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleReset}
            >
              ↺ Reset
            </Button>
          </div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default ConfigPanel;