-- CreateEnum
CREATE TYPE "VendorDocumentType" AS ENUM ('COMPANY_REGISTRATION', 'TAX_REGISTRATION', 'SIGNATORY_ID', 'ADDRESS_PROOF', 'BANK_VERIFICATION', 'COMPANY_LOGO', 'BROCHURE', 'GALLERY_IMAGE', 'CERTIFICATE', 'CONTRACT', 'OTHER');

-- CreateTable
CREATE TABLE "VendorDocument" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "documentType" "VendorDocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedById" TEXT,
    "uploadedByName" TEXT,
    "uploadedByRole" "Role",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VendorDocument" ADD CONSTRAINT "VendorDocument_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
