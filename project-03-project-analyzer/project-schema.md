# Project Management Analysis Schema

## 📋 Google Sheets Schema Design

### **Project Tasks Table**: Sheet Name: `project_tasks`
```
item_id | title | status | start_date | due_date | assignee | dependency_item_id | priority | progress_pct | estimated_hours | actual_hours | category | notes
```

### **Field Definitions**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `item_id` | String | Unique task identifier | TASK_001, TASK_002 |
| `title` | String | Task description | "Design user authentication system" |
| `status` | Enum | Current task status | NOT_STARTED, IN_PROGRESS, BLOCKED, COMPLETED |
| `start_date` | Date | When task begins | 2024-01-15 |
| `due_date` | Date | Deadline | 2024-01-22 |
| `assignee` | String | Person responsible | "John Smith", "AI Agent", "External Team" |
| `dependency_item_id` | String | Tasks that must complete first | TASK_001 (or empty) |
| `priority` | Enum | Task importance | LOW, MEDIUM, HIGH, CRITICAL |
| `progress_pct` | Number | Completion percentage | 0-100 |
| `estimated_hours` | Number | Original time estimate | 8, 16, 40 |
| `actual_hours` | Number | Time actually spent | 12, 18, 35 |
| `category` | String | Task type | DEVELOPMENT, DESIGN, TESTING, DOCS |
| `notes` | Text | Additional context | "Waiting for client feedback" |

### **Sample Project Data**
```
TASK_001 | Setup development environment | COMPLETED | 2024-01-01 | 2024-01-03 | John Smith | | HIGH | 100 | 8 | 6 | DEVELOPMENT | Went faster than expected
TASK_002 | Design database schema | IN_PROGRESS | 2024-01-04 | 2024-01-10 | Sarah Johnson | TASK_001 | HIGH | 75 | 16 | 14 | DESIGN | Need to review with client
TASK_003 | Implement user authentication | NOT_STARTED | 2024-01-11 | 2024-01-18 | Mike Chen | TASK_002 | HIGH | 0 | 24 | 0 | DEVELOPMENT | Blocked by schema completion
TASK_004 | Create landing page | IN_PROGRESS | 2024-01-08 | 2024-01-15 | Lisa Wang | | MEDIUM | 60 | 12 | 8 | DEVELOPMENT | Good progress
TASK_005 | Write API documentation | NOT_STARTED | 2024-01-19 | 2024-01-25 | Alex Brown | TASK_003 | LOW | 0 | 8 | 0 | DOCS | Can start after auth is done
```

## 🔍 **Risk Assessment Analysis Types**

### **1. Timeline Risk Analysis**
```python
RISK_FACTORS = {
    'OVERDUE_TASKS': 'Tasks past due date',
    'DEADLINE_PRESSURE': 'Tasks due within 3 days with <80% progress', 
    'DEPENDENCY_BOTTLENECKS': 'Critical path dependencies not started',
    'RESOURCE_CONFLICTS': 'Same person assigned to overlapping critical tasks',
    'SCOPE_CREEP': 'Actual hours significantly exceeding estimates'
}
```

### **2. Resource Risk Assessment**
- **Workload Distribution**: Who has too many tasks?
- **Single Points of Failure**: Critical tasks assigned to one person
- **Skill Gap Analysis**: Tasks assigned to wrong expertise level

### **3. Progress Risk Indicators**
- **Velocity Tracking**: Are estimates realistic?
- **Completion Patterns**: Which categories consistently run over?
- **Dependency Chain Analysis**: What happens if key tasks delay?

## 🤖 **CrewAI Risk Analysis Agents**

### **Agent 1: Timeline Analyzer**
- **Role**: Project Timeline Risk Specialist
- **Goal**: Identify schedule risks and critical path issues
- **Backstory**: Former project manager with experience in software delivery deadlines

### **Agent 2: Resource Analyst**  
- **Role**: Team Capacity and Workload Expert
- **Goal**: Assess resource allocation and identify bottlenecks
- **Backstory**: Operations manager who optimizes team productivity and prevents burnout

### **Agent 3: Risk Assessor**
- **Role**: Project Risk Management Consultant  
- **Goal**: Generate actionable recommendations to mitigate identified risks
- **Backstory**: Consultant who has saved dozens of projects from failure

## 📊 **Analysis Reports Generated**

### **1. Executive Dashboard**
```
🚨 HIGH RISK ITEMS (3)
⚠️  MEDIUM RISK ITEMS (5)  
✅ ON TRACK ITEMS (12)

📈 Project Health Score: 72/100
🎯 Estimated Completion: 2024-02-15 (+5 days delay risk)
👥 Team Utilization: 85% (optimal range)
```

### **2. Risk Detail Report**
```
🚨 CRITICAL RISKS:
- TASK_003: Authentication blocked by schema delay (3 days overdue)
- Sarah Johnson: Overallocated (120% capacity next week)
- Dependency Chain: 5 tasks waiting on TASK_002 completion

⚠️ MEDIUM RISKS:
- TASK_004: Landing page 40% behind schedule
- Estimation Accuracy: Development tasks averaging 125% of estimates
```

### **3. Actionable Recommendations**
```
IMMEDIATE ACTIONS:
1. Prioritize TASK_002 completion (assign additional developer)
2. Break TASK_003 into smaller parallel tasks
3. Move TASK_005 to different team member

PREVENTIVE MEASURES:
1. Review estimation process for development tasks
2. Add buffer time to dependency chains
3. Weekly capacity planning meetings
```

## 🎯 **Student Learning Objectives**

- **Google Sheets Integration**: Read/write data from external systems
- **Business Intelligence**: Transform data into actionable insights
- **Risk Management**: Identify and mitigate project risks
- **Multi-Agent Analysis**: Coordinate specialized AI agents for complex analysis
- **Real-world Application**: Build tools they'll use in their careers

## 💡 **Frontend Interface**

**Simple Input Form:**
- Google Sheet ID input field
- "Analyze Project" button  
- Real-time progress indicator
- Results displayed in clean report format

**User Flow:**
1. User enters Google Sheet ID
2. CrewAI agents analyze the data
3. Risk assessment report generated
4. Recommendations displayed with priority actions

This gives students practical project management skills while learning AI integration!