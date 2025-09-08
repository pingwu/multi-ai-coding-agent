from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
import json
from datetime import datetime, timezone

@CrewBase
class ExpenseTrackerCrew():
    """Expense Tracker crew with 3-agent workflow: Parse → Categorize → Validate"""

    agents: List[BaseAgent]
    tasks: List[Task]

    # Expense parsing agents - optimized for performance
    @agent
    def expense_parser(self) -> Agent:
        return Agent(
            config=self.agents_config['expense_parser'], # type: ignore[index]
            verbose=False  # Disable verbose logging for performance
        )

    @agent
    def category_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config['category_specialist'], # type: ignore[index]
            verbose=False  # Disable verbose logging for performance
        )

    @agent
    def compliance_validator(self) -> Agent:
        return Agent(
            config=self.agents_config['compliance_validator'], # type: ignore[index]
            verbose=False  # Disable verbose logging for performance
        )

    # Expense processing tasks
    @task
    def parse_expense_task(self) -> Task:
        return Task(
            config=self.tasks_config['parse_expense_task'], # type: ignore[index]
        )

    @task
    def categorize_expense_task(self) -> Task:
        return Task(
            config=self.tasks_config['categorize_expense_task'], # type: ignore[index]
        )

    @task
    def validate_expense_task(self) -> Task:
        return Task(
            config=self.tasks_config['validate_expense_task'], # type: ignore[index]
            # Note: We'll handle CSV output in the web API, not as a file output here
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Expense Tracker crew - optimized for performance"""
        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=False,  # Disable verbose logging for faster processing
            memory=False,   # Disable memory for faster processing
        )

    def process_expense(self, expense_description: str) -> dict:
        """
        Process a single expense description through the full pipeline
        Returns the final validated expense record as a dictionary
        """
        # Set the input for the crew
        inputs = {"expense_description": expense_description}
        
        # Run the crew
        result = self.crew().kickoff(inputs=inputs)
        
        # Parse the final result (should be JSON from the validator)
        try:
            expense_record = json.loads(str(result))
            # Add processing timestamp
            expense_record["created_at"] = datetime.now(timezone.utc).isoformat()
            return expense_record
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return {
                "error": "Failed to parse expense",
                "raw_result": str(result),
                "expense_description": expense_description,
                "created_at": datetime.now(timezone.utc).isoformat()
            }