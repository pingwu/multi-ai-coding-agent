import React from 'react';
import { ListGroup, Badge, Spinner } from 'react-bootstrap';
import { ChatMessage } from '../types/chat';

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';
    const isAssistant = message.type === 'assistant';

    return (
      <div
        key={message.id}
        className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}
      >
        <div
          className={`p-3 rounded-3 position-relative ${
            isUser
              ? 'bg-primary text-white ms-auto'
              : isSystem
              ? 'bg-light text-muted border'
              : 'bg-white border shadow-sm'
          }`}
          style={{
            maxWidth: '75%',
            wordBreak: 'break-word',
          }}
        >
          {/* Message Header */}
          <div className="d-flex align-items-center justify-content-between mb-1">
            <div className="d-flex align-items-center">
              {isUser && (
                <span className="me-2">
                  👤
                </span>
              )}
              {isAssistant && (
                <span className="me-2">
                  🤖
                </span>
              )}
              {isSystem && (
                <span className="me-2">
                  ⚙️
                </span>
              )}
              <small className={`${isUser ? 'text-white-50' : 'text-muted'}`}>
                {formatTimestamp(message.timestamp)}
              </small>
            </div>

            {/* Status indicator for user messages */}
            {isUser && message.status && (
              <div className="ms-2">
                {message.status === 'sending' && (
                  <Spinner size="sm" className="text-white-50" />
                )}
                {message.status === 'sent' && (
                  <Badge bg="success" className="badge-sm">✓</Badge>
                )}
                {message.status === 'error' && (
                  <Badge bg="danger" className="badge-sm">✗</Badge>
                )}
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className={`${isSystem ? 'font-monospace small' : ''}`}>
            {message.content.split('\n').map((line, index) => (
              <div key={index}>
                {line}
                {index < message.content.split('\n').length - 1 && <br />}
              </div>
            ))}
          </div>

          {/* Metadata for assistant messages */}
          {isAssistant && message.metadata && (
            <div className="mt-2 pt-2 border-top border-light">
              <small className="text-muted d-block">
                {message.metadata.model && (
                  <span className="me-3">
                    📱 {message.metadata.model}
                  </span>
                )}
                {message.metadata.tokens && (
                  <span className="me-3">
                    🔢 {message.metadata.tokens.total} tokens
                  </span>
                )}
                {message.metadata.executionTime && (
                  <span>
                    ⏱️ {message.metadata.executionTime.toFixed(1)}s
                  </span>
                )}
              </small>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-3" style={{ minHeight: '400px' }}>
      {messages.map(renderMessage)}

      {/* Typing indicator */}
      {isTyping && (
        <div className="d-flex justify-content-start mb-3">
          <div className="bg-light border rounded-3 p-3 d-flex align-items-center">
            <span className="me-2">🤖</span>
            <span className="text-muted me-2">ADK is thinking</span>
            <div className="typing-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;