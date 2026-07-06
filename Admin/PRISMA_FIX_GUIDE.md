# Prisma Enum Casting Fix - Vendor Onboarding Status

## Issue
```
ERROR: column "status" is of type "VendorOnboardingStatus" but expression is of type text
```

This error occurs when querying by the `status` enum field with a raw text value instead of properly casting to the enum type.

## Root Cause
The backend is likely using `$executeRaw()` or filtering with string values directly on an enum column:

```typescript
// ❌ WRONG - causes the error
const result = await prisma.$executeRaw`
  SELECT * FROM VendorOnboarding 
  WHERE status = 'UNDER_REVIEW'
`;
```

## Solutions

### Solution 1: Use Prisma Query (Recommended)
Replace raw queries with Prisma's built-in query builder:

```typescript
// ✅ CORRECT - using Prisma query
const onboardings = await prisma.vendorOnboarding.findMany({
  where: {
    status: 'UNDER_REVIEW', // Prisma handles enum casting
    paymentStatus: 'COMPLETED',
  },
});
```

### Solution 2: Cast to Enum in Raw Query
If you must use `$executeRaw()`, cast the value to the enum type:

```typescript
// ✅ CORRECT - explicit cast
const result = await prisma.$executeRaw`
  SELECT * FROM VendorOnboarding 
  WHERE status = 'UNDER_REVIEW'::VendorOnboardingStatus
  AND payment_status = 'COMPLETED'::PaymentStatus
`;
```

### Solution 3: Use Parameterized Queries
For parameterized raw queries with proper casting:

```typescript
// ✅ CORRECT - parameterized with casting
const result = await prisma.$executeRaw`
  SELECT * FROM VendorOnboarding 
  WHERE status = ${Prisma.raw(`'UNDER_REVIEW'::VendorOnboardingStatus`)}
  AND payment_status = ${Prisma.raw(`'COMPLETED'::PaymentStatus`)}
`;
```

## Backend Implementation Fix

Update the `listPendingReviews` endpoint in your backend:

```typescript
// Instead of raw query, use Prisma query builder
export async function listPendingReviews(
  status = 'UNDER_REVIEW',
  paymentStatus = 'COMPLETED',
  completedOnly = true
) {
  return prisma.vendorOnboarding.findMany({
    where: {
      status: status as VendorOnboardingStatus,
      paymentStatus: paymentStatus as PaymentStatus,
      // ... other filters
    },
    include: {
      documents: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
```

## Schema Reference
Ensure your Prisma schema has these enums defined:

```prisma
enum VendorOnboardingStatus {
  UNDER_REVIEW
  PENDING_ACTIVATION
  ACTIVE
  REJECTED
}

enum PaymentStatus {
  PENDING
  COMPLETED
}
```

## Testing
After fix, test with:
```bash
# Backend test
curl -X GET "http://localhost:4000/api/admin/vendor-onboardings?status=UNDER_REVIEW&paymentStatus=COMPLETED"
```
