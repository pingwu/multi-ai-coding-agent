from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai_tools import SerperDevTool
from typing import List
import os
from dotenv import load_dotenv

# Load .env file first, then fall back to environment variables
load_dotenv(override=False)  # override=False means .env takes priority over existing env vars
# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

@CrewBase
class ContentGeneratorCrew():
    """Content Generator crew with 3-agent workflow"""

    agents: List[BaseAgent]
    tasks: List[Task]

    def get_llm(self):
        """Get the configured LLM with improved validation and fallback logic"""
        # Check for demo mode first
        demo_mode = os.environ.get("DEMO_MODE", "false").lower() in ["true", "1"]

        if demo_mode:
            return None  # CrewAI will use default behavior in demo mode

        # Validate and configure OpenAI
        openai_key = os.environ.get("OPENAI_API_KEY")
        if openai_key and openai_key not in ["demo-key", "your-openai-api-key-here"]:
            try:
                model_name = os.environ.get("LLM_MODEL", "gpt-4o-mini")
                llm = LLM(model=model_name, api_key=openai_key)
                return llm
            except Exception as e:
                print(f"Warning: OpenAI LLM configuration failed: {e}")

        # Validate and configure Anthropic as fallback
        anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
        if anthropic_key and anthropic_key not in ["demo-key", "your-anthropic-api-key-here"]:
            try:
                anthropic_model = os.environ.get("ANTHROPIC_MODEL", "claude-3-haiku-20240307")
                llm = LLM(model=anthropic_model, api_key=anthropic_key)
                return llm
            except Exception as e:
                print(f"Warning: Anthropic LLM configuration failed: {e}")

        # If no valid API keys, return None for demo mode behavior
        print("Warning: No valid API keys found, using demo mode")
        return None

    # Learn more about YAML configuration files here:
    # Agents: https://docs.crewai.com/concepts/agents#yaml-configuration-recommended
    # Tasks: https://docs.crewai.com/concepts/tasks#yaml-configuration-recommended
    
    # If you would like to add tools to your agents, you can learn more about it here:
    # https://docs.crewai.com/concepts/agents#agent-tools
    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config['researcher'], # type: ignore[index]
            tools=[SerperDevTool()],
            verbose=True,
            llm=self.get_llm()
        )

    @agent
    def strategist(self) -> Agent:
        return Agent(
            config=self.agents_config['strategist'], # type: ignore[index]
            verbose=True,
            llm=self.get_llm()
        )

    @agent
    def writer(self) -> Agent:
        return Agent(
            config=self.agents_config['writer'], # type: ignore[index]
            verbose=True,
            llm=self.get_llm()
        )

    # To learn more about structured task outputs,
    # task dependencies, and task callbacks, check out the documentation:
    # https://docs.crewai.com/concepts/tasks#overview-of-a-task
    @task
    def research_task(self) -> Task:
        return Task(
            config=self.tasks_config['research_task'], # type: ignore[index]
        )

    @task
    def strategy_task(self) -> Task:
        return Task(
            config=self.tasks_config['strategy_task'], # type: ignore[index]
        )

    @task
    def writing_task(self) -> Task:
        return Task(
            config=self.tasks_config['writing_task'], # type: ignore[index]
            output_file='generated_content.md'
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Content Generator crew"""
        # To learn how to add knowledge sources to your crew, check out the documentation:
        # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )
