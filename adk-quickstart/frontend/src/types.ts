export interface AgentConfigForm {
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface AgentRequest {
  appName: string;
  userId: string;
  prompt: string;
  config: AgentConfigForm;
}

export type SessionStatus = 'pending' | 'running' | 'completed' | 'error';

export interface AgentConfigResponse {
  model: string;
  temperature: number;
  max_tokens: number;
}

export interface SessionState {
  session_id: string;
  app_name: string;
  user_id: string;
  status: SessionStatus;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  config: AgentConfigResponse;
  prompt?: string;
  result?: string;
  error?: string;
  logs: string[];
  metadata?: {
    model: string;
    temperature: number;
    max_tokens: number;
    execution_time_seconds: number;
    api_status?: string;
    token_usage?: {
      input_tokens: number;
      output_tokens: number;
      total_tokens: number;
    };
  };
}
