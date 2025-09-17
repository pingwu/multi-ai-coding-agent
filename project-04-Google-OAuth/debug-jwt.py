#!/usr/bin/env python3
"""
JWT Session Cookie Debug Script
Run this to test JWT generation and validation outside of FastAPI
"""

import os
import jwt
import time
from datetime import datetime

def test_jwt_functionality():
    """Test JWT generation and validation with your current settings"""

    # Load environment variables (or use defaults)
    JWT_SECRET = os.getenv("JWT_SECRET_KEY", "change_me")
    JWT_ALG = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_EXPIRE_MIN = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    print("=== JWT Configuration Test ===")
    print(f"JWT Secret: {JWT_SECRET[:10]}... (length: {len(JWT_SECRET)})")
    print(f"JWT Algorithm: {JWT_ALG}")
    print(f"Expiration: {ACCESS_EXPIRE_MIN} minutes")
    print()

    # Test user data
    user = {
        "id": "test_user_123",
        "email": "test@example.com",
        "name": "Test User"
    }

    # Generate JWT token (same as _issue_session_cookie)
    now = int(time.time())
    payload = {
        "sub": user.get("id") or user.get("email"),
        "email": user.get("email"),
        "name": user.get("name"),
        "iat": now,
        "exp": now + ACCESS_EXPIRE_MIN * 60,
    }

    print("=== JWT Token Generation ===")
    print(f"Payload: {payload}")
    print(f"Current time: {datetime.fromtimestamp(now)}")
    print(f"Expiration time: {datetime.fromtimestamp(payload['exp'])}")

    try:
        # Generate token
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)
        print(f"Generated token (length {len(token)}): {token[:50]}...")
        print()

        # Validate token (same as _decode_session)
        print("=== JWT Token Validation ===")
        decoded_payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        print(f"Decoded payload: {decoded_payload}")
        print("✅ JWT generation and validation successful!")

        return True, token, decoded_payload

    except jwt.ExpiredSignatureError as e:
        print(f"❌ JWT token expired: {e}")
        return False, None, None
    except jwt.InvalidTokenError as e:
        print(f"❌ Invalid JWT token: {e}")
        return False, None, None
    except Exception as e:
        print(f"❌ Unexpected JWT error: {type(e).__name__}: {e}")
        return False, None, None

def test_cookie_settings():
    """Test cookie configuration settings"""
    print("=== Cookie Configuration Test ===")

    cookie_secure = (os.getenv("SESSION_COOKIE_SECURE", "false").lower() in ("1", "true", "yes"))
    cookie_httponly = (os.getenv("SESSION_COOKIE_HTTPONLY", "true").lower() in ("1", "true", "yes"))
    cookie_samesite = os.getenv("SESSION_COOKIE_SAMESITE", "lax").lower()

    print(f"COOKIE_SECURE: {cookie_secure}")
    print(f"COOKIE_HTTPONLY: {cookie_httponly}")
    print(f"COOKIE_SAMESITE: {cookie_samesite}")

    # Recommendations for development
    print("\n=== Development Recommendations ===")
    if cookie_secure:
        print("⚠️  WARNING: COOKIE_SECURE=true may block cookies on HTTP localhost")
        print("   Recommendation: Set SESSION_COOKIE_SECURE=false for development")
    else:
        print("✅ COOKIE_SECURE=false - Good for HTTP localhost development")

    if cookie_samesite == "strict":
        print("⚠️  WARNING: SameSite=strict may block cross-port cookies")
        print("   Recommendation: Set SESSION_COOKIE_SAMESITE=lax for development")
    elif cookie_samesite == "lax":
        print("✅ SameSite=lax - Good for localhost cross-port requests")

    if cookie_httponly:
        print("✅ HttpOnly=true - Good for security")

def test_oauth_config():
    """Test OAuth configuration"""
    print("\n=== OAuth Configuration Test ===")

    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    frontend_url = os.getenv("FRONTEND_URL")

    print(f"GOOGLE_CLIENT_ID: {'✅ Set' if client_id else '❌ Missing'}")
    print(f"GOOGLE_CLIENT_SECRET: {'✅ Set' if client_secret else '❌ Missing'}")
    print(f"GOOGLE_REDIRECT_URI: {redirect_uri or '❌ Missing'}")
    print(f"FRONTEND_URL: {frontend_url or '❌ Missing'}")

    if redirect_uri and not redirect_uri.startswith("http://localhost:8000"):
        print("⚠️  WARNING: GOOGLE_REDIRECT_URI should point to api-service (port 8000)")

def main():
    """Run all tests"""
    print("JWT Session Cookie Debugging Tool")
    print("=" * 50)

    # Test JWT functionality
    success, token, payload = test_jwt_functionality()

    # Test cookie settings
    test_cookie_settings()

    # Test OAuth config
    test_oauth_config()

    print("\n" + "=" * 50)
    if success:
        print("🎉 JWT functionality is working correctly!")
        print("If you're still having issues, check:")
        print("1. Docker container logs for cookie/request details")
        print("2. Browser developer tools for cookie presence")
        print("3. Network tab for request/response headers")
    else:
        print("❌ JWT functionality has issues - fix these first")

if __name__ == "__main__":
    main()