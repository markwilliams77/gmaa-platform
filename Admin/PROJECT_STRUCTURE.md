# Project Structure - API Infrastructure

```
src/
├── types/
│   └── index.ts                 # TypeScript models and interfaces
│
├── services/
│   └── api/
│       ├── client.ts            # Axios client with interceptors
│       ├── authService.ts       # Authentication endpoints
│       ├── tendersService.ts    # Tender endpoints
│       ├── bidsService.ts       # Bid endpoints
│       ├── vendorsService.ts    # Vendor endpoints
│       ├── supportService.ts    # Support ticket endpoints
│       ├── consultationsService.ts  # Consultation endpoints
│       ├── leadsService.ts      # Lead endpoints
│       ├── systemService.ts     # System/demo endpoints
│       └── index.ts             # Barrel export for all services
│
├── components/
│   ├── AdminDashboard.tsx       # Main admin component
│   ├── AuthContext.tsx          # Auth state management
│   └── LoginPage.tsx            # Login UI
│
├── App.tsx
├── main.tsx
└── index.css

server.ts                         # Express backend with all API endpoints

.env.example                      # Environment variables template
vite.config.ts                   # Vite configuration (updated)
package.json                     # Dependencies (axios added)

API_SETUP.md                     # Complete API setup guide
ADMIN_PANEL_API_SPEC.md          # API specification
PROJECT_STRUCTURE.md             # This file
```

## Key Files Created/Modified

### New Directories
- `src/types/` - TypeScript interfaces and models
- `src/services/api/` - API client and service files

### New Files
- `src/types/index.ts` - 140+ lines of TypeScript models
- `src/services/api/client.ts` - Axios client with auth interceptors
- `src/services/api/authService.ts` - Auth service
- `src/services/api/tendersService.ts` - Tenders service
- `src/services/api/bidsService.ts` - Bids service
- `src/services/api/vendorsService.ts` - Vendors service
- `src/services/api/supportService.ts` - Support service
- `src/services/api/consultationsService.ts` - Consultations service
- `src/services/api/leadsService.ts` - Leads service
- `src/services/api/systemService.ts` - System service
- `src/services/api/index.ts` - Barrel export
- `API_SETUP.md` - Complete setup guide

### Modified Files
- `server.ts` - Complete rewrite with full API implementation
- `package.json` - Added axios dependency
- `.env.example` - Updated with new variables
- `vite.config.ts` - Added VITE_API_BASE_URL

---

## API Endpoints Implemented

### Authentication
- `POST /api/auth/admin/generate` - Generate credentials
- `POST /api/auth/login` - Login

### Tenders
- `GET /api/tenders` - List tenders
- `POST /api/tenders` - Create tender
- `PUT /api/tenders/:tenderId` - Update tender

### Bids
- `GET /api/bids` - List bids
- `PUT /api/bids/:bidId` - Update bid

### Vendors
- `GET /api/vendors` - List vendors

### Support Tickets
- `GET /api/support-tickets` - List tickets
- `POST /api/support-tickets/:ticketId/messages` - Add message

### Consultations
- `GET /api/consultations` - List consultations
- `PUT /api/consultations/:consultationId` - Update consultation

### Leads
- `POST /api/leads/:leadId/messages` - Add message to lead

### System
- `POST /api/system/seed` - Seed demo data
- `POST /api/system/purge` - Clear all data

---

## Features Included

✅ JWT-based authentication
✅ Admin credential generation with download
✅ Automatic token injection via axios interceptors
✅ Type-safe API calls with TypeScript models
✅ Separate service files for maintainability
✅ Error handling with 401 redirect
✅ Mock data storage (in-memory, ready for Firestore integration)
✅ Demo data seeding
✅ Credential download as text file
✅ Environment variable configuration
✅ Complete API documentation

---

## Next Steps to Integrate

1. **Update AdminDashboard.tsx** to use API services instead of Firestore
2. **Create CredentialDownload component** for showing credentials
3. **Add loading states** to API calls
4. **Test all endpoints** with provided curl examples
5. **Integrate with Firestore** when ready for persistence
6. **Add password reset** functionality

---

## Usage Example

```typescript
import { authService, tendersService } from '@/services/api';

// Login
const response = await authService.login('admin@gmaa.local', 'password');
// Token automatically stored in localStorage

// Create tender
await tendersService.createTender({
  tenderData: { ... },
  vendorEmails: [...],
  broadcast: true,
});

// Update tender
await tendersService.updateTender('T-001', { status: 'awarded' });

// Logout
authService.logout();
```

All API calls include the JWT token automatically via axios interceptor.
