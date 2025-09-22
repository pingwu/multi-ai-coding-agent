"""
Authentication routes for the API Gateway

Implements a minimal but secure Google OAuth 2.0 Authorization Code flow
and stateless JWT session cookie handling for the frontend.
"""

from fastapi import APIRouter, Request, Response
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional, Any
import os
import time
import requests
import jwt
import logging
from src.utils.privacy import should_redact, redact_text, redact_dict
logger = logging.getLogger(__name__)
import secrets
import hashlib
import base64

router = APIRouter()


class User(BaseModel):
    id: str
    email: str
    name: str


class AuthStatus(BaseModel):
    authenticated: bool
    user: Optional[User] = None


# Environment configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

JWT_SECRET = os.getenv("JWT_SECRET_KEY", "change_me")
JWT_ALG = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_EXPIRE_MIN = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Cookie settings
COOKIE_SECURE = (os.getenv("SESSION_COOKIE_SECURE", "false").lower() in ("1", "true", "yes"))
COOKIE_HTTPONLY = (os.getenv("SESSION_COOKIE_HTTPONLY", "true").lower() in ("1", "true", "yes"))
COOKIE_SAMESITE = os.getenv("SESSION_COOKIE_SAMESITE", "lax").lower()


def _issue_session_cookie(response: Response, user: dict):
    try:
        now = int(time.time())
        payload = {
            "sub": user.get("id") or user.get("email"),
            "email": user.get("email"),
            "name": user.get("name"),
            "iat": now,
            "exp": now + ACCESS_EXPIRE_MIN * 60,
        }

        if should_redact():
            logger.debug("Issuing session cookie (user info redacted)")
        else:
            logger.debug(f"Issuing session cookie for user: {payload}")
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)
        logger.debug(f"JWT created successfully (length: {len(token)})")

        # Normalise SameSite value and surface misconfiguration for easier debugging
        samesite = COOKIE_SAMESITE if COOKIE_SAMESITE in {"lax", "strict", "none"} else "lax"
        if samesite != COOKIE_SAMESITE:
            logger.warning(
                "Invalid SESSION_COOKIE_SAMESITE=%s; defaulting to 'lax'",
                COOKIE_SAMESITE,
            )

        if samesite == "none" and not COOKIE_SECURE:
            logger.info(
                "SESSION_COOKIE_SAMESITE is 'none' but SESSION_COOKIE_SECURE is false; "
                "modern browsers may ignore the cookie."
            )

        response.set_cookie(
            key="session",
            value=token,
            max_age=ACCESS_EXPIRE_MIN * 60,
            secure=COOKIE_SECURE,
            httponly=COOKIE_HTTPONLY,
            samesite=samesite,
            path="/",
        )
        logger.debug("Session cookie set successfully")

    except Exception as e:
        logger.error(f"Error setting session cookie: {e}")
        raise


# ---- OAuth Hardening: state and PKCE support ----
STATE_COOKIE_NAME = "oauth_state"
PKCE_COOKIE_NAME = "oauth_pkce"
TEMP_COOKIE_MAX_AGE = 300  # 5 minutes


def _issue_temp_cookie(response: Response, key: str, value: str, max_age: int = TEMP_COOKIE_MAX_AGE):
    response.set_cookie(
        key=key,
        value=value,
        max_age=max_age,
        secure=COOKIE_SECURE,
        httponly=True,
        samesite=COOKIE_SAMESITE,
        path="/",
    )


def _delete_cookie(response: Response, key: str):
    response.delete_cookie(key, path="/")


def _generate_state() -> str:
    return secrets.token_urlsafe(32)


def _generate_pkce_pair() -> tuple[str, str]:
    """Return (code_verifier, code_challenge) for PKCE S256."""
    verifier = secrets.token_urlsafe(64)  # 43-128 chars
    digest = hashlib.sha256(verifier.encode("ascii")).digest()
    challenge = base64.urlsafe_b64encode(digest).rstrip(b"=").decode("ascii")
    return verifier, challenge


def _decode_session(request: Request) -> Optional[dict]:
    token = request.cookies.get("session")
    logger.info(f"DEBUG: Raw cookies from request: {dict(request.cookies)}")

    if not token:
        logger.warning("DEBUG: No session cookie found in request")
        return None

    try:
        logger.debug(f"Attempting to decode JWT token (length: {len(token)})")
        logger.debug("JWT secret configured: yes")
        logger.debug(f"JWT algorithm: {JWT_ALG}")

        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        if should_redact():
            logger.debug("Successfully decoded JWT payload (redacted)")
        else:
            logger.debug(f"Successfully decoded JWT payload: {payload}")
        return payload

    except jwt.ExpiredSignatureError as e:
        logger.warning(f"JWT token expired: {e}")
        return None
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid JWT token: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected JWT decode error: {type(e).__name__}: {e}")
        return None


@router.get("/auth/status", response_model=AuthStatus)
async def get_auth_status(request: Request):
    """Return current authentication status from JWT cookie."""
    claims = _decode_session(request)
    if not claims:
        return AuthStatus(authenticated=False, user=None)
    return AuthStatus(
        authenticated=True,
        user=User(id=claims.get("sub", ""), email=claims.get("email", ""), name=claims.get("name", "")),
    )


@router.post("/auth/logout")
async def logout(response: Response):
    """Clear the session cookie."""
    response = JSONResponse({"success": True})
    response.delete_cookie("session", path="/")
    return response


@router.get("/auth/login")
async def login():
    """Redirect to Google OAuth consent screen."""
    if not GOOGLE_CLIENT_ID or not GOOGLE_REDIRECT_URI:
        return JSONResponse(status_code=400, content={"error": "Google OAuth not configured"})

    scopes = os.getenv("GOOGLE_OAUTH_SCOPES", "openid email profile").replace(" ", "%20")
    # Generate CSRF state and PKCE
    state = _generate_state()
    code_verifier, code_challenge = _generate_pkce_pair()

    # Build auth URL with state and PKCE (S256)
    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={GOOGLE_REDIRECT_URI}&"
        "response_type=code&"
        f"scope={scopes}&"
        f"state={state}&"
        "code_challenge_method=S256&"
        f"code_challenge={code_challenge}&"
        "access_type=offline&"
        "prompt=consent"
    )

    # Set short-lived cookies with state and PKCE verifier
    response = RedirectResponse(url=auth_url)
    _issue_temp_cookie(response, STATE_COOKIE_NAME, state)
    _issue_temp_cookie(response, PKCE_COOKIE_NAME, code_verifier)
    return response


@router.get("/auth/callback")
async def auth_callback(request: Request):
    """Handle Google OAuth callback, exchange code for tokens, set session cookie."""
    code = request.query_params.get("code")
    state = request.query_params.get("state")
    if not code:
        return JSONResponse(status_code=400, content={"error": "Missing authorization code"})

    if not (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET and GOOGLE_REDIRECT_URI):
        return JSONResponse(status_code=400, content={"error": "Google OAuth not configured"})

    try:
        # Validate state from cookie to mitigate CSRF
        cookie_state = request.cookies.get(STATE_COOKIE_NAME)
        if not state or not cookie_state or state != cookie_state:
            return JSONResponse(status_code=400, content={"error": "Invalid OAuth state"})

        # Prepare PKCE code_verifier if present
        code_verifier = request.cookies.get(PKCE_COOKIE_NAME)

        # Exchange code for tokens
        data = {
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        }
        if code_verifier:
            data["code_verifier"] = code_verifier

        token_resp = requests.post(
            "https://oauth2.googleapis.com/token",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data=data,
            timeout=10,
        )
        if token_resp.status_code != 200:
            safe_body: Any
            try:
                token_error = token_resp.json()
                safe_body = redact_dict(token_error) if isinstance(token_error, dict) else None
            except Exception:
                safe_body = None

            if safe_body is None:
                preview = token_resp.text[:200]
                safe_body = redact_text(preview) if should_redact() else preview

            logger.warning(
                "Token exchange failed: status=%s body=%s",
                token_resp.status_code,
                safe_body,
            )
            return JSONResponse(status_code=400, content={"error": "Token exchange failed", "details": safe_body})

        token_data = token_resp.json()
        access_token = token_data.get("access_token")

        # Fetch user info from Google OpenID endpoint
        userinfo_resp = requests.get(
            "https://openidconnect.googleapis.com/v1/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10,
        )
        if userinfo_resp.status_code != 200:
            return JSONResponse(status_code=400, content={"error": "Failed to fetch user info"})

        info = userinfo_resp.json()
        user = {
            "id": info.get("sub", info.get("email", "")),
            "email": info.get("email", ""),
            "name": info.get("name", info.get("given_name", "User")),
        }

        # Set session cookie and redirect back to frontend welcome view
        frontend_base = FRONTEND_URL.rstrip("/") if FRONTEND_URL else "http://localhost:3000"
        response = RedirectResponse(url=f"{frontend_base}/welcome")
        if should_redact():
            logger.debug("About to set session cookie for user (email redacted)")
        else:
            logger.debug(f"About to set session cookie for user: {user.get('email','')}")
        _issue_session_cookie(response, user)
        logger.debug("Session cookie function finished")
        # Clear one-time OAuth cookies
        _delete_cookie(response, STATE_COOKIE_NAME)
        _delete_cookie(response, PKCE_COOKIE_NAME)
        logger.debug(f"Redirecting to frontend: {FRONTEND_URL}")
        return response

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
