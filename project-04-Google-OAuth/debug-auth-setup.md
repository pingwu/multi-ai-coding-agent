# JWT Session Cookie Debug Guide

## Environment Configuration for Development

Add these specific settings to your `.env` file:

```bash
# JWT Configuration
JWT_SECRET_KEY=your_64_character_hex_jwt_secret_here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Cookie Configuration for Development (CRITICAL)
SESSION_COOKIE_SECURE=false
SESSION_COOKIE_HTTPONLY=true
SESSION_COOKIE_SAMESITE=lax

# OAuth Configuration
GOOGLE_CLIENT_ID=your_oauth_client_id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_oauth_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
FRONTEND_URL=http://localhost:3000

# Debug Logging
LOG_LEVEL=INFO
```

## Critical Security Settings for Development

1. **SESSION_COOKIE_SECURE=false** - MUST be false for HTTP localhost
2. **SESSION_COOKIE_SAMESITE=lax** - Allows cross-port requests on localhost
3. **Domain not set** - Let browser handle localhost domain automatically

## Testing Steps

1. **Check Environment Variables**:
   ```bash
   docker-compose exec api-service printenv | grep -E "(JWT|COOKIE|GOOGLE)"
   ```

2. **Test JWT Generation Manually**:
   ```python
   import jwt
   import time

   JWT_SECRET = "your_secret_here"
   JWT_ALG = "HS256"

   payload = {
       "sub": "test@example.com",
       "email": "test@example.com",
       "name": "Test User",
       "iat": int(time.time()),
       "exp": int(time.time()) + 1800
   }

   token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)
   decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
   print(f"Token: {token}")
   print(f"Decoded: {decoded}")
   ```

3. **Browser Cookie Inspection**:
   - Open Developer Tools → Application → Cookies → http://localhost:8000
   - Look for "session" cookie after OAuth login
   - Check cookie attributes (Secure, HttpOnly, SameSite)

4. **API Logs Analysis**:
   ```bash
   docker-compose logs -f api-service | grep -E "(DEBUG|session|cookie|JWT)"
   ```

## Common Issues & Solutions

### Issue 1: No Session Cookie Found
- **Cause**: Cookie not being set or wrong domain
- **Fix**: Check COOKIE_SECURE=false for HTTP development

### Issue 2: JWT Token Invalid
- **Cause**: Secret mismatch or algorithm mismatch
- **Fix**: Verify JWT_SECRET_KEY length (32+ chars) and algorithm

### Issue 3: CORS Credential Issues
- **Cause**: Frontend not sending credentials
- **Fix**: Ensure `credentials: 'include'` in ALL fetch requests

### Issue 4: SameSite Cookie Blocking
- **Cause**: SameSite=strict blocking cross-port requests
- **Fix**: Use SameSite=lax for development

## Browser Network Tab Analysis

Check these headers in OAuth callback:

**Response Headers (should include):**
```
Set-Cookie: session=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...; Path=/; HttpOnly; SameSite=lax
```

**Request Headers (to /auth/status should include):**
```
Cookie: session=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## Production vs Development

| Setting | Development | Production |
|---------|-------------|------------|
| COOKIE_SECURE | false | true |
| COOKIE_SAMESITE | lax | strict |
| ALLOWED_ORIGINS | localhost:3000 | your-domain.com |
| JWT_SECRET | development key | strong random key |

## Next Steps if Still Failing

1. Check Docker logs for specific JWT decode errors
2. Verify browser is actually sending cookies in requests
3. Test JWT token generation/validation outside of FastAPI
4. Check for network middleware interfering with cookies