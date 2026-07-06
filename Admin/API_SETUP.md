# GMAA Admin Panel - API Setup & Usage Guide

## Overview

The admin panel now includes a complete backend API layer with:
- JWT-based authentication
- Admin credential generation and login
- RESTful endpoints for all admin operations
- TypeScript models for type safety
- Axios-based API client with automatic token injection

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This includes the newly added `axios` package.

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:3000

ADMIN_GENERATION_SECRET=my-super-secret-key
JWT_SECRET=my-jwt-secret-key

RESEND_API_KEY=
ENABLE_MAIL_LIVE=false
```

**Important:**
- `ADMIN_GENERATION_SECRET`: Use this secret to generate new admin credentials via `/api/auth/admin/generate`
- `JWT_SECRET`: Used to sign and verify JWT tokens (keep this secure!)

### 3. Start the Server

```bash
npm run dev
```

The server will run on `http://localhost:3000` by default.

---

## Authentication Flow

### Generate Admin Credentials

**Endpoint:** `POST /api/auth/admin/generate`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/admin/generate \
  -H "Content-Type: application/json" \
  -d '{"secret": "my-super-secret-key"}'
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

⚠️ **IMPORTANT:** 
- Save these credentials in a secure location (download the file)
- Do NOT share or lose this password - password reset is not yet implemented
- The file will be automatically downloaded from the frontend

### Login

**Endpoint:** `POST /api/auth/login`

**Request:**
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
  "token": "eyJ...<jwt>...",
  "user": {
    "id": "admin-1779939400534@gmaa.local",
    "email": "admin-1779939400534@gmaa.local",
    "username": "toothless-night-534"
  }
}
```

The `token` is automatically stored in `localStorage` by the client and included in all subsequent API requests.

---

## API Client Setup

The API client is configured with automatic token injection in `src/services/api/client.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically adds Bearer token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handles 401 errors and redirects to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Using the API Services

### Example: Get All Tenders

```typescript
import { tendersService } from '@/services/api';

async function loadTenders() {
  try {
    const response = await tendersService.getTenders();
    console.log(response.tenders);
  } catch (error) {
    console.error('Failed to load tenders:', error);
  }
}
```

### Example: Create a New Tender

```typescript
import { tendersService } from '@/services/api';
import type { CreateTenderRequest } from '@/types';

async function createTender() {
  const request: CreateTenderRequest = {
    tenderData: {
      service: 'Robotic Knee Replacement',
      category: 'Orthopaedics',
      region: 'Southeast Asia',
      budget: 'USD 360,000',
      deadline: '72 Hours',
      description: 'Advanced medical equipment procurement',
    },
    vendorEmails: ['vendor@example.com'],
    broadcast: true,
  };

  try {
    const response = await tendersService.createTender(request);
    console.log('Tender created:', response.tenderId);
  } catch (error) {
    console.error('Failed to create tender:', error);
  }
}
```

### Example: Award a Bid

```typescript
import { bidsService } from '@/services/api';

async function awardBid(bidId: string) {
  try {
    await bidsService.updateBid(bidId, { status: 'awarded' });
    console.log('Bid awarded');
  } catch (error) {
    console.error('Failed to award bid:', error);
  }
}
```

---

## Available API Services

### `authService`
- `generateAdminCredentials(secret: string)` - Generate new admin credentials
- `login(email: string, password: string)` - Login and get JWT
- `logout()` - Clear local storage
- `getStoredToken()` - Retrieve stored JWT
- `getStoredUser()` - Retrieve stored user info
- `downloadCredentials(credentials)` - Download credentials as text file

### `tendersService`
- `getTenders()` - Get all tenders
- `createTender(request)` - Create a new tender
- `updateTender(tenderId, updates)` - Update tender status/metadata
- `getTenderById(tenderId)` - Get specific tender

### `bidsService`
- `getBids(tenderId?, vendorId?)` - Get bids (optionally filtered)
- `updateBid(bidId, updates)` - Update bid status
- `getBidById(bidId)` - Get specific bid

### `vendorsService`
- `getVendors()` - Get all vendors
- `getVendorById(vendorId)` - Get specific vendor

### `supportService`
- `getTickets()` - Get all support tickets
- `addMessage(ticketId, message)` - Add message to ticket
- `getTicketById(ticketId)` - Get specific ticket

### `consultationsService`
- `getConsultations()` - Get all consultations
- `updateConsultation(consultationId, updates)` - Update consultation
- `getConsultationById(consultationId)` - Get specific consultation

### `leadsService`
- `addMessage(leadId, message)` - Add message to lead

### `systemService`
- `seedDemoData()` - Seed demo data for testing
- `purgeDemoData()` - Clear all demo data

---

## TypeScript Models

All API responses are typed using models in `src/types/index.ts`:

```typescript
import type {
  Tender,
  Bid,
  Vendor,
  Consultation,
  SupportTicket,
  CreateTenderRequest,
  AuthLoginResponse,
} from '@/types';
```

---

## Protected Routes

All API endpoints (except `/api/auth/admin/generate` and `/api/auth/login`) require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

The token is automatically added by the axios interceptor when you use the API services.

---

## Demo Data

Test the API with demo data:

```bash
# Seed demo data
curl -X POST http://localhost:3000/api/system/seed \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"

# Clear all data
curl -X POST http://localhost:3000/api/system/purge \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

---

## Error Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

The axios interceptors automatically handle 401 errors and redirect to login when tokens expire.

---

## Next Steps

1. **Password Reset API** - Implement `/api/auth/password-reset` endpoint
2. **Email Verification** - Add email verification during credential generation
3. **Rate Limiting** - Implement rate limiting on auth endpoints
4. **CORS Configuration** - Add CORS headers for cross-domain requests
5. **Database Integration** - Replace in-memory storage with Firestore/PostgreSQL
6. **Admin Roles** - Implement role-based access control

---

## Troubleshooting

**Issue:** Token not being sent in requests
- Check that token is stored in `localStorage` with key `auth_token`
- Verify the axios interceptor is properly configured

**Issue:** 401 Unauthorized errors
- Generate new admin credentials
- Verify `ADMIN_GENERATION_SECRET` is correct
- Check token expiration

**Issue:** CORS errors in browser
- Ensure `VITE_API_BASE_URL` matches your server URL
- Check browser console for specific error messages

---

## Security Notes

⚠️ **Important:**
- Never commit `.env` with real secrets
- Credentials should be generated with a strong, unique `ADMIN_GENERATION_SECRET`
- Always use HTTPS in production
- Implement rate limiting on credential generation
- Add email verification before enabling new admin accounts
- Password reset will be implemented in a future release
