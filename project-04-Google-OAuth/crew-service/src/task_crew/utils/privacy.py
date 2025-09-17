import os
import re
from typing import Any, Dict


EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
TOKEN_RE = re.compile(r"(Bearer\s+)?([A-Za-z0-9-_]{20,}\.[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}|[A-Za-z0-9-_]{24,})")


def should_redact() -> bool:
    val = os.getenv("LOG_REDACT_INPUTS", "true").strip().lower()
    return val in ("1", "true", "yes", "on")


def redact_text(text: str) -> str:
    if not text:
        return text
    redacted = EMAIL_RE.sub("[email]", text)
    redacted = TOKEN_RE.sub("[token]", redacted)
    return redacted


def redact_dict(d: Dict[str, Any]) -> Dict[str, Any]:
    safe: Dict[str, Any] = {}
    for k, v in d.items():
        if isinstance(v, str):
            safe[k] = redact_text(v)
        else:
            safe[k] = v
    return safe

