"""
Simple task management agent for natural language todo list operations.
Focused on basic task operations: create, update, complete tasks.
"""

from crewai import Agent
from typing import Dict, Any
import re


class SimpleTaskAgent:
    """Agent specialized in simple task management - create, update, complete tasks."""

    def __init__(self):
        self.agent = Agent(
            role="Simple Task Manager",
            goal="Parse natural language to create, update, or complete simple todo tasks",
            backstory="""You are a helpful task manager who understands how people naturally describe their work.
            You focus on simple task operations: starting tasks, updating progress, and completing tasks.
            You keep task management simple and straightforward.""",
            verbose=True,
            allow_delegation=False
        )

    def parse_simple_task(self, text: str) -> Dict[str, Any]:
        """Parse natural language for simple task operations."""
        text_lower = text.lower()

        # Detect task action type
        if any(word in text_lower for word in ['finished', 'completed', 'done']):
            action = 'complete'
            status = 'COMPLETED'
        elif any(word in text_lower for word in ['started', 'working on', 'beginning']):
            action = 'create'
            status = 'IN_PROGRESS'
        elif any(word in text_lower for word in ['update', 'progress', 'continuing']):
            action = 'update'
            status = 'IN_PROGRESS'
        else:
            action = 'create'  # Default to creating new task
            status = 'NOT_STARTED'

        # Detect priority
        if any(word in text_lower for word in ['urgent', 'critical', 'emergency']):
            priority = 'URGENT'
        elif any(word in text_lower for word in ['high', 'important', 'asap']):
            priority = 'HIGH'
        elif any(word in text_lower for word in ['low', 'minor', 'whenever']):
            priority = 'LOW'
        else:
            priority = 'MEDIUM'

        # Detect category
        category = self._detect_category(text_lower)

        # Extract task title (simplified)
        title = self._extract_task_title(text)

        return {
            'action': action,
            'title': title,
            'status': status,
            'priority': priority,
            'category': category,
            'raw_input': text
        }

    def _detect_category(self, text_lower: str) -> str:
        """Detect task category from text."""
        if any(word in text_lower for word in ['code', 'coding', 'programming', 'development', 'api', 'bug']):
            return 'DEVELOPMENT'
        elif any(word in text_lower for word in ['meeting', 'call', 'standup', 'discussion']):
            return 'MEETING'
        elif any(word in text_lower for word in ['document', 'docs', 'readme', 'write']):
            return 'DOCUMENTATION'
        elif any(word in text_lower for word in ['test', 'testing', 'qa', 'verify']):
            return 'TESTING'
        elif any(word in text_lower for word in ['research', 'investigate', 'analyze', 'study']):
            return 'RESEARCH'
        elif any(word in text_lower for word in ['deploy', 'deployment', 'release', 'publish']):
            return 'DEPLOYMENT'
        else:
            return 'GENERAL'

    def _extract_task_title(self, text: str) -> str:
        """Extract a simple task title from the input text."""
        # Remove action words and clean up
        text = text.strip()

        # Remove common starting phrases
        removal_phrases = [
            'working on', 'started', 'finished', 'completed', 'done with',
            'beginning', 'starting', 'continuing', 'updating progress on'
        ]

        text_lower = text.lower()
        for phrase in removal_phrases:
            if text_lower.startswith(phrase):
                text = text[len(phrase):].strip()
                break

        # Remove priority words
        for word in ['urgent', 'critical', 'high priority', 'low priority', 'important']:
            text = re.sub(r'\b' + word + r'\b', '', text, flags=re.IGNORECASE).strip()

        # Clean up extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()

        # Limit length
        if len(text) > 100:
            text = text[:97] + "..."

        return text or "New Task"

    def generate_simple_report(self, tasks: list) -> Dict[str, Any]:
        """Generate a simple priority and risk summary report."""
        if not tasks:
            return {
                'total_tasks': 0,
                'priority_summary': {},
                'status_summary': {},
                'risk_alerts': [],
                'recommendations': ['No tasks found. Add some tasks to get started!']
            }

        # Count by priority
        priority_counts = {'URGENT': 0, 'HIGH': 0, 'MEDIUM': 0, 'LOW': 0}
        for task in tasks:
            priority = task.get('priority', 'MEDIUM')
            priority_counts[priority] += 1

        # Count by status
        status_counts = {'NOT_STARTED': 0, 'IN_PROGRESS': 0, 'COMPLETED': 0, 'BLOCKED': 0}
        for task in tasks:
            status = task.get('status', 'NOT_STARTED')
            status_counts[status] += 1

        # Generate risk alerts
        risk_alerts = []
        urgent_tasks = priority_counts['URGENT']
        high_tasks = priority_counts['HIGH']
        blocked_tasks = status_counts.get('BLOCKED', 0)

        if urgent_tasks > 0:
            risk_alerts.append(f"⚠️ {urgent_tasks} URGENT task(s) need immediate attention")

        if high_tasks > 3:
            risk_alerts.append(f"🔥 {high_tasks} HIGH priority tasks - consider delegating")

        if blocked_tasks > 0:
            risk_alerts.append(f"🚫 {blocked_tasks} task(s) are BLOCKED - needs resolution")

        # Generate recommendations
        recommendations = []
        total_tasks = len(tasks)
        completed_tasks = status_counts['COMPLETED']

        if completed_tasks == 0:
            recommendations.append("💡 Start with completing one small task to build momentum")
        elif urgent_tasks > 0:
            recommendations.append("🎯 Focus on URGENT tasks first before starting new work")
        elif high_tasks > 0:
            recommendations.append("📈 Tackle HIGH priority tasks to make significant progress")
        else:
            recommendations.append("✅ Great job! Keep up the steady progress")

        return {
            'total_tasks': total_tasks,
            'priority_summary': priority_counts,
            'status_summary': status_counts,
            'risk_alerts': risk_alerts,
            'recommendations': recommendations,
            'completion_rate': f"{(completed_tasks/total_tasks*100):.0f}%" if total_tasks > 0 else "0%"
        }


def create_simple_task_agent():
    """Factory function to create a SimpleTaskAgent instance."""
    return SimpleTaskAgent()