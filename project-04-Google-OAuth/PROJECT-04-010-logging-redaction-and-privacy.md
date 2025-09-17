# Issue: OAuth Authentication Issue - Debugging Logging and Privacy

**Date**: 2025-09-16
**Status**: IN PROGRESS - Debugging Logging Configuration
**Priority**: HIGH - Blocking OAuth login functionality

## Problem Summary

OAuth authentication flow with Google completes successfully but users get redirected back to login page instead of the main application. The `/auth/status` endpoint returns `{"authenticated":false,"user":null}` even after successful OAuth completion. This issue is documented in `OAUTH-AUTHENTICATION-ISSUE.md`.

## Investigation Steps Taken

1.  **Initial Analysis:** Reviewed `OAUTH-AUTHENTICATION-ISSUE.md` and `api-service/src/routes/auth.py`. Hypothesized that `_issue_session_cookie()` was failing silently, preventing the session cookie from being set.

2.  **Attempted Logging Enhancement (Round 1):** Added `logger.info("DEBUG: PRE-COOKIE: ...")` and `logger.info("DEBUG: POST-COOKIE: ...")` to `auth_callback` in `api-service/src/routes/auth.py` to pinpoint execution flow.

3.  **Logging Issue Identified:** Observed that logs from `auth.py` were not appearing in `docker compose logs api-service`, despite `main.py` and other libraries (like `httpx` and `urllib3`) logging correctly. This indicated a problem with the logging configuration specific to the `auth.py` module.

4.  **Logging Configuration Adjustment (Round 1 - `main.py` `basicConfig`):** Modified `api-service/src/main.py` to explicitly set `logging.basicConfig(level=logging.DEBUG)` and `LOG_LEVEL = "DEBUG"` to ensure the root logger was configured for debug output. This did not resolve the issue of missing `auth.py` logs.

5.  **Logging Configuration Adjustment (Round 2 - Direct `basicConfig` in `auth.py`):** Added `logging.basicConfig(level=logging.DEBUG)` directly to the top of `api-service/src/routes/auth.py`. This was an attempt to force the logging configuration for that specific module. Still, no `auth.py` logs appeared.

6.  **Current Hypothesis on Logging:** The `auth.py` module's logger is not being configured correctly, possibly due to import order or how `getLogger(__name__)` interacts with `basicConfig` in this specific FastAPI/Uvicorn setup when modules are imported. The standard `logging.basicConfig()` might not be effectively configuring loggers in modules imported after the initial `basicConfig` call in `main.py`, or there's an interaction with Uvicorn's internal logging.

## Next Steps / What I want to try

1.  **Forceful Logging Configuration in `auth.py`:** Implement a more explicit and robust logging configuration directly within `api-service/src/routes/auth.py`. This involves getting the logger, setting its level, and explicitly adding a `StreamHandler` with a `Formatter`. This is a debugging step to guarantee that logs from this module appear, and will be reverted once the core OAuth issue is resolved and a proper, centralized logging strategy is confirmed.

    *   **Action:** Replace the existing `import logging` line in `api-service/src/routes/auth.py` with the following block:

        ```python
        import logging
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.DEBUG)
        handler = logging.StreamHandler()
        handler.setLevel(logging.DEBUG)
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        ```

2.  **Re-run and Analyze Logs:** After applying the forceful logging configuration, I will ask the user to restart the Docker services, attempt the OAuth login flow, and then provide the filtered logs (`docker compose logs api-service | grep -E "(callback|oauth|DEBUG)"`). This should finally reveal whether `_issue_session_cookie()` is being called, what the `user` payload looks like, and if any exceptions are occurring during the cookie setting process.
