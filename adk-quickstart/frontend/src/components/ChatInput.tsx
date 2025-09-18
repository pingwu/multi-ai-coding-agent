import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message..."
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // Focus input on mount
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className="border-top bg-light p-3">
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            as="textarea"
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="border-0 bg-white shadow-sm resize-none"
            style={{
              height: 'auto',
              minHeight: '40px',
              maxHeight: '120px',
              overflow: 'auto',
            }}
            rows={1}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={disabled || !message.trim()}
            className="px-4"
          >
            {disabled ? (
              <span>⏳</span>
            ) : (
              <span>📤</span>
            )}
          </Button>
        </InputGroup>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <small className="text-muted">
            Press Enter to send, Shift+Enter for new line
          </small>
          <small className="text-muted">
            {message.length}/4000
          </small>
        </div>
      </Form>
    </div>
  );
};

export default ChatInput;