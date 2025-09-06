# what it will do

Certificate Registration

Hash certificate data (SHA-256)
Submit transaction to blockchain
Store transaction hash in PostgreSQL

Certificate Verification
Compare incoming certificate hash with blockchain record
Return blockchain transaction details to verifier

Revocation & Updates
Mark certificates as revoked on blockchain (if supported)
Maintain off-chain DB mapping for quick lookups

Integration
Expose REST endpoints for Django API and Verification Engine
like this :-

POST   /api/v1/blockchain/register   # Register new certificate
POST   /api/v1/blockchain/verify     # Verify a certificate against blockchain
POST   /api/v1/blockchain/revoke     # Revoke a certificate
GET    /api/v1/blockchain/status/:id # Get blockchain transaction status
