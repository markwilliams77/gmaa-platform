# S3 Document Viewing & Download Guide

## Overview
Vendors upload documents during the onboarding process, which are stored in S3 with the following types:
- **Business License** (`business_license`)
- **MOH Accreditation** (`moh_accreditation`)
- **Tax Identification** (`tax_identification`)

## Frontend Document Access

### How Documents Are Displayed

In the **Compliance Audit** tab → **Vendor Onboarding Review Modal**, documents are shown in the "Attached Documents" section with two action buttons:

#### 1. **Preview Button** (Eye icon)
- Fetches signed S3 URL from backend
- Displays documents inline:
  - **PDFs**: Embedded viewer with toolbar
  - **Images** (JPG, PNG, GIF, WEBP): Full-size preview
  - **Other formats**: Download prompt

#### 2. **Download Button** (Arrow icon)
- Opens S3 URL in new browser tab
- Browser handles the download or preview

### Document Information Shown
- Document type (formatted: "BUSINESS LICENSE")
- File name
- File size (in KB)
- Upload timestamp

## API Endpoints Used

### 1. List Pending Onboardings
```
GET /api/admin/vendor-onboardings?status=UNDER_REVIEW&paymentStatus=COMPLETED
```
Returns document metadata:
```json
{
  "documents": {
    "business_license": {
      "fileKey": "vendor-onboarding/uuid/business_license/license.pdf",
      "fileName": "license.pdf",
      "contentType": "application/pdf",
      "fileSize": 12345,
      "uploadedAt": "2026-06-04T12:00:00.000Z"
    }
  }
}
```

### 2. Get Document Download URL
```
GET /api/admin/vendor-onboardings/:vendorId/documents/:documentType
```

Returns signed S3 URL (expires in 300 seconds):
```json
{
  "success": true,
  "document": {
    "documentType": "business_license",
    "fileName": "license.pdf",
    "contentType": "application/pdf",
    "fileSize": 12345,
    "uploadedAt": "2026-06-04T12:00:00.000Z",
    "fileKey": "vendor-onboarding/uuid/business_license/license.pdf",
    "downloadUrl": "https://bucket.s3.region.amazonaws.com/...",
    "expiresIn": 300
  }
}
```

## Frontend Code Implementation

### Service Method
```typescript
// vendorsService.ts
getDocumentDownloadUrl: async (
  vendorId: string,
  documentType: 'business_license' | 'moh_accreditation' | 'tax_identification'
): Promise<DocumentResponse> => {
  const response = await api.get(
    `/api/admin/vendor-onboardings/${vendorId}/documents/${documentType}`
  );
  return response.data;
}
```

### Modal Preview Handling
```typescript
const handlePreviewDoc = async (
  vendorId: string,
  docType: 'business_license' | 'moh_accreditation' | 'tax_identification',
  fileName: string
) => {
  try {
    const response = await vendorsService.getDocumentDownloadUrl(vendorId, docType);
    setPreviewDoc({ docType, url: response.document.downloadUrl, fileName });
  } catch (err) {
    console.error("Failed to get document URL:", err);
    onDownloadDoc(vendorId, docType); // Fallback to direct download
  }
};
```

## Document Preview Modal Features

### PDF Preview
- Embedded iframe with Google's PDF viewer
- Toolbar enabled: zoom, download, print, share
- Full document navigation

### Image Preview
- Direct image display
- Responsive sizing
- Download option available

### Other Formats
- Not supported for inline preview
- Shows message with download option
- User can manually open in their preferred application

## Workflow for Admins

### Step 1: Navigate to Compliance Audit
- Click "Compliance Audit" in sidebar
- View table of "Pending Vendor Onboardings"

### Step 2: Review Vendor
- Click "Review" button for the vendor
- Modal opens with all details

### Step 3: View Documents
- Scroll to "Attached Documents" section
- Click eye icon (Preview) to view inline
- Click arrow icon (Download) to download file

### Step 4: Make Decision
- Click "Approve & Activate" (ACTIVE status)
- Click "Approve (Pending)" (PENDING_ACTIVATION status)
- Click "Reject" to reject the vendor

## S3 File Structure

```
vendor-onboarding/
├── {vendorId}/
│   ├── business_license/
│   │   └── {fileName}
│   ├── moh_accreditation/
│   │   └── {fileName}
│   └── tax_identification/
│       └── {fileName}
```

## Error Handling

### Missing Documents
- Section hidden if no documents present
- Empty state shown

### Download URL Expiration
- URLs expire after 300 seconds
- Fresh request generates new signed URL
- Frontend handles retry automatically

### S3 Access Issues
- Backend should return 403 if S3 access denied
- Frontend shows error in dashboard
- User can retry or contact support

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| PDF Iframe | ✅ | ✅ | ✅ | ✅ |
| Image Preview | ✅ | ✅ | ✅ | ✅ |
| S3 Download | ✅ | ✅ | ✅ | ✅ |

## Security Considerations

1. **Signed URLs**: S3 URLs are signed and time-limited (300 sec)
2. **Backend Validation**: Backend verifies vendor belongs to authenticated admin
3. **Document Type Validation**: Only allows specific document types
4. **File Size Limits**: Enforced at upload time (backend defined)
5. **Content Type Validation**: Files checked for correct MIME types

## Troubleshooting

### Document Preview Not Loading
- Check S3 URL expiration (refresh by clicking Preview again)
- Verify browser allows cross-origin iframe embedding
- Check browser console for CORS errors

### Download Not Working
- Verify S3 permissions on the bucket
- Check if document was uploaded successfully
- Verify vendor has payment completed status

### Missing Documents in Onboarding
- Vendor may have skipped document upload
- Check backend logs for upload errors
- Contact vendor to resubmit documents
