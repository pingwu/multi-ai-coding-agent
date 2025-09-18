import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { ChatSession, ChatMessage, ChatConfig } from '../types/chat';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import ConfigPanel from './ConfigPanel';

interface ChatBoxProps {
  initialConfig?: Partial<ChatConfig>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ initialConfig }) => {
  // Helper to get backend URL
  const getBackendUrl = (path: string) => {
    const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL ||
      `${window.location.protocol}//${window.location.hostname}:8000`;
    return `${backendBaseUrl}${path}`;
  };
  const [session, setSession] = useState<ChatSession>({
    id: '',
    appName: initialConfig?.appName || 'chat-demo',
    userId: initialConfig?.userId || 'user-' + Math.random().toString(36).substr(2, 9),
    config: {
      model: initialConfig?.model || 'gemini-1.5-flash',
      temperature: initialConfig?.temperature || 0.7,
      maxTokens: initialConfig?.maxTokens || 800,
    },
    messages: [{
      id: 'welcome',
      type: 'system' as const,
      content: '👋 Welcome to Google ADK Chat! Start a conversation below.',
      timestamp: new Date(),
    }],
    isConnected: false,
    isTyping: false,
  });

  const [showConfig, setShowConfig] = useState(false);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  const createNewSession = async (): Promise<string> => {
    const response = await fetch(
      getBackendUrl(`/api/apps/${encodeURIComponent(session.appName)}/users/${encodeURIComponent(session.userId)}/sessions`),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            model: session.config.model,
            temperature: session.config.temperature,
            max_tokens: session.config.maxTokens,
          },
        }),
      }
    );

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Failed to create session: ${message}`);
    }

    const data = await response.json();
    return data.session_id;
  };

  const connectWebSocket = (sessionId: string) => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const backendHost = window.location.hostname + ':8000';
    const wsUrl = `${wsProtocol}//${backendHost}/ws/sessions/${sessionId}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setSession(prev => ({ ...prev, isConnected: true }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'log') {
        // Add system message for logs
        const logMessage: ChatMessage = {
          id: `log-${Date.now()}`,
          type: 'system' as const,
          content: `🔄 ${data.message}`,
          timestamp: new Date(),
        };
        setSession(prev => ({
          ...prev,
          messages: [...prev.messages, logMessage],
          isTyping: !data.message.includes('completed'),
        }));
      } else if (data.type === 'status' && data.status?.status === 'completed') {
        setSession(prev => ({ ...prev, isTyping: false }));
        // Fetch the final result
        fetchResult(sessionId);
      }
    };

    ws.onclose = () => {
      setSession(prev => ({ ...prev, isConnected: false }));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setSession(prev => ({ ...prev, isConnected: false }));
    };

    setWebsocket(ws);
  };

  const fetchResult = async (sessionId: string) => {
    try {
      const response = await fetch(getBackendUrl(`/api/sessions/${sessionId}/results`));
      if (response.ok) {
        const data = await response.json();

        // Extract AI response from the structured result
        const resultText = data.result || 'No response received';
        const responseMatch = resultText.match(/## Agent Response\n([\s\S]*?)(?:\n## |$)/);
        const aiResponse = responseMatch ? responseMatch[1].trim() : resultText;

        const responseMessage: ChatMessage = {
          id: `response-${Date.now()}`,
          type: 'assistant' as const,
          content: aiResponse,
          timestamp: new Date(),
          metadata: data.metadata ? {
            model: data.metadata.model,
            tokens: data.metadata.token_usage,
            executionTime: data.metadata.execution_time_seconds,
          } : undefined,
        };

        setSession(prev => ({
          ...prev,
          messages: [...prev.messages, responseMessage],
        }));
      }
    } catch (error) {
      console.error('Failed to fetch result:', error);
    }
  };

  const sendMessage = async (content: string) => {
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date(),
      status: 'sending' as const,
    };

    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    try {
      // Create new session for each message (following current backend pattern)
      const sessionId = await createNewSession();
      setSession(prev => ({ ...prev, id: sessionId }));

      // Connect WebSocket for real-time updates
      connectWebSocket(sessionId);

      // Start the agent run
      const runResponse = await fetch(getBackendUrl('/api/run'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          app_name: session.appName,
          user_id: session.userId,
          config: {
            model: session.config.model,
            temperature: session.config.temperature,
            max_tokens: session.config.maxTokens,
          },
          prompt: content,
        }),
      });

      if (!runResponse.ok) {
        throw new Error('Failed to start agent');
      }

      // Mark user message as sent
      setSession(prev => ({
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
        ),
      }));

    } catch (error) {
      console.error('Error sending message:', error);

      // Mark user message as error and add error message
      setSession(prev => ({
        ...prev,
        messages: [
          ...prev.messages.map(msg =>
            msg.id === userMessage.id ? { ...msg, status: 'error' as const } : msg
          ),
          {
            id: `error-${Date.now()}`,
            type: 'system' as const,
            content: `❌ Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
            timestamp: new Date(),
          }
        ],
        isTyping: false,
      }));
    }
  };

  const updateConfig = (newConfig: Partial<ChatConfig>) => {
    setSession(prev => ({
      ...prev,
      ...newConfig,
      config: { ...prev.config, ...newConfig },
    }));
  };

  const clearChat = () => {
    if (websocket) {
      websocket.close();
      setWebsocket(null);
    }
    setSession(prev => ({
      ...prev,
      id: '',
      messages: [{
        id: 'welcome',
        type: 'system' as const,
        content: '👋 Chat cleared! Start a new conversation below.',
        timestamp: new Date(),
      }],
      isConnected: false,
      isTyping: false,
    }));
  };

  return (
    <Container fluid className="h-100 py-3">
      <Row className="h-100">
        <Col lg={9} md={8} className="d-flex flex-column h-100">
          <Card className="flex-grow-1 d-flex flex-column shadow-sm">
            <ChatHeader
              session={session}
              onToggleConfig={() => setShowConfig(!showConfig)}
              onClearChat={clearChat}
            />
            <Card.Body className="flex-grow-1 d-flex flex-column p-0">
              <div className="flex-grow-1 overflow-auto">
                <MessageList messages={session.messages} isTyping={session.isTyping} />
                <div ref={messagesEndRef} />
              </div>
              <ChatInput
                onSendMessage={sendMessage}
                disabled={session.isTyping}
                placeholder={session.isTyping ? "ADK is responding..." : "Type your message..."}
              />
            </Card.Body>
          </Card>
        </Col>

        {showConfig && (
          <Col lg={3} md={4}>
            <ConfigPanel
              config={session}
              onUpdateConfig={updateConfig}
              onClose={() => setShowConfig(false)}
            />
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default ChatBox;