"""FastAPI backend for the public ADK quickstart demo.

This module keeps the same workflow shape as the internal build while
running entirely in a simulated (mock) mode so we never ship secrets or
make external calls by default.  It exposes REST and WebSocket endpoints
that mirror the production contract, which makes it safe for students to
experiment with and easy for maintainers to harden.
"""

from __future__ import annotations

import asyncio
import logging
import os
import re
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

try:  # Optional dependency for real ADK mode
    import google.generativeai as genai
except ImportError:  # pragma: no cover - library optional at runtime
    genai = None  # type: ignore

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator

ENABLE_REAL_ADK = os.getenv("ENABLE_REAL_ADK", "").lower() in {"1", "true", "yes"}
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
REAL_ADK_ENABLED = False

LOGGER = logging.getLogger("adk-quickstart")
logging.basicConfig(level=logging.INFO)

if ENABLE_REAL_ADK:
    if genai is None:
        LOGGER.warning(
            "Real ADK mode requested but google-generativeai is not installed; "
            "falling back to simulator."
        )
    elif not GOOGLE_API_KEY:
        LOGGER.warning(
            "Real ADK mode requested but GOOGLE_API_KEY is not set; "
            "falling back to simulator."
        )
    else:
        try:
            genai.configure(api_key=GOOGLE_API_KEY)
            REAL_ADK_ENABLED = True
            LOGGER.info("Real ADK mode enabled; live Gemini calls will be attempted.")
        except Exception as exc:  # pragma: no cover - defensive configuration
            LOGGER.warning("Failed to configure Google Generative AI: %s", exc)

AGENT_MODE = "live" if REAL_ADK_ENABLED else "simulated"


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class AgentConfig(BaseModel):
    """Configuration parameters for an ADK agent run."""

    model: str = Field(default="gemini-1.5-flash", max_length=64)
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=1024, ge=64, le=8192)


class SessionRequest(BaseModel):
    config: Optional[AgentConfig] = None
    prompt: Optional[str] = Field(default=None, max_length=4096)

    @validator("prompt")
    def ensure_prompt_not_blank(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and not value.strip():
            raise ValueError("prompt cannot be empty if provided")
        return value


class AgentRunRequest(SessionRequest):
    session_id: str = Field(..., min_length=8)
    app_name: str = Field(..., min_length=1, max_length=128)
    user_id: str = Field(..., min_length=1, max_length=128)


SimulationLog = Dict[str, str]


class SessionState(BaseModel):
    session_id: str
    app_name: str
    user_id: str
    status: str
    created_at: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    config: AgentConfig
    prompt: Optional[str] = None
    result: Optional[str] = None
    error: Optional[str] = None
    logs: List[str] = Field(default_factory=list)
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        arbitrary_types_allowed = True


class SessionStore:
    """In-memory session registry for the demo."""

    def __init__(self) -> None:
        self._sessions: Dict[str, SessionState] = {}
        self._connections: Dict[str, List[WebSocket]] = {}
        self._lock = asyncio.Lock()

    async def active_count(self) -> int:
        async with self._lock:
            return len(self._sessions)

    async def create(self, app_name: str, user_id: str, request: SessionRequest) -> SessionState:
        async with self._lock:
            session_id = str(uuid.uuid4())
            state = SessionState(
                session_id=session_id,
                app_name=app_name,
                user_id=user_id,
                status="pending",
                created_at=_utc_now(),
                config=request.config or AgentConfig(),
                prompt=request.prompt,
            )
            self._sessions[session_id] = state
            self._connections.setdefault(session_id, [])
            LOGGER.info("session %s created for app=%s", session_id, app_name)
            return state

    async def get(self, session_id: str) -> SessionState:
        state = self._sessions.get(session_id)
        if not state:
            raise HTTPException(status_code=404, detail="Session not found")
        return state

    async def update(self, session_id: str, **changes) -> SessionState:
        async with self._lock:
            state = await self.get(session_id)
            updated = state.copy(update=changes)
            self._sessions[session_id] = updated
            return updated

    async def append_log(self, session_id: str, message: str) -> SessionState:
        async with self._lock:
            state = await self.get(session_id)
            state.logs.append(message)
            return state

    def connections(self, session_id: str) -> List[WebSocket]:
        return self._connections.setdefault(session_id, [])

    def attach(self, session_id: str, websocket: WebSocket) -> None:
        self.connections(session_id).append(websocket)

    def detach(self, session_id: str, websocket: WebSocket) -> None:
        if session_id in self._connections:
            self._connections[session_id] = [ws for ws in self._connections[session_id] if ws != websocket]
            if not self._connections[session_id]:
                self._connections.pop(session_id)


SESSION_STORE = SessionStore()

ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",") if origin.strip()]
SIMULATION_DELAY = float(os.getenv("SIMULATION_DELAY_SECONDS", "0.6"))
MAX_CONCURRENT_SESSIONS = int(os.getenv("MAX_CONCURRENT_SESSIONS", "25"))

app = FastAPI(title="Google ADK Quickstart (Demo Mode)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/agent")
async def agent_status() -> Dict[str, str]:
    return {
        "status": AGENT_MODE,
        "message": (
            "Connected to Google ADK. Ensure secrets stay off disk."
            if REAL_ADK_ENABLED
            else "Demo agent ready. Provide a Google ADK backend to enable live runs."
        ),
        "timestamp": _utc_now(),
    }


def _sanitize_for_log(raw: str) -> str:
    if not raw:
        return raw
    redacted = re.sub(r"([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})", "[redacted-email]", raw)
    redacted = re.sub(r"\b\d{6,}\b", "[redacted-number]", redacted)
    if len(redacted) > 120:
        return f"{redacted[:117]}..."
    return redacted


async def _broadcast(session_id: str, payload: Dict[str, object]) -> None:
    to_remove: List[WebSocket] = []
    for connection in list(SESSION_STORE.connections(session_id)):
        try:
            await connection.send_json(payload)
        except Exception as exc:  # pragma: no cover - defensive cleanup
            LOGGER.warning("websocket send failed: %s", exc)
            to_remove.append(connection)
    for connection in to_remove:
        SESSION_STORE.detach(session_id, connection)


@app.post("/api/apps/{app_name}/users/{user_id}/sessions")
async def create_session(app_name: str, user_id: str, request: SessionRequest) -> JSONResponse:
    current_sessions = await SESSION_STORE.active_count()
    if current_sessions >= MAX_CONCURRENT_SESSIONS:
        raise HTTPException(status_code=429, detail="Too many active sessions; try again later")
    state = await SESSION_STORE.create(app_name, user_id, request)
    return JSONResponse(
        status_code=201,
        content={
            "session_id": state.session_id,
            "status": state.status,
            "app_name": state.app_name,
            "user_id": state.user_id,
        },
    )


@app.post("/api/run")
async def run_agent(request: AgentRunRequest) -> Dict[str, str]:
    state = await SESSION_STORE.get(request.session_id)
    if state.status in {"running", "completed"}:
        raise HTTPException(status_code=409, detail="Session already processed")

    await SESSION_STORE.update(
        request.session_id,
        status="running",
        started_at=_utc_now(),
        config=request.config or state.config,
        prompt=request.prompt or state.prompt,
    )

    asyncio.create_task(_execute_agent(request))
    return {"status": "started", "session_id": request.session_id}


@app.get("/api/sessions/{session_id}/status")
async def get_session_status(session_id: str) -> SessionState:
    return await SESSION_STORE.get(session_id)


@app.get("/api/sessions/{session_id}/results")
async def get_session_results(session_id: str) -> SessionState:
    state = await SESSION_STORE.get(session_id)
    if state.status not in {"completed", "error"}:
        raise HTTPException(status_code=400, detail="Session not finished")
    return state


async def _execute_agent(request: AgentRunRequest) -> None:
    if REAL_ADK_ENABLED:
        try:
            await _run_real_adk(request)
            return
        except Exception as exc:  # pragma: no cover - defensive path
            LOGGER.exception("Real ADK execution failed")
            await _record_failure(request.session_id, exc)
            return

    await _run_simulation(request)


async def _record_failure(session_id: str, exc: Exception) -> None:
    completion_time = _utc_now()
    sanitized_error = _sanitize_for_log(str(exc)) or "Execution failed"
    await SESSION_STORE.update(
        session_id,
        status="error",
        completed_at=completion_time,
        error=sanitized_error,
    )
    await SESSION_STORE.append_log(session_id, f"❌ {sanitized_error}")
    await _broadcast(session_id, {"type": "error", "message": sanitized_error})


async def _run_real_adk(request: AgentRunRequest) -> None:
    if genai is None:  # pragma: no cover - guardrail
        raise RuntimeError("google-generativeai library not available")

    session_id = request.session_id
    config = request.config or AgentConfig()
    prompt = request.prompt or "Provide a concise status update."
    start_time = datetime.now(timezone.utc)

    steps = [
        "Provisioning secure ADK session",
        "Loading Gemini model configuration",
        "Dispatching prompt to Google ADK",
        "Awaiting response",
        "Formatting final results",
    ]
    for step in steps[:-2]:  # Log initial progress before the API call
        sanitized_step = _sanitize_for_log(step)
        await SESSION_STORE.append_log(session_id, sanitized_step)
        await _broadcast(session_id, {"type": "log", "message": sanitized_step})
        await asyncio.sleep(SIMULATION_DELAY)

    loop = asyncio.get_running_loop()

    def _call_gemini() -> Any:
        model = genai.GenerativeModel(config.model)
        return model.generate_content(
            prompt,
            generation_config={
                "temperature": config.temperature,
                "max_output_tokens": config.max_tokens,
            },
        )

    response = await loop.run_in_executor(None, _call_gemini)
    await SESSION_STORE.append_log(session_id, "✨ Response received from Google ADK")
    await _broadcast(session_id, {"type": "log", "message": "✨ Response received from Google ADK"})

    for step in steps[-2:]:
        sanitized_step = _sanitize_for_log(step)
        await SESSION_STORE.append_log(session_id, sanitized_step)
        await _broadcast(session_id, {"type": "log", "message": sanitized_step})
        await asyncio.sleep(SIMULATION_DELAY / 2)

    ai_response = getattr(response, "text", None)
    if not ai_response and getattr(response, "candidates", None):
        candidate_texts = []
        for candidate in response.candidates:
            parts = getattr(candidate, "content", None)
            if parts and getattr(parts, "parts", None):
                for part in parts.parts:
                    text_value = getattr(part, "text", None)
                    if text_value:
                        candidate_texts.append(text_value)
        if candidate_texts:
            ai_response = "\n\n".join(candidate_texts)

    if not ai_response:
        ai_response = "Google ADK returned no content."

    usage_metadata = getattr(response, "usage_metadata", None)
    input_tokens = getattr(usage_metadata, "prompt_token_count", 0) if usage_metadata else 0
    output_tokens = getattr(usage_metadata, "candidates_token_count", 0) if usage_metadata else 0
    total_tokens = getattr(usage_metadata, "total_token_count", 0) if usage_metadata else 0

    completion_time = _utc_now()
    execution_seconds = max((datetime.now(timezone.utc) - start_time).total_seconds(), 0.0)
    execution_metadata: Dict[str, Any] = {
        "model": config.model,
        "temperature": config.temperature,
        "max_tokens": config.max_tokens,
        "execution_time_seconds": execution_seconds,
        "token_usage": {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": total_tokens,
        },
        "api_status": "connected",
    }

    result = _build_result(request, completion_time, ai_response, execution_metadata)
    await SESSION_STORE.update(
        session_id,
        status="completed",
        completed_at=completion_time,
        result=result,
        error=None,
        metadata=execution_metadata,
    )
    await SESSION_STORE.append_log(session_id, "✅ Agent execution completed")
    await _broadcast(
        session_id,
        {"type": "status", "status": {"status": "completed", "completed_at": completion_time}},
    )
    await _broadcast(session_id, {"type": "log", "message": "✅ Agent execution completed"})


async def _run_simulation(request: AgentRunRequest) -> None:
    session_id = request.session_id
    # Step-by-step simulation to mirror the production workflow.
    steps = [
        "Provisioning container",
        "Pulling prompt configuration",
        "Warming up model",
        "Executing agent workflow",
        "Aggregating final response",
    ]
    for step in steps:
        sanitized_step = _sanitize_for_log(step)
        await SESSION_STORE.append_log(session_id, sanitized_step)
        await _broadcast(session_id, {"type": "log", "message": sanitized_step})
        await asyncio.sleep(SIMULATION_DELAY)

    prompt_preview = _sanitize_for_log(request.prompt or "(no prompt supplied)")
    await SESSION_STORE.append_log(session_id, f"Prompt preview: {prompt_preview}")
    await _broadcast(session_id, {"type": "log", "message": f"Prompt preview: {prompt_preview}"})

    completion_time = _utc_now()
    result = _build_result(request, completion_time)
    await SESSION_STORE.update(
        session_id,
        status="completed",
        completed_at=completion_time,
        result=result,
        error=None,
        metadata=None,
    )
    await SESSION_STORE.append_log(session_id, "✅ Agent execution completed")
    await _broadcast(session_id, {"type": "status", "status": {"status": "completed", "completed_at": completion_time}})
    await _broadcast(session_id, {"type": "log", "message": "✅ Agent execution completed"})


def _build_result(
    request: AgentRunRequest,
    completed_at: str,
    response_text: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> str:
    config = request.config or AgentConfig()
    prompt = request.prompt or "Generate a friendly welcome message"
    truncated_prompt = _sanitize_for_log(prompt)
    body = response_text or (
        "This is a demo response generated by the quickstart simulator. "
        "Connect a real Google ADK backend to replace this content with live output."
    )

    configuration_lines = [
        f"- Model: {metadata.get('model', config.model) if metadata else config.model}",
        f"- Temperature: {metadata.get('temperature', config.temperature) if metadata else config.temperature}",
        f"- Max Tokens: {metadata.get('max_tokens', config.max_tokens) if metadata else config.max_tokens}",
    ]

    execution_lines = [f"- Completed At: {completed_at}", f"- Session ID: {request.session_id}"]

    if metadata and isinstance(metadata.get("token_usage"), dict):
        tokens = metadata["token_usage"]
        execution_lines.extend(
            [
                f"- Input Tokens: {tokens.get('input_tokens', 0)}",
                f"- Output Tokens: {tokens.get('output_tokens', 0)}",
                f"- Total Tokens: {tokens.get('total_tokens', 0)}",
            ]
        )

    sections = [
        "# ADK Quickstart Result",
        "",
        "## Prompt Snapshot",
        truncated_prompt,
        "",
        "## Configuration",
        "\n".join(configuration_lines),
        "",
        "## Agent Response",
        body,
        "",
        "## Execution Metadata",
        "\n".join(execution_lines),
    ]

    return "\n".join(sections) + "\n"


@app.websocket("/ws/sessions/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str) -> None:
    await websocket.accept()
    try:
        state = await SESSION_STORE.get(session_id)
    except HTTPException:
        await websocket.close(code=4004)
        return

    SESSION_STORE.attach(session_id, websocket)

    # Send existing logs and status so late subscribers have context.
    await websocket.send_json({"type": "status", "status": state.dict()})
    for log_message in state.logs:
        await websocket.send_json({"type": "log", "message": log_message})

    try:
        while True:
            # We keep the channel alive but ignore inbound messages for now.
            await websocket.receive_text()
    except WebSocketDisconnect:
        SESSION_STORE.detach(session_id, websocket)
    except Exception as exc:  # pragma: no cover - defensive cleanup
        LOGGER.warning("unexpected websocket exception: %s", exc)
        SESSION_STORE.detach(session_id, websocket)
        await websocket.close()
