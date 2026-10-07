# Quick Start Guide - Admin Panel API

## 1. Install Dependencies

```bash
cd d:\gmaa-admin-panel
npm install
```

## 2. Set Up Environment

Create `.env` file:

```env
PORT=3000
VITE_API_BASE_URL=http://localhost:3000
ADMIN_GENERATION_SECRET=your-super-secret-key
JWT_SECRET=your-jwt-secret
```

## 3. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## 4. Generate Admin Credentials

**Option A: Using curl**
```bash
curl -X POST http://localhost:3000/api/auth/admin/generate \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-super-secret-key"}'
```

**Response:**
```json
{
  "success": true,
  "credentials": {
    "username": "toothless-night-534",
    "password": "XDF1URDoUM8Z^Fbx",
    "email": "admin-1779939400534@gmaa.local"
  }
}
```

⚠️ Save this immediately - password cannot be reset yet!

## 5. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin-1779939400534@gmaa.local",
    "password": "XDF1URDoUM8Z^Fbx"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": { "id": "...", "email": "...", "username": "..." }
}
```

## 6. Use the Token

All requests need the token:
```bash
curl -X GET http://localhost:3000/api/tenders \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

## 7. In React Code

```typescript
import { authService, tendersService } from '@/services/api';

// Login
await authService.login('admin@gmaa.local', 'password');

// Get tenders (token auto-injected)
const { tenders } = await tendersService.getTenders();

// Create tender
await tendersService.createTender({
  tenderData: {
    service: 'Robotic Surgery System',
    category: 'Surgery',
    region: 'Asia',
    budget: 'USD 500,000',
    deadline: '72 Hours',
    description: 'Advanced surgical equipment',
  },
  vendorEmails: ['vendor@example.com'],
  broadcast: true,
});

// Logout
authService.logout();
```

## File Structure

```
src/
  services/api/          ← All API services
    client.ts            ← Axios with interceptors
    authService.ts
    tendersService.ts
    bidsService.ts
    vendorsService.ts
    supportService.ts
    consultationsService.ts
    leadsService.ts
    systemService.ts
    index.ts             ← Import all from here
  types/
    index.ts             ← TypeScript models

server.ts               ← Backend endpoints
```

## Common Tasks

### Get all tenders
```typescript
const { tenders } = await tendersService.getTenders();
```

### Create a tender
```typescript
const response = await tendersService.createTender({
  tenderData: { /* ... */ },
  vendorEmails: ['email@example.com'],
  broadcast: true,
});
```

### Award a bid
```typescript
await bidsService.updateBid('B-001', { status: 'awarded' });
```

### Update tender status
```typescript
await tendersService.updateTender('T-001', {
  status: 'awarded',
  awardedBidId: 'B-001',
  awardedVendorId: 'V-001',
});
```

### Get vendors
```typescript
const { vendors } = await vendorsService.getVendors();
```

### Seed demo data
```typescript
await systemService.seedDemoData();
```

### Clear all data
```typescript
await systemService.purgeDemoData();
```

## Debugging

### Check the UI profile cache
```javascript
// In browser console
localStorage.getItem('admin_user')
```

The authentication token is held in an HTTP-only cookie and is not readable from JavaScript.

### Check API calls
```javascript
// Open browser DevTools → Network tab
// See all API requests with responses
```

### Server logs
```bash
# Terminal shows:
# [Auth] New admin credentials generated: admin-xxx@gmaa.local
# [Auth] Admin logged in: admin-xxx@gmaa.local
# [Server] Running on http://localhost:3000
```

## Testing with Demo Data

```bash
# Generate credentials
curl -X POST http://localhost:3000/api/auth/admin/generate \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-super-secret-key"}'

# Login (use credentials from above)
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"...", "password":"..."}' | jq -r '.token')

# Seed demo data
curl -X POST http://localhost:3000/api/system/seed \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Get tenders
curl -X GET http://localhost:3000/api/tenders \
  -H "Authorization: Bearer $TOKEN"

# Clear data
curl -X POST http://localhost:3000/api/system/purge \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

## Full Documentation

See `API_SETUP.md` for complete documentation.

## Notes

- ⚠️ Credentials cannot be reset - save them securely
- Token auto-expires on 401 errors (redirects to login)
- All data is in-memory (lost on server restart)
- Ready for Firestore integration
- Password reset coming soon
