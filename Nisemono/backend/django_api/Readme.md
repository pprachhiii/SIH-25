# what it would handle :

Institution Management

Register, verify, suspend institutions
Store institution public keys for digital signatures

Certificate Management
Add/update/revoke certificates
Store hashes (SHA-256 + blockchain hash reference)

Verification Logs
Track who verified what, and when
Store AI/ML fraud detection results

Admin Panel
Super-admin access (govt/education boards)
Institution admin access (universities)

API Gateway Connection
Expose REST APIs for web, mobile, Node microservices

# Authentication & Roles

Super Admin → full access
Institution Admin → can manage own institution & certificates
Verifier → can only verify certificates
Auditor → read-only