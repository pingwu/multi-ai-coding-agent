import React from 'react';
import { Card, Button, Badge, Dropdown } from 'react-bootstrap';
import { ChatSession } from '../types/chat';

interface ChatHeaderProps {
  session: ChatSession;
  onToggleConfig: () => void;
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  session,
  onToggleConfig,
  onClearChat
}) => {
  return (
    <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <h5 className="mb-0 me-3">
          🤖 Google ADK Chat
        </h5>

        <div className="d-flex align-items-center">
          {/* Connection Status */}
          <Badge
            bg={session.isConnected ? 'success' : 'secondary'}
            className="me-2"
          >
            {session.isConnected ? '🟢 Connected' : '⚪ Offline'}
          </Badge>

          {/* Model Badge */}
          <Badge bg="light" text="dark" className="me-2">
            {session.config.model}
          </Badge>

          {/* Message Count */}
          <small className="text-white-50">
            {session.messages.filter(m => m.type !== 'system').length} messages
          </small>
        </div>
      </div>

      <div className="d-flex align-items-center">
        {/* Actions Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="outline-light"
            size="sm"
            className="border-0"
            id="chat-actions"
          >
            ⚙️
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={onToggleConfig}>
              🔧 Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={onClearChat} className="text-danger">
              🗑️ Clear Chat
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Card.Header>
  );
};

export default ChatHeader;