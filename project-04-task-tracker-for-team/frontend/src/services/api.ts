// API service for communicating with the backend

import { 
  Task, 
  TaskInputRequest, 
  TaskInputResponse, 
  DashboardSummary, 
  PreviewResponse 
} from '../types/Task';

// Prefer relative requests so CRA proxy can route to the API container.
// Fall back to env base URL only when not running in a browser context.
const resolveBaseUrl = () => {
  try {
    if (typeof window !== 'undefined' && window.location) {
      // Use host loopback to call API directly; CORS is configured to allow localhost:3000
      return 'http://localhost:8000';
    }
  } catch {}
  return process.env.REACT_APP_API_URL || '';
};

const API_BASE_URL = resolveBaseUrl();

class ApiService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest('/health');
  }

  // Preview parsing (client-side heuristic fallback)
  async previewTaskInput(req: { input: string }): Promise<PreviewResponse> {
    const text = req.input.trim();
    const lower = text.toLowerCase();

    const predicted: any[] = [];
    if (/(finished|completed|done)/.test(lower)) {
      predicted.push({
        action: 'update_status',
        status: 'COMPLETED',
        detected_phrase: 'finished/completed/done',
        confidence: 'medium',
      });
    } else if (/(working on|started|starting|beginning)/.test(lower)) {
      predicted.push({
        action: 'create_task',
        category: 'GENERAL',
        detected_phrase: 'working on/started',
        confidence: 'low',
      });
    }

    return {
      input: text,
      predicted_actions: predicted,
      requires_ai_processing: predicted.length === 0,
      timestamp: new Date().toISOString(),
    };
  }

  // Process natural language task input
  async processTaskInput(request: TaskInputRequest): Promise<TaskInputResponse> {
    return this.makeRequest('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get simple report (replaces dashboard)
  async getSimpleReport(sheetId?: string): Promise<{
    total_tasks: number;
    priority_summary: { [key: string]: number };
    status_summary: { [key: string]: number };
    risk_alerts: string[];
    recommendations: string[];
    completion_rate: string;
    timestamp: string;
  }> {
    const params = sheetId ? `?sheet_id=${encodeURIComponent(sheetId)}` : '';
    return this.makeRequest(`/api/report${params}`);
  }

  // Get all tasks
  async getAllTasks(sheetId?: string): Promise<{ tasks: Task[]; count: number; timestamp: string }> {
    const params = sheetId ? `?sheet_id=${encodeURIComponent(sheetId)}` : '';
    return this.makeRequest(`/api/tasks${params}`);
  }

  // Synthesize a dashboard summary from tasks and simple report
  async getDashboard(): Promise<DashboardSummary> {
    const tasksResp = await this.getAllTasks();
    const tasks = tasksResp.tasks || [];

    // Count by status
    const by_status: any = { NOT_STARTED: 0, IN_PROGRESS: 0, COMPLETED: 0, BLOCKED: 0, ON_HOLD: 0 };
    const by_category: any = { DEVELOPMENT: 0, MEETING: 0, DOCUMENTATION: 0, RESEARCH: 0, TESTING: 0, DEPLOYMENT: 0, PLANNING: 0, REVIEW: 0, GENERAL: 0 };
    const by_motivation: any = { INTRINSIC: 0, EXTRINSIC: 0, MIXED: 0 };

    // Normalize fields from potentially inconsistent sheet headers
    const norm = (t: any): Task => ({
      task_id: t.task_id || t["I do"] || t.id || '',
      title: t.title || t["Title"] || '',
      status: (t.status || t["Status"] || 'NOT_STARTED') as any,
      category: (t.category || t["Category"] || 'GENERAL') as any,
      priority: (t.priority || t["Priority"] || 'MEDIUM') as any,
      created_date: t.created_date || t["created_date"] || t["Created"] || new Date().toISOString(),
      updated_date: t.updated_date || t["updated_date"] || t["last update date"] || new Date().toISOString(),
      due_date: t.due_date || t["due_date"] || undefined,
      notes: t.notes || t["Notes"] || undefined,
      raw_input: t.raw_input || t["raw_input"] || undefined,
      motivation_type: (t.motivation_type || t["motivation_type"] || 'MIXED') as any,
      parent_item_id: t.parent_item_id || t["parent_item_id"] || undefined,
      last_updated_date: t.last_updated_date || t["last update date"] || t["updated_date"] || new Date().toISOString(),
      last_update_message: t.last_update_message || t["last update message"] || t["last_update_action"] || undefined,
    });

    const normalized = tasks.map(norm);

    for (const t of normalized) {
      if (by_status[t.status] !== undefined) by_status[t.status]++;
      if (by_category[t.category] !== undefined) by_category[t.category]++;
      if (by_motivation[t.motivation_type] !== undefined) by_motivation[t.motivation_type]++;
    }

    // Recent tasks: sort by updated_date desc and take 5
    const recent_tasks = [...normalized].sort((a, b) => new Date(b.updated_date).getTime() - new Date(a.updated_date).getTime()).slice(0, 5);

    const total_tasks = normalized.length;
    const active_tasks = by_status.IN_PROGRESS || 0;
    const completed_tasks = by_status.COMPLETED || 0;

    return {
      total_tasks,
      by_status,
      by_category,
      by_motivation,
      recent_tasks,
      active_tasks,
      completed_tasks,
      timestamp: new Date().toISOString(),
    } as DashboardSummary;
  }

  // Get tasks by status
  async getTasksByStatus(
    status: string, 
    sheetId?: string
  ): Promise<{ tasks: Task[]; status: string; count: number; timestamp: string }> {
    const params = sheetId ? `?sheet_id=${encodeURIComponent(sheetId)}` : '';
    return this.makeRequest(`/api/tasks/status/${status}${params}`);
  }

  // Get tasks by category
  async getTasksByCategory(
    category: string, 
    sheetId?: string
  ): Promise<{ tasks: Task[]; category: string; count: number; timestamp: string }> {
    const params = sheetId ? `?sheet_id=${encodeURIComponent(sheetId)}` : '';
    return this.makeRequest(`/api/tasks/category/${category}${params}`);
  }

  // Get configuration info
  async getConfig(): Promise<{
    google_sheets_configured: boolean;
    credentials_configured: boolean;
    openai_configured: boolean;
    sheet_id: string;
    timestamp: string;
  }> {
    return this.makeRequest('/api/config');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
