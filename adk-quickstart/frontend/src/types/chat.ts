export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  metadata?: {
    model?: string;
    tokens?: {
      input: number;
      output: number;
      total: number;
    };
    executionTime?: number;
  };
}

export interface ChatSession {
  id: string;
  appName: string;
  userId: string;
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
  messages: ChatMessage[];
  isConnected: boolean;
  isTyping: boolean;
}

export interface ChatConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  appName: string;
  userId: string;
}