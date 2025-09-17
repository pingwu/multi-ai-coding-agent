from setuptools import setup, find_packages

setup(
    name="task-crew",
    version="0.1.0",
    description="CrewAI service for intelligent task management with Google Sheets",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    python_requires=">=3.10,<3.13",
    install_requires=[
        "crewai[tools]>=0.119.0,<1.0.0",
        "fastapi==0.104.1",
        "uvicorn[standard]==0.24.0",
        "pydantic==2.5.0",
        "gspread>=5.12.0",
        "google-auth>=2.25.0",
        "openai>=1.3.0"
    ],
    entry_points={
        "console_scripts": [
            "task-crew=task_crew.main:cli",
            "serve=task_crew.main:serve",
        ],
    },
)