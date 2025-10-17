// TypeScript types for Task Management

export interface Task {
  task_id: string;
  title: string;
  description?: string;  // Added: detailed task description
  status: TaskStatus;
  category: TaskCategory;
  priority: TaskPriority;
  created_date: string;
  updated_date: string;
  due_date?: string;
  notes?: string;
  raw_input?: string;
  last_update_action?: string;  // Added: activity history with timestamp
  motivation_type: MotivationType;
  parent_item_id?: string;
  last_updated_date: string;
  last_update_message?: string;
  user_email?: string;  // Added: email of user who created/updated task
}

export type TaskStatus = 
  | 'NOT_STARTED'
  | 'IN_PROGRESS' 
  | 'COMPLETED'
  | 'BLOCKED'
  | 'ON_HOLD';

export type TaskCategory = 
  | 'DEVELOPMENT'
  | 'MEETING'
  | 'DOCUMENTATION'
  | 'RESEARCH'
  | 'TESTING'
  | 'DEPLOYMENT'
  | 'PLANNING'
  | 'REVIEW'
  | 'GENERAL';

export type TaskPriority = 
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW';

export type MotivationType = 
  | 'INTRINSIC'
  | 'EXTRINSIC'
  | 'MIXED';

export interface TaskInputRequest {
  input: string;
  sheet_id?: string;
}

export interface TaskInputResponse {
  success: boolean;
  user_input: string;
  processing_result?: string;
  current_tasks?: Task[];
  error?: string;
  timestamp: string;
}

export interface DashboardSummary {
  total_tasks: number;
  by_status: Record<TaskStatus, number>;
  by_category: Record<TaskCategory, number>;
  by_motivation: Record<MotivationType, number>;
  recent_tasks: Task[];
  active_tasks: number;
  completed_tasks: number;
  timestamp: string;
}

export interface PreviewResponse {
  input: string;
  predicted_actions: PredictedAction[];
  requires_ai_processing: boolean;
  timestamp: string;
}

export interface PredictedAction {
  action: 'update_status' | 'create_task';
  status?: TaskStatus;
  category?: TaskCategory;
  detected_phrase: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ApiError {
  error: string;
  message?: string;
  timestamp: string;
}

// NEW: Hierarchical Task Breakdown Types
export interface TaskIdea {
  raw_text: string;
  extracted_action: string;
  extracted_object: string;
  context_keywords: string[];
  complexity_score: number;
  confidence_score: number;
}

export interface TaskGroup {
  primary_task: TaskIdea;
  similar_tasks: TaskIdea[];
  merged_title: string;
  confidence_score: number;
}

export interface HierarchicalTask {
  title: string;
  type: 'epic' | 'feature' | 'task';
  level: number; // 1=Epic, 2=Feature, 3=Task
  children?: HierarchicalTask[];
  estimated_effort?: number;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  dependencies?: string[];
}

export interface ProjectHierarchy {
  epics: HierarchicalTask[];
  total_tasks: number;
  breakdown_confidence: number;
  processing_time_seconds: number;
}

export interface NaturalLanguageRequest {
  text: string;
  context?: string;
  breakdown_type: 'full' | 'quick' | 'merge_only';
}

export interface TaskBreakdownResponse {
  request_id: string;
  hierarchy: ProjectHierarchy;
  processing_summary: Record<string, any>;
  suggestions: string[];
  warnings: string[];
}