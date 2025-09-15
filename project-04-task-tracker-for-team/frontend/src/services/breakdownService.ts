import { NaturalLanguageRequest, TaskBreakdownResponse } from '../types/Task';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export class BreakdownService {
  
  static async breakdownText(request: NaturalLanguageRequest): Promise<TaskBreakdownResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/breakdown`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Breakdown service error:', error);
      throw error;
    }
  }

  static async getBreakdownStatus(requestId: string): Promise<TaskBreakdownResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/breakdown/${requestId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get breakdown status error:', error);
      throw error;
    }
  }

  static async refineHierarchy(requestId: string, refinements: Record<string, any>): Promise<TaskBreakdownResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/breakdown/${requestId}/refine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refinements),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Refine hierarchy error:', error);
      throw error;
    }
  }

  static createWebSocket(requestId: string): WebSocket {
    const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';
    return new WebSocket(`${WS_BASE_URL}/ws/breakdown/${requestId}`);
  }
}

// WebSocket hook for real-time progress updates
export interface BreakdownProgress {
  step: string;
  percentage: number;
  timestamp: string;
}

export interface WebSocketMessage {
  type: 'status_update' | 'progress_update' | 'error';
  status?: string;
  progress?: BreakdownProgress;
  message?: string;
  error?: string;
  request_id?: string;
}

export const useBreakdownWebSocket = (
  requestId: string | null,
  onMessage: (message: WebSocketMessage) => void,
  onError?: (error: Event) => void
) => {
  let ws: WebSocket | null = null;

  const connect = () => {
    if (!requestId) return;

    ws = BreakdownService.createWebSocket(requestId);

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        onMessage(message);
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const disconnect = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
      ws = null;
    }
  };

  return { connect, disconnect };
};