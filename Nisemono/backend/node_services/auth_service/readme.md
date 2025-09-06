# what it will handle
User Authentication
Login with email/username/password
OTP-based login (via SMS/Email, optional)
Refresh token mechanism

JWT Token Management
Issue access tokens (short-lived)
Issue refresh tokens (long-lived)

Support role-based claims (Super Admin, Institution Admin, Verifier, Auditor)

Session Handling
Store active sessions in Redis
Blacklist/revoke tokens when needed

Integration
Django & AI services validate incoming JWTs via middleware
Frontend & mobile apps authenticate through this service

# Authentication Flow

User logs in → Auth Service validates credentials
Issues Access Token (JWT) + Refresh Token
Django API / AI Service receive JWT → validate via shared secret/public key
For refresh, frontend/mobile call /refresh endpoint → new tokens issued
Logout → tokens revoked from Redis